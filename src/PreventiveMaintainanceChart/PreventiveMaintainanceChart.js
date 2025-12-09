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





// import React, { useState, useEffect } from "react";
// import ChartTable from "./PreventiveMaintainanceChartTable";
// import ChartForm from "./PreventiveMaintainanceChartForm";
// import "./PreventiveMaintainanceChart.css";
// import baseURL from '../ApiUrl/Apiurl';
// import Swal from 'sweetalert2';

// const PreventiveMaintainanceChart = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [selectedChart, setSelectedChart] = useState(null); // ✅ new state
//   const [formData, setFormData] = useState({
//     pm_group: "",
//     pm_id: "",
//     description: "",
//     task_type: "",
//     frequency_days: "",
//     alert_days: "",
//     overdue_alert_days: "",
//     responsible: "",
//     remarks: "",
//     created_by: "Service Manager",
//     updated_by: "Service Manager"
//   });

//   const [pmGroups, setPmGroups] = useState([]);
//   const [charts, setCharts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch PM Groups
//         const groupsResponse = await fetch(`${baseURL}/pm-groups/`);
//         const groupsData = await groupsResponse.json();
//         if (groupsData.status === "success") {
//           setPmGroups(groupsData.data);
//         }

//         // Fetch Charts
//         const chartsResponse = await fetch(`${baseURL}/pm-charts/`);
//         const chartsData = await chartsResponse.json();
//         if (chartsData.status === "success") {
//           const sortedCharts = chartsData.data.sort(
//             (a, b) => new Date(b.created_at) - new Date(a.created_at)
//           );
//           setCharts(sortedCharts);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'Failed to fetch data. Please try again later.',
//           confirmButtonColor: '#3085d6',
//         });
//       }
//     };

//     fetchData();
//   }, []);

//   // const toggleForm = () => setShowForm(!showForm);
//     const toggleForm = () => {
//     setShowForm(!showForm);
//     setSelectedChart(null); // reset on cancel
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   const payload = {
//   //     pm_id: formData.pm_id,
//   //     description: formData.description,
//   //     task_type: formData.task_type,
//   //     frequency_days: parseInt(formData.frequency_days),
//   //     alert_days: parseInt(formData.alert_days),
//   //     overdue_alert_days: parseInt(formData.overdue_alert_days),
//   //     responsible: formData.responsible,
//   //     remarks: formData.remarks,
//   //     created_by: formData.created_by,
//   //     updated_by: formData.updated_by,
//   //     pm_group: formData.pm_group
//   //   };

//   //   try {
//   //     const response = await fetch(`${baseURL}/pm-charts/`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json"
//   //       },
//   //       body: JSON.stringify(payload)
//   //     });

//   //     const result = await response.json();

//   //     if (response.ok && result.status === "success") {
//   //       // Add the new chart to the beginning of the list
//   //       setCharts(prev => [result.data, ...prev]);
        
//   //       Swal.fire({
//   //         icon: 'success',
//   //         title: 'Success!',
//   //         text: 'PM Chart created successfully!',
//   //         confirmButtonColor: '#3085d6',
//   //       });
        
//   //       // Reset form
//   //       setFormData({
//   //         pm_group: "",
//   //         pm_id: "",
//   //         description: "",
//   //         task_type: "",
//   //         frequency_days: "",
//   //         alert_days: "",
//   //         overdue_alert_days: "",
//   //         responsible: "",
//   //         remarks: "",
//   //         created_by: "Service Manager",
//   //         updated_by: "Service Manager"
//   //       });
//   //       toggleForm();
//   //     } else {
//   //       console.error("Failed to create chart:", result.message || result);
//   //       Swal.fire({
//   //         icon: 'error',
//   //         title: 'Error',
//   //         text: result.message || 'Failed to create PM Chart',
//   //         confirmButtonColor: '#3085d6',
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.error("Error during POST request:", error);
//   //     Swal.fire({
//   //       icon: 'error',
//   //       title: 'Error',
//   //       text: 'An error occurred while creating the PM Chart',
//   //       confirmButtonColor: '#3085d6',
//   //     });
//   //   }
//   // };


//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const payload = {
//     ...formData,
//     frequency_days: parseInt(formData.frequency_days),
//     alert_days: parseInt(formData.alert_days),
//     overdue_alert_days: parseInt(formData.overdue_alert_days),
//     updated_by: "Service Manager"
//   };

//   const isEdit = !!selectedChart;
//   const url = isEdit
//     ? `${baseURL}/pm-charts/${selectedChart.chart_id}/`
//     : `${baseURL}/pm-charts/`;
//   const method = isEdit ? "PUT" : "POST";

//   try {
//     const response = await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const result = await response.json();

//     if (response.ok && result.status === "success") {
//       if (isEdit) {
//         setCharts(prev =>
//           prev.map(chart =>
//             chart.chart_id === selectedChart.chart_id ? result.data : chart
//           )
//         );
//       } else {
//         setCharts(prev => [result.data, ...prev]);
//       }

//       Swal.fire({
//         icon: "success",
//         title: "Success!",
//         text: `PM Chart ${isEdit ? "updated" : "created"} successfully!`,
//         confirmButtonColor: "#3085d6",
//       });

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
//         updated_by: "Service Manager",
//       });
//       toggleForm();
//     } else {
//       console.error(
//         `❌ ${method} ${url} failed with status ${response.status}:`,
//         result
//       );

//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: result.message || `Failed to ${isEdit ? "update" : "create"} PM Chart`,
//         confirmButtonColor: "#3085d6",
//       });
//     }
//   } catch (error) {
//     console.error(`⚠️ Error during ${method} ${url}:`, error);

//     Swal.fire({
//       icon: "error",
//       title: "Error",
//       text: `An error occurred while ${isEdit ? "updating" : "creating"} the PM Chart`,
//       confirmButtonColor: "#3085d6",
//     });
//   }
// };


//  const handleDelete = async (chartId) => {
//   try {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, delete it!'
//     });

//     if (result.isConfirmed) {
//       const response = await fetch(`${baseURL}/pm-charts/${chartId}/`, {
//         method: "DELETE"
//       });

//       if (response.ok) {
//         setCharts(prev => prev.filter(chart => chart.chart_id !== chartId));
//         Swal.fire({
//           icon: 'success',
//           title: 'Deleted!',
//           text: 'PM Chart has been deleted.',
//           confirmButtonColor: '#3085d6',
//         });
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to delete PM Chart');
//       }
//     }
//   } catch (error) {
//     console.error("Error deleting PM Chart:", error);
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: error.message || 'Failed to delete PM Chart',
//       confirmButtonColor: '#3085d6',
//     });
//   }
// };

//   const handleEdit = (chart) => {
//     setSelectedChart(chart); // store chart being edited
//     setFormData({
//       pm_group: chart.pm_group || "",
//       pm_id: chart.pm_id || "",
//       description: chart.description || "",
//       task_type: chart.task_type || "",
//       frequency_days: chart.frequency_days || "",
//       alert_days: chart.alert_days || "",
//       overdue_alert_days: chart.overdue_alert_days || "",
//       responsible: chart.responsible || "",
//       remarks: chart.remarks || "",
//       created_by: chart.created_by || "Service Manager",
//       updated_by: "Service Manager"
//     });
//     setShowForm(true);
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
//         <ChartForm
//           formData={formData}
//           handleChange={handleChange}
//           handleSubmit={handleSubmit}
//           pmGroups={pmGroups}
//           toggleForm={toggleForm}
//         />
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
//                     onDelete={handleDelete}
//                       onEdit={handleEdit} // ✅ added

//         />
//       )}
//     </div>
//   );
// };

// export default PreventiveMaintainanceChart;


//===============================================================
// After fixing filter -Global search issue 




import React, { useState, useEffect } from "react";
import ChartTable from "./PreventiveMaintainanceChartTable";
import ChartForm from "./PreventiveMaintainanceChartForm";
import "./PreventiveMaintainanceChart.css";
import baseURL from '../ApiUrl/Apiurl';
import Swal from 'sweetalert2';

const PreventiveMaintainanceChart = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
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
  const [users, setUsers] = useState([]); // To store user data for search

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

        // Fetch Users for username search
        const usersResponse = await fetch(`${baseURL}/users/`);
        const usersData = await usersResponse.json();
        if (usersData && Array.isArray(usersData)) {
          setUsers(usersData);
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

  // Function to get username from user_id
  const getUsernameById = (userId) => {
    if (!userId || users.length === 0) return userId;
    
    const user = users.find(user => user.user_id === userId);
    return user ? user.username : userId;
  };

  // Function to get user search data (both ID and username)
  const getUserSearchData = (userId) => {
    if (!userId) return '';
    const user = users.find(user => user.user_id === userId);
    return user ? `${userId} ${user.username}` : userId;
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setSelectedChart(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

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
    setSelectedChart(chart);
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

  // Function to format date in multiple formats for search
  const formatDateForSearch = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const monthName = date.toLocaleString('en-IN', { month: 'long' });
    const monthShort = date.toLocaleString('en-IN', { month: 'short' });
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    
    // Return multiple formats for better searchability
    return [
      `${day}/${month}/${year}`,                    // DD/MM/YYYY
      `${day}/${month}/${year} ${hour}:${minute}:${second}`, // DD/MM/YYYY HH:MM:SS
      `${month}/${day}/${year}`,                    // MM/DD/YYYY
      `${year}-${month}-${day}`,                    // YYYY-MM-DD
      `${year}${month}${day}`,                      // YYYYMMDD
      `${day}-${month}-${year}`,                    // DD-MM-YYYY
      date.toISOString(),                           // ISO string
      monthName,                                    // January, February
      monthShort,                                   // Jan, Feb
      `${year}`,                                    // 2024
      `${month}/${year}`,                           // MM/YYYY
      `${day} ${monthName} ${year}`,               // 15 January 2024
      `${day} ${monthShort} ${year}`,              // 15 Jan 2024
      `${hour}:${minute}`,                          // HH:MM
      `${hour}:${minute}:${second}`,               // HH:MM:SS
    ].join(' ');
  };

  // Enhanced global search functionality
  const filteredCharts = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return charts;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return charts.filter((chart) => {
      // Get user data for search
      const createdBySearch = getUserSearchData(chart.created_by);
      const updatedBySearch = getUserSearchData(chart.updated_by);
      
      // Get dates in multiple formats for search
      const createdDateFormats = formatDateForSearch(chart.created_at);
      const updatedDateFormats = formatDateForSearch(chart.updated_at);
      
      // Get PM Group name for search
      const pmGroup = pmGroups.find(group => group.pm_group_id === chart.pm_group);
      const pmGroupName = pmGroup ? pmGroup.pm_group_name : chart.pm_group;
      
      // Create a comprehensive search string
      const searchableText = [
        // Raw chart data
        chart.chart_id || '',
        chart.pm_group || '',
        chart.pm_id || '',
        chart.description || '',
        chart.task_type || '',
        chart.frequency_days ? String(chart.frequency_days) : '',
        chart.alert_days ? String(chart.alert_days) : '',
        chart.overdue_alert_days ? String(chart.overdue_alert_days) : '',
        chart.responsible || '',
        chart.remarks || '',
        chart.created_by || '',
        chart.updated_by || '',
        chart.created_at || '',
        chart.updated_at || '',
        chart.company_id || '',
        chart.status || '',
        chart.is_active !== undefined ? String(chart.is_active) : '',
        
        // Formatted user data for search
        createdBySearch,
        updatedBySearch,
        
        // PM Group name for search
        pmGroupName,
        
        // Dates in multiple formats
        createdDateFormats,
        updatedDateFormats,
        
        // Display values (exactly as shown in table)
        getUsernameById(chart.created_by),
        getUsernameById(chart.updated_by),
        
        // Task type variations for better search
        chart.task_type === 'Inspection' ? 'Inspection check examine' : '',
        chart.task_type === 'Maintenance' ? 'Maintenance repair service' : '',
        chart.task_type === 'Calibration' ? 'Calibration adjust tune' : '',
        chart.task_type === 'Cleaning' ? 'Cleaning clean wash' : '',
        chart.task_type === 'Replacement' ? 'Replacement replace change' : '',
        
        // Frequency variations
        chart.frequency_days ? `every ${chart.frequency_days} days daily weekly monthly` : '',
        
        // Alert variations
        chart.alert_days ? `alert ${chart.alert_days} days notification reminder` : '',
        
        // Status variations
        chart.status === 'Active' ? 'Active Active Active' : '',
        chart.status === 'Inactive' ? 'Inactive Inactive Inactive' : '',
        chart.status === 'Pending' ? 'Pending Pending Pending' : '',
        
        // Active/Inactive variations
        chart.is_active === true ? 'active true yes enabled' : '',
        chart.is_active === false ? 'inactive false no disabled' : '',
        
        // Responsible variations
        chart.responsible ? `responsible ${chart.responsible} person assigned` : '',
        
        // Add any other properties that might exist
        ...Object.values(chart).filter(val => 
          val !== null && val !== undefined
        ).map(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return String(val);
          }
          if (typeof val === 'boolean') {
            return val ? 'true yes active' : 'false no inactive';
          }
          if (Array.isArray(val)) {
            return val.join(' ');
          }
          if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val);
          }
          return '';
        })
      ]
      .join(' ')                    // Combine into one string
      .toLowerCase()                // Make case-insensitive
      .replace(/\s+/g, ' ')         // Normalize spaces
      .trim();
      
      return searchableText.includes(searchLower);
    });
  }, [searchTerm, charts, users, pmGroups]);

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
          onEdit={handleEdit}
          users={users}
          getUsernameById={getUsernameById}
        />
      )}
    </div>
  );
};

export default PreventiveMaintainanceChart;