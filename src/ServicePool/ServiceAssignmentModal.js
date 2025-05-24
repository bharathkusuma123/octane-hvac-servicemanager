import React from "react";
import "./ServiceAssignment.css";

const ServiceAssignmentModal = ({ show, onClose, onSubmit, formData, handleChange }) => {
  if (!show) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add Service Assignment</h2>
        <form onSubmit={handleFormSubmit} className="service-assignment-form mt-3">
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Assigned Engineer ID</label>
              <input
                type="text"
                className="form-control"
                name="engineerId"
                value={formData.engineerId}
                onChange={handleChange}
                placeholder="001"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Estimated Completion Time</label>
              <input
                type="time"
                className="form-control"
                name="completionTime"
                value={formData.completionTime}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Estimated Price</label>
              <input
                type="number"
                className="form-control"
                name="estimatedPrice"
                value={formData.estimatedPrice}
                onChange={handleChange}
                placeholder="21.20"
              />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label">Estimated Start Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Estimated End Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Service Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceAssignmentModal;
