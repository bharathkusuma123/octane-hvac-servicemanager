import React, { useState, useEffect } from "react";
import "./ServicePool.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useCompany } from "../AuthContext/CompanyContext";

const ServicePoolTable = () => {
  const userId = localStorage.getItem('userId'); 
  const [showAssignmentScreen, setShowAssignmentScreen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [formData, setFormData] = useState({
    engineerId: "",
    completionTime: "",
    estimatedPrice: "",
    startDateTime: "",
    endDateTime: "",
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [dateError, setDateError] = useState("");
  const [busyEngineers, setBusyEngineers] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const navigate = useNavigate();

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
   const { selectedCompany } = useCompany(); // Get selected company from context

  useEffect(() => {
    axios.get("http://175.29.21.7:8006/users/")
      .then(response => {
        const serviceEngineers = response.data.filter(
          user => user.role === "Service Engineer"
        );
        setEngineers(serviceEngineers);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://175.29.21.7:8006/service-pools/");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      const responseData = result.data || result;
      let dataArray = Array.isArray(responseData) ? responseData : [responseData];

      // Sort by created_at descending (most recent first)
      dataArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setData(dataArray);
      setFilteredData(dataArray); // Initialize filtered data
    } catch (err) {
      setError(err.message);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply search filter whenever searchTerm or data changes
   useEffect(() => {
    let results = data;
    
    // First filter by selected company if one is selected
    if (selectedCompany) {
      results = results.filter(item => 
        item.company === selectedCompany
      );
    }
    
    // Then apply search term filter
    if (searchTerm) {
      results = results.filter(item =>
        Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  )}
    
    setFilteredData(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCompany, searchTerm, data]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Split the time string into hours, minutes, seconds
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    // Return formatted time (e.g., "06:40 PM")
    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const checkEngineerAvailability = async (startDateTime, endDateTime) => {
    if (!startDateTime || !endDateTime) return;
    
    setCheckingAvailability(true);
    try {
      // Fetch all existing assignments
      const response = await axios.get("http://175.29.21.7:8006/service-pools/");
      const allAssignments = response.data.data || response.data;
      
      // Convert to array if it's not
      const assignmentsArray = Array.isArray(allAssignments) ? allAssignments : [allAssignments];
      
      // Filter assignments that overlap with our selected time period
      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);
      
      const overlappingAssignments = assignmentsArray.filter(assignment => {
        if (!assignment.est_start_datetime || !assignment.est_end_datetime || assignment.status !== "Assigned") return false;
        
        const assignmentStart = new Date(assignment.est_start_datetime);
        const assignmentEnd = new Date(assignment.est_end_datetime);
        
        return (
          (assignmentStart >= startDate && assignmentStart <= endDate) || // Assignment starts during our period
          (assignmentEnd >= startDate && assignmentEnd <= endDate) ||    // Assignment ends during our period
          (assignmentStart <= startDate && assignmentEnd >= endDate)     // Assignment spans our entire period
        );
      });
      
      // Get unique engineer IDs from overlapping assignments
      const busyEngineerIds = [...new Set(
        overlappingAssignments
          .map(assignment => assignment.assigned_engineer)
          .filter(id => id) // Remove null/undefined
      )];
      
      setBusyEngineers(busyEngineerIds);
    } catch (error) {
      console.error("Error checking engineer availability:", error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    
    // If we're changing the end date, validate it
    if (name === "endDateTime" && newFormData.startDateTime) {
      const startDate = new Date(newFormData.startDateTime);
      const endDate = new Date(value);
      
      if (endDate <= startDate) {
        setDateError("End date must be after start date");
      } else {
        setDateError("");
        // Calculate completion time in hours
        const diffInHours = Math.abs(endDate - startDate) / 36e5;
        newFormData.completionTime = `${Math.floor(diffInHours)}:${Math.floor((diffInHours % 1) * 60)}`;
        
        // Check engineer availability when both dates are set
        checkEngineerAvailability(newFormData.startDateTime, value);
      }
    }
    
    // Also check availability when start date changes and end date exists
    if (name === "startDateTime" && newFormData.endDateTime) {
      checkEngineerAvailability(value, newFormData.endDateTime);
    }
    
    setFormData(newFormData);
  };

  const handleAssignClick = (request) => {
    setCurrentRequest(request);
    // Pre-fill the start date with the preferred date from the request
    setFormData({
      ...formData,
      startDateTime: request.preferred_date ? 
        new Date(request.preferred_date).toISOString().slice(0, 16) : ""
    });
    setShowAssignmentScreen(true);
    setBusyEngineers([]); // Reset busy engineers when opening the form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates before submission
    if (formData.endDateTime && formData.startDateTime) {
      const startDate = new Date(formData.startDateTime);
      const endDate = new Date(formData.endDateTime);
      
      if (endDate <= startDate) {
        setDateError("End date must be after start date");
        return;
      }
    }


function toISOTimeString(start, end) {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const durationMs = endTime - startTime;
  const durationDate = new Date(durationMs);
  return durationDate.toISOString().split("T")[1]; // gets only the time part with Z
}



    const payload = {
  assigned_engineer: formData.engineerId,
  estimated_completion_time: toISOTimeString(formData.startDateTime, formData.endDateTime),
  estimated_price: Number(formData.estimatedPrice),
  est_start_datetime: formData.startDateTime,
  est_end_datetime: formData.endDateTime,
  status: "Assigned",
  company: selectedCompany, 
};

    try {
      // First update the service pool record
      await axios.put(
        `http://175.29.21.7:8006/service-pools/${currentRequest.request_id}/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Then create the assignment history record
      const assignmentPayload = {
        assignment_id: Math.floor(Math.random() * 1000000),
        request: currentRequest.request_id,
        assigned_engineer: formData.engineerId,
        assigned_by: userId,
        assigned_at: new Date().toISOString(),
        assignment_type: "Assign",
        status: "Pending",
        comments: '',
        created_by: "Service Manager",
        updated_by: "Service Manager",
        company: selectedCompany,
        
      };

      await axios.post(
        "http://175.29.21.7:8006/assignment-history/",
        assignmentPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Engineer assigned successfully and history recorded!");
      
      // Refresh data after assignment
      await fetchData();
      
      // Close modal and reset form
      setShowAssignmentScreen(false);
      setFormData({
        engineerId: "",
        completionTime: "",
        estimatedPrice: "",
        startDateTime: "",
        endDateTime: "",
      });
      setDateError("");

    } catch (err) {
      console.error("Failed to assign engineer:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Status code:", err.response.status);
        console.error("Headers:", err.response.headers);
      } else if (err.request) {
        console.error("Request was made but no response received:", err.request);
      } else {
        console.error("Something went wrong in setting up the request:", err.message);
      }
      alert("Failed to assign engineer. Please check the console for more details.");
    }
  };

  // Pagination calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  if (loading) {
    return <div className="service-container">Loading...</div>;
  }

  if (error) {
    return <div className="service-container">Error: {error}</div>;
  }

  return (
    <div className="service-container pm-container">
      {/* Header */}
      {!showAssignmentScreen && (
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div>
            <h2 className="pm-title">Service Pool Details</h2>
             <p className="pm-subtitle">
              {selectedCompany 
                ? `Showing service requests for ${selectedCompany}`
                : 'Showing all service requests'}
            </p>
            <p className="pm-subtitle">Manage service requests and assignments</p>
          </div>
        </div>
      )}

      {!showAssignmentScreen && (
        <>
          {/* Search and Entries Per Page */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="form-select form-select-sm w-auto"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              entries
            </div>
            <input
              type="text"
              className="form-control w-auto"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table-responsive mb-4">
            <table className="table ">
              <thead className="new-customer-table-header">
                <tr>
                  <th>S.No</th>
                  <th>Request ID</th>
                   <th>Company</th>
                  <th>Request By</th>
                  <th>Service Item</th>
                  <th>Preferred Date/Time</th>
                  <th>Status</th>
                  <th>Engineer</th>
                  <th>Assign</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={item.request_id || index}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>
                        <button 
                          className="btn btn-link p-0 " 
                          onClick={() => navigate(`/servicemanager/service-requests/${item.request_id}`)}
                        >
                          {item.request_id}
                        </button>
                      </td>
                        <td>{item.company}</td>
                      <td>{item.requested_by || "N/A"}</td>
                      <td>{item.service_item}</td>
                      <td>
                        {formatDate(item.preferred_date)} {formatTime(item.preferred_time)}
                      </td>
                      <td>{item.status}</td>
                      <td>{item.assigned_engineer || "N/A"}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${item.status === "Accepted" ? "btn-secondary disabled" : "btn-primary"}`}
                          onClick={() => handleAssignClick(item)}
                          disabled={item.status === "Accepted"}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No service requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="pagination-controls d-flex justify-content-center mt-3">
              <button
                className="btn btn-outline-primary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </button>
              <span className="align-self-center mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-outline-primary ms-2"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Full-Screen Assignment Form */}
      {showAssignmentScreen && (
        <div className="container mt-4 service-request-form">
          <div className="card">
            <div className="card-header">
              <h3>Service Assignment for {currentRequest?.request_id}</h3>
              <p>Fill in the service assignment details below</p>
            </div>

            <form onSubmit={handleSubmit} className="assignment-form">
              <div className="row mb-3">
                {/* Row 1: Start Date, End Date, Completion Time */}
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

                <div className="col-md-4 mt-2">
                  <label className="form-label">Estimated End Date & Time</label>
                  <input
                    type="datetime-local"
                    name="endDateTime"
                    value={formData.endDateTime}
                    onChange={handleDateChange}
                    required
                    className="form-control"
                    min={
                      formData.startDateTime ||
                      (currentRequest?.preferred_date
                        ? new Date(currentRequest.preferred_date).toISOString().slice(0, 16)
                        : ""
      )}
                  />
                  {dateError && (
                    <div className="text-danger small mt-1">{dateError}</div>
                  )}
                </div>

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

                {/* Row 2: Assigned Engineer, Estimated Price */}
                <div className="col-md-4 mt-3">
                  <label className="form-label">Assigned Engineer</label>
                  <select
                    name="engineerId"
                    value={formData.engineerId}
                    onChange={handleChange}
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
                          .map(engineer => (
                            <option key={engineer.user_id} value={engineer.user_id}>
                              {engineer.full_name} ({engineer.user_id})
                            </option>
                          ))}
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

                <div className="col-md-4 mt-3">
                  <label className="form-label">Estimated Price</label>
                  <input
                    type="number"
                    name="estimatedPrice"
                    value={formData.estimatedPrice}
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
                  onClick={() => {
                    setShowAssignmentScreen(false);
                    setDateError("");
                  }}
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
      )}
    </div>
  );
};

export default ServicePoolTable;