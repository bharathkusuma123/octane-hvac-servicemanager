import React, { useState, useEffect } from "react";
import "./PreventiveMaintainanceChart.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const PreventiveMaintainanceChart = () => {
  const [showForm, setShowForm] = useState(false);
  const [pmCharts, setPmCharts] = useState([
    {
      chart_id: "1",
      pm_id: "PM12345",
      description: "Filter replacement",
      task_type: "Replace",
      frequency_days: 90,
      alert_days: 14,
      responsible: "Factory",
      remarks: "Use OEM filters only",
      created_at: "2023-01-15T09:30:00Z",
      updated_at: "2023-01-15T09:30:00Z",
      created_by: "Service Manager",
      updated_by: "Service Manager",
      pm_group: "GRP001",
    },
    {
      chart_id: "2",
      pm_id: "PM67890",
      description: "System cleaning",
      task_type: "Clean",
      frequency_days: 180,
      alert_days: 30,
      responsible: "Customer",
      remarks: "Follow safety protocols",
      created_at: "2023-02-20T11:15:00Z",
      updated_at: "2023-02-20T11:15:00Z",
      created_by: "Service Manager",
      updated_by: "Service Manager",
      pm_group: "GRP002",
    },
  ]);

  const [formData, setFormData] = useState({
    pm_id: "",
    description: "",
    task_type: "",
    frequency_days: "",
    alert_days: "",
    responsible: "Factory",
    remarks: "",
    pm_group: "",
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

    const newChart = {
      pm_id: formData.pm_id,
      description: formData.description,
      task_type: formData.task_type,
      frequency_days: Number(formData.frequency_days),
      alert_days: Number(formData.alert_days),
      responsible: formData.responsible,
      remarks: formData.remarks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "Service Manager",
      updated_by: "Service Manager",
      pm_group: formData.pm_group,
    };

    try {
      const response = await fetch("http://175.29.21.7:8006/pm-charts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newChart),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        // Optionally append the new chart (simulate refresh)
        setPmCharts((prev) => [
          { chart_id: (prev.length + 1).toString(), ...newChart },
          ...prev,
        ]);
        setFormData({
          pm_id: "",
          description: "",
          task_type: "",
          frequency_days: "",
          alert_days: "",
          responsible: "Factory",
          remarks: "",
          pm_group: "",
        });
        setShowForm(false);
      } else {
        console.error("API error:", result.message);
        alert("Failed to save chart: " + result.message);
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("An error occurred while saving the chart.");
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setFormData({
        pm_id: "",
        description: "",
        task_type: "",
        frequency_days: "",
        alert_days: "",
        responsible: "Factory",
        remarks: "",
        pm_group: "",
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
                  <th>PM Group</th>
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
                      <td>{chart.pm_group}</td>
                      <td>{chart.pm_id}</td>
                      <td>{chart.description}</td>
                      <td>{chart.task_type}</td>
                      <td>{chart.frequency_days}</td>
                      <td>{chart.alert_days}</td>
                      <td>{chart.responsible}</td>
                      <td>{chart.remarks}</td>
                      <td>{new Date(chart.created_at).toLocaleString()}</td>
                      <td>{new Date(chart.updated_at).toLocaleString()}</td>
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
