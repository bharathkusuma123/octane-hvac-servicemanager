import React, { useState, useEffect } from "react";
import ChartTable from "./PreventiveMaintainanceChartTable";
import ChartForm from "./PreventiveMaintainanceChartForm";
import "./PreventiveMaintainanceChart.css";
import baseURL from '../ApiUrl/Apiurl';

const PreventiveMaintainanceChart = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    chart_id: "",
    pm_group: "",
    pm_id: "",
    description: "",
    task_type: "",
    frequency_days: "",
    alert_days: "",
    responsible: "",
    remarks: ""
  });

  const [pmGroups, setPmGroups] = useState([]);
  const [charts, setCharts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPmGroups = async () => {
      try {
         const response = await fetch(`${baseURL}/pm-groups/`);
        const data = await response.json();
        if (data.status === "success") {
          setPmGroups(data.data);
        } else {
          console.error("Failed to fetch PM Groups");
        }
      } catch (error) {
        console.error("Error fetching PM Groups:", error);
      }
    };

    fetchPmGroups();
    setCharts([]);
  }, []);

  useEffect(() => {
  const fetchPmGroups = async () => {
    try {
               const response = await fetch(`${baseURL}/pm-groups/`);
      const data = await response.json();
      if (data.status === "success") {
        setPmGroups(data.data);
      } else {
        console.error("Failed to fetch PM Groups");
      }
    } catch (error) {
      console.error("Error fetching PM Groups:", error);
    }
  };

  const fetchCharts = async () => {
    try {
                     const response = await fetch(`${baseURL}/pm-charts/`);

      const data = await response.json();
      if (data.status === "success") {
         const sortedCharts = data.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
       setCharts(sortedCharts);
      } else {
        console.error("Failed to fetch charts");
      }
    } catch (error) {
      console.error("Error fetching charts:", error);
    }
  };

  fetchPmGroups();
  fetchCharts();
}, []);


  const toggleForm = () => setShowForm(!showForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newChart = {
      chart_id: formData.chart_id, // use manual chart_id from form input as string
      pm_id: formData.pm_id,
      description: formData.description,
      task_type: formData.task_type,
      frequency_days: parseInt(formData.frequency_days),
      alert_days: parseInt(formData.alert_days),
      responsible: formData.responsible,
      remarks: formData.remarks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "Service Manager",
      updated_by: "Service Manager",
      pm_group: formData.pm_group
    };

    try {

      const response = await fetch(`${baseURL}/pm-charts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newChart)
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setCharts((prev) => [...prev, newChart]);
        alert("Chart saved successfully!");
        setFormData({
          chart_id: "",
          pm_group: "",
          pm_id: "",
          description: "",
          task_type: "",
          frequency_days: "",
          alert_days: "",
          responsible: "",
          remarks: ""
        });
        toggleForm();
      } else {
        console.error("Failed to save chart:", result.message || result);
        alert("Failed to save chart.");
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      alert("An error occurred while saving the chart.");
    }
  };

  const filteredCharts = charts.filter((chart) =>
    Object.values(chart).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredCharts.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredCharts.length / entriesPerPage);

  return (
    <div className="pm-container">
      {!showForm && (
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div>
            <h2 className="pm-title">Preventive Maintenance Chart</h2>
            <p className="pm-subtitle">Create and manage maintenance tasks and schedules</p>
          </div>
          <button onClick={toggleForm} className="btn btn-primary">Add New Chart</button>
        </div>
      )}

      {showForm ? (
        <>
          {/* <h2 className="pm-title">Preventive Maintenance Chart</h2>
          <p className="pm-subtitle">Enter details for new maintenance task</p> */}
          <ChartForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            pmGroups={pmGroups}
            toggleForm={toggleForm}
          />
        </>
      ) : (
        <ChartTable
          currentItems={currentItems}
          indexOfFirstEntry={indexOfFirstEntry}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          filteredCharts={filteredCharts}
        />
      )}
    </div>
  );
};

export default PreventiveMaintainanceChart;