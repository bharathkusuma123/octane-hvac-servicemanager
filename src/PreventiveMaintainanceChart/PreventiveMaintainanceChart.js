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

// import React, { useState } from "react";
// import "./PreventiveMaintainanceChart.css";
// import { FaEdit, FaTrash } from "react-icons/fa"; // Add this at top if not already

// const PreventiveMaintainanceChart = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [pmCharts, setPmCharts] = useState([
//     // Sample data - replace with your actual data
//     {
//       chart_id: 1,
//       pm_group_id: "GRP001",
//       pm_id: "A0101",
//       description: "Filter replacement",
//       task_type: "Replace",
//       frequency_days: 90,
//       alert_days: 14,
//       responsible: "Factory",
//       remarks: "Use OEM filters only",
//       created_at: "2023-01-15 09:30:00",
//       updated_at: "2023-01-15 09:30:00",
//       created_by: "admin",
//       updated_by: "admin"
//     },
//     {
//       chart_id: 2,
//       pm_group_id: "GRP002",
//       pm_id: "B0201",
//       description: "System cleaning",
//       task_type: "Clean",
//       frequency_days: 180,
//       alert_days: 30,
//       responsible: "Customer",
//       remarks: "Follow safety protocols",
//       created_at: "2023-02-20 11:15:00",
//       updated_at: "2023-02-20 11:15:00",
//       created_by: "manager",
//       updated_by: "manager"
//     }
//   ]);

//   const [formData, setFormData] = useState({
//     pm_group_id: "",
//     pm_id: "",
//     description: "",
//     task_type: "",
//     frequency_days: "",
//     alert_days: "",
//     responsible: "Factory",
//     remarks: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted", formData);
//     // Here you would typically call an API to save the data
//     // Then reset the form and hide it
//     setFormData({
//       pm_group_id: "",
//       pm_id: "",
//       description: "",
//       task_type: "",
//       frequency_days: "",
//       alert_days: "",
//       responsible: "Factory",
//       remarks: ""
//     });
//     setShowForm(false);
//   };

//   const toggleForm = () => {
//     setShowForm(!showForm);
//   };

//   return (
//     <div className="pm-container">
//       <h2 className="delegate-title">Preventive Maintenance Chart</h2>
//       <p className="delegate-subtitle">
//         Create and manage maintenance tasks and schedules
//       </p>
//       <hr />

//       {!showForm ? (
//         <>
//           <div className="d-flex justify-content-end mb-3">
//             <button
//               onClick={toggleForm}
//               className="btn btn-primary"
//             >
//               Create New PM Chart
//             </button>
//           </div>

//           <div className="table-responsive">
//             <table className="table table-striped table-hover">
//               <thead className="table-dark">
//                 <tr>
//                   <th>Chart ID</th>
//                   <th>PM Group</th>
//                   <th>PM ID</th>
//                   <th>Description</th>
//                   <th>Task Type</th>
//                   <th>Frequency</th>
//                   <th>Alert Days</th>
//                   <th>Responsible</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pmCharts.map((chart) => (
//                   <tr key={chart.chart_id}>
//                     <td>{chart.chart_id}</td>
//                     <td>{chart.pm_group_id}</td>
//                     <td>{chart.pm_id}</td>
//                     <td>{chart.description}</td>
//                     <td>{chart.task_type}</td>
//                     <td>{chart.frequency_days} days</td>
//                     <td>{chart.alert_days} days</td>
//                     <td>
//                       <span className={`badge ${
//                         chart.responsible === 'Factory' ? 'bg-primary' : 'bg-info'
//                       }`}>
//                         {chart.responsible}
//                       </span>
//                     </td>
//    <td>
//   <FaEdit
//     className="action-icon text-primary me-2"
//     title="Edit"

//     role="button"
//   />
//   <FaTrash
//     className="action-icon text-danger"
//     title="Delete"

//     role="button"
//   />
// </td>

//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       ) : (
//         <form className="pm-form" onSubmit={handleSubmit}>
//           {/* Basic Information */}
//           <h3 className="pm-title">Basic Information</h3>
//           <div className="row mb-3">
//             <div className="col-md-6">
//               <label className="form-label">Chart ID</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Auto-generated"
//                 readOnly
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">PM Group ID</label>
//               <select
//                 className="form-select"
//                 name="pm_group_id"
//                 value={formData.pm_group_id}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select PM Group</option>
//                 <option value="GRP001">GRP001</option>
//                 <option value="GRP002">GRP002</option>
//                 <option value="GRP003">GRP003</option>
//               </select>
//             </div>
//           </div>

//           <div className="row mb-3">
//             <div className="col-md-6">
//               <label className="form-label">PM ID</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="pm_id"
//                 value={formData.pm_id}
//                 onChange={handleChange}
//                 placeholder="e.g., A0101"
//                 required
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">Task Type</label>
//               <select
//                 className="form-select"
//                 name="task_type"
//                 value={formData.task_type}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select task type</option>
//                 <option value="Replace">Replace</option>
//                 <option value="Clean">Clean</option>
//                 <option value="Top-up">Top-up</option>
//               </select>
//             </div>
//           </div>

//           {/* Task Details */}
//           <h3 className="pm-title">Task Details</h3>
//           <div className="mb-3">
//             <label className="form-label">Description</label>
//             <textarea
//               className="form-control"
//               rows="3"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Enter maintenance task description"
//               required
//             ></textarea>
//           </div>

//           <div className="row mb-3">
//             <div className="col-md-4">
//               <label className="form-label">Frequency (Days)</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="frequency_days"
//                 value={formData.frequency_days}
//                 onChange={handleChange}
//                 placeholder="e.g., 90"
//                 required
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Alert (Days-before end date)</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 name="alert_days"
//                 value={formData.alert_days}
//                 onChange={handleChange}
//                 placeholder="e.g., 14"
//                 required
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label d-block">Responsible Party</label>
//               <div className="form-check form-check-inline">
//                 <input
//                   type="radio"
//                   name="responsible"
//                   id="factory"
//                   className="form-check-input"
//                   value="Factory"
//                   checked={formData.responsible === "Factory"}
//                   onChange={handleChange}
//                 />
//                 <label className="form-check-label" htmlFor="factory">Factory</label>
//               </div>
//               <div className="form-check form-check-inline">
//                 <input
//                   type="radio"
//                   name="responsible"
//                   id="customer"
//                   className="form-check-input"
//                   value="Customer"
//                   checked={formData.responsible === "Customer"}
//                   onChange={handleChange}
//                 />
//                 <label className="form-check-label" htmlFor="customer">Customer</label>
//               </div>
//             </div>
//           </div>

//           {/* Additional Information */}
//           <h3 className="pm-title">Additional Information</h3>
//           <div className="mb-3">
//             <label className="form-label">Remarks</label>
//             <textarea
//               className="form-control"
//               rows="3"
//               name="remarks"
//               value={formData.remarks}
//               onChange={handleChange}
//               placeholder="Additional notes"
//             ></textarea>
//           </div>

//           {/* Buttons */}
//           <div className="d-flex justify-content-end gap-2">
//             <button
//               type="button"
//               className="btn btn-outline-secondary"
//               onClick={toggleForm}
//             >
//               Cancel
//             </button>
//             <button type="submit" className="btn btn-primary">
//               Save Chart
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default PreventiveMaintainanceChart;

import React, { useState, useEffect } from "react";
import "./PreventiveMaintainanceChart.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const PreventiveMaintainanceChart = () => {
  const [showForm, setShowForm] = useState(false);
  const [pmCharts, setPmCharts] = useState([
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
      updated_by: "admin",
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
      updated_by: "manager",
    },
  ]);

  const [formData, setFormData] = useState({
    pm_group_id: "",
    pm_id: "",
    description: "",
    task_type: "",
    frequency_days: "",
    alert_days: "",
    responsible: "Factory",
    remarks: "",
  });

  const [pmGroups, setPmGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCharts, setFilteredCharts] = useState(pmCharts);

  // Fetch PM Groups from API
  useEffect(() => {
    fetch("http://175.29.21.7:8006/pm-groups/")
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "success") {
          setPmGroups(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch PM Groups:", err));
  }, []);

  useEffect(() => {
    const filtered = pmCharts.filter((chart) =>
      Object.values(chart)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredCharts(filtered);
    setCurrentPage(1);
  }, [searchTerm, pmCharts]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredCharts.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredCharts.length / entriesPerPage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    pm_group: formData.pm_group_id, // ✅ Use correct field
    pm_id: formData.pm_id,
    description: formData.description,
    task_type: formData.task_type,
    frequency_days: Number(formData.frequency_days),
    alert_days: Number(formData.alert_days),
    responsible: formData.responsible,
    remarks: formData.remarks,
    created_by: "Service Manager",
    updated_by: "Service Manager"
  };

  try {
    const response = await fetch("http://175.29.21.7:8006/pm-charts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      alert("Chart added successfully!");

      const newChart = {
        chart_id: result.data?.chart_id || `CHART-${Date.now()}`, // fallback if not returned
        ...payload,
        pm_group_id: payload.pm_group, // add for UI display
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setPmCharts((prev) => [newChart, ...prev]);

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
    } else {
      console.error("API Error:", result);
      alert(result?.message || "Failed to add chart. Please try again.");
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error occurred. Please try again.");
  }
};



  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setFormData({
        pm_group_id: "",
        pm_id: "",
        description: "",
        task_type: "",
        frequency_days: "",
        alert_days: "",
        responsible: "Factory",
        remarks: "",
      });
    }
  };

  return (
    <div className="pm-container">
      {!showForm && (
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div>
            <h2 className="pm-title">Preventive Maintenance Chart</h2>
            <p className="pm-subtitle">
              Create and manage maintenance tasks and schedules
            </p>
          </div>
          <button onClick={toggleForm} className="btn btn-primary">
            Add New Chart
          </button>
        </div>
      )}

      {showForm && (
        <>
          <h2 className="pm-title">Preventive Maintenance Chart</h2>
          <p className="pm-subtitle">Enter details for new maintenance task</p>
        </>
      )}

      {!showForm ? (
        <>
          {/* Search and Pagination Controls */}
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
              </select>
              entries
            </div>
            <input
              type="text"
              className="form-control w-auto"
              placeholder="Search charts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Chart Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>PM Group ID</th>
                  <th>PM ID</th>
                  <th>Description</th>
                  <th>Task Type</th>
                  <th>Frequency (days)</th>
                  <th>Alert Days</th>
                  <th>Responsible</th>
                  <th>Remarks</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Created By</th>
                  <th>Updated By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((chart, index) => (
                    <tr key={index}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{chart.pm_group_id}</td>
                      <td>{chart.pm_id}</td>
                      <td>{chart.description}</td>
                      <td>{chart.task_type}</td>
                      <td>{chart.frequency_days}</td>
                      <td>{chart.alert_days}</td>
                      <td>{chart.responsible}</td>
                      <td>{chart.remarks}</td>
                      <td>{chart.created_at}</td>
                      <td>{chart.updated_at}</td>
                      <td>{chart.created_by}</td>
                      <td>{chart.updated_by}</td>
                      <td>
                        <FaEdit className="text-primary me-2" />
                        <FaTrash className="text-danger" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="14" className="text-center">
                      No charts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredCharts.length > 0 && (
            <div className="pagination-controls d-flex justify-content-center mt-3">
              <button
                className="btn btn-outline-primary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span className="align-self-center mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-outline-primary ms-2"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="pm-form">
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">PM Group ID</label>
              <select
                className="form-control"
                name="pm_group_id"
                value={formData.pm_group_id}
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
              >
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
