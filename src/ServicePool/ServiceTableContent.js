// import React, { useState, useEffect, useRef } from "react";

// const ServiceTableContent = ({
//   selectedCompany,
//   searchTerm,
//   setSearchTerm,
//   entriesPerPage,
//   setEntriesPerPage,
//   currentPage,
//   setCurrentPage,
//   filteredData,
//   historyResponse,
//   navigate,
//   handleAssignClick,
//   handleReopenService,
//   getCustomerName,
//   userId,
//   serviceItems
// }) => {
//   // New filter states
//   const [engineerStatusFilter, setEngineerStatusFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [createdDateFilter, setCreatedDateFilter] = useState("");
//   const [displayDateFilter, setDisplayDateFilter] = useState("");
//   const dateInputRef = useRef(null);

//   // Utility functions
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '-';
      
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}/${month}/${year}`; // dd/mm/yyyy format
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return '-';
//     }
//   };

//   const formatTime = (dateTimeString) => {
//     if (!dateTimeString) return '';
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) return '';
      
//       let hours = date.getHours();
//       const minutes = date.getMinutes();
//       const period = hours >= 12 ? 'PM' : 'AM';
      
//       // Convert to 12-hour format
//       hours = hours % 12 || 12;
      
//       return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
//     } catch (error) {
//       console.error('Error formatting time:', error);
//       return '';
//     }
//   };

//   // Format datetime for display (combines date and time)
//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '-';
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) return '-';
      
//       // Format date as dd/mm/yyyy
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
      
//       // Format time as HH:MM AM/PM
//       let hours = date.getHours();
//       const minutes = date.getMinutes();
//       const period = hours >= 12 ? 'PM' : 'AM';
//       hours = hours % 12 || 12;
      
//       return `${day}/${month}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
//     } catch (error) {
//       console.error('Error formatting datetime:', error);
//       return '-';
//     }
//   };

//   // Convert dd/mm/yyyy to yyyy-mm-dd for filtering
//   const convertToISOFormat = (ddmmyyyy) => {
//     if (!ddmmyyyy) return '';
//     const parts = ddmmyyyy.split('/');
//     if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
//       return `${parts[2]}-${parts[1]}-${parts[0]}`; // yyyy-mm-dd
//     }
//     return '';
//   };

//   // Convert yyyy-mm-dd to dd/mm/yyyy
//   const convertFromISOFormat = (yyyymmdd) => {
//     if (!yyyymmdd) return '';
//     const parts = yyyymmdd.split('-');
//     if (parts.length === 3) {
//       return `${parts[2]}/${parts[1]}/${parts[0]}`; // dd/mm/yyyy
//     }
//     return '';
//   };

//   // Handle date picker change
//   const handleDatePickerChange = (e) => {
//     const isoDate = e.target.value; // yyyy-mm-dd
//     setCreatedDateFilter(isoDate);
//     setDisplayDateFilter(convertFromISOFormat(isoDate));
//   };

//   // Handle text input change
//   const handleDateInputChange = (e) => {
//     let value = e.target.value.replace(/[^0-9/]/g, ''); // Keep only numbers and slashes
    
//     // Auto-format as dd/mm/yyyy
//     const numbers = value.replace(/\//g, '');
//     if (numbers.length >= 2) {
//       value = numbers.slice(0, 2) + '/' + numbers.slice(2);
//     }
//     if (numbers.length >= 4) {
//       value = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
//     }
    
//     setDisplayDateFilter(value);
    
//     // If complete date (dd/mm/yyyy), convert to ISO format for filtering
//     if (value.length === 10) {
//       const isoDate = convertToISOFormat(value);
//       if (isoDate) {
//         setCreatedDateFilter(isoDate);
//       }
//     } else {
//       setCreatedDateFilter('');
//     }
//   };

//   // Function to get service item details
//   const getServiceItemDetails = (serviceItemId) => {
//     if (!serviceItemId || serviceItems.length === 0) return { location: "Loading..." };
    
//     const serviceItem = serviceItems.find(item => item.service_item_id === serviceItemId);
//     return serviceItem ? serviceItem : { location: "Location not found" };
//   };

//   // Get current items for display (after all filters)
//   const getFilteredData = () => {
//     let results = filteredData;

//     // Apply Engineer Status filter
//     if (engineerStatusFilter) {
//       const historyData = historyResponse.data || [];
//       results = results.filter(item => {
//         const latestAssignment = Array.isArray(historyData) 
//           ? historyData.find(history => history.request === item.request_id)
//           : null;
//         const engineerStatus = latestAssignment?.status || "N/A";
//         return engineerStatus === engineerStatusFilter;
//       });
//     }

//     // Apply Status filter
//     if (statusFilter) {
//       results = results.filter(item => item.status === statusFilter);
//     }

//     // Apply Created Date filter
//     if (createdDateFilter) {
//       results = results.filter(item => {
//         const itemDate = new Date(item.created_at).toISOString().split('T')[0];
//         return itemDate === createdDateFilter;
//       });
//     }

//     return results;
//   };

//   const finalFilteredData = getFilteredData();
//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentItems = finalFilteredData.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(finalFilteredData.length / entriesPerPage);

//   // Clear all filters
//   const clearFilters = () => {
//     setEngineerStatusFilter("");
//     setStatusFilter("");
//     setCreatedDateFilter("");
//     setDisplayDateFilter("");
//   };

//   return (
//     <>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <div>
//           <h2 className="pm-title">Service Pool Details</h2>
//           <p className="pm-subtitle">
//             {selectedCompany 
//               ? `Showing service requests for ${selectedCompany}`
//               : 'Showing all service requests'}
//           </p>
//           <p className="pm-subtitle">Manage service requests and assignments</p>
//         </div>
//       </div>

//       {/* Search and Entries Per Page */}
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <div className="d-flex align-items-center gap-2">
//           Show
//           <select
//             value={entriesPerPage}
//             onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//             className="form-select form-select-sm w-auto"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//           </select>
//           entries
//         </div>
//         <input
//           type="text"
//           className="form-control w-auto"
//           placeholder="Search services..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Filter Controls */}
//       <div className="row mb-3">
//         <div className="col-md-3">
//           <label className="form-label small">Engineer Status</label>
//           <select
//             value={engineerStatusFilter}
//             onChange={(e) => setEngineerStatusFilter(e.target.value)}
//             className="form-select form-select-sm"
//           >
//             <option value="">All Engineer Status</option>
//             <option value="Pending">Pending</option>
//             <option value="Accepted">Accepted</option>
//           </select>
//         </div>
//         <div className="col-md-3">
//           <label className="form-label small">Status</label>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="form-select form-select-sm"
//           >
//             <option value="">All Status</option>
//             <option value="Open">Open</option>
//             <option value="Assigned">Assigned</option>
//             <option value="UnderProgress">UnderProgress</option>
//             <option value="Reopened">Reopened</option>
//             <option value="Closed">Closed</option>
//             <option value="Waiting for Quote">Waiting for Quote</option>
//           </select>
//         </div>
//         <div className="col-md-3">
//           <label className="form-label small">Created Date (DD/MM/YYYY)</label>
//           <div className="position-relative">
//             <input
//               type="text"
//               value={displayDateFilter}
//               onChange={handleDateInputChange}
//               className="form-control form-control-sm"
//               placeholder="DD/MM/YYYY"
//               maxLength="10"
//               style={{ paddingRight: '35px' }}
//             />
//             <input
//               ref={dateInputRef}
//               type="date"
//               value={createdDateFilter}
//               onChange={handleDatePickerChange}
//               className="position-absolute"
//               style={{
//                 top: '0',
//                 right: '0',
//                 width: '30px',
//                 height: '100%',
//                 opacity: '0',
//                 cursor: 'pointer'
//               }}
//             />
//             <span 
//               className="position-absolute"
//               style={{
//                 top: '50%',
//                 right: '8px',
//                 transform: 'translateY(-50%)',
//                 pointerEvents: 'none',
//                 color: '#6c757d'
//               }}
//             >
//               📅
//             </span>
//           </div>
//         </div>
//         <div className="col-md-3 d-flex align-items-end">
//           <button
//             onClick={clearFilters}
//             className="btn btn-outline-secondary btn-sm"
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="table-responsive mb-4">
//         <table className="table">
//           <thead className="new-customer-table-header">
//             <tr>
//               <th>S.No</th>
//               <th>Request ID</th>
//               <th>Requested By</th>
//               <th>Request Details</th>
//               <th>Service Item</th>
//               <th>Location</th>
//               <th>Preferred Date/Time</th>
//               <th>Created Date/Time</th>
//               <th>Status</th>
//               <th>Engineer</th>
//               <th>Engineer Status</th>
//               <th>Assign</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.length > 0 ? (
//               currentItems.map((item, index) => {
//                 const historyData = historyResponse.data || [];
//                 const latestAssignment = Array.isArray(historyData) 
//                   ? historyData.find(history => history.request === item.request_id)
//                   : null;
//                 const engineerStatus = latestAssignment?.status || "N/A";
//                 const serviceItemDetails = getServiceItemDetails(item.service_item);

//                 return (
//                   <tr key={item.request_id || index}>
//                     <td>{indexOfFirstEntry + index + 1}</td>
//                     <td>
//                       <button 
//                         className="btn btn-link p-0" 
//                         onClick={() => navigate(`/servicemanager/service-requests/${item.request_id}`, { 
//                           state: { service_item: item.service_item } 
//                         })}
//                       >
//                         {item.request_id}
//                       </button>
//                     </td>
//                     <td>{getCustomerName(item.requested_by)}</td>
//                     <td>{item.request_details || "N/A"}</td>
//                     <td>{item.service_item}</td>
//                     <td>
//                       {serviceItemDetails.location || "Location not found"}
//                     </td>
//                     <td>
//                       {/* Combined preferred date and time display */}
//                       {item.preferred_date && item.preferred_time 
//                         ? formatDateTime(`${item.preferred_date}T${item.preferred_time}`)
//                         : item.preferred_date 
//                           ? formatDate(item.preferred_date)
//                           : '-'
//                       }
//                     </td>
//                     <td>
//                       {formatDateTime(item.created_at)}
//                     </td>
//                     <td>{item.status}</td>
//                     <td>{item.assigned_engineer || "N/A"}</td>
//                     <td>
//                       {engineerStatus === "Pending" && (
//                         <span className="badge bg-warning text-dark">Pending</span>
//                       )}
//                       {engineerStatus === "Accepted" && (
//                         <span className="badge bg-success">Accepted</span>
//                       )}
//                       {engineerStatus === "Declined" && (
//                         <span className="badge bg-danger">Rejected</span>
//                       )}
//                       {engineerStatus === "N/A" && "N/A"}
//                     </td>
//                     <td>
//                       {item.status === "Open" ? (
//                         <button
//                           className="btn btn-sm btn-primary"
//                           onClick={() => handleAssignClick(item)}
//                         >
//                           Assign
//                         </button>
//                       ) : item.status === "Closed" ? (
//                         <button
//                           className="btn btn-sm btn-warning"
//                           onClick={() => handleReopenService(item)}
//                         >
//                           Re-open Service
//                         </button>
//                       ) : (
//                         <button className="btn btn-sm btn-secondary disabled">
//                           {item.status === "Reopened" ? "Already Reopened" : "Assign"}
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="12" className="text-center">No service requests found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {finalFilteredData.length > 0 && (
//         <div className="pagination-controls d-flex justify-content-center mt-3">
//           <button
//             className="btn btn-outline-primary me-2"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(prev => prev - 1)}
//           >
//             Previous
//           </button>
//           <span className="align-self-center mx-2">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="btn btn-outline-primary ms-2"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(prev => prev + 1)}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default ServiceTableContent;



// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import baseURL from "../ApiUrl/Apiurl";

// const ServiceTableContent = ({
//   selectedCompany,
//   searchTerm,
//   setSearchTerm,
//   entriesPerPage,
//   setEntriesPerPage,
//   currentPage,
//   setCurrentPage,
//   filteredData,
//   historyResponse,
//   navigate,
//   handleAssignClick,
//   handleReopenService,
//   getCustomerName,
//   userId,
//   serviceItems
// }) => {
//   // New filter states
//   const [engineerStatusFilter, setEngineerStatusFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [createdDateFilter, setCreatedDateFilter] = useState("");
//   const [displayDateFilter, setDisplayDateFilter] = useState("");
//   const [companiesData, setCompaniesData] = useState([]);
//   const dateInputRef = useRef(null);

//   // Fetch companies data
//   const fetchCompanies = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/companies/`);
//       if (response.data.status === "success") {
//         setCompaniesData(response.data.data);
//       }
//     } catch (error) {
//       console.error("Failed to load companies data", error);
//     }
//   };

//   // Function to get company name only
//   const getCompanyName = (companyId) => {
//     if (!companiesData || companiesData.length === 0) return companyId;
    
//     const company = companiesData.find(comp => comp.company_id === companyId);
//     return company ? company.company_name : companyId;
//   };

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   // Utility functions
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '-';
      
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}/${month}/${year}`; // dd/mm/yyyy format
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return '-';
//     }
//   };

//   const formatTime = (dateTimeString) => {
//     if (!dateTimeString) return '';
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) return '';
      
//       let hours = date.getHours();
//       const minutes = date.getMinutes();
//       const period = hours >= 12 ? 'PM' : 'AM';
      
//       // Convert to 12-hour format
//       hours = hours % 12 || 12;
      
//       return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
//     } catch (error) {
//       console.error('Error formatting time:', error);
//       return '';
//     }
//   };

//   // Format datetime for display (combines date and time)
//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '-';
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) return '-';
      
//       // Format date as dd/mm/yyyy
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
      
//       // Format time as HH:MM AM/PM
//       let hours = date.getHours();
//       const minutes = date.getMinutes();
//       const period = hours >= 12 ? 'PM' : 'AM';
//       hours = hours % 12 || 12;
      
//       return `${day}/${month}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
//     } catch (error) {
//       console.error('Error formatting datetime:', error);
//       return '-';
//     }
//   };

//   // Convert dd/mm/yyyy to yyyy-mm-dd for filtering
//   const convertToISOFormat = (ddmmyyyy) => {
//     if (!ddmmyyyy) return '';
//     const parts = ddmmyyyy.split('/');
//     if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
//       return `${parts[2]}-${parts[1]}-${parts[0]}`; // yyyy-mm-dd
//     }
//     return '';
//   };

//   // Convert yyyy-mm-dd to dd/mm/yyyy
//   const convertFromISOFormat = (yyyymmdd) => {
//     if (!yyyymmdd) return '';
//     const parts = yyyymmdd.split('-');
//     if (parts.length === 3) {
//       return `${parts[2]}/${parts[1]}/${parts[0]}`; // dd/mm/yyyy
//     }
//     return '';
//   };

//   // Handle date picker change
//   const handleDatePickerChange = (e) => {
//     const isoDate = e.target.value; // yyyy-mm-dd
//     setCreatedDateFilter(isoDate);
//     setDisplayDateFilter(convertFromISOFormat(isoDate));
//   };

//   // Handle text input change
//   const handleDateInputChange = (e) => {
//     let value = e.target.value.replace(/[^0-9/]/g, ''); // Keep only numbers and slashes
    
//     // Auto-format as dd/mm/yyyy
//     const numbers = value.replace(/\//g, '');
//     if (numbers.length >= 2) {
//       value = numbers.slice(0, 2) + '/' + numbers.slice(2);
//     }
//     if (numbers.length >= 4) {
//       value = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
//     }
    
//     setDisplayDateFilter(value);
    
//     // If complete date (dd/mm/yyyy), convert to ISO format for filtering
//     if (value.length === 10) {
//       const isoDate = convertToISOFormat(value);
//       if (isoDate) {
//         setCreatedDateFilter(isoDate);
//       }
//     } else {
//       setCreatedDateFilter('');
//     }
//   };

//   // Function to get service item details
//   const getServiceItemDetails = (serviceItemId) => {
//     if (!serviceItemId || serviceItems.length === 0) return { location: "Loading..." };
    
//     const serviceItem = serviceItems.find(item => item.service_item_id === serviceItemId);
//     return serviceItem ? serviceItem : { location: "Location not found" };
//   };

//   // Get current items for display (after all filters)
//   const getFilteredData = () => {
//     let results = filteredData;

//     // Apply Engineer Status filter
//     if (engineerStatusFilter) {
//       const historyData = historyResponse.data || [];
//       results = results.filter(item => {
//         const latestAssignment = Array.isArray(historyData) 
//           ? historyData.find(history => history.request === item.request_id)
//           : null;
//         const engineerStatus = latestAssignment?.status || "N/A";
//         return engineerStatus === engineerStatusFilter;
//       });
//     }

//     // Apply Status filter
//     if (statusFilter) {
//       results = results.filter(item => item.status === statusFilter);
//     }

//     // Apply Created Date filter
//     if (createdDateFilter) {
//       results = results.filter(item => {
//         const itemDate = new Date(item.created_at).toISOString().split('T')[0];
//         return itemDate === createdDateFilter;
//       });
//     }

//     return results;
//   };

//   const finalFilteredData = getFilteredData();
//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentItems = finalFilteredData.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(finalFilteredData.length / entriesPerPage);

//   // Clear all filters
//   const clearFilters = () => {
//     setEngineerStatusFilter("");
//     setStatusFilter("");
//     setCreatedDateFilter("");
//     setDisplayDateFilter("");
//   };

//   return (
//     <>
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <div>
//           <h2 className="pm-title">Service Pool Details</h2>
//           <p className="pm-subtitle">
//             {selectedCompany 
//               ? `Showing service requests for ${getCompanyName(selectedCompany)}`
//               : 'Showing all service requests'}
//           </p>
//           <p className="pm-subtitle">Manage service requests and assignments</p>
//         </div>
//       </div>

//       {/* Rest of your component remains the same */}
//       {/* Search and Entries Per Page */}
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <div className="d-flex align-items-center gap-2">
//           Show
//           <select
//             value={entriesPerPage}
//             onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//             className="form-select form-select-sm w-auto"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//           </select>
//           entries
//         </div>
//         <input
//           type="text"
//           className="form-control w-auto"
//           placeholder="Search services..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Filter Controls */}
//       <div className="row mb-3">
//         <div className="col-md-3">
//           <label className="form-label small">Engineer Status</label>
//           <select
//             value={engineerStatusFilter}
//             onChange={(e) => setEngineerStatusFilter(e.target.value)}
//             className="form-select form-select-sm"
//           >
//             <option value="">All Engineer Status</option>
//             <option value="Pending">Pending</option>
//             <option value="Accepted">Accepted</option>
//           </select>
//         </div>
//         <div className="col-md-3">
//           <label className="form-label small">Status</label>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="form-select form-select-sm"
//           >
//             <option value="">All Status</option>
//             <option value="Open">Open</option>
//             <option value="Assigned">Assigned</option>
//             <option value="UnderProgress">UnderProgress</option>
//             <option value="Reopened">Reopened</option>
//             <option value="Closed">Closed</option>
//             <option value="Waiting for Quote">Waiting for Quote</option>
//           </select>
//         </div>
//         <div className="col-md-3">
//           <label className="form-label small">Created Date (DD/MM/YYYY)</label>
//           <div className="position-relative">
//             <input
//               type="text"
//               value={displayDateFilter}
//               onChange={handleDateInputChange}
//               className="form-control form-control-sm"
//               placeholder="DD/MM/YYYY"
//               maxLength="10"
//               style={{ paddingRight: '35px' }}
//             />
//             <input
//               ref={dateInputRef}
//               type="date"
//               value={createdDateFilter}
//               onChange={handleDatePickerChange}
//               className="position-absolute"
//               style={{
//                 top: '0',
//                 right: '0',
//                 width: '30px',
//                 height: '100%',
//                 opacity: '0',
//                 cursor: 'pointer'
//               }}
//             />
//             <span 
//               className="position-absolute"
//               style={{
//                 top: '50%',
//                 right: '8px',
//                 transform: 'translateY(-50%)',
//                 pointerEvents: 'none',
//                 color: '#6c757d'
//               }}
//             >
//               📅
//             </span>
//           </div>
//         </div>
//         <div className="col-md-3 d-flex align-items-end">
//           <button
//             onClick={clearFilters}
//             className="btn btn-outline-secondary btn-sm"
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="table-responsive mb-4">
//         <table className="table">
//           <thead className="new-customer-table-header">
//             <tr>
//               <th>S.No</th>
//               <th>Request ID</th>
//               <th>Requested By</th>
//               <th>Request Details</th>
//               <th>Service Item</th>
//               <th>Location</th>
//               <th>Preferred Date/Time</th>
//               <th>Created Date/Time</th>
//               <th>Status</th>
//               <th>Engineer</th>
//               <th>Engineer Status</th>
//               <th>Assign</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.length > 0 ? (
//               currentItems.map((item, index) => {
//                 const historyData = historyResponse.data || [];
//                 const latestAssignment = Array.isArray(historyData) 
//                   ? historyData.find(history => history.request === item.request_id)
//                   : null;
//                 const engineerStatus = latestAssignment?.status || "N/A";
//                 const serviceItemDetails = getServiceItemDetails(item.service_item);

//                 return (
//                   <tr key={item.request_id || index}>
//                     <td>{indexOfFirstEntry + index + 1}</td>
//                     {/* <td>
//                       <button 
//                         className="btn btn-link p-0" 
//                         onClick={() => navigate(`/servicemanager/service-requests/${item.request_id}`, { 
//                           state: { service_item: item.service_item } 
//                         })}
//                       >
//                         {item.request_id}
//                       </button>
//                     </td> */}
                 
// <td>
//   <button 
//     className="btn btn-link p-0" 
//     onClick={() => navigate(`/servicemanager/service-requests/${item.request_id}`, { 
//       state: { 
//         serviceRequest: item, // Pass the entire service request data
//         serviceItemDetails: getServiceItemDetails(item.service_item), // Pass service item details
//         engineerStatus: engineerStatus, // Pass engineer status
//         customerName: getCustomerName(item.requested_by) // Pass customer name
//       } 
//     })}
//   >
//     {item.request_id}
//   </button>
// </td>
//                     <td>{getCustomerName(item.requested_by)}</td>
//                     <td>{item.request_details || "N/A"}</td>
//                     <td>{item.service_item}</td>
//                     <td>
//                       {serviceItemDetails.location || "Location not found"}
//                     </td>
//                     <td>
//                       {/* Combined preferred date and time display */}
//                       {item.preferred_date && item.preferred_time 
//                         ? formatDateTime(`${item.preferred_date}T${item.preferred_time}`)
//                         : item.preferred_date 
//                           ? formatDate(item.preferred_date)
//                           : '-'
//                       }
//                     </td>
//                     <td>
//                       {formatDateTime(item.created_at)}
//                     </td>
//                     <td>{item.status}</td>
//                     <td>{item.assigned_engineer || "N/A"}</td>
//                     <td>
//                       {engineerStatus === "Pending" && (
//                         <span className="badge bg-warning text-dark">Pending</span>
//                       )}
//                       {engineerStatus === "Accepted" && (
//                         <span className="badge bg-success">Accepted</span>
//                       )}
//                       {engineerStatus === "Declined" && (
//                         <span className="badge bg-danger">Rejected</span>
//                       )}
//                       {engineerStatus === "N/A" && "N/A"}
//                     </td>
//                     <td>
//                       {item.status === "Open" ? (
//                         <button
//                           className="btn btn-sm btn-primary"
//                           onClick={() => handleAssignClick(item)}
//                         >
//                           Assign
//                         </button>
//                       ) : item.status === "Closed" ? (
//                         <button
//                           className="btn btn-sm btn-warning"
//                           onClick={() => handleReopenService(item)}
//                         >
//                           Re-open Service
//                         </button>
//                       ) : (
//                         <button className="btn btn-sm btn-secondary disabled">
//                           {item.status === "Reopened" ? "Already Reopened" : "Assign"}
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="12" className="text-center">No service requests found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {finalFilteredData.length > 0 && (
//         <div className="pagination-controls d-flex justify-content-center mt-3">
//           <button
//             className="btn btn-outline-primary me-2"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(prev => prev - 1)}
//           >
//             Previous
//           </button>
//           <span className="align-self-center mx-2">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="btn btn-outline-primary ms-2"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(prev => prev + 1)}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default ServiceTableContent;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import baseURL from "../ApiUrl/Apiurl";

const ServiceTableContent = ({
  selectedCompany,
  searchTerm,
  setSearchTerm,
  entriesPerPage,
  setEntriesPerPage,
  currentPage,
  setCurrentPage,
  filteredData,
  historyResponse,
  navigate,
  handleAssignClick,
  handleReopenService,
  getCustomerName,
  userId,
  serviceItems
}) => {
  // New filter states
  const [engineerStatusFilter, setEngineerStatusFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createdDateFilter, setCreatedDateFilter] = useState("");
  const [displayDateFilter, setDisplayDateFilter] = useState("");
  const [companiesData, setCompaniesData] = useState([]);
  const dateInputRef = useRef(null);

  // Fetch companies data
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${baseURL}/companies/`);
      if (response.data.status === "success") {
        setCompaniesData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load companies data", error);
    }
  };

  // Function to get company name only
  const getCompanyName = (companyId) => {
    if (!companiesData || companiesData.length === 0) return companyId;
    
    const company = companiesData.find(comp => comp.company_id === companyId);
    return company ? company.company_name : companyId;
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Handle Service Request Item History button click - Navigate to new page
  const handleServiceRequestHistory = (serviceRequest) => {
    const historyData = historyResponse.data || [];
    const latestAssignment = Array.isArray(historyData) 
      ? historyData.find(history => history.request === serviceRequest.request_id)
      : null;
    const engineerStatus = latestAssignment?.status || "N/A";
    const serviceItemDetails = getServiceItemDetails(serviceRequest.service_item);

    // Navigate to the service request item history page with all necessary data
    navigate(`/servicemanager/service-request-item-history/${serviceRequest.request_id}`, {
      state: {
        serviceRequest: serviceRequest,
        serviceItemDetails: serviceItemDetails,
        engineerStatus: engineerStatus,
        customerName: getCustomerName(serviceRequest.requested_by),
        userId: userId
      }
    });
  };

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';
      
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '-';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      
      return `${day}/${month}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return '-';
    }
  };

  const convertToISOFormat = (ddmmyyyy) => {
    if (!ddmmyyyy) return '';
    const parts = ddmmyyyy.split('/');
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  };

  const convertFromISOFormat = (yyyymmdd) => {
    if (!yyyymmdd) return '';
    const parts = yyyymmdd.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return '';
  };

  // Handle date picker change
  const handleDatePickerChange = (e) => {
    const isoDate = e.target.value;
    setCreatedDateFilter(isoDate);
    setDisplayDateFilter(convertFromISOFormat(isoDate));
  };

  // Handle text input change
  const handleDateInputChange = (e) => {
    let value = e.target.value.replace(/[^0-9/]/g, '');
    
    const numbers = value.replace(/\//g, '');
    if (numbers.length >= 2) {
      value = numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    if (numbers.length >= 4) {
      value = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
    }
    
    setDisplayDateFilter(value);
    
    if (value.length === 10) {
      const isoDate = convertToISOFormat(value);
      if (isoDate) {
        setCreatedDateFilter(isoDate);
      }
    } else {
      setCreatedDateFilter('');
    }
  };

  // Function to get service item details
  const getServiceItemDetails = (serviceItemId) => {
    if (!serviceItemId || serviceItems.length === 0) return { location: "Loading..." };
    
    const serviceItem = serviceItems.find(item => item.service_item_id === serviceItemId);
    return serviceItem ? serviceItem : { location: "Location not found" };
  };

  // Get current items for display (after all filters)
  const getFilteredData = () => {
    let results = filteredData;

    if (engineerStatusFilter) {
      const historyData = historyResponse.data || [];
      results = results.filter(item => {
        const latestAssignment = Array.isArray(historyData) 
          ? historyData.find(history => history.request === item.request_id)
          : null;
        const engineerStatus = latestAssignment?.status || "N/A";
        return engineerStatus === engineerStatusFilter;
      });
    }

    if (statusFilter) {
      results = results.filter(item => item.status === statusFilter);
    }

    if (createdDateFilter) {
      results = results.filter(item => {
        const itemDate = new Date(item.created_at).toISOString().split('T')[0];
        return itemDate === createdDateFilter;
      });
    }

    return results;
  };

  const finalFilteredData = getFilteredData();
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = finalFilteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(finalFilteredData.length / entriesPerPage);

  // Clear all filters
  const clearFilters = () => {
    setEngineerStatusFilter("");
    setStatusFilter("");
    setCreatedDateFilter("");
    setDisplayDateFilter("");
  };

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div>
          <h2 className="pm-title">Service Pool Details</h2>
          <p className="pm-subtitle">
            {selectedCompany 
              ? `Showing service requests for ${getCompanyName(selectedCompany)}`
              : 'Showing all service requests'}
          </p>
          <p className="pm-subtitle">Manage service requests and assignments</p>
        </div>
      </div>

      {/* Search and Entries Per Page */}
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
            <option value={50}>50</option>
          </select>
          entries
        </div>
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Controls */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label small">Engineer Status</label>
          <select
            value={engineerStatusFilter}
            onChange={(e) => setEngineerStatusFilter(e.target.value)}
            className="form-select form-select-sm"
          >
            <option value="">All Engineer Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label small">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select form-select-sm"
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="UnderProgress">UnderProgress</option>
            <option value="Reopened">Reopened</option>
            <option value="Closed">Closed</option>
            <option value="Waiting for Quote">Waiting for Quote</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label small">Created Date (DD/MM/YYYY)</label>
          <div className="position-relative">
            <input
              type="text"
              value={displayDateFilter}
              onChange={handleDateInputChange}
              className="form-control form-control-sm"
              placeholder="DD/MM/YYYY"
              maxLength="10"
              style={{ paddingRight: '35px' }}
            />
            <input
              ref={dateInputRef}
              type="date"
              value={createdDateFilter}
              onChange={handleDatePickerChange}
              className="position-absolute"
              style={{
                top: '0',
                right: '0',
                width: '30px',
                height: '100%',
                opacity: '0',
                cursor: 'pointer'
              }}
            />
            <span 
              className="position-absolute"
              style={{
                top: '50%',
                right: '8px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#6c757d'
              }}
            >
              📅
            </span>
          </div>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button
            onClick={clearFilters}
            className="btn btn-outline-secondary btn-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive mb-4">
        <table className="table">
          <thead className="new-customer-table-header">
            <tr>
              <th>S.No</th>
              <th>Request ID</th>
              <th>Requested By</th>
              <th>Request Details</th>
              <th>Service Item</th>
              <th>Location</th>
              <th>Preferred Date/Time</th>
              <th>Created Date/Time</th>
              <th>Status</th>
              <th>Engineer</th>
              <th>Engineer Status</th>
              <th>Service Request Item History</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => {
                const historyData = historyResponse.data || [];
                const latestAssignment = Array.isArray(historyData) 
                  ? historyData.find(history => history.request === item.request_id)
                  : null;
                const engineerStatus = latestAssignment?.status || "N/A";
                const serviceItemDetails = getServiceItemDetails(item.service_item);

                return (
                  <tr key={item.request_id || index}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td>
                      <button 
                        className="btn btn-link p-0" 
                        onClick={() => navigate(`/servicemanager/service-requests/${item.request_id}`, { 
                          state: { 
                            serviceRequest: item,
                            serviceItemDetails: getServiceItemDetails(item.service_item),
                            engineerStatus: engineerStatus,
                            customerName: getCustomerName(item.requested_by)
                          } 
                        })}
                      >
                        {item.request_id}
                      </button>
                    </td>
                    <td>{getCustomerName(item.requested_by)}</td>
                    <td>{item.request_details || "N/A"}</td>
                    <td>{item.service_item}</td>
                    <td>
                      {serviceItemDetails.location || "Location not found"}
                    </td>
                    <td>
                      {item.preferred_date && item.preferred_time 
                        ? formatDateTime(`${item.preferred_date}T${item.preferred_time}`)
                        : item.preferred_date 
                          ? formatDate(item.preferred_date)
                          : '-'
                      }
                    </td>
                    <td>
                      {formatDateTime(item.created_at)}
                    </td>
                    <td>{item.status}</td>
                    <td>{item.assigned_engineer || "N/A"}</td>
                    <td>
                      {engineerStatus === "Pending" && (
                        <span className="badge bg-warning text-dark">Pending</span>
                      )}
                      {engineerStatus === "Accepted" && (
                        <span className="badge bg-success">Accepted</span>
                      )}
                      {engineerStatus === "Declined" && (
                        <span className="badge bg-danger">Rejected</span>
                      )}
                      {engineerStatus === "N/A" && "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleServiceRequestHistory(item)}
                      >
                        Service Request Item History
                      </button>
                    </td>
                    <td>
                      {item.status === "Open" ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleAssignClick(item)}
                        >
                          Assign
                        </button>
                      ) : item.status === "Closed" ? (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleReopenService(item)}
                        >
                          Re-open Service
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-secondary disabled">
                          {item.status === "Reopened" ? "Already Reopened" : "Assign"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="13" className="text-center">No service requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {finalFilteredData.length > 0 && (
        <div className="pagination-controls d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-primary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className="align-self-center mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default ServiceTableContent;