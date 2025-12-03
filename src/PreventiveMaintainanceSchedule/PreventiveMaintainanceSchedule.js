// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../AuthContext/AuthContext';
// import { useCompany } from '../AuthContext/CompanyContext';
// import baseURL from '../ApiUrl/Apiurl';

// const PreventiveMaintenanceSchedule = () => {
//   const { userId } = useContext(AuthContext);
//   const { selectedCompany } = useCompany();
//   const [activeTab, setActiveTab] = useState('factory');
//   const [pmSchedules, setPmSchedules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [processingId, setProcessingId] = useState(null); // Track which schedule is being processed

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${baseURL}/service-item-pm-schedules/?user_id=${userId}&company_id=${selectedCompany}`);

//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }

//         const data = await response.json();

//         if (data.status === 'success') {
//           setPmSchedules(data.data);
//         } else {
//           throw new Error(data.message || 'Failed to retrieve PM schedules');
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedCompany, activeTab]);

//   // Filter schedules based on active tab
//   const filteredSchedules = pmSchedules.filter(schedule =>
//     activeTab === 'factory'
//       ? schedule.responsible.toLowerCase() === 'factory'
//       : schedule.responsible.toLowerCase() === 'customer'
//   );

//   // Handle raise request button click
//   const handleRaiseRequest = async (schedule) => {
//     setProcessingId(schedule.pm_schedule_id);
    
//     try {
//       const response = await fetch(`${baseURL}/pm-schedules/${schedule.pm_schedule_id}/create-service-request/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       const result = await response.json();
      
//       // Check if the response contains a success message
//       if (response.ok && result.message && result.message.includes("successfully")) {
//         // Update the schedule status to "Processed"
//         setPmSchedules(prevSchedules => 
//           prevSchedules.map(s => 
//             s.pm_schedule_id === schedule.pm_schedule_id 
//               ? { ...s, status: 'Processed', is_alert_sent: true } 
//               : s
//           )
//         );
        
//         alert(`Service request created successfully for PM Schedule ID: ${schedule.pm_schedule_id}`);
//       } else {
//         throw new Error(result.message || 'Failed to create service request');
//       }
//     } catch (err) {
//       console.error('Error creating service request:', err);
//       alert(`Failed to create service request: ${err.message}`);
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // Check if button should be disabled
//   const isButtonDisabled = (schedule) => {
//     // Case 1: is_alert_sent: false AND status: Pending
//     if (!schedule.is_alert_sent && schedule.status === 'Pending') {
//       return true;
//     }
    
//     // Case 2: is_alert_sent: true AND status is not Pending
//     if (schedule.is_alert_sent && schedule.status !== 'Pending') {
//       return true;
//     }
    
//     // Enable button only if is_alert_sent is true AND status is still Pending
//     return false;
//   };

//   // Define the blue color for consistency
//   const blueColor = '#0096D6';

//   // Format date for display as dd-mm-yyyy
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   if (loading) {
//     return (
//       <div className="pm-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//         <div>Loading PM schedules...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="pm-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//         <div>Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="pm-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1 className="delegate-title" style={{ color: '#333', marginBottom: '20px' }}>Preventive Maintenance Schedules</h1>

//       {/* Tabs */}
//       <div style={{ marginBottom: '20px' }}>
//         <button
//           onClick={() => setActiveTab('factory')}
//           style={{
//             padding: '10px 20px',
//             marginRight: '10px',
//             backgroundColor: activeTab === 'factory' ? blueColor : '#f1f1f1',
//             color: activeTab === 'factory' ? 'white' : 'black',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontWeight: '500'
//           }}
//         >
//           Factory
//         </button>
//         <button
//           onClick={() => setActiveTab('customer')}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: activeTab === 'customer' ? blueColor : '#f1f1f1',
//             color: activeTab === 'customer' ? 'white' : 'black',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontWeight: '500'
//           }}
//         >
//           Customer
//         </button>
//       </div>

//       {/* Factory Tab Content */}
//       {activeTab === 'factory' && (
//         <div>
//           <h2 className="pm-title" style={{ color: '#333', marginBottom: '15px' }}>Factory PM Schedules</h2>
//           <div className="table-responsive">
//             <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>PM Schedule ID</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Service Item</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Description</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Task Type</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Due Date</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Alert Date</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Overdue Date</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Status</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSchedules.map((schedule) => {
//                   const disabled = isButtonDisabled(schedule);
//                   const isProcessing = processingId === schedule.pm_schedule_id;
                  
//                   return (
//                     <tr key={schedule.pm_schedule_id} style={{ borderBottom: '1px solid #ddd' }}>
//                       <td style={{ padding: '12px' }}>{schedule.pm_schedule_id}</td>
//                       <td style={{ padding: '12px' }}>{schedule.service_item}</td>
//                       <td style={{ padding: '12px' }}>{schedule.description}</td>
//                       <td style={{ padding: '12px' }}>{schedule.task_type}</td>
//                       <td style={{ padding: '12px' }}>{formatDate(schedule.due_date)}</td>
//                       <td style={{ padding: '12px' }}>{formatDate(schedule.alert_date)}</td>
//                       <td style={{ padding: '12px' }}>{formatDate(schedule.overdue_alert_date)}</td>
//                       <td style={{ padding: '12px' }}>{schedule.status}</td>
//                       <td style={{ padding: '12px' }}>
//                         <button
//                           onClick={() => handleRaiseRequest(schedule)}
//                           disabled={disabled || isProcessing}
//                           style={{
//                             padding: '8px 12px',
//                             backgroundColor: disabled ? '#ccc' : blueColor,
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: disabled ? 'not-allowed' : 'pointer'
//                           }}
//                         >
//                           {isProcessing ? 'Processing...' : 'Raise Request'}
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {filteredSchedules.length === 0 && (
//                   <tr>
//                     <td colSpan="9" style={{ padding: '12px', textAlign: 'center' }}>
//                       No factory PM schedules found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Customer Tab Content */}
//       {activeTab === 'customer' && (
//         <div>
//           <h2 className="pm-title" style={{ color: '#333', marginBottom: '15px' }}>Customer PM Schedules</h2>
//           <div className="table-responsive">
//             <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>PM Schedule ID</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Service Item</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Description</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Task Type</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Due Date</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Alert Date</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Overdue Date</th>
//                   <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSchedules.map((schedule) => (
//                   <tr key={schedule.pm_schedule_id} style={{ borderBottom: '1px solid #ddd' }}>
//                     <td style={{ padding: '12px' }}>{schedule.pm_schedule_id}</td>
//                     <td style={{ padding: '12px' }}>{schedule.service_item}</td>
//                     <td style={{ padding: '12px' }}>{schedule.description}</td>
//                     <td style={{ padding: '12px' }}>{schedule.task_type}</td>
//                     <td style={{ padding: '12px' }}>{formatDate(schedule.due_date)}</td>
//                     <td style={{ padding: '12px' }}>{formatDate(schedule.alert_date)}</td>
//                     <td style={{ padding: '12px' }}>{formatDate(schedule.overdue_alert_date)}</td>
//                     <td style={{ padding: '12px' }}>{schedule.status}</td>
//                   </tr>
//                 ))}
//                 {filteredSchedules.length === 0 && (
//                   <tr>
//                     <td colSpan="8" style={{ padding: '12px', textAlign: 'center' }}>
//                       No customer PM schedules found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PreventiveMaintenanceSchedule;





import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';
import baseURL from '../ApiUrl/Apiurl';
import { useNavigate } from 'react-router-dom';

const PreventiveMaintenanceSchedule = () => {
  const { userId } = useContext(AuthContext);
  const { selectedCompany } = useCompany();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('factory');
  const [pmSchedules, setPmSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/service-item-pm-schedules/?user_id=${userId}&company_id=${selectedCompany}`);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        if (data.status === 'success') {
          setPmSchedules(data.data);
          filterSchedules(data.data, 'factory');
        } else {
          throw new Error(data.message || 'Failed to retrieve PM schedules');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany]);

  // Filter schedules based on active tab
  useEffect(() => {
    filterSchedules(pmSchedules, activeTab);
  }, [activeTab, pmSchedules]);

  // Apply search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      // If search term is empty, show all filtered schedules
      const filteredByTab = pmSchedules.filter(schedule =>
        activeTab === 'factory'
          ? schedule.responsible.toLowerCase() === 'factory'
          : schedule.responsible.toLowerCase() === 'customer'
      );
      setFilteredSchedules(filteredByTab);
      setCurrentPage(1); // Reset to first page when search is cleared
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filteredByTab = pmSchedules.filter(schedule =>
        activeTab === 'factory'
          ? schedule.responsible.toLowerCase() === 'factory'
          : schedule.responsible.toLowerCase() === 'customer'
      );
      
      const searchedSchedules = filteredByTab.filter(schedule =>
        schedule.pm_schedule_id?.toString().toLowerCase().includes(lowercasedSearch) ||
        schedule.service_item?.toString().toLowerCase().includes(lowercasedSearch) ||
        schedule.description?.toLowerCase().includes(lowercasedSearch) ||
        schedule.task_type?.toLowerCase().includes(lowercasedSearch) ||
        schedule.status?.toLowerCase().includes(lowercasedSearch) ||
        formatDate(schedule.due_date)?.toLowerCase().includes(lowercasedSearch) ||
        formatDate(schedule.alert_date)?.toLowerCase().includes(lowercasedSearch) ||
        formatDate(schedule.overdue_alert_date)?.toLowerCase().includes(lowercasedSearch)
      );
      
      setFilteredSchedules(searchedSchedules);
      setCurrentPage(1); // Reset to first page when searching
    }
  }, [searchTerm, activeTab, pmSchedules]);

  const filterSchedules = (schedules, tab) => {
    const filtered = schedules.filter(schedule =>
      tab === 'factory'
        ? schedule.responsible.toLowerCase() === 'factory'
        : schedule.responsible.toLowerCase() === 'customer'
    );
    setFilteredSchedules(filtered);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Pagination calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredSchedules.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredSchedules.length / entriesPerPage);

  // Handle service item click
  const handleServiceItemClick = (serviceItemId) => {
    if (serviceItemId) {
      navigate(`/servicemanager/service-item-details/${serviceItemId}`);
    }
  };

  // Handle raise request button click
  const handleRaiseRequest = async (schedule) => {
    setProcessingId(schedule.pm_schedule_id);
    
    try {
      const response = await fetch(`${baseURL}/pm-schedules/${schedule.pm_schedule_id}/create-service-request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok && result.message && result.message.includes("successfully")) {
        // Update the schedule status to "Processed"
        setPmSchedules(prevSchedules => 
          prevSchedules.map(s => 
            s.pm_schedule_id === schedule.pm_schedule_id 
              ? { ...s, status: 'Processed', is_alert_sent: true } 
              : s
          )
        );
        
        alert(`Service request created successfully for PM Schedule ID: ${schedule.pm_schedule_id}`);
      } else {
        throw new Error(result.message || 'Failed to create service request');
      }
    } catch (err) {
      console.error('Error creating service request:', err);
      alert(`Failed to create service request: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Check if button should be disabled
  const isButtonDisabled = (schedule) => {
    if (!schedule.is_alert_sent && schedule.status === 'Pending') {
      return true;
    }
    
    if (schedule.is_alert_sent && schedule.status !== 'Pending') {
      return true;
    }
    
    return false;
  };

  // Define the blue color for consistency
  const blueColor = '#0096D6';

  // Format date for display as dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="pm-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div>Loading PM schedules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pm-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="pm-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="delegate-title" style={{ color: '#333', marginBottom: '20px' }}>Preventive Maintenance Schedules</h1>

      {/* Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('factory')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'factory' ? blueColor : '#f1f1f1',
            color: activeTab === 'factory' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Factory
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'customer' ? blueColor : '#f1f1f1',
            color: activeTab === 'customer' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Customer
        </button>
      </div>

      {/* Search and Entries Per Page Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Show
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          entries
        </div>
        
        <input
          type="text"
          placeholder="Search PM schedules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            minWidth: '250px'
          }}
        />
      </div>

      {/* Factory Tab Content */}
      {activeTab === 'factory' && (
        <div>
          <h2 className="pm-title" style={{ color: '#333', marginBottom: '15px' }}>Factory PM Schedules</h2>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>S.No</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>PM Schedule ID</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Service Item</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Task Type</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Due Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Alert Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Overdue Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((schedule, index) => {
                  const disabled = isButtonDisabled(schedule);
                  const isProcessing = processingId === schedule.pm_schedule_id;
                  
                  return (
                    <tr key={schedule.pm_schedule_id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px' }}>{indexOfFirstEntry + index + 1}</td>
                      <td style={{ padding: '12px' }}>{schedule.pm_schedule_id}</td>
                      <td style={{ padding: '12px' }}>
                        <button 
                          onClick={() => handleServiceItemClick(schedule.service_item)}
                          style={{
                            color: '#0077cc',
                            textDecoration: 'underline',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: 'inherit',
                            fontWeight: "600",
                            padding: '0',
                            textAlign: 'left'
                          }}
                        >
                          {schedule.service_item}
                        </button>
                      </td>
                      <td style={{ padding: '12px' }}>{schedule.description}</td>
                      <td style={{ padding: '12px' }}>{schedule.task_type}</td>
                      <td style={{ padding: '12px' }}>{formatDate(schedule.due_date)}</td>
                      <td style={{ padding: '12px' }}>{formatDate(schedule.alert_date)}</td>
                      <td style={{ padding: '12px' }}>{formatDate(schedule.overdue_alert_date)}</td>
                      <td style={{ padding: '12px' }}>{schedule.status}</td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleRaiseRequest(schedule)}
                          disabled={disabled || isProcessing}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: disabled ? '#ccc' : blueColor,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: disabled ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isProcessing ? 'Processing...' : 'Raise Request'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredSchedules.length === 0 && (
                  <tr>
                    <td colSpan="10" style={{ padding: '12px', textAlign: 'center' }}>
                      {searchTerm ? 'No matching PM schedules found' : 'No factory PM schedules found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Tab Content */}
      {activeTab === 'customer' && (
        <div>
          <h2 className="pm-title" style={{ color: '#333', marginBottom: '15px' }}>Customer PM Schedules</h2>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>S.No</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>PM Schedule ID</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Service Item</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Task Type</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Due Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Alert Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Overdue Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((schedule, index) => (
                  <tr key={schedule.pm_schedule_id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px' }}>{indexOfFirstEntry + index + 1}</td>
                    <td style={{ padding: '12px' }}>{schedule.pm_schedule_id}</td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => handleServiceItemClick(schedule.service_item)}
                        style={{
                          color: '#0077cc',
                          textDecoration: 'underline',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: 'inherit',
                          fontWeight: "600",
                          padding: '0',
                          textAlign: 'left'
                        }}
                      >
                        {schedule.service_item}
                      </button>
                    </td>
                    <td style={{ padding: '12px' }}>{schedule.description}</td>
                    <td style={{ padding: '12px' }}>{schedule.task_type}</td>
                    <td style={{ padding: '12px' }}>{formatDate(schedule.due_date)}</td>
                    <td style={{ padding: '12px' }}>{formatDate(schedule.alert_date)}</td>
                    <td style={{ padding: '12px' }}>{formatDate(schedule.overdue_alert_date)}</td>
                    <td style={{ padding: '12px' }}>{schedule.status}</td>
                  </tr>
                ))}
                {filteredSchedules.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ padding: '12px', textAlign: 'center' }}>
                      {searchTerm ? 'No matching PM schedules found' : 'No customer PM schedules found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '20px',
          alignItems: 'center',
          gap: '10px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px',
              backgroundColor: currentPage === 1 ? '#f1f1f1' : blueColor,
              color: currentPage === 1 ? '#666' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <div style={{ display: 'flex', gap: '5px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: currentPage === page ? blueColor : '#f1f1f1',
                  color: currentPage === page ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '6px 12px',
              backgroundColor: currentPage === totalPages ? '#f1f1f1' : blueColor,
              color: currentPage === totalPages ? '#666' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PreventiveMaintenanceSchedule;