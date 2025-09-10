import React, { useState, useEffect } from "react";
import "./ServicePool.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import baseURL from "../ApiUrl/Apiurl";

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


  useEffect(() => {
    axios.get(`${baseURL}/users/`)
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

  // ✅ Step 1: Create reusable fetch function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/service-pools/`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      const responseData = result.data || result;
      const dataArray = Array.isArray(responseData) ? responseData : [responseData];
      setData(dataArray);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Call fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

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
      `${baseURL}/service-pools/${currentRequest.request_id}/`,
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
      comments: ''
      // decline_reason and comments can be omitted or set to empty string
    };
    console.log("assignmentpayload",assignmentPayload);

    await axios.post(
      `${baseURL}/assignment-history/`,
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

  // More detailed error logging
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


  if (loading) {
    return <div className="service-container">Loading...</div>;
  }

  if (error) {
    return <div className="service-container">Error: {error}</div>;
  }

  return (
    <div className="service-container">
      <h2>Service Pool Details</h2>

      {/* Search & Filter Controls */}
      {!showAssignmentScreen && (
        <div className="table-controls">
          <div className="entries-selector">
            Show{" "}
            <select>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>{" "}
            entries
            <input
              type="text"
              placeholder="Search services..."
              className="search-input"
            />
          </div>
        </div>
      )}

      {/* Table */}
      {!showAssignmentScreen && (
        <>
          <div className="table-wrapper">
            <table className="service-table">
              <thead>
                <tr>
                  <th>SL. NO</th>
                  <th>REQUEST ID</th>
                  <th>REQUEST BY</th>
                  <th>SOURCE TYPE</th>
                  <th>SERVICE ITEM ID</th>
                  <th>PREFERRED DATE || TIME</th>
                  <th>STATUS</th>
                  <th>ENGINEER</th>
                  <th>ACTIONS</th>
                  <th>ASSIGN</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, index) => (
                  <tr key={d.request_id || index}>
                    <td>{String(index + 1).padStart(2, "0")}</td>
                    <td>{d.request_id}</td>
                    <td>{d.requested_by || "N/A"}</td>
                    <td>{d.source_type}</td>
                    <td>{d.service_item}</td>
                    <td>
                      {d.preferred_date ? d.preferred_date.split('T')[0] : "N/A"} || 
                      {d.preferred_time ? d.preferred_time.substring(0, 5) : "N/A"}
                    </td>
                    <td>{d.status}</td>
                    <td>{d.assigned_engineer}</td>
                    <td className="action-icons">
                      <FaEye className="icon view" />
                      <FaEdit className="icon edit" />
                      <FaTrash className="icon delete" />
                    </td>
                    <td>
                      <button
                        className={`assign-btn ${d.status === "Accepted" ? "disabled" : ""}`}
                        onClick={() => handleAssignClick(d)}
                        disabled={d.status == "Accepted"} 
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="table-footer">
            <span>
              Showing 1 to {data.length} of {data.length} items
            </span>
            <div className="pagination">
              <button disabled>«</button>
              <button className="active">1</button>
              <button disabled>»</button>
            </div>
          </div>
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
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAssignmentScreen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
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