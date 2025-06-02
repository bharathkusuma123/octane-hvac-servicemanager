import React from "react";

const complaintTypes = [
  "Service Delay",
  "Product Defect",
  "Billing Error",
  "Service Quality",
  "Documentation Error",
];

const escalationLevels = ["None", "Level 1", "Level 2", "Level 3"];
const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];

const CustomerComplaintsForm = ({
  formData,
  handleChange,
  handleSubmit,
  toggleForm,
  companies = [],
  customers = [],
}) => (
  <form onSubmit={handleSubmit} className="complaint-form">
    <div className="row mb-3">
      <div className="col-md-4">
        <label className="form-label">Complaint ID</label>
        <input
          type="text"
          className="form-control"
          name="complaint_id"
          value={formData.complaint_id || ""}
          onChange={handleChange}
          placeholder="Auto-generated"
          readOnly
        />
      </div>

      <div className="col-md-4">
        <label className="form-label">Complaint Type</label>
        <select
          className="form-control"
          name="complaint_type"
          value={formData.complaint_type || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select Complaint Type</option>
          {complaintTypes.map((type, i) => (
            <option key={i} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label">Status</label>
        <select
          className="form-control"
          name="status"
          value={formData.status || "Open"}
          onChange={handleChange}
          required
        >
          {statusOptions.map((status, i) => (
            <option key={i} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Company</label>
        <select
          className="form-control"
          name="company"
          value={formData.company || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select Company</option>
          {companies.map((company, i) => (
            <option key={i} value={company}>{company}</option>
          ))}
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label">Customer</label>
        <select
          className="form-control"
          name="customer"
          value={formData.customer || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select Customer</option>
          {customers.map((customer, i) => (
            <option key={i} value={customer}>{customer}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Service Order #</label>
        <input
          type="number"
          className="form-control"
          name="service_order"
          value={formData.service_order || ""}
          onChange={handleChange}
          required
          placeholder="Enter service order number"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Escalation Level</label>
        <select
          className="form-control"
          name="escalation_level"
          value={formData.escalation_level || "None"}
          onChange={handleChange}
        >
          {escalationLevels.map((level, i) => (
            <option key={i} value={level}>{level}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Service Manager Email</label>
        <input
          type="email"
          className="form-control"
          name="service_manager_email"
          value={formData.service_manager_email || ""}
          onChange={handleChange}
          required
          placeholder="e.g. manager@example.com"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">GM Email</label>
        <input
          type="email"
          className="form-control"
          name="gm_email"
          value={formData.gm_email || ""}
          onChange={handleChange}
          required
          placeholder="e.g. gm@example.com"
        />
      </div>
    </div>

    <div className="mb-3">
      <label className="form-label">Complaint Details</label>
      <textarea
        className="form-control"
        name="complaint_details"
        value={formData.complaint_details || ""}
        onChange={handleChange}
        rows="3"
        required
        placeholder="Describe the complaint in detail"
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Resolution Details</label>
      <textarea
        className="form-control"
        name="resolution_details"
        value={formData.resolution_details || ""}
        onChange={handleChange}
        rows="3"
        placeholder="Enter resolution details if resolved"
      />
    </div>

    <div className="d-flex justify-content-end gap-2 mt-4">
      <button type="button" className="btn btn-outline-secondary" onClick={toggleForm}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        {formData.complaint_id ? "Update Complaint" : "Create Complaint"}
      </button>
    </div>
  </form>
);

export default CustomerComplaintsForm;
