import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import baseURL from "../ApiUrl/Apiurl";

const AssignmentForm = ({ 
  currentRequest, 
  engineers, 
  resources, 
  selectedCompany, 
  userId, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    engineerId: "",
    completionTime: "",
    estimatedPrice: "",
    dynamics_service_order_no: "",
    startDateTime: currentRequest?.preferred_date 
      ? new Date(currentRequest.preferred_date).toISOString().slice(0, 16) 
      : "",
    endDateTime: "",
  });

  console.log("Resources in AssignmentForm:", resources);
  
  const [dateError, setDateError] = useState("");
  const [busyEngineers, setBusyEngineers] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [selectedEngineerHourlyRate, setSelectedEngineerHourlyRate] = useState(0);

  // Check engineer availability
  const checkEngineerAvailability = async (startDateTime, endDateTime) => {
    if (!startDateTime || !endDateTime) return;

    setCheckingAvailability(true);
    try {
      const response = await axios.get(`${baseURL}/service-pools/?user_id=${userId}&company_id=${selectedCompany}`);
      const allAssignments = response.data.data || response.data;
      const assignmentsArray = Array.isArray(allAssignments) ? allAssignments : [allAssignments];

      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);

      const overlappingAssignments = assignmentsArray.filter((assignment) => {
        if (
          !assignment.est_start_datetime ||
          !assignment.est_end_datetime ||
          assignment.status !== "Assigned"
        )
          return false;

        const assignmentStart = new Date(assignment.est_start_datetime);
        const assignmentEnd = new Date(assignment.est_end_datetime);

        return (
          (assignmentStart >= startDate && assignmentStart <= endDate) ||
          (assignmentEnd >= startDate && assignmentEnd <= endDate) ||
          (assignmentStart <= startDate && assignmentEnd >= endDate)
        );
      });

      const busyResourceIds = [
        ...new Set(
          overlappingAssignments
            .map((assignment) => assignment.assigned_engineer)
            .filter(Boolean)
        ),
      ];

      const busyUserIds = resources
        .filter((r) => busyResourceIds.includes(r.resource_id))
        .map((r) => r.user);

      setBusyEngineers(busyUserIds);

      if (busyUserIds.includes(formData.engineerId)) {
        setFormData((prev) => ({ ...prev, engineerId: "" }));
        setSelectedEngineerHourlyRate(0);
      }
    } catch (error) {
      console.error("Error checking engineer availability:", error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const toDecimalHours = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime - startTime;

    const totalMinutes = durationMs / (1000 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const decimalHours = hours + minutes / 60;
    return Number(decimalHours.toFixed(1));
  };

  // Calculate estimated price based on hourly rate and completion time
  const calculateEstimatedPrice = (engineerId, completionTime) => {
    if (!engineerId || !completionTime) return "";

    const engineerResource = Array.isArray(resources)
      ? resources.find((resource) => resource.user === engineerId)
      : null;

    if (!engineerResource || !engineerResource.hourly_rate) return "";

    const hourlyRate = parseFloat(engineerResource.hourly_rate);
    
    // Parse completion time (HH:MM format)
    const [hours, minutes] = completionTime.split(':').map(Number);
    const totalHours = hours + (minutes / 60);
    
    const calculatedPrice = (hourlyRate * totalHours).toFixed(2);
    return calculatedPrice;
  };

  const handleEngineerChange = (e) => {
    const { value } = e.target;
    
    // Find the selected engineer's resource to get hourly rate
    const selectedEngineerResource = Array.isArray(resources)
      ? resources.find((resource) => resource.user === value)
      : null;

    const hourlyRate = selectedEngineerResource ? parseFloat(selectedEngineerResource.hourly_rate) : 0;
    setSelectedEngineerHourlyRate(hourlyRate);

    // Calculate price if completion time is already set
    let newEstimatedPrice = "";
    if (value && formData.completionTime) {
      newEstimatedPrice = calculateEstimatedPrice(value, formData.completionTime);
    }

    setFormData((prev) => ({ 
      ...prev, 
      engineerId: value,
      estimatedPrice: newEstimatedPrice
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    
    if (name === "endDateTime" && newFormData.startDateTime) {
      const startDate = new Date(newFormData.startDateTime);
      const endDate = new Date(value);
      
      if (endDate <= startDate) {
        setDateError("End date must be after start date");
      } else {
        setDateError("");
        const diffInHours = Math.abs(endDate - startDate) / 36e5;
        const hours = Math.floor(diffInHours);
        const minutes = Math.floor((diffInHours % 1) * 60);
        const completionTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
        
        newFormData.completionTime = completionTime;

        // Calculate estimated price if engineer is selected
        if (newFormData.engineerId) {
          const calculatedPrice = calculateEstimatedPrice(newFormData.engineerId, completionTime);
          newFormData.estimatedPrice = calculatedPrice;
        }

        checkEngineerAvailability(newFormData.startDateTime, value);
      }
    }
    
    if (name === "startDateTime" && newFormData.endDateTime) {
      checkEngineerAvailability(value, newFormData.endDateTime);
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.endDateTime && formData.startDateTime) {
      const startDate = new Date(formData.startDateTime);
      const endDate = new Date(formData.endDateTime);
      if (endDate <= startDate) {
        setDateError("End date must be after start date");
        return;
      }
    }

    const selectedEngineerResource = Array.isArray(resources)
      ? resources.find((resource) => resource.user === formData.engineerId)
      : null;

    if (!selectedEngineerResource) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Engineer resource not found. Please verify the selection.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const payload = {
      assigned_engineer: selectedEngineerResource.resource_id,
      estimated_completion_time: toDecimalHours(formData.startDateTime, formData.endDateTime),
      estimated_price: Number(formData.estimatedPrice),
      dynamics_service_order_no: formData.dynamics_service_order_no,
      est_start_datetime: formData.startDateTime,
      est_end_datetime: formData.endDateTime,
      status: "Assigned",
      company: selectedCompany,
      user_id: userId,
      company_id: selectedCompany,
    };

    const assignmentPayload = {
      assignment_id: `ASG-${Date.now()}`,
      assignment_type: "Assign",
      status: "Pending",
      decline_reason: "",
      comments: "",
      created_by: userId,
      updated_by: userId,
      company: selectedCompany,
      request: currentRequest.request_id,
      assigned_engineer: selectedEngineerResource.resource_id,
      assigned_by: userId,
      company_id: selectedCompany,
      user_id: userId,
    };

    try {
      await axios.post(`${baseURL}/assignment-history/`, assignmentPayload);
      await axios.put(`${baseURL}/service-pools/${currentRequest.request_id}/`, payload);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Service request assigned successfully!',
        confirmButtonColor: '#3085d6',
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Assignment failed:", err);
      let errorMessage = err.message;
      
      if (err.response?.data) {
        errorMessage = `Assignment failed: ${JSON.stringify(err.response.data, null, 2)}`;
      }

      Swal.fire({
        icon: 'error',
        title: 'Assignment Failed',
        text: errorMessage,
        confirmButtonColor: '#3085d6',
      });
    }
  };

  return (
    <div className="container mt-4 service-request-form">
      <div className="card">
        <div className="card-header">
          <h3>Service Assignment for {currentRequest?.request_id}</h3>
          <p>Fill in the service assignment details below</p>
        </div>

        <form onSubmit={handleSubmit} className="assignment-form">
          <div className="row mb-3">
            {/* Start Date */}
            <div className="col-md-4 mt-2">
              <label className="form-label">Estimated Start Date & Time</label>
              <input
                type="datetime-local"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleDateChange}
                required
                className="form-control"
                min={currentRequest?.preferred_date
                  ? new Date(currentRequest.preferred_date).toISOString().slice(0, 16)
                  : ""}
              />
            </div>

            {/* End Date */}
            <div className="col-md-4 mt-2">
              <label className="form-label">Estimated End Date & Time</label>
              <input
                type="datetime-local"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleDateChange}
                required
                className="form-control"
                min={formData.startDateTime ||
                  (currentRequest?.preferred_date
                    ? new Date(currentRequest.preferred_date).toISOString().slice(0, 16)
                    : "")}
              />
              {dateError && <div className="text-danger small mt-1">{dateError}</div>}
            </div>

            {/* Completion Time */}
            <div className="col-md-4 mt-2">
              <label className="form-label">Estimated Completion Time (HH:MM)</label>
              <input
                type="text"
                name="completionTime"
                value={formData.completionTime}
                onChange={handleChange}
                required
                className="form-control"
                readOnly
              />
            </div>

            {/* Assigned Engineer */}
            <div className="col-md-4 mt-3">
              <label className="form-label">Assigned Engineer</label>
              <select
                name="engineerId"
                value={formData.engineerId}
                onChange={handleEngineerChange}
                required
                className="form-control"
                disabled={checkingAvailability || (engineers.length > 0 && engineers.filter(e => !busyEngineers.includes(e.user_id)).length === 0)}
              >
                {checkingAvailability ? (
                  <option value="">Checking engineer availability...</option>
                ) : engineers.length === 0 ? (
                  <option value="">Loading engineers...</option>
                ) : engineers.filter(e => !busyEngineers.includes(e.user_id)).length === 0 ? (
                  <option value="" disabled>
                    No available engineers during this time period. Please adjust your dates.
                  </option>
                ) : (
                  <>
                    <option value="">-- Select Engineer --</option>
                    {engineers
                      .filter(engineer => !busyEngineers.includes(engineer.user_id))
                      .map(engineer => {
                        const engineerResource = Array.isArray(resources)
                          ? resources.find((resource) => resource.user === engineer.user_id)
                          : null;
                        const hourlyRate = engineerResource ? ` - ₹${engineerResource.hourly_rate}/hr` : '';
                        
                        return (
                          <option key={engineer.user_id} value={engineer.user_id}>
                            {engineer.full_name} ({engineer.user_id}){hourlyRate}
                          </option>
                        );
                      })}
                  </>
                )}
              </select>
              {engineers.length > 0 && 
               engineers.filter(e => !busyEngineers.includes(e.user_id)).length === 0 &&
               !checkingAvailability && (
                <div className="text-danger small mt-1">
                  No engineers available during selected time period. Please choose different dates.
                </div>
              )}
            </div>

            {/* Estimated Price */}
            <div className="col-md-4 mt-3">
              <label className="form-label">Estimated Price</label>
              <input
                type="number"
                name="estimatedPrice"
                value={formData.estimatedPrice}
                onChange={handleChange}
                required
                className="form-control"
                step="0.01"
                min="0"
              />
              {selectedEngineerHourlyRate > 0 && (
                <div className="text-muted small mt-1">
                  Calculated from {selectedEngineerHourlyRate}/hr × {formData.completionTime || '0'} hours
                </div>
              )}
            </div>

            {/* Dynamic Service Order Id */}
            <div className="col-md-4 mt-3">
              <label className="form-label">Dynamic Service Order Id</label>
              <input
                type="text"
                name="dynamics_service_order_no"
                value={formData.dynamics_service_order_no}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>

          <div className="form-actions d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={checkingAvailability || (engineers.length > 0 && engineers.filter(e => !busyEngineers.includes(e.user_id)).length === 0)}
            >
              {checkingAvailability ? "Checking Availability..." : "Save Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;