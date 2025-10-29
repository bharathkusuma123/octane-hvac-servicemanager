import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import baseURL from "../ApiUrl/Apiurl";

const ServiceRequestItemHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceRequest, serviceItemDetails, engineerStatus, customerName, userId } = location.state || {};

  const [serviceRequestHistory, setServiceRequestHistory] = useState([]);
  const [historyFormData, setHistoryFormData] = useState({
    sr_item_id: "",
    company: "",
    service_request: "",
    component: "",
    pm_schedule: "",
    old_comp_serial_no: "",
    new_comp_serial_no: "",
    task_type: "",
    warranty_start_date: "",
    warranty_end_date: "",
    action_taken: "",
    remarks: "",
    serviced_by: "",
    created_by: userId || "",
    updated_by: userId || ""
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch service request history
  const fetchServiceRequestHistory = async () => {
    if (!serviceRequest?.request_id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/service-req-items-history/`, {
        params: {
          service_request: serviceRequest.request_id
        }
      });
      
      if (response.data && response.data.length > 0) {
        setServiceRequestHistory(response.data);
        // Pre-fill form with first history item if exists
        const firstHistory = response.data[0];
        setHistoryFormData({
          sr_item_id: firstHistory.sr_item_id || "",
          company: firstHistory.company || serviceRequest.company || "",
          service_request: serviceRequest.request_id,
          component: firstHistory.component || "",
          pm_schedule: firstHistory.pm_schedule || "",
          old_comp_serial_no: firstHistory.old_comp_serial_no || "",
          new_comp_serial_no: firstHistory.new_comp_serial_no || "",
          task_type: firstHistory.task_type || "",
          warranty_start_date: firstHistory.warranty_start_date || "",
          warranty_end_date: firstHistory.warranty_end_date || "",
          action_taken: firstHistory.action_taken || "",
          remarks: firstHistory.remarks || "",
          serviced_by: firstHistory.serviced_by || "",
          created_by: userId || "",
          updated_by: userId || ""
        });
      } else {
        // Initialize empty form for new history
        setHistoryFormData(prev => ({
          ...prev,
          company: serviceRequest.company || "",
          service_request: serviceRequest.request_id,
          created_by: userId || "",
          updated_by: userId || ""
        }));
      }
    } catch (error) {
      console.error("Failed to fetch service request history", error);
      // Initialize empty form on error
      setHistoryFormData(prev => ({
        ...prev,
        company: serviceRequest?.company || "",
        service_request: serviceRequest?.request_id || "",
        created_by: userId || "",
        updated_by: userId || ""
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceRequest?.request_id) {
      fetchServiceRequestHistory();
    }
  }, [serviceRequest?.request_id]);

  // Handle form input changes
  const handleHistoryFormChange = (e) => {
    const { name, value } = e.target;
    setHistoryFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleHistoryFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let response;
      
      if (serviceRequestHistory.length > 0 && historyFormData.sr_item_id) {
        // Update existing history
        response = await axios.put(
          `${baseURL}/service-req-items-history/${historyFormData.sr_item_id}/`,
          historyFormData
        );
      } else {
        // Create new history
        response = await axios.post(
          `${baseURL}/service-req-items-history/`,
          historyFormData
        );
      }
      
      if (response.status === 200 || response.status === 201) {
        alert("Service request item history saved successfully!");
        // Refresh the history data
        fetchServiceRequestHistory();
      }
    } catch (error) {
      console.error("Failed to save service request history", error);
      alert("Failed to save service request history. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (!serviceRequest) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">No service request data found. Please go back and try again.</div>
        <button onClick={handleBack} className="btn btn-secondary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="pm-title">Service Request Item History</h2>
          <p className="pm-subtitle">Request ID: {serviceRequest.request_id}</p>
        </div>
        <button onClick={handleBack} className="btn btn-outline-secondary">
          ← Back to Service Pool
        </button>
      </div>

      {/* Service Request Summary */}
      {/* <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Service Request Summary</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <strong>Requested By:</strong> {customerName || "N/A"}
            </div>
            <div className="col-md-4">
              <strong>Service Item:</strong> {serviceRequest.service_item || "N/A"}
            </div>
            <div className="col-md-4">
              <strong>Location:</strong> {serviceItemDetails?.location || "N/A"}
            </div>
            <div className="col-md-4 mt-2">
              <strong>Status:</strong> {serviceRequest.status || "N/A"}
            </div>
            <div className="col-md-4 mt-2">
              <strong>Engineer Status:</strong> {engineerStatus || "N/A"}
            </div>
            <div className="col-md-4 mt-2">
              <strong>Assigned Engineer:</strong> {serviceRequest.assigned_engineer || "N/A"}
            </div>
          </div>
        </div>
      </div> */}

      {/* History Form */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            {serviceRequestHistory.length > 0 ? "Edit Service Request Item History" : "Add Service Request Item History"}
          </h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleHistoryFormSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Service Request Item ID *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="sr_item_id"
                    value={historyFormData.sr_item_id}
                    onChange={handleHistoryFormChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    className="form-control"
                    name="company"
                    value={historyFormData.company}
                    onChange={handleHistoryFormChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Service Request</label>
                  <input
                    type="text"
                    className="form-control"
                    value={historyFormData.service_request}
                    disabled
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Component</label>
                  <input
                    type="text"
                    className="form-control"
                    name="component"
                    value={historyFormData.component}
                    onChange={handleHistoryFormChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">PM Schedule</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pm_schedule"
                    value={historyFormData.pm_schedule}
                    onChange={handleHistoryFormChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Task Type</label>
                  <select
                    className="form-select"
                    name="task_type"
                    value={historyFormData.task_type}
                    onChange={handleHistoryFormChange}
                  >
                    <option value="">Select Task Type</option>
                    <option value="Replace">Replace</option>
                    <option value="Clean">Clean</option>
                    <option value="Top-up">Top-up</option>
                    <option value="Repair">Repair</option>
                    <option value="Inspect">Inspect</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Old Component Serial No</label>
                  <input
                    type="text"
                    className="form-control"
                    name="old_comp_serial_no"
                    value={historyFormData.old_comp_serial_no}
                    onChange={handleHistoryFormChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">New Component Serial No</label>
                  <input
                    type="text"
                    className="form-control"
                    name="new_comp_serial_no"
                    value={historyFormData.new_comp_serial_no}
                    onChange={handleHistoryFormChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Warranty Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="warranty_start_date"
                    value={historyFormData.warranty_start_date}
                    onChange={handleHistoryFormChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Warranty End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="warranty_end_date"
                    value={historyFormData.warranty_end_date}
                    onChange={handleHistoryFormChange}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Action Taken</label>
                  <textarea
                    className="form-control"
                    name="action_taken"
                    value={historyFormData.action_taken}
                    onChange={handleHistoryFormChange}
                    rows="3"
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    name="remarks"
                    value={historyFormData.remarks}
                    onChange={handleHistoryFormChange}
                    rows="3"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Serviced By</label>
                  <input
                    type="text"
                    className="form-control"
                    name="serviced_by"
                    value={historyFormData.serviced_by}
                    onChange={handleHistoryFormChange}
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    "Save History"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Existing History Records */}
      {serviceRequestHistory.length > 0 && (
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="card-title mb-0">Existing History Records</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>SR Item ID</th>
                    <th>Task Type</th>
                    <th>Action Taken</th>
                    <th>Serviced By</th>
                    <th>Serviced At</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequestHistory.map((history) => (
                    <tr key={history.sr_item_id}>
                      <td>{history.sr_item_id}</td>
                      <td>{history.task_type}</td>
                      <td>{history.action_taken}</td>
                      <td>{history.serviced_by}</td>
                      <td>{new Date(history.serviced_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequestItemHistory;