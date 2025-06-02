import React, { useState, useEffect } from "react";
import "./ServicePool.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

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
const navigate = useNavigate();

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

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
      const dataArray = Array.isArray(responseData) ? responseData : [responseData];
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
    if (searchTerm === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignClick = (request) => {
    setCurrentRequest(request);
    setShowAssignmentScreen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      assigned_engineer: formData.engineerId,
      estimated_completion_time: formData.completionTime,
      estimated_price: formData.estimatedPrice,
      est_start_datetime: formData.startDateTime,
      est_end_datetime: formData.endDateTime,
      status: "Assigned"
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
  created_by:"Service Manager",
updated_by: "Service Manager"
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
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Request ID</th>
                  <th>Request By</th>
                  <th>Source Type</th>
                  <th>Service Item</th>
                  <th>Preferred Date/Time</th>
                  <th>Status</th>
                  <th>Engineer</th>
                  <th>Actions</th>
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
</td>                      <td>{item.requested_by || "N/A"}</td>
                      <td>{item.source_type}</td>
                      <td>{item.service_item}</td>
                      <td>
                        {item.preferred_date ? item.preferred_date.split('T')[0] : "N/A"} / 
                        {item.preferred_time ? item.preferred_time.substring(0, 5) : "N/A"}
                      </td>
                      <td>{item.status}</td>
                      <td>{item.assigned_engineer || "N/A"}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary">
                            <FaEye />
                          </button>
                          <button className="btn btn-sm btn-outline-secondary">
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
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
        <div className="assignment-screen">
          <h3>Service Assignment for {currentRequest?.request_id}</h3>
          <p>Fill in the service assignment details below</p>

          <form onSubmit={handleSubmit} className="assignment-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Assigned Engineer</label>
                <select
                  name="engineerId"
                  value={formData.engineerId}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">-- Select Engineer --</option>
                  {engineers.map(engineer => (
                    <option key={engineer.user_id} value={engineer.user_id}>
                      {engineer.full_name} ({engineer.user_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Completion Time</label>
                <input
                  type="time"
                  name="completionTime"
                  value={formData.completionTime}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Estimated Price</label>
                <input
                  type="number"
                  name="estimatedPrice"
                  value={formData.estimatedPrice}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Estimated Start Date & Time</label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Estimated End Date & Time</label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
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
                onClick={() => setShowAssignmentScreen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Assignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServicePoolTable;