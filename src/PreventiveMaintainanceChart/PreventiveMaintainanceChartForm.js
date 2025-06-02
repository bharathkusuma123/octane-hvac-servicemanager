import React from "react";

const ChartForm = ({ formData, handleChange, handleSubmit, pmGroups, toggleForm }) => (
  <form onSubmit={handleSubmit} className="pm-form">
    <div className="row mb-3">
      <div className="col-md-4">
        <label className="form-label">Chart ID</label>
        <input
          type="text"
          className="form-control"
          name="chart_id"
          value={formData.chart_id || ""}
          onChange={handleChange}
        //   placeholder="Enter Chart ID"
          required
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">PM Group</label>
        <select
          className="form-control"
          name="pm_group"
          value={formData.pm_group}
          onChange={handleChange}
          required
        >
          <option value="">Select PM Group</option>
          {pmGroups.map((group) => (
            <option key={group.pm_group_id} value={group.pm_group_id}>
              {group.pm_group_id}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label">PM ID</label>
        <input
          type="text"
          className="form-control"
          name="pm_id"
          value={formData.pm_id}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Description</label>
        <input
          type="text"
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-4">
        <label className="form-label">Task Type</label>
        <input
          type="text"
          className="form-control"
          name="task_type"
          value={formData.task_type}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Frequency (Days)</label>
        <input
          type="number"
          className="form-control"
          name="frequency_days"
          value={formData.frequency_days}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Alert Days</label>
        <input
          type="number"
          className="form-control"
          name="alert_days"
          value={formData.alert_days}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-4">
        <label className="form-label">Responsible</label>
        <select
          className="form-select"
          name="responsible"
          value={formData.responsible}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="Factory">Factory</option>
          <option value="Customer">Customer</option>
        </select>
      </div>
      <div className="col-md-8">
        <label className="form-label">Remarks</label>
        <input
          type="text"
          className="form-control"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
        />
      </div>
    </div>

    <div className="d-flex justify-content-end gap-2">
      <button type="button" className="btn btn-outline-secondary" onClick={toggleForm}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        Save Chart
      </button>
    </div>
  </form>
);

export default ChartForm;
