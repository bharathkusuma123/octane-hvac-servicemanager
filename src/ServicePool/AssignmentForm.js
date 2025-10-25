import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import baseURL from "../ApiUrl/Apiurl";

const AssignmentForm = ({ 
  currentRequest, 
  resources, 
  selectedCompany, 
  userId, 
  onClose, 
  onSuccess,
  customers,
  serviceItems,
  getCustomerDetails,
  getServiceItemDetails,
  dataLoading
}) => {
  // Helper function to combine date and time into datetime-local format (24-hour format)
  const combineDateAndTime = (dateString, timeString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    // If timeString is provided, use it; otherwise use default time (09:00)
    if (timeString) {
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      date.setHours(hours, minutes || 0, seconds || 0, 0);
    } else {
      // Default to 9:00 AM if no time provided
      date.setHours(9, 0, 0, 0);
    }
    
    // Convert to local timezone and format for datetime-local input
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return localDate.toISOString().slice(0, 16);
  };

  // Helper function to convert time string to 24-hour format for datetime-local
  const timeTo24HourFormat = (timeString) => {
    if (!timeString) return '09:00'; // Default to 9:00 AM
    
    // If time is already in 24-hour format (contains only numbers and colons)
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeString)) {
      return timeString.split(':').slice(0, 2).join(':');
    }
    
    // If time is in 12-hour format with AM/PM
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      let [_, hours, minutes, period] = timeMatch;
      hours = parseInt(hours);
      minutes = parseInt(minutes);
      
      if (period.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    return '09:00'; // Default fallback
  };

  const [formData, setFormData] = useState({
    engineerId: "",
    completionTime: "",
    estimatedPrice: "",
    dynamics_service_order_no: "",
    startDateTime: combineDateAndTime(currentRequest?.preferred_date, currentRequest?.preferred_time),
    endDateTime: "",
  });

  console.log("Resources in AssignmentForm:", resources);
  
  const [dateError, setDateError] = useState("");
  const [busyEngineers, setBusyEngineers] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [selectedEngineerHourlyRate, setSelectedEngineerHourlyRate] = useState(0);
  
  // Customer and Service Item details state
  const [customerDetails, setCustomerDetails] = useState(null);
  const [serviceItemDetails, setServiceItemDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);

  // Debug function to see what time we're getting from the API
  const debugTimeInfo = () => {
    if (!currentRequest) return null;
    
    console.log('Debug Time Info:');
    console.log('Preferred Date:', currentRequest.preferred_date);
    console.log('Preferred Time:', currentRequest.preferred_time);
    console.log('Combined DateTime:', combineDateAndTime(currentRequest.preferred_date, currentRequest.preferred_time));
    console.log('Form Start DateTime:', formData.startDateTime);
  };

  // Re-initialize form data when currentRequest changes
  useEffect(() => {
    if (currentRequest) {
      const initialStartDateTime = combineDateAndTime(currentRequest.preferred_date, currentRequest.preferred_time);
      setFormData(prev => ({
        ...prev,
        startDateTime: initialStartDateTime,
        endDateTime: ""
      }));
    }
  }, [currentRequest]);

  // Call debug on render to see what's happening
  useEffect(() => {
    debugTimeInfo();
  }, [currentRequest, formData.startDateTime]);

  // Fetch customer and service item details when component mounts or currentRequest changes
  useEffect(() => {
    const fetchDetails = async () => {
      if (!currentRequest) return;
      
      setDetailsLoading(true);
      
      try {
        // Get customer details
        const customerId = currentRequest.customer?.id || currentRequest.customer || currentRequest.requested_by;
        let customer = null;
        
        if (getCustomerDetails) {
          customer = getCustomerDetails(customerId);
        } else if (customers && customers.length > 0) {
          customer = customers.find(cust => cust.customer_id === customerId) || null;
        }
        
        setCustomerDetails(customer);

        // Get service item details
        const serviceItemId = currentRequest.service_item?.id || currentRequest.service_item;
        let serviceItem = null;
        
        if (getServiceItemDetails) {
          serviceItem = getServiceItemDetails(serviceItemId);
        } else if (serviceItems && serviceItems.length > 0) {
          serviceItem = serviceItems.find(item => item.service_item_id === serviceItemId) || null;
        }
        
        setServiceItemDetails(serviceItem);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [currentRequest, customers, serviceItems, getCustomerDetails, getServiceItemDetails]);

  // Show loading state if data is still loading
  if (dataLoading || detailsLoading) {
    return (
      <div className="container mt-4 service-request-form">
        <div className="card">
          <div className="card-header">
            <h3>Service Assignment for {currentRequest?.request_id}</h3>
            <p>Loading customer and service item details...</p>
          </div>
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Please wait while we load the details...</p>
          </div>
        </div>
      </div>
    );
  }


  // Filter active resources (engineers)
  const activeResources = Array.isArray(resources) 
    ? resources.filter(resource => resource.status === "Active")
    : [];

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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  // Format time for display (12-hour format)
  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      let date;
      if (timeString.includes('T') || timeString.includes(' ')) {
        // It's a datetime string
        date = new Date(timeString);
      } else {
        // It's a time string, combine with today's date
        const today = new Date().toISOString().split('T')[0];
        date = new Date(`${today}T${timeString}`);
      }
      
      if (isNaN(date.getTime())) return '';
      
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  // Format datetime for display in form fields (12-hour format)
  const formatDateTimeForDisplay = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';
      
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      
      return `${month}/${day}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return '';
    }
  };

  return (
    <div className="container mt-4 service-request-form">
      <div className="card">
        <div className="card-header">
          <h3>Service Assignment for {currentRequest?.request_id}</h3>
          <p>Fill in the service assignment details below</p>
        </div>

        {/* Customer and Service Item Details Section */}
        <div className="card-body border-bottom">
          <h5 className="mb-3">Request Details</h5>
          <div className="row">
            {/* Customer Details */}
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-header py-2">
                  <h6 className="mb-0">Customer Information</h6>
                </div>
                <div className="card-body">
                  {customerDetails ? (
                    <>
                      <p><strong>Name:</strong> {customerDetails.full_name || customerDetails.username || 'N/A'}</p>
                      <p><strong>Email:</strong> {customerDetails.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {customerDetails.phone || 'N/A'}</p>
                      <p><strong>Address:</strong> {customerDetails.address || 'N/A'}</p>
                    </>
                  ) : (
                    <p className="text-muted">Customer details not found</p>
                  )}
                </div>
              </div>
            </div>

            {/* Service Item Details */}
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-header py-2">
                  <h6 className="mb-0">Service Item Information</h6>
                </div>
                <div className="card-body">
                  {serviceItemDetails ? (
                    <>
                      <p><strong>Item Name:</strong> {serviceItemDetails.item_name || 'N/A'}</p>
                      <p><strong>Location:</strong> {serviceItemDetails.location || 'N/A'}</p>
                      <p><strong>Category:</strong> {serviceItemDetails.category || 'N/A'}</p>
                      <p><strong>Model:</strong> {serviceItemDetails.model || 'N/A'}</p>
                      <p><strong>Serial No:</strong> {serviceItemDetails.serial_number || 'N/A'}</p>
                    </>
                  ) : (
                    <p className="text-muted">Service item details not found</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Service Request Information - All in same row */}
          <div className="row mt-3">
            <div className="col-12">
              <div className="card bg-light">
                <div className="card-header py-2">
                  <h6 className="mb-0">Service Request Information</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* Preferred Date, Preferred Time, and Alert Details in same row */}
                    <div className="col-md-4">
                      <p><strong>Preferred Date:</strong> {formatDate(currentRequest?.preferred_date)}</p>
                    </div>
                    <div className="col-md-4">
                      <p><strong>Preferred Time:</strong> {formatTime(currentRequest?.preferred_time)}</p>
                    </div>
                    <div className="col-md-4">
                      <p><strong>Alert Details:</strong> {currentRequest?.alert_details || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {/* Request Details in last row */}
                  <div className="row mt-2">
                    <div className="col-12">
                      <p><strong>Request Details:</strong> {currentRequest?.request_details || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Form */}
        <form onSubmit={handleSubmit} className="assignment-form p-4">
          <h5 className="mb-3">Assignment Details</h5>
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
                  ? combineDateAndTime(currentRequest.preferred_date, "00:00")
                  : ""}
              />
              <small className="text-muted">
                Based on customer preference: {formatDateTimeForDisplay(combineDateAndTime(currentRequest?.preferred_date, currentRequest?.preferred_time))}
              </small>
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
                    ? combineDateAndTime(currentRequest.preferred_date, "00:00")
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
                placeholder="00:00"
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
                disabled={checkingAvailability || (activeResources.length > 0 && activeResources.filter(r => !busyEngineers.includes(r.user)).length === 0)}
              >
                {checkingAvailability ? (
                  <option value="">Checking engineer availability...</option>
                ) : activeResources.length === 0 ? (
                  <option value="">No active engineers available</option>
                // ) : activeResources.filter(r => !busyEngineers.includes(r.user)).length === 0 ? (
                //   <option value="" disabled>
                //     No available engineers during this time period. Please adjust your dates.
                //   </option>
                ) : (
                  <>
                    <option value="">-- Select Engineer --</option>
                    {activeResources
                      .filter(resource => !busyEngineers.includes(resource.user))
                      .map(resource => (
                        <option key={resource.user} value={resource.user}>
                         {resource.full_name} ({resource.user}) - ﷼{resource.hourly_rate}/hr

                        </option>
                      ))}
                  </>
                )}
              </select>
              {activeResources.length > 0 && 
               activeResources.filter(r => !busyEngineers.includes(r.user)).length === 0 &&
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
    type="text"
    name="estimatedPrice"
    value={
      formData.estimatedPrice
        ? new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(formData.estimatedPrice)
        : ''
    }
    onChange={handleChange}
    required
    className="form-control"
    readOnly
  />
  {selectedEngineerHourlyRate > 0 && (
    <div className="text-muted small mt-1">
      Calculated from ﷼{selectedEngineerHourlyRate}/hr × {formData.completionTime || '0'} hours
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
                placeholder="Enter service order number"
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
              disabled={checkingAvailability || (activeResources.length > 0 && activeResources.filter(r => !busyEngineers.includes(r.user)).length === 0)}
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