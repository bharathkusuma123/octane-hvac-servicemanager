import React, { useState, useEffect } from "react";
import "./ServicePool.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const ServicePoolTable = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://175.29.21.7:8006/service-pools/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        
        // Handle both array and object responses
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted for request:", currentRequest?.request_id, formData);
    setShowAssignmentScreen(false);
    setFormData({
      engineerId: "",
      completionTime: "",
      estimatedPrice: "",
      startDateTime: "",
      endDateTime: "",
    });
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
                    <td className="action-icons">
                      <FaEye className="icon view" />
                      <FaEdit className="icon edit" />
                      <FaTrash className="icon delete" />
                    </td>
                    <td>
                      <button
                        className="assign-btn"
                        onClick={() => handleAssignClick(d)}
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
                <label>Assigned Engineer ID</label>
                <input
                  type="text"
                  name="engineerId"
                  value={formData.engineerId}
                  onChange={handleChange}
                  required
                />
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