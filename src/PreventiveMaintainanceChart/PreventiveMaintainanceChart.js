// import React from "react";
// import "./PreventiveMaintainanceChart.css";

// const PreventiveMaintainanceChart = () => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted");
//   };

//   return (
//     <div className="pm-container">
//       <h2 className="delegate-title">Preventive Maintenance Chart</h2>
//       <p className="delegate-subtitle">
//         Create and manage maintenance tasks and schedules
//       </p>
//       <hr />

//       <form className="pm-form" onSubmit={handleSubmit}>
//         {/* Basic Information */}
//         <h3 className="pm-title">Basic Information</h3>
//         <div className="row mb-3">
//           <div className="col-md-6">
//             <label className="form-label">Chart ID</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Auto-generated"
//               readOnly
//             />
//           </div>
//           <div className="col-md-6">
//             <label className="form-label">PM Group ID</label>
//             <select className="form-select">
//               <option>Select PM Group</option>
//             </select>
//           </div>
//         </div>

//         <div className="row mb-3">
//           <div className="col-md-6">
//             <label className="form-label">PM ID</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="e.g., A0101"
//             />
//           </div>
//           <div className="col-md-6">
//             <label className="form-label">Task Type</label>
//             <select className="form-select">
//               <option>Select task type</option>
//         <option>Replace  </option>
//               <option>Clean  </option>
//               <option>Topup  </option>

//             </select>
//           </div>
//         </div>

//         {/* Task Details */}
//         <h3 className="pm-title">Task Details</h3>
//         <div className="mb-3">
//           <label className="form-label">Description</label>
//           <textarea
//             className="form-control"
//             rows="3"
//             placeholder="Enter maintenance task description"
//           ></textarea>
//         </div>

//        <div className="row mb-3">
//   <div className="col-md-4">
//     <label className="form-label">Frequency (Days)</label>
//     <input
//       type="number"
//       className="form-control"
//       placeholder="e.g., 90"
//     />
//   </div>
//   <div className="col-md-4">
//     <label className="form-label">Alert (Days-before end date)</label>
//     <input
//       type="number"
//       className="form-control"
//       placeholder="e.g., 14"
//     />
//   </div>
//   <div className="col-md-4">
//     <label className="form-label d-block">Responsible Party</label>
//     <div className="form-check form-check-inline " >
//       <input
//         type="radio"
//         name="responsible"
//         id="factory"
//         className="form-check-input"
//         defaultChecked
//       />
//       <label className="form-check-label" htmlFor="factory">Factory</label>
//     </div>
//     <div className="form-check form-check-inline">
//       <input
//         type="radio"
//         name="responsible"
//         id="customer"
//         className="form-check-input"
//       />
//       <label className="form-check-label" htmlFor="customer">Customer</label>
//     </div>
//   </div>
// </div>

//         {/* Additional Information */}
//         <h3 className="pm-title">Additional Information</h3>
//         <div className="mb-3">
//           <label className="form-label">Remarks</label>
//           <textarea
//             className="form-control"
//             rows="3"
//             placeholder="Additional notes"
//           ></textarea>
//         </div>

//         {/* Buttons */}
//         <div className="d-flex justify-content-end gap-2">
//           <button type="button" className="btn btn-outline-secondary">
//             Cancel
//           </button>
//           <button type="submit" className="btn btn-primary">
//             Save Chart
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PreventiveMaintainanceChart;












import React, { useState } from "react";
import "./PreventiveMaintainanceChart.css";

const PreventiveMaintainanceChart = () => {
  const [showForm, setShowForm] = useState(false);
  const [pmCharts, setPmCharts] = useState([
    // Sample data - replace with your actual data
    {
      chart_id: 1,
      pm_group_id: "GRP001",
      pm_id: "A0101",
      description: "Filter replacement",
      task_type: "Replace",
      frequency_days: 90,
      alert_days: 14,
      responsible: "Factory",
      remarks: "Use OEM filters only",
      created_at: "2023-01-15 09:30:00",
      updated_at: "2023-01-15 09:30:00",
      created_by: "admin",
      updated_by: "admin"
    },
    {
      chart_id: 2,
      pm_group_id: "GRP002",
      pm_id: "B0201",
      description: "System cleaning",
      task_type: "Clean",
      frequency_days: 180,
      alert_days: 30,
      responsible: "Customer",
      remarks: "Follow safety protocols",
      created_at: "2023-02-20 11:15:00",
      updated_at: "2023-02-20 11:15:00",
      created_by: "manager",
      updated_by: "manager"
    }
  ]);

  const [formData, setFormData] = useState({
    pm_group_id: "",
    pm_id: "",
    description: "",
    task_type: "",
    frequency_days: "",
    alert_days: "",
    responsible: "Factory",
    remarks: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    // Here you would typically call an API to save the data
    // Then reset the form and hide it
    setFormData({
      pm_group_id: "",
      pm_id: "",
      description: "",
      task_type: "",
      frequency_days: "",
      alert_days: "",
      responsible: "Factory",
      remarks: ""
    });
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="pm-container">
      <h2 className="delegate-title">Preventive Maintenance Chart</h2>
      <p className="delegate-subtitle">
        Create and manage maintenance tasks and schedules
      </p>
      <hr />

      {!showForm ? (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button 
              onClick={toggleForm}
              className="btn btn-primary"
            >
              Create New PM Chart
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Chart ID</th>
                  <th>PM Group</th>
                  <th>PM ID</th>
                  <th>Description</th>
                  <th>Task Type</th>
                  <th>Frequency</th>
                  <th>Alert Days</th>
                  <th>Responsible</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pmCharts.map((chart) => (
                  <tr key={chart.chart_id}>
                    <td>{chart.chart_id}</td>
                    <td>{chart.pm_group_id}</td>
                    <td>{chart.pm_id}</td>
                    <td>{chart.description}</td>
                    <td>{chart.task_type}</td>
                    <td>{chart.frequency_days} days</td>
                    <td>{chart.alert_days} days</td>
                    <td>
                      <span className={`badge ${
                        chart.responsible === 'Factory' ? 'bg-primary' : 'bg-info'
                      }`}>
                        {chart.responsible}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form className="pm-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <h3 className="pm-title">Basic Information</h3>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Chart ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Auto-generated"
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">PM Group ID</label>
              <select 
                className="form-select"
                name="pm_group_id"
                value={formData.pm_group_id}
                onChange={handleChange}
                required
              >
                <option value="">Select PM Group</option>
                <option value="GRP001">GRP001</option>
                <option value="GRP002">GRP002</option>
                <option value="GRP003">GRP003</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">PM ID</label>
              <input
                type="text"
                className="form-control"
                name="pm_id"
                value={formData.pm_id}
                onChange={handleChange}
                placeholder="e.g., A0101"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Task Type</label>
              <select 
                className="form-select"
                name="task_type"
                value={formData.task_type}
                onChange={handleChange}
                required
              >
                <option value="">Select task type</option>
                <option value="Replace">Replace</option>
                <option value="Clean">Clean</option>
                <option value="Top-up">Top-up</option>
              </select>
            </div>
          </div>

          {/* Task Details */}
          <h3 className="pm-title">Task Details</h3>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter maintenance task description"
              required
            ></textarea>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Frequency (Days)</label>
              <input
                type="number"
                className="form-control"
                name="frequency_days"
                value={formData.frequency_days}
                onChange={handleChange}
                placeholder="e.g., 90"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Alert (Days-before end date)</label>
              <input
                type="number"
                className="form-control"
                name="alert_days"
                value={formData.alert_days}
                onChange={handleChange}
                placeholder="e.g., 14"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label d-block">Responsible Party</label>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="responsible"
                  id="factory"
                  className="form-check-input"
                  value="Factory"
                  checked={formData.responsible === "Factory"}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="factory">Factory</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  name="responsible"
                  id="customer"
                  className="form-check-input"
                  value="Customer"
                  checked={formData.responsible === "Customer"}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="customer">Customer</label>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <h3 className="pm-title">Additional Information</h3>
          <div className="mb-3">
            <label className="form-label">Remarks</label>
            <textarea
              className="form-control"
              rows="3"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Additional notes"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={toggleForm}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Chart
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PreventiveMaintainanceChart;