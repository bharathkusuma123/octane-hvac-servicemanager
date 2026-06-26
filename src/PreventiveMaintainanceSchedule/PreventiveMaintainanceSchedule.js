// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../AuthContext/AuthContext';
// import { useCompany } from '../AuthContext/CompanyContext';
// import baseURL from '../ApiUrl/Apiurl';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const PreventiveMaintenanceSchedule = () => {
//   const { userId } = useContext(AuthContext);
//   const { selectedCompany } = useCompany();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState('factory');
//   const [pmSchedules, setPmSchedules] = useState([]);
//   const [filteredSchedules, setFilteredSchedules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [processingId, setProcessingId] = useState(null);
//  const [searchTerm, setSearchTerm] = useState(() => {
//   return sessionStorage.getItem('pmSchedule_searchTerm') || '';
// });

// const [entriesPerPage, setEntriesPerPage] = useState(() => {
//   return Number(sessionStorage.getItem('pmSchedule_entriesPerPage')) || 10;
// });

// const [currentPage, setCurrentPage] = useState(() => {
//   return Number(sessionStorage.getItem('pmSchedule_currentPage')) || 1;
// });

//   // Filter state 
//   const [filterType, setFilterType] = useState('all'); // 'all' | 'due_date' | 'alert_date' | 'overdue_date'
//   const [filterDateFrom, setFilterDateFrom] = useState('');
//   const [filterDateTo, setFilterDateTo] = useState(''); 

//   useEffect(() => {
//   sessionStorage.setItem('pmSchedule_searchTerm', searchTerm);
// }, [searchTerm]);

// useEffect(() => {
//   sessionStorage.setItem('pmSchedule_entriesPerPage', entriesPerPage);
// }, [entriesPerPage]);

// useEffect(() => {
//   sessionStorage.setItem('pmSchedule_currentPage', currentPage);
// }, [currentPage]);

// const handleSearchChange = (value) => {
//   setSearchTerm(value);
//   setCurrentPage(1);
//   sessionStorage.setItem('pmSchedule_currentPage', 1);
// };

// const handleEntriesPerPageChange = (value) => {
//   setEntriesPerPage(value);
//   setCurrentPage(1);
//   sessionStorage.setItem('pmSchedule_currentPage', 1);
// };

//   const blueColor = '#0096D6';

//   // ─── Fetch ────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${baseURL}/service-item-pm-schedules/?user_id=${userId}&company_id=${selectedCompany}`
//         );
//         if (!response.ok) throw new Error('Failed to fetch data');
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
//   }, [selectedCompany]);

//  useEffect(() => {
//   let result = pmSchedules.filter(s =>
//     activeTab === 'factory'
//       ? s.responsible.toLowerCase() === 'factory'
//       : s.responsible.toLowerCase() === 'customer'
//   );

//   if (filterType !== 'all') {
//     const fieldMap = {
//       due_date: 'due_date',
//       alert_date: 'alert_date',
//       overdue_date: 'overdue_alert_date',
//     };
//     const field = fieldMap[filterType];

//     if (filterDateFrom) {
//       result = result.filter(s => s[field] && s[field] >= filterDateFrom);
//     }
//     if (filterDateTo) {
//       result = result.filter(s => s[field] && s[field] <= filterDateTo);
//     }
//   }

//   if (searchTerm.trim()) {
//     const lower = searchTerm.toLowerCase();
//     result = result.filter(s =>
//       s.pm_schedule_id?.toString().toLowerCase().includes(lower) ||
//       s.service_item?.toString().toLowerCase().includes(lower) ||
//       s.description?.toLowerCase().includes(lower) ||
//       s.task_type?.toLowerCase().includes(lower) ||
//       s.status?.toLowerCase().includes(lower) ||
//       formatDate(s.due_date)?.toLowerCase().includes(lower) ||
//       formatDate(s.alert_date)?.toLowerCase().includes(lower) ||
//       formatDate(s.overdue_alert_date)?.toLowerCase().includes(lower)
//     );
//   }

//   setFilteredSchedules(result);

//   // ✅ CLAMP PAGE (instead of reset)
//   const totalPagesNow = Math.ceil(result.length / entriesPerPage);
//   const savedPage = Number(sessionStorage.getItem('pmSchedule_currentPage')) || 1;

//   if (savedPage > totalPagesNow && totalPagesNow > 0) {
//     setCurrentPage(totalPagesNow);
//   }

// }, [activeTab, pmSchedules, searchTerm, filterType, filterDateFrom, filterDateTo, entriesPerPage]);

//   // ─── Pagination ───────────────────────────────────────────────────────────
//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentItems = filteredSchedules.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredSchedules.length / entriesPerPage);

//   // ─── Helpers ──────────────────────────────────────────────────────────────
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const isButtonDisabled = (schedule) => {
//   // Disable if status is not Pending
//   if (schedule.status !== 'Pending') return true;

//   // Enable ONLY if is_alert_sent is explicitly true
//   if (schedule.is_alert_sent === true) return false;

//   // All other cases — disable (including overdue date condition removed)
//   return true;
// };

//   const handleServiceItemClick = (serviceItemId) => {
//     if (serviceItemId) navigate(`/servicemanager/service-item-details/${serviceItemId}`);
//   };

//   const handleClearFilters = () => {
//     setFilterType('all');
//     setFilterDateFrom('');
//     setFilterDateTo('');
//     setSearchTerm('');
//   };

//   // ─── Raise Request ────────────────────────────────────────────────────────
//   const handleRaiseRequest = async (schedule) => {
//     setProcessingId(schedule.pm_schedule_id);
//     try {
//       const response = await fetch(
//         `${baseURL}/pm-schedules/${schedule.pm_schedule_id}/create-service-request/`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       const result = await response.json();

//       if (response.ok && result.message && result.message.toLowerCase().includes('successfully')) {
//         setPmSchedules(prev =>
//           prev.map(s =>
//             s.pm_schedule_id === schedule.pm_schedule_id
//               ? { ...s, status: 'Processed', is_alert_sent: true }
//               : s
//           )
//         );
//         Swal.fire({
//           icon: 'success',
//           title: 'Success',
//           text: `Service request created successfully for PM Schedule ID: ${schedule.pm_schedule_id}`,
//           confirmButtonColor: blueColor,
//         });
//       } else {
//         // Show the exact API error message
//         Swal.fire({
//           icon: 'error',
//           title: 'Request Failed',
//           text: result.error || result.message || 'Failed to create service request',
//           confirmButtonColor: blueColor,
//         });
//       }
//     } catch (err) {
//       console.error('Error creating service request:', err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: err.message || 'An unexpected error occurred',
//         confirmButtonColor: blueColor,
//       });
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // ─── Column definitions ───────────────────────────────────────────────────
//   const commonColumns = [
//     { label: 'S.No' },
//     { label: 'PM Schedule ID' },
//     { label: 'Service Item' },
//     { label: 'Description' },
//     { label: 'Task Type' },
//     { label: 'Due Date' },
//     { label: 'Alert Date' },
//     { label: 'Overdue Date' },
//     { label: 'Status' },
//   ];

//   const thStyle = {
//     padding: '12px',
//     backgroundColor: blueColor,
//     color: 'white',
//     textAlign: 'left',
//     whiteSpace: 'nowrap',
//   };

//   const tdStyle = { padding: '12px' };

//   // ─── Render ───────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//         Loading PM schedules...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1 style={{ color: '#333', marginBottom: '20px' }}>
//         Preventive Maintenance Schedules
//       </h1>

//       {/* ── Tabs ── */}
//       <div style={{ marginBottom: '20px' }}>
//         {['factory', 'customer'].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             style={{
//               padding: '10px 20px',
//               marginRight: '10px',
//               backgroundColor: activeTab === tab ? blueColor : '#f1f1f1',
//               color: activeTab === tab ? 'white' : 'black',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontWeight: '500',
//               textTransform: 'capitalize',
//             }}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* ── Filter Bar ── */}
//       <div
//         style={{
//           backgroundColor: '#f8f9fa',
//           border: '1px solid #dee2e6',
//           borderRadius: '6px',
//           padding: '16px',
//           marginBottom: '20px',
//         }}
//       >
//         <div
//           style={{
//             display: 'flex',
//             flexWrap: 'wrap',
//             gap: '12px',
//             alignItems: 'flex-end',
//           }}
//         >
//           {/* Filter type */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//             <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>
//               Filter By Date
//             </label>
//             <select
//               value={filterType}
//               onChange={e => {
//                 setFilterType(e.target.value);
//                 setFilterDateFrom('');
//                 setFilterDateTo('');
//               }}
//               style={{
//                 padding: '8px 10px',
//                 borderRadius: '4px',
//                 border: '1px solid #ccc',
//                 cursor: 'pointer',
//                 minWidth: '160px',
//               }}
//             >
//               <option value="all">All Records</option>
//               <option value="due_date">Due Date</option>
//               <option value="alert_date">Alert Date</option>
//               <option value="overdue_date">Overdue Date</option>
//             </select>
//           </div>

//           {/* Date From */}
//           {filterType !== 'all' && (
//             <>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//                 <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>
//                   From
//                 </label>
//                 <input
//                   type="date"
//                   value={filterDateFrom}
//                   onChange={e => setFilterDateFrom(e.target.value)}
//                   style={{
//                     padding: '8px 10px',
//                     borderRadius: '4px',
//                     border: '1px solid #ccc',
//                   }}
//                 />
//               </div>

//               <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//                 <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>
//                   To
//                 </label>
//                 <input
//                   type="date"
//                   value={filterDateTo}
//                   onChange={e => setFilterDateTo(e.target.value)}
//                   style={{
//                     padding: '8px 10px',
//                     borderRadius: '4px',
//                     border: '1px solid #ccc',
//                   }}
//                 />
//               </div>
//             </>
//           )}

//           {/* Quick filter buttons */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//             <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>
//               Quick Filters
//             </label>
//             <div style={{ display: 'flex', gap: '8px' }}>
//               {[
//                 { label: 'Overdue', field: 'overdue_date' },
//                 { label: 'Due Today', field: 'due_date' },
//                 { label: 'Alert Today', field: 'alert_date' },
//               ].map(({ label, field }) => (
//                 <button
//                   key={field}
//                   onClick={() => {
//                     const today = new Date().toISOString().split('T')[0];
//                     setFilterType(field);
//                     if (field === 'overdue_date') {
//                       setFilterDateFrom('');
//                       setFilterDateTo(today);
//                     } else {
//                       setFilterDateFrom(today);
//                       setFilterDateTo(today);
//                     }
//                   }}
//                   style={{
//                     padding: '8px 12px',
//                     backgroundColor:
//                       field === 'overdue_date' ? '#dc3545' :
//                       field === 'due_date' ? '#fd7e14' : '#6f42c1',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '4px',
//                     cursor: 'pointer',
//                     fontSize: '13px',
//                     whiteSpace: 'nowrap',
//                   }}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Clear */}
//           {(filterType !== 'all' || filterDateFrom || filterDateTo || searchTerm) && (
//             <button
//               onClick={handleClearFilters}
//               style={{
//                 padding: '8px 14px',
//                 backgroundColor: '#6c757d',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 alignSelf: 'flex-end',
//               }}
//             >
//               Clear Filters
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Search + Entries ── */}
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '20px',
//           flexWrap: 'wrap',
//           gap: '10px',
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           Show
//           <select
//             value={entriesPerPage}
//           onChange={e => handleEntriesPerPageChange(Number(e.target.value))}
//             style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
//           >
//             {[5, 10, 25, 50, 100].map(n => (
//               <option key={n} value={n}>{n}</option>
//             ))}
//           </select>
//           entries
//         </div>

//         <input
//           type="text"
//           placeholder="Search PM schedules..."
//           value={searchTerm}
//         onChange={e => handleSearchChange(e.target.value)}
//           style={{
//             padding: '8px 12px',
//             borderRadius: '4px',
//             border: '1px solid #ccc',
//             minWidth: '250px',
//           }}
//         />
//       </div>

//       {/* ── Results summary ── */}
//       <div style={{ marginBottom: '10px', fontSize: '13px', color: '#666' }}>
//         Showing {filteredSchedules.length} record{filteredSchedules.length !== 1 ? 's' : ''}
//         {filterType !== 'all' && (
//           <span style={{ marginLeft: '8px', color: blueColor, fontWeight: '600' }}>
//             (filtered by {filterType.replace('_', ' ')})
//           </span>
//         )}
//       </div>

//       {/* ── Table ── */}
//       <h2 style={{ color: '#333', marginBottom: '15px', textTransform: 'capitalize' }}>
//         {activeTab} PM Schedules
//       </h2>

//       <div style={{ overflowX: 'auto' }}>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               {commonColumns.map(col => (
//                 <th key={col.label} style={thStyle}>{col.label}</th>
//               ))}
//               {activeTab === 'factory' && (
//                 <th style={thStyle}>Action</th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={activeTab === 'factory' ? 10 : 9}
//                   style={{ padding: '20px', textAlign: 'center', color: '#666' }}
//                 >
//                   {searchTerm || filterType !== 'all'
//                     ? 'No matching PM schedules found'
//                     : `No ${activeTab} PM schedules found`}
//                 </td>
//               </tr>
//             ) : (
//               currentItems.map((schedule, index) => {
//                 const disabled = isButtonDisabled(schedule);
//                 const isProcessing = processingId === schedule.pm_schedule_id;

//                 // Row highlight: overdue rows in light red
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0);
//                 const overdueDate = schedule.overdue_alert_date
//                   ? new Date(schedule.overdue_alert_date)
//                   : null;
//                 if (overdueDate) overdueDate.setHours(0, 0, 0, 0);
//                 const isOverdue =
//                   overdueDate && today >= overdueDate && schedule.status === 'Pending';

//                 return (
//                   <tr
//                     key={schedule.pm_schedule_id}
//                     style={{
//                       borderBottom: '1px solid #ddd',
//                       backgroundColor: isOverdue ? '#fff5f5' : 'transparent',
//                     }}
//                   >
//                     <td style={tdStyle}>{indexOfFirstEntry + index + 1}</td>
//                     <td style={tdStyle}>{schedule.pm_schedule_id}</td>
//                     <td style={tdStyle}>
//                       <button
//                         onClick={() => handleServiceItemClick(schedule.service_item)}
//                         style={{
//                           color: '#0077cc',
//                           textDecoration: 'underline',
//                           border: 'none',
//                           background: 'none',
//                           cursor: 'pointer',
//                           fontSize: 'inherit',
//                           fontWeight: '600',
//                           padding: '0',
//                           textAlign: 'left',
//                         }}
//                       >
//                         {schedule.service_item}
//                       </button>
//                     </td>
//                     <td style={tdStyle}>{schedule.description}</td>
//                     <td style={tdStyle}>{schedule.task_type}</td>
//                     <td style={tdStyle}>{formatDate(schedule.due_date)}</td>
//                     <td style={tdStyle}>{formatDate(schedule.alert_date)}</td>
//                     <td style={{ ...tdStyle, color: isOverdue ? '#dc3545' : 'inherit', fontWeight: isOverdue ? '600' : 'normal' }}>
//                       {formatDate(schedule.overdue_alert_date)}
//                     </td>
//                     <td style={tdStyle}>
//                       <span
//                         style={{
//                           padding: '3px 10px',
//                           borderRadius: '12px',
//                           fontSize: '12px',
//                           fontWeight: '600',
//                           backgroundColor:
//                             schedule.status === 'Pending' ? '#fff3cd' :
//                             schedule.status === 'Processed' ? '#d1ecf1' : '#d4edda',
//                           color:
//                             schedule.status === 'Pending' ? '#856404' :
//                             schedule.status === 'Processed' ? '#0c5460' : '#155724',
//                         }}
//                       >
//                         {schedule.status}
//                       </span>
//                     </td>
//                     {activeTab === 'factory' && (
//                       <td style={tdStyle}>
//                         <button
//                           onClick={() => handleRaiseRequest(schedule)}
//                           disabled={disabled || isProcessing}
//                           style={{
//                             padding: '7px 12px',
//                             backgroundColor: disabled ? '#ccc' : blueColor,
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '4px',
//                             cursor: disabled ? 'not-allowed' : 'pointer',
//                             whiteSpace: 'nowrap',
//                             fontSize: '13px',
//                           }}
//                         >
//                           {isProcessing ? 'Processing...' : 'Raise Request'}
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//      {/* ── Pagination ── */}
// {totalPages > 1 && (
//   <div
//     style={{
//       display: 'flex',
//       justifyContent: 'center',
//       marginTop: '20px',
//       alignItems: 'center',
//       overflowX: totalPages > 10 ? 'auto' : 'visible',
//       width: '100%',
//     }}
//   >
//     <div
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: '10px',
//         flexWrap: 'nowrap',
//         whiteSpace: 'nowrap',
//       }}
//     >
//       {/* Previous */}
//       <button
//         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//         disabled={currentPage === 1}
//         style={{
//           padding: '6px 12px',
//           backgroundColor: currentPage === 1 ? '#f1f1f1' : blueColor,
//           color: currentPage === 1 ? '#666' : 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
//           flexShrink: 0,
//         }}
//       >
//         Previous
//       </button>

//       {/* Page Numbers */}
//       <div
//         style={{
//           display: 'flex',
//           gap: '5px',
//           flexWrap: 'nowrap',
//         }}
//       >
//         {(() => {
//           const maxVisiblePages = 5;
//           let pageNumbers = [];

//           if (totalPages <= maxVisiblePages) {
//             for (let i = 1; i <= totalPages; i++) {
//               pageNumbers.push(i);
//             }
//           } else {
//             let startPage = Math.max(1, currentPage - 2);
//             let endPage = Math.min(
//               totalPages,
//               startPage + maxVisiblePages - 1
//             );

//             if (endPage - startPage + 1 < maxVisiblePages) {
//               startPage = Math.max(
//                 1,
//                 endPage - maxVisiblePages + 1
//               );
//             }

//             for (let i = startPage; i <= endPage; i++) {
//               pageNumbers.push(i);
//             }
//           }

//           return pageNumbers.map(page => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               style={{
//                 padding: '6px 12px',
//                 backgroundColor:
//                   currentPage === page ? blueColor : '#f1f1f1',
//                 color: currentPage === page ? 'white' : 'black',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 flexShrink: 0,
//               }}
//             >
//               {page}
//             </button>
//           ));
//         })()}
//       </div>

//       {/* Next */}
//       <button
//         onClick={() =>
//           setCurrentPage(prev => Math.min(prev + 1, totalPages))
//         }
//         disabled={currentPage === totalPages}
//         style={{
//           padding: '6px 12px',
//           backgroundColor:
//             currentPage === totalPages ? '#f1f1f1' : blueColor,
//           color: currentPage === totalPages ? '#666' : 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor:
//             currentPage === totalPages
//               ? 'not-allowed'
//               : 'pointer',
//           flexShrink: 0,
//         }}
//       >
//         Next
//       </button>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default PreventiveMaintenanceSchedule;


import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';
import baseURL from '../ApiUrl/Apiurl';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const PreventiveMaintenanceSchedule = () => {
  const { userId } = useContext(AuthContext);
  const { selectedCompany } = useCompany();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('factory');
  const [pmSchedules, setPmSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Pagination states (server-side)
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem('pmSchedule_searchTerm') || '';
  });
  const [entriesPerPage, setEntriesPerPage] = useState(() => {
    return Number(sessionStorage.getItem('pmSchedule_entriesPerPage')) || 10;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(sessionStorage.getItem('pmSchedule_currentPage')) || 1;
  });

  // Server-side pagination data
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Filter state (server-side)
  const [filterType, setFilterType] = useState('all'); // 'all' | 'due_date' | 'alert_date' | 'overdue_date'
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const blueColor = '#0096D6';

  // Save pagination state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('pmSchedule_searchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('pmSchedule_entriesPerPage', entriesPerPage);
  }, [entriesPerPage]);

  useEffect(() => {
    sessionStorage.setItem('pmSchedule_currentPage', currentPage);
  }, [currentPage]);

  // ─── Fetch PM Schedules with pagination ──────────────────────────────────
  const fetchPmSchedules = async (page = currentPage, size = entriesPerPage, search = searchTerm) => {
    setFetching(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        user_id: userId,
        company_id: selectedCompany,
        page: page,
        page_size: size
      });

      // Add search parameter if exists
      if (search) {
        params.append('search', search);
      }

      // Add filter parameters if set
      if (filterType !== 'all') {
        params.append('filter_type', filterType);
        if (filterDateFrom) {
          params.append('date_from', filterDateFrom);
        }
        if (filterDateTo) {
          params.append('date_to', filterDateTo);
        }
      }

      // Add responsible filter based on active tab
      params.append('responsible', activeTab);

      const response = await axios.get(`${baseURL}/service-item-pm-schedules/?${params.toString()}`);

      if (response.data.status === 'success') {
        const data = response.data.data || [];
        const pagination = response.data.pagination || {};
        
        setPmSchedules(data);
        setTotalCount(pagination.total_count || 0);
        setTotalPages(pagination.total_pages || 1);
        setHasNextPage(pagination.has_next || false);
        setHasPreviousPage(pagination.has_previous || false);
        setCurrentPage(pagination.current_page || 1);
      } else {
        throw new Error(response.data.message || 'Failed to retrieve PM schedules');
      }
    } catch (err) {
      setError(err.message);
      setPmSchedules([]);
    } finally {
      setFetching(false);
    }
  };

  // ─── Initial data fetch ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchPmSchedules(1, entriesPerPage, searchTerm);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId && selectedCompany) {
      fetchData();
    }
  }, [selectedCompany, userId]);

  // ─── Refetch when pagination, search, filters, or tab changes ───────────
  useEffect(() => {
    if (!loading && userId && selectedCompany) {
      const debounceTimer = setTimeout(() => {
        fetchPmSchedules(currentPage, entriesPerPage, searchTerm);
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [currentPage, entriesPerPage, searchTerm, filterType, filterDateFrom, filterDateTo, activeTab]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    sessionStorage.setItem('pmSchedule_currentPage', 1);
  };

  const handleEntriesPerPageChange = (value) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
    sessionStorage.setItem('pmSchedule_currentPage', 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    sessionStorage.setItem('pmSchedule_currentPage', 1);
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setFilterDateFrom('');
    setFilterDateTo('');
    setCurrentPage(1);
    sessionStorage.setItem('pmSchedule_currentPage', 1);
  };

  const handleFilterDateFromChange = (value) => {
    setFilterDateFrom(value);
    setCurrentPage(1);
    sessionStorage.setItem('pmSchedule_currentPage', 1);
  };

  const handleFilterDateToChange = (value) => {
    setFilterDateTo(value);
    setCurrentPage(1);
    sessionStorage.setItem('pmSchedule_currentPage', 1);
  };

  const handleClearFilters = () => {
    setFilterType('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSearchTerm('');
    setCurrentPage(1);
    sessionStorage.setItem('pmSchedule_currentPage', 1);
  };

  const handleQuickFilter = (field) => {
    const today = new Date().toISOString().split('T')[0];
    setFilterType(field);
    setCurrentPage(1);
    sessionStorage.setItem('pmSchedule_currentPage', 1);
    
    if (field === 'overdue_date') {
      setFilterDateFrom('');
      setFilterDateTo(today);
    } else {
      setFilterDateFrom(today);
      setFilterDateTo(today);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return 'N/A';
    }
  };

  const isButtonDisabled = (schedule) => {
    if (schedule.status !== 'Pending') return true;
    if (schedule.is_alert_sent === true) return false;
    return true;
  };

  const handleServiceItemClick = (serviceItemId) => {
    if (serviceItemId) navigate(`/servicemanager/service-item-details/${serviceItemId}`);
  };

  // ─── Raise Request ────────────────────────────────────────────────────────
  const handleRaiseRequest = async (schedule) => {
    setProcessingId(schedule.pm_schedule_id);
    try {
      const response = await fetch(
        `${baseURL}/pm-schedules/${schedule.pm_schedule_id}/create-service-request/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = await response.json();

      if (response.ok && result.message && result.message.toLowerCase().includes('successfully')) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Service request created successfully for PM Schedule ID: ${schedule.pm_schedule_id}`,
          confirmButtonColor: blueColor,
        });
        // Refresh the current page data
        fetchPmSchedules(currentPage, entriesPerPage, searchTerm);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Request Failed',
          text: result.error || result.message || 'Failed to create service request',
          confirmButtonColor: blueColor,
        });
      }
    } catch (err) {
      console.error('Error creating service request:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'An unexpected error occurred',
        confirmButtonColor: blueColor,
      });
    } finally {
      setProcessingId(null);
    }
  };

  // ─── Column definitions ───────────────────────────────────────────────────
  const commonColumns = [
    { label: 'S.No' },
    { label: 'PM Schedule ID' },
    { label: 'Service Item' },
    { label: 'Description' },
    { label: 'Task Type' },
    { label: 'Due Date' },
    { label: 'Alert Date' },
    { label: 'Overdue Date' },
    { label: 'Status' },
  ];

  const thStyle = {
    padding: '12px',
    backgroundColor: blueColor,
    color: 'white',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  };

  const tdStyle = { padding: '12px' };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading PM schedules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    );
  }

  // Calculate index for display
  const indexOfFirstEntry = (currentPage - 1) * entriesPerPage;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        Preventive Maintenance Schedules
      </h1>

      {/* ── Tabs ── */}
      <div style={{ marginBottom: '20px' }}>
        {['factory', 'customer'].map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: activeTab === tab ? blueColor : '#f1f1f1',
              color: activeTab === tab ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          padding: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'flex-end',
          }}
        >
          {/* Filter type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>
              Filter By Date
            </label>
            <select
              value={filterType}
              onChange={e => handleFilterTypeChange(e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                cursor: 'pointer',
                minWidth: '160px',
              }}
            >
              <option value="all">All Records</option>
              <option value="due_date">Due Date</option>
              <option value="alert_date">Alert Date</option>
              <option value="overdue_date">Overdue Date</option>
            </select>
          </div>

          {/* Date From */}
          {filterType !== 'all' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>
                  From
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={e => handleFilterDateFromChange(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>
                  To
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={e => handleFilterDateToChange(e.target.value)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
              </div>
            </>
          )}

          {/* Quick filter buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#555' }}>
              Quick Filters
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: 'Overdue', field: 'overdue_date' },
                { label: 'Due Today', field: 'due_date' },
                { label: 'Alert Today', field: 'alert_date' },
              ].map(({ label, field }) => (
                <button
                  key={field}
                  onClick={() => handleQuickFilter(field)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor:
                      field === 'overdue_date' ? '#dc3545' :
                      field === 'due_date' ? '#fd7e14' : '#6f42c1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {(filterType !== 'all' || filterDateFrom || filterDateTo || searchTerm) && (
            <button
              onClick={handleClearFilters}
              style={{
                padding: '8px 14px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                alignSelf: 'flex-end',
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Search + Entries ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Show
          <select
            value={entriesPerPage}
            onChange={e => handleEntriesPerPageChange(Number(e.target.value))}
            style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            {[5, 10, 25, 50, 100].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          entries
        </div>

        <input
          type="text"
          placeholder="Search PM schedules..."
          value={searchTerm}
          onChange={e => handleSearchChange(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            minWidth: '250px',
          }}
        />
      </div>

      {/* ── Results summary ── */}
      <div style={{ marginBottom: '10px', fontSize: '13px', color: '#666' }}>
        Showing {pmSchedules.length} of {totalCount} record{totalCount !== 1 ? 's' : ''}
        {filterType !== 'all' && (
          <span style={{ marginLeft: '8px', color: blueColor, fontWeight: '600' }}>
            (filtered by {filterType.replace('_', ' ')})
          </span>
        )}
        {searchTerm && (
          <span style={{ marginLeft: '8px', color: blueColor, fontWeight: '600' }}>
            (search: "{searchTerm}")
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <h2 style={{ color: '#333', marginBottom: '15px', textTransform: 'capitalize' }}>
        {activeTab} PM Schedules
      </h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {commonColumns.map(col => (
                <th key={col.label} style={thStyle}>{col.label}</th>
              ))}
              {activeTab === 'factory' && (
                <th style={thStyle}>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <tr>
                <td
                  colSpan={activeTab === 'factory' ? 10 : 9}
                  style={{ padding: '20px', textAlign: 'center' }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading PM schedules...</p>
                </td>
              </tr>
            ) : pmSchedules.length === 0 ? (
              <tr>
                <td
                  colSpan={activeTab === 'factory' ? 10 : 9}
                  style={{ padding: '20px', textAlign: 'center', color: '#666' }}
                >
                  {searchTerm || filterType !== 'all'
                    ? 'No matching PM schedules found'
                    : `No ${activeTab} PM schedules found`}
                </td>
              </tr>
            ) : (
              pmSchedules.map((schedule, index) => {
                const disabled = isButtonDisabled(schedule);
                const isProcessing = processingId === schedule.pm_schedule_id;

                // Row highlight: overdue rows in light red
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const overdueDate = schedule.overdue_alert_date
                  ? new Date(schedule.overdue_alert_date)
                  : null;
                if (overdueDate) overdueDate.setHours(0, 0, 0, 0);
                const isOverdue =
                  overdueDate && today >= overdueDate && schedule.status === 'Pending';

                return (
                  <tr
                    key={schedule.pm_schedule_id}
                    style={{
                      borderBottom: '1px solid #ddd',
                      backgroundColor: isOverdue ? '#fff5f5' : 'transparent',
                    }}
                  >
                    <td style={tdStyle}>{indexOfFirstEntry + index + 1}</td>
                    <td style={tdStyle}>{schedule.pm_schedule_id}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleServiceItemClick(schedule.service_item)}
                        style={{
                          color: '#0077cc',
                          textDecoration: 'underline',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: 'inherit',
                          fontWeight: '600',
                          padding: '0',
                          textAlign: 'left',
                        }}
                      >
                        {schedule.service_item}
                      </button>
                    </td>
                    <td style={tdStyle}>{schedule.description}</td>
                    <td style={tdStyle}>{schedule.task_type}</td>
                    <td style={tdStyle}>{formatDate(schedule.due_date)}</td>
                    <td style={tdStyle}>{formatDate(schedule.alert_date)}</td>
                    <td style={{ ...tdStyle, color: isOverdue ? '#dc3545' : 'inherit', fontWeight: isOverdue ? '600' : 'normal' }}>
                      {formatDate(schedule.overdue_alert_date)}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor:
                            schedule.status === 'Pending' ? '#fff3cd' :
                            schedule.status === 'Processed' ? '#d1ecf1' : '#d4edda',
                          color:
                            schedule.status === 'Pending' ? '#856404' :
                            schedule.status === 'Processed' ? '#0c5460' : '#155724',
                        }}
                      >
                        {schedule.status}
                      </span>
                    </td>
                    {activeTab === 'factory' && (
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleRaiseRequest(schedule)}
                          disabled={disabled || isProcessing}
                          style={{
                            padding: '7px 12px',
                            backgroundColor: disabled ? '#ccc' : blueColor,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '13px',
                          }}
                        >
                          {isProcessing ? 'Processing...' : 'Raise Request'}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {(totalPages > 1 || hasNextPage || currentPage > 1) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
            alignItems: 'center',
            overflowX: totalPages > 10 ? 'auto' : 'visible',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px',
                backgroundColor: currentPage === 1 ? '#f1f1f1' : blueColor,
                color: currentPage === 1 ? '#666' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                flexShrink: 0,
              }}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div
              style={{
                display: 'flex',
                gap: '5px',
                flexWrap: 'nowrap',
              }}
            >
              {(() => {
                const maxVisiblePages = 5;
                let pageNumbers = [];

                if (totalPages <= maxVisiblePages) {
                  for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                  }
                } else {
                  let startPage = Math.max(1, currentPage - 2);
                  let endPage = Math.min(
                    totalPages,
                    startPage + maxVisiblePages - 1
                  );

                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(
                      1,
                      endPage - maxVisiblePages + 1
                    );
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(i);
                  }
                }

                return pageNumbers.map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor:
                        currentPage === page ? blueColor : '#f1f1f1',
                      color: currentPage === page ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {page}
                  </button>
                ));
              })()}
            </div>

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 12px',
                backgroundColor:
                  currentPage === totalPages ? '#f1f1f1' : blueColor,
                color: currentPage === totalPages ? '#666' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor:
                  currentPage === totalPages
                    ? 'not-allowed'
                    : 'pointer',
                flexShrink: 0,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreventiveMaintenanceSchedule;