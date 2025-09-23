import React, { useState, useEffect, useContext, useRef } from "react";
import "./ServicePool.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import baseURL from "../ApiUrl/Apiurl";
import { useNavigate } from 'react-router-dom';
import { useCompany } from "../AuthContext/CompanyContext";
import Swal from 'sweetalert2';
import { AuthContext } from "../AuthContext/AuthContext";

const ServicePoolTable = () => { 
  const { userId } = useContext(AuthContext);
  const [showAssignmentScreen, setShowAssignmentScreen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [isReopening, setIsReopening] = useState(false);
  const [historyResponse, setHistoryResponse] = useState({ data: [] });
  const [formData, setFormData] = useState({
    engineerId: "",
    completionTime: "",
    estimatedPrice: "",
    dynamics_service_order_no: "",
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
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();
  const ws = useRef(null);

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const { selectedCompany } = useCompany();

  // Function to get the latest assignment for a request
  const getLatestAssignment = (requestId) => {
    if (!historyResponse.data || !Array.isArray(historyResponse.data)) return null;
    
    // Filter assignments for this request
    const requestAssignments = historyResponse.data.filter(
      history => history.request === requestId
    );
    
    if (requestAssignments.length === 0) return null;
    
    // Sort by assigned_at date (newest first) and return the first one
    const sortedAssignments = requestAssignments.sort((a, b) => 
      new Date(b.assigned_at) - new Date(a.assigned_at)
    );
    
    return sortedAssignments[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${baseURL}/users/`);
        const serviceEngineers = usersResponse.data.filter(
          user => user.role === "Service Engineer"
        );
        setEngineers(serviceEngineers);

        if (selectedCompany && userId) {
          const resourcesResponse = await axios.get(`${baseURL}/resources/?company_id=${selectedCompany}&user_id=${userId}`);
          const resourceArray = Array.isArray(resourcesResponse.data?.data) ? resourcesResponse.data.data : [];
          setResources(resourceArray);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [selectedCompany, userId]);

  const fetchPoolData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/service-pools/?user_id=${userId}&company_id=${selectedCompany}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json(); 
      const responseData = result.data || result;
      let dataArray = Array.isArray(responseData) ? responseData : [responseData];

      dataArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setData(dataArray);
      setFilteredData(dataArray);
    } catch (err) {
      setError(err.message);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoolData();
  }, [userId, selectedCompany]);

  useEffect(() => {
    let results = data;
    
    if (selectedCompany) {
      results = results.filter(item => 
        item.company === selectedCompany
      );
    }
    
    if (searchTerm) {
      results = results.filter(item =>
        Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
      )}
    
    setFilteredData(results);
    setCurrentPage(1);
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
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

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
      }
    } catch (error) {
      console.error("Error checking engineer availability:", error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  useEffect(() => {
    const fetchAssignmentHistory = async () => {
      try {
        const response = await axios.get(`${baseURL}/assignment-history/`, {
          params: {
            user_id: userId,
            company_id: selectedCompany
          }
        });
        
        let historyData = response.data?.data || response.data || [];
        
        // Ensure it's an array and sort by assigned_at date (newest first)
        if (Array.isArray(historyData)) {
          historyData.sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at));
        }
        
        setHistoryResponse({ data: historyData });
      } catch (error) {
        console.error("Error fetching assignment history:", error);
        setHistoryResponse({ data: [] });
      }
    };

    if (userId && selectedCompany) {
      fetchAssignmentHistory();
    }
  }, [userId, selectedCompany]);

  // WebSocket connection
  useEffect(() => {
    if (!userId || !selectedCompany) return;

    const websocketUrl = `ws://175.29.21.7:8006/ws/assignment-status/?user_id=${userId}&company_id=${selectedCompany}`;
    console.log('Attempting to connect WebSocket:', websocketUrl);

    ws.current = new WebSocket(websocketUrl);

    ws.current.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    ws.current.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);
        console.log('📩 WebSocket message received:', message);

        setHistoryResponse(prev => {
          const updatedData = prev.data.map(item =>
            item.assignment_id === message.assignment_id
              ? { ...item, status: message.status }
              : item
          );
          return { data: updatedData };
        });
      } catch (err) {
        console.error('❌ Error parsing WebSocket message:', err);
      }
    };

    ws.current.onerror = (e) => {
      console.error('❌ WebSocket error. Possibly backend not running or incorrect URL.', e);
    };

    ws.current.onclose = (e) => {
      console.warn('⚠ WebSocket disconnected. Code:', e.code, 'Reason:', e.reason || 'No reason');
    };

    return () => {
      if (ws.current) {
        console.log('🔌 Closing WebSocket connection');
        ws.current.close();
      }
    };
  }, [userId, selectedCompany]);

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
        newFormData.completionTime = `${Math.floor(diffInHours)}:${Math.floor((diffInHours % 1) * 60)}`;
        checkEngineerAvailability(newFormData.startDateTime, value);
      }
    }
    
    if (name === "startDateTime" && newFormData.endDateTime) {
      checkEngineerAvailability(value, newFormData.endDateTime);
    }
    
    setFormData(newFormData);
  };

  const handleAssignClick = (request, isReopen = false) => {
    setCurrentRequest(request);
    setIsReopening(isReopen);
    
    if (isReopen && request) {
      setFormData({
        engineerId: "",
        completionTime: "",
        estimatedPrice: request.estimated_price || "",
        dynamics_service_order_no: request.dynamics_service_order_no || "",
        startDateTime: request.est_start_datetime ? 
          new Date(request.est_start_datetime).toISOString().slice(0, 16) : 
          (request.preferred_date ? 
            new Date(request.preferred_date).toISOString().slice(0, 16) : ""),
        endDateTime: request.est_end_datetime ? 
          new Date(request.est_end_datetime).toISOString().slice(0, 16) : "",
      });
    } else {
      setFormData({
        engineerId: "",
        completionTime: "",
        estimatedPrice: "",
        dynamics_service_order_no: "",
        startDateTime: request.preferred_date ? 
          new Date(request.preferred_date).toISOString().slice(0, 16) : "",
        endDateTime: "",
      });
    }
    
    setShowAssignmentScreen(true);
    setBusyEngineers([]);
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
      assignment_type: isReopening ? "Reassign" : "Assign",
      status: "Pending",
      decline_reason: "",
      comments: isReopening ? "Service reopened and reassigned" : "",
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
        text: `Service request ${isReopening ? 'reopened and ' : ''}assigned successfully!`,
        confirmButtonColor: '#3085d6',
      });

      await fetchPoolData();
      setShowAssignmentScreen(false);
      setFormData({
        engineerId: "",
        completionTime: "",
        estimatedPrice: "",
        dynamics_service_order_no: "",
        startDateTime: "",
        endDateTime: "",
      });
      setIsReopening(false);
      setDateError("");
    } catch (err) {
      console.error("Assignment failed:", err);
      let errorMessage = err.message;
      
      if (err.response?.data) {
        console.log("Backend error response:", err.response.data);
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

  const handleReopenService = (request) => {
    Swal.fire({
      icon: 'question',
      title: 'Re-open Service?',
      text: `Are you sure you want to re-open request ${request.request_id}? This will allow you to assign it to an engineer.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Re-open',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        handleAssignClick(request, true);
      }
    });
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
            <table className="table">
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
                  <th>Engineer Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => {
                    // Get the latest assignment for this request
                    const latestAssignment = getLatestAssignment(item.request_id);
                    const engineerStatus = latestAssignment?.status || "N/A";

                    // Determine if Assign button should be enabled
                    const canAssign = item.status === "Open" || engineerStatus === "Declined";

                    return (
                      <tr key={item.request_id || index}>
                        <td>{indexOfFirstEntry + index + 1}</td>
                        <td>
                          <button 
                            className="btn btn-link p-0" 
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
                          {engineerStatus === "Pending" && (
                            <span className="badge bg-warning text-dark">Pending</span>
                          )}
                          {engineerStatus === "Accepted" && (
                            <span className="badge bg-success">Accepted</span>
                          )}
                          {engineerStatus === "Declined" && (
                            <span className="badge bg-danger">Declined</span>
                          )}
                          {engineerStatus === "N/A" && "N/A"}
                        </td>
                        <td>
                          {canAssign ? (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleAssignClick(item, false)}
                            >
                              Assign
                            </button>
                          ) : item.status === "Closed" ? (
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleReopenService(item)}
                            >
                              Re-open Service
                            </button>
                          ) : (
                            <button className="btn btn-sm btn-secondary disabled">
                              Assign
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">No service requests found.</td>
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
              <h3>
                {isReopening ? 'Re-open Service Assignment' : 'Service Assignment'} 
                for {currentRequest?.request_id}
              </h3>
              <p>
                {isReopening 
                  ? 'Reassign this service to an engineer' 
                  : 'Fill in the service assignment details below'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="assignment-form">
              <div className="row mb-3">
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
                      )
                    }
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
                  onClick={() => {
                    setShowAssignmentScreen(false);
                    setDateError("");
                    setIsReopening(false);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={checkingAvailability || (engineers.length > 0 && engineers.filter(e => !busyEngineers.includes(e.user_id)).length === 0)}
                >
                  {checkingAvailability 
                    ? "Checking Availability..." 
                    : isReopening 
                      ? "Re-open and Assign" 
                      : "Save Assignment"}
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