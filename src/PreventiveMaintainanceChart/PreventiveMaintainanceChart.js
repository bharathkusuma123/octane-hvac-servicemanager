// import React, { useState, useEffect } from "react";
// import ChartTable from "./PreventiveMaintainanceChartTable";
// import ChartForm from "./PreventiveMaintainanceChartForm";
// import "./PreventiveMaintainanceChart.css";
// import baseURL from '../ApiUrl/Apiurl';

// const PreventiveMaintainanceChart = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     chart_id: "",
//     pm_group: "",
//     pm_id: "",
//     description: "",
//     task_type: "",
//     frequency_days: "",
//     alert_days: "",
//     overdue_alert_days:"",
//     responsible: "",
//     remarks: ""
//   });

//   const [pmGroups, setPmGroups] = useState([]);
//   const [charts, setCharts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchPmGroups = async () => {
//       try {
//          const response = await fetch(`${baseURL}/pm-groups/`);
//         const data = await response.json();
//         if (data.status === "success") {
//           setPmGroups(data.data);
//         } else {
//           console.error("Failed to fetch PM Groups");
//         }
//       } catch (error) {
//         console.error("Error fetching PM Groups:", error);
//       }
//     };

//     fetchPmGroups();
//     setCharts([]);
//   }, []);

//   useEffect(() => {
//   const fetchPmGroups = async () => {
//     try {
//                const response = await fetch(`${baseURL}/pm-groups/`);
//       const data = await response.json();
//       if (data.status === "success") {
//         setPmGroups(data.data);
//       } else {
//         console.error("Failed to fetch PM Groups");
//       }
//     } catch (error) {
//       console.error("Error fetching PM Groups:", error);
//     }
//   };

//   const fetchCharts = async () => {
//     try {
//                      const response = await fetch(`${baseURL}/pm-charts/`);

//       const data = await response.json();
//       if (data.status === "success") {
//          const sortedCharts = data.data.sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//       );
//        setCharts(sortedCharts);
//       } else {
//         console.error("Failed to fetch charts");
//       }
//     } catch (error) {
//       console.error("Error fetching charts:", error);
//     }
//   };

//   fetchPmGroups();
//   fetchCharts();
// }, []);


//   const toggleForm = () => setShowForm(!showForm);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newChart = {
//       chart_id: formData.chart_id, // use manual chart_id from form input as string
//       pm_id: formData.pm_id,
//       description: formData.description,
//       task_type: formData.task_type,
//       frequency_days: parseInt(formData.frequency_days),
//       alert_days: parseInt(formData.alert_days),
//       overdue_alert_days:  parseInt(formData.overdue_alert_days),
//       responsible: formData.responsible,
//       remarks: formData.remarks,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       created_by: "Service Manager",
//       updated_by: "Service Manager",
//       pm_group: formData.pm_group
//     };

//     try {

//       const response = await fetch(`${baseURL}/pm-charts/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(newChart)
//       });

//       const result = await response.json();

//       if (response.ok && result.status === "success") {
//         setCharts((prev) => [...prev, newChart]);
//         alert("Chart saved successfully!");
//         setFormData({
//           chart_id: "",
//           pm_group: "",
//           pm_id: "",
//           description: "",
//           task_type: "",
//           frequency_days: "",
//           alert_days: "",
//           overdue_alert_days:"",
//           responsible: "",
//           remarks: ""
//         });
//         toggleForm();
//       } else {
//         console.error("Failed to save chart:", result.message || result);
//         alert("Failed to save chart.");
//       }
//     } catch (error) {
//       console.error("Error during POST request:", error);
//       alert("An error occurred while saving the chart.");
//     }
//   };

//   const filteredCharts = charts.filter((chart) =>
//     Object.values(chart).some((val) =>
//       String(val).toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentItems = filteredCharts.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredCharts.length / entriesPerPage);

//   return (
//     <div className="pm-container">
//       {!showForm && (
//         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//           <div>
//             <h2 className="pm-title">Preventive Maintenance Chart</h2>
//             <p className="pm-subtitle">Create and manage maintenance tasks and schedules</p>
//           </div>
//           <button onClick={toggleForm} className="btn btn-primary">Add New Chart</button>
//         </div>
//       )}

//       {showForm ? (
//         <>
//           {/* <h2 className="pm-title">Preventive Maintenance Chart</h2>
//           <p className="pm-subtitle">Enter details for new maintenance task</p> */}
//           <ChartForm
//             formData={formData}
//             handleChange={handleChange}
//             handleSubmit={handleSubmit}
//             pmGroups={pmGroups}
//             toggleForm={toggleForm}
//           />
//         </>
//       ) : (
//         <ChartTable
//           currentItems={currentItems}
//           indexOfFirstEntry={indexOfFirstEntry}
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           entriesPerPage={entriesPerPage}
//           setEntriesPerPage={setEntriesPerPage}
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           totalPages={totalPages}
//           filteredCharts={filteredCharts}
//         />
//       )}
//     </div>
//   );
// };

// export default PreventiveMaintainanceChart;





import React, { useState, useEffect } from "react";
import ChartTable from "./PreventiveMaintainanceChartTable";
import ChartForm from "./PreventiveMaintainanceChartForm";
import "./PreventiveMaintainanceChart.css";
import baseURL from '../ApiUrl/Apiurl';
import Swal from 'sweetalert2';

const PreventiveMaintainanceChart = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null); // ✅ new state
  const [formData, setFormData] = useState({
    pm_group: "",
    pm_id: "",
    description: "",
    task_type: "",
    frequency_days: "",
    alert_days: "",
    overdue_alert_days: "",
    responsible: "",
    remarks: "",
    created_by: "Service Manager",
    updated_by: "Service Manager"
  });

  const [pmGroups, setPmGroups] = useState([]);
  const [charts, setCharts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch PM Groups
        const groupsResponse = await fetch(`${baseURL}/pm-groups/`);
        const groupsData = await groupsResponse.json();
        if (groupsData.status === "success") {
          setPmGroups(groupsData.data);
        }

        // Fetch Charts
        const chartsResponse = await fetch(`${baseURL}/pm-charts/`);
        const chartsData = await chartsResponse.json();
        if (chartsData.status === "success") {
          const sortedCharts = chartsData.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setCharts(sortedCharts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch data. Please try again later.',
          confirmButtonColor: '#3085d6',
        });
      }
    };

    fetchData();
  }, []);

  // const toggleForm = () => setShowForm(!showForm);
    const toggleForm = () => {
    setShowForm(!showForm);
    setSelectedChart(null); // reset on cancel
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const payload = {
  //     pm_id: formData.pm_id,
  //     description: formData.description,
  //     task_type: formData.task_type,
  //     frequency_days: parseInt(formData.frequency_days),
  //     alert_days: parseInt(formData.alert_days),
  //     overdue_alert_days: parseInt(formData.overdue_alert_days),
  //     responsible: formData.responsible,
  //     remarks: formData.remarks,
  //     created_by: formData.created_by,
  //     updated_by: formData.updated_by,
  //     pm_group: formData.pm_group
  //   };

  //   try {
  //     const response = await fetch(`${baseURL}/pm-charts/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(payload)
  //     });

  //     const result = await response.json();

  //     if (response.ok && result.status === "success") {
  //       // Add the new chart to the beginning of the list
  //       setCharts(prev => [result.data, ...prev]);
        
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Success!',
  //         text: 'PM Chart created successfully!',
  //         confirmButtonColor: '#3085d6',
  //       });
        
  //       // Reset form
  //       setFormData({
  //         pm_group: "",
  //         pm_id: "",
  //         description: "",
  //         task_type: "",
  //         frequency_days: "",
  //         alert_days: "",
  //         overdue_alert_days: "",
  //         responsible: "",
  //         remarks: "",
  //         created_by: "Service Manager",
  //         updated_by: "Service Manager"
  //       });
  //       toggleForm();
  //     } else {
  //       console.error("Failed to create chart:", result.message || result);
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         text: result.message || 'Failed to create PM Chart',
  //         confirmButtonColor: '#3085d6',
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error during POST request:", error);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'An error occurred while creating the PM Chart',
  //       confirmButtonColor: '#3085d6',
  //     });
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    frequency_days: parseInt(formData.frequency_days),
    alert_days: parseInt(formData.alert_days),
    overdue_alert_days: parseInt(formData.overdue_alert_days),
    updated_by: "Service Manager"
  };

  const isEdit = !!selectedChart;
  const url = isEdit
    ? `${baseURL}/pm-charts/${selectedChart.chart_id}/`
    : `${baseURL}/pm-charts/`;
  const method = isEdit ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      if (isEdit) {
        setCharts(prev =>
          prev.map(chart =>
            chart.chart_id === selectedChart.chart_id ? result.data : chart
          )
        );
      } else {
        setCharts(prev => [result.data, ...prev]);
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `PM Chart ${isEdit ? "updated" : "created"} successfully!`,
        confirmButtonColor: "#3085d6",
      });

      setFormData({
        pm_group: "",
        pm_id: "",
        description: "",
        task_type: "",
        frequency_days: "",
        alert_days: "",
        overdue_alert_days: "",
        responsible: "",
        remarks: "",
        created_by: "Service Manager",
        updated_by: "Service Manager",
      });
      toggleForm();
    } else {
      console.error(
        `❌ ${method} ${url} failed with status ${response.status}:`,
        result
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message || `Failed to ${isEdit ? "update" : "create"} PM Chart`,
        confirmButtonColor: "#3085d6",
      });
    }
  } catch (error) {
    console.error(`⚠️ Error during ${method} ${url}:`, error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: `An error occurred while ${isEdit ? "updating" : "creating"} the PM Chart`,
      confirmButtonColor: "#3085d6",
    });
  }
};


 const handleDelete = async (chartId) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const response = await fetch(`${baseURL}/pm-charts/${chartId}/`, {
        method: "DELETE"
      });

      if (response.ok) {
        setCharts(prev => prev.filter(chart => chart.chart_id !== chartId));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'PM Chart has been deleted.',
          confirmButtonColor: '#3085d6',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete PM Chart');
      }
    }
  } catch (error) {
    console.error("Error deleting PM Chart:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to delete PM Chart',
      confirmButtonColor: '#3085d6',
    });
  }
};

  const handleEdit = (chart) => {
    setSelectedChart(chart); // store chart being edited
    setFormData({
      pm_group: chart.pm_group || "",
      pm_id: chart.pm_id || "",
      description: chart.description || "",
      task_type: chart.task_type || "",
      frequency_days: chart.frequency_days || "",
      alert_days: chart.alert_days || "",
      overdue_alert_days: chart.overdue_alert_days || "",
      responsible: chart.responsible || "",
      remarks: chart.remarks || "",
      created_by: chart.created_by || "Service Manager",
      updated_by: "Service Manager"
    });
    setShowForm(true);
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
        <ChartForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          pmGroups={pmGroups}
          toggleForm={toggleForm}
        />
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
                    onDelete={handleDelete}
                      onEdit={handleEdit} // ✅ added

        />
      )}
    </div>
  );
};

export default PreventiveMaintainanceChart;