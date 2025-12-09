// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import baseURL from '../ApiUrl/Apiurl';
// import { useCompany } from "../AuthContext/CompanyContext";
// import { AuthContext } from "../AuthContext/AuthContext";
// import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

// const ErrorLogs = () => { 
//   const [errorData, setErrorData] = useState([]);
//   const [filteredErrors, setFilteredErrors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { selectedCompany } = useCompany();
//   const { userId } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Fetch error logs data
//   const fetchErrorLogs = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       if (!userId || !selectedCompany) {
//         setError('Missing user ID or company ID');
//         return;
//       }
      
//       const response = await axios.get(
//         `${baseURL}/errors/all/?user_id=${userId}&company_id=${selectedCompany}`
//       );
      
//       if (response.data.status === "success") {
//         setErrorData(response.data.data);
//       } else {
//         setError('Failed to load error logs');
//       }
//     } catch (error) {
//       console.error('Error fetching error logs:', error);
//       setError('Failed to load error logs. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchErrorLogs();
//   }, [selectedCompany, userId]);

//   // Flatten the error data for easier display
//   const flattenErrors = () => {
//     const flattened = [];
//     errorData.forEach(device => {
//       device.errors.forEach(error => {
//         flattened.push({
//           ...error,
//           pcb_serial_number: device.pcb_serial_number
//         });
//       });
//     });
//     return flattened;
//   };

//   useEffect(() => {
//     let results = flattenErrors();
    
//     if (searchTerm) {
//       results = results.filter(error =>
//         Object.values(error)
//           .join(" ")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         error.pcb_serial_number.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     // Sort by timestamp descending (newest first)
//     results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
//     setFilteredErrors(results);
//     setCurrentPage(1);
//   }, [searchTerm, errorData]);

// const handleRaiseRequest = (error) => {
//   navigate('/servicemanager/error-logs/request-form', { 
//     state: { 
//       errorData: error,
//       pcb_serial_number: error.pcb_serial_number,
//       autoDescription: error.description,          // explanation
//       autoErrorCode: error.error_code              // code number
//     } 
//   });
// };


//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = filteredErrors.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredErrors.length / entriesPerPage);

//   const formatDate = (dateString) => {
//   if (!dateString) return '-';

//   const date = new Date(dateString);

//   // Use UTC values (because backend timestamp ends with Z = UTC)
//   let day = date.getUTCDate().toString().padStart(2, '0');
//   let month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
//   let year = date.getUTCFullYear();

//   let hours = date.getUTCHours();
//   const minutes = date.getUTCMinutes().toString().padStart(2, '0');

//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   hours = hours % 12 || 12; // Convert 0 → 12

//   return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
// };


//   const getPriorityBadge = (priority) => {
//     const priorityStyles = {
//       HIGH: 'bg-danger',
//       MEDIUM: 'bg-warning text-dark',
//       LOW: 'bg-info',
//       CRITICAL: 'bg-dark'
//     };
    
//     return (
//       <span className={`badge ${priorityStyles[priority] || 'bg-secondary'}`}>
//         {priority}
//       </span>
//     );
//   };

//   const getErrorCodeBadge = (errorCode) => {
//     return (
//       <span className="badge bg-primary">
//         Error {errorCode}
//       </span>
//     );
//   };

//   if (loading) return <div className="text-center my-4">Loading error logs...</div>;
//   if (error) return <div className="alert alert-danger my-4">{error}</div>;

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap mt-3">
//         <div>
//           <h2 className="error-logs-title mb-0">
//             <FaExclamationTriangle className="me-2" />
//             Error Logs
//           </h2>
//           <p className="error-logs-subtitle mb-0 text-muted">
//             {selectedCompany ? `Showing error logs for selected company` : 'Showing all error logs'}
//           </p>
//         </div>
//         <button onClick={fetchErrorLogs} className="btn btn-outline-primary">
//           Refresh Logs
//         </button>
//       </div>
      
//       <div className="row mb-4">
//         <div className="col-md-6">
//           <div className="card bg-light">
//             <div className="card-body py-2">
//               <div className="d-flex align-items-center">
//                 <FaInfoCircle className="text-primary me-2" />
//                 <small className="text-muted">
//                   Total Errors: <strong>{filteredErrors.length}</strong> | 
//                   Showing: {currentEntries.length} of {filteredErrors.length}
//                 </small>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-6">
//           <div className="d-flex justify-content-end gap-3 flex-wrap">
//             <div className="d-flex align-items-center gap-2">
//               Show
//               <select
//                 value={entriesPerPage}
//                 onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//                 className="form-select form-select-sm w-auto"
//               >
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//                 <option value={100}>100</option>
//               </select>
//               entries
//             </div>

//             <input
//               type="text"
//               placeholder="Search error logs..."
//               className="form-control w-auto"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="table-responsive mb-4">
//         <table className="table table-striped table-hover">
//           <thead className="table-dark">
//             <tr>
//               <th>S.No</th>
//               <th>PCB Serial Number</th>
//               <th>Error Code</th>
//               <th>Description</th>
//               <th>Priority</th>
//               <th>Timestamp</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentEntries.length > 0 ? (
//               currentEntries.map((error, index) => (
//                 <tr key={error.id} className={error.priority === 'HIGH' || error.priority === 'CRITICAL' ? 'table-warning' : ''}>
//                   <td>{indexOfFirstEntry + index + 1}</td>
//                   <td>
//                     <strong>{error.pcb_serial_number}</strong>
//                   </td>
//                   <td>{getErrorCodeBadge(error.error_code)}</td>
//                   <td>{error.description}</td>
//                   <td>{getPriorityBadge(error.priority)}</td>
//                   <td>{formatDate(error.original_timestamp)}</td>
//                   <td style={{ padding: '12px' }}>
//                     <button
//                       onClick={() => handleRaiseRequest(error)}
//                       style={{
//                         padding: '8px 12px',
//                         backgroundColor: '#007bff',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       Raise Request
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center py-4">
//                   <div className="text-muted">
//                     <FaExclamationTriangle className="mb-2" size={24} />
//                     <p className="mb-0">
//                       {searchTerm 
//                         ? 'No error logs found matching your search'
//                         : 'No error logs found'}
//                     </p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <nav aria-label="Page navigation">
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//             </li>

//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <li
//                 key={page}
//                 className={`page-item ${currentPage === page ? "active" : ""}`}
//               >
//                 <button className="page-link" onClick={() => setCurrentPage(page)}>
//                   {page}
//                 </button>
//               </li>
//             ))}

//             <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       )}
//     </>
//   );
// };

// export default ErrorLogs;


//===============================================================
// After fixing filter -Global search issue 


import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../ApiUrl/Apiurl';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const ErrorLogs = () => { 
  const [errorData, setErrorData] = useState([]);
  const [filteredErrors, setFilteredErrors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [serviceItemsData, setServiceItemsData] = useState([]);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/`);
      if (response.data && Array.isArray(response.data)) {
        setUsersData(response.data);
      }
    } catch (error) {
      console.error("Failed to load users data", error);
    }
  };

  // Fetch service items data
  const fetchServiceItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/service-items/?user_id=${userId}&company_id=${selectedCompany}`);
      if (response.data.status === "success") {
        setServiceItemsData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load service items data", error);
    }
  };

  // Fetch error logs data
  const fetchErrorLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userId || !selectedCompany) {
        setError('Missing user ID or company ID');
        return;
      }
      
      const response = await axios.get(
        `${baseURL}/errors/all/?user_id=${userId}&company_id=${selectedCompany}`
      );
      
      if (response.data.status === "success") {
        setErrorData(response.data.data);
      } else {
        setError('Failed to load error logs');
      }
    } catch (error) {
      console.error('Error fetching error logs:', error);
      setError('Failed to load error logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await fetchUsers();
        await fetchServiceItems();
        await fetchErrorLogs();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedCompany, userId]);

  // Function to get username from user ID
  const getUsernameById = (userId) => {
    if (!userId || usersData.length === 0) return userId;
    
    const user = usersData.find(user => user.user_id === userId);
    return user ? user.username : userId;
  };

  // Function to get user search data (both ID and username)
  const getUserSearchData = (userId) => {
    if (!userId) return '';
    const user = usersData.find(user => user.user_id === userId);
    return user ? `${userId} ${user.username} ${user.email || ''}` : userId;
  };

  // Function to get service item details by PCB serial number
  const getServiceItemByPcbSerial = (pcbSerialNumber) => {
    if (!serviceItemsData || serviceItemsData.length === 0) return null;
    
    const serviceItem = serviceItemsData.find(item => 
      item.pcb_serial_number === pcbSerialNumber
    );
    return serviceItem;
  };

  // Function to get service item search data
  const getServiceItemSearchData = (pcbSerialNumber) => {
    if (!pcbSerialNumber) return '';
    const serviceItem = getServiceItemByPcbSerial(pcbSerialNumber);
    if (!serviceItem) return pcbSerialNumber;
    
    return [
      pcbSerialNumber,
      serviceItem.service_item_id || '',
      serviceItem.serial_number || '',
      serviceItem.service_item_name || '',
      serviceItem.location || '',
      serviceItem.product_description || '',
      serviceItem.customer || '',
      serviceItem.status || '',
      serviceItem.iot_status || '',
    ].filter(Boolean).join(' ');
  };

  // Function to format date as dd/mm/yyyy hh:mm AM/PM
  const formatDate = (dateString) => {
    if (!dateString) return '-';

    const date = new Date(dateString);

    // Use UTC values (because backend timestamp ends with Z = UTC)
    let day = date.getUTCDate().toString().padStart(2, '0');
    let month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    let year = date.getUTCFullYear();

    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 → 12

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  // Function to format date in multiple formats for search
  const formatDateForSearch = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const monthName = date.toLocaleString('en-IN', { month: 'long' });
    const monthShort = date.toLocaleString('en-IN', { month: 'short' });
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return [
      `${day}/${month}/${year}`,                    // DD/MM/YYYY
      `${day}/${month}/${year} ${hours12}:${minutes} ${ampm}`, // DD/MM/YYYY HH:MM AM/PM
      `${month}/${day}/${year}`,                    // MM/DD/YYYY
      `${year}-${month}-${day}`,                    // YYYY-MM-DD
      `${year}${month}${day}`,                      // YYYYMMDD
      `${day}-${month}-${year}`,                    // DD-MM-YYYY
      `${hours12}:${minutes} ${ampm}`,              // HH:MM AM/PM
      `${hours}:${minutes}:${seconds}`,             // HH:MM:SS (24h)
      monthName,                                    // January, February
      monthShort,                                   // Jan, Feb
      `${year}`,                                    // 2024
      `${month}/${year}`,                           // MM/YYYY
      `${day} ${monthName} ${year}`,               // 15 January 2024
      `${day} ${monthShort} ${year}`,              // 15 Jan 2024
      date.toISOString(),                           // ISO string
      date.toUTCString(),                           // UTC string
    ].join(' ');
  };

  // Flatten the error data for easier display
  const flattenErrors = () => {
    const flattened = [];
    errorData.forEach(device => {
      device.errors.forEach(error => {
        flattened.push({
          ...error,
          pcb_serial_number: device.pcb_serial_number,
          device_errors_count: device.errors.length,
          device_info: device
        });
      });
    });
    return flattened;
  };

  // Enhanced global search functionality
  const enhancedFilteredErrors = useMemo(() => {
    const flattenedErrors = flattenErrors();
    
    if (!searchTerm.trim()) {
      return flattenedErrors;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return flattenedErrors.filter((error) => {
      // Get service item data for search
      const serviceItemSearch = getServiceItemSearchData(error.pcb_serial_number);
      
      // Get user data for search
      const createdBySearch = getUserSearchData(error.created_by);
      const updatedBySearch = getUserSearchData(error.updated_by);
      
      // Get dates in multiple formats for search
      const timestampFormats = formatDateForSearch(error.timestamp);
      const originalTimestampFormats = formatDateForSearch(error.original_timestamp);
      const createdDateFormats = formatDateForSearch(error.created_at);
      const updatedDateFormats = formatDateForSearch(error.updated_at);
      const resolvedAtFormats = formatDateForSearch(error.resolved_at);
      const acknowledgedAtFormats = formatDateForSearch(error.acknowledged_at);
      
      // Create a comprehensive search string
      const searchableText = [
        // Raw error data
        error.id || '',
        error.error_code || '',
        error.error_code ? `error ${error.error_code}` : '',
        error.description || '',
        error.priority || '',
        error.status || '',
        error.pcb_serial_number || '',
        error.component || '',
        error.module || '',
        error.source || '',
        error.category || '',
        error.severity || '',
        error.timestamp || '',
        error.original_timestamp || '',
        error.resolved_at || '',
        error.acknowledged_at || '',
        error.resolution_notes || '',
        error.acknowledged_by || '',
        error.resolved_by || '',
        error.created_by || '',
        error.updated_by || '',
        error.created_at || '',
        error.updated_at || '',
        
        // Formatted relational data
        serviceItemSearch,
        createdBySearch,
        updatedBySearch,
        
        // Dates in multiple formats
        timestampFormats,
        originalTimestampFormats,
        createdDateFormats,
        updatedDateFormats,
        resolvedAtFormats,
        acknowledgedAtFormats,
        
        // Display values (exactly as shown in table)
        formatDate(error.original_timestamp),
        formatDate(error.timestamp),
        formatDate(error.created_at),
        formatDate(error.updated_at),
        getUsernameById(error.created_by),
        getUsernameById(error.updated_by),
        getUsernameById(error.acknowledged_by),
        getUsernameById(error.resolved_by),
        
        // Priority variations for search
        error.priority === 'HIGH' ? 'high critical urgent immediate serious' : '',
        error.priority === 'MEDIUM' ? 'medium moderate normal average' : '',
        error.priority === 'LOW' ? 'low minor trivial unimportant' : '',
        error.priority === 'CRITICAL' ? 'critical emergency fatal catastrophic' : '',
        
        // Status variations
        error.status === 'ACTIVE' ? 'active open ongoing unresolved pending' : '',
        error.status === 'RESOLVED' ? 'resolved closed fixed solved completed' : '',
        error.status === 'ACKNOWLEDGED' ? 'acknowledged seen reviewed noted' : '',
        error.status === 'IN_PROGRESS' ? 'in progress working investigating processing' : '',
        
        // Error code variations
        error.error_code ? `code ${error.error_code} E${error.error_code}` : '',
        
        // Component variations
        error.component ? `component ${error.component} part hardware` : '',
        
        // Module variations
        error.module ? `module ${error.module} system software` : '',
        
        // Source variations
        error.source ? `source ${error.source} origin cause` : '',
        
        // Category variations
        error.category ? `category ${error.category} type classification` : '',
        
        // Severity variations
        error.severity ? `severity ${error.severity} level intensity` : '',
        
        // Description variations
        error.description ? `${error.description} problem issue fault defect bug` : '',
        
        // Resolution notes variations
        error.resolution_notes ? `resolution notes solution fix repair ${error.resolution_notes}` : '',
        
        // Device info variations
        error.device_info ? JSON.stringify(error.device_info) : '',
        
        // Add any other properties that might exist
        ...Object.values(error).filter(val => 
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
  }, [searchTerm, errorData, usersData, serviceItemsData]);

  // Update filteredErrors based on search
  useEffect(() => {
    // Sort by timestamp descending (newest first)
    const sortedErrors = [...enhancedFilteredErrors].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    setFilteredErrors(sortedErrors);
    setCurrentPage(1);
  }, [enhancedFilteredErrors]);

  const handleRaiseRequest = (error) => {
    navigate('/servicemanager/error-logs/request-form', { 
      state: { 
        errorData: error,
        pcb_serial_number: error.pcb_serial_number,
        autoDescription: error.description,          // explanation
        autoErrorCode: error.error_code              // code number
      } 
    });
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredErrors.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredErrors.length / entriesPerPage);

  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      HIGH: 'bg-danger',
      MEDIUM: 'bg-warning text-dark',
      LOW: 'bg-info',
      CRITICAL: 'bg-dark'
    };
    
    return (
      <span className={`badge ${priorityStyles[priority] || 'bg-secondary'}`}>
        {priority}
      </span>
    );
  };

  const getErrorCodeBadge = (errorCode) => {
    return (
      <span className="badge bg-primary">
        Error {errorCode}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      ACTIVE: 'bg-danger',
      RESOLVED: 'bg-success',
      ACKNOWLEDGED: 'bg-info',
      IN_PROGRESS: 'bg-warning text-dark'
    };
    
    return (
      <span className={`badge ${statusStyles[status] || 'bg-secondary'}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="text-center my-4">Loading error logs...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap mt-3">
        <div>
          <h2 className="error-logs-title mb-0">
            <FaExclamationTriangle className="me-2" />
            Error Logs
          </h2>
          <p className="error-logs-subtitle mb-0 text-muted">
            {selectedCompany ? `Showing error logs for selected company` : 'Showing all error logs'}
          </p>
        </div>
        <button onClick={fetchErrorLogs} className="btn btn-outline-primary">
          Refresh Logs
        </button>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body py-2">
              <div className="d-flex align-items-center">
                <FaInfoCircle className="text-primary me-2" />
                <small className="text-muted">
                  Total Errors: <strong>{filteredErrors.length}</strong> | 
                  Showing: {currentEntries.length} of {filteredErrors.length}
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="form-select form-select-sm w-auto"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              entries
            </div>

            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search in all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: '250px' }}
              />
              {searchTerm && (
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="alert alert-info mb-3">
          <strong>Search Results:</strong> Found {filteredErrors.length} error(s) matching "{searchTerm}"
        </div>
      )}

      <div className="table-responsive mb-4">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>PCB Serial Number</th>
              <th>Error Code</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.length > 0 ? (
              currentEntries.map((error, index) => (
                <tr key={error.id} className={error.priority === 'HIGH' || error.priority === 'CRITICAL' ? 'table-warning' : ''}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td title={`Service Item: ${getServiceItemSearchData(error.pcb_serial_number)}`}>
                    <strong>{error.pcb_serial_number}</strong>
                  </td>
                  <td>{getErrorCodeBadge(error.error_code)}</td>
                  <td>{error.description}</td>
                  <td>{getPriorityBadge(error.priority)}</td>
                  <td>{getStatusBadge(error.status)}</td>
                  <td title={`Original: ${formatDate(error.original_timestamp)}\nServer: ${formatDate(error.timestamp)}`}>
                    {formatDate(error.original_timestamp)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleRaiseRequest(error)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Raise Request
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <div className="text-muted">
                    <FaExclamationTriangle className="mb-2" size={24} />
                    <p className="mb-0">
                      {searchTerm 
                        ? `No error logs found matching "${searchTerm}"`
                        : 'No error logs found'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {(() => {
              const maxVisiblePages = 5;
              let pageNumbers = [];
              
              if (totalPages <= maxVisiblePages) {
                for (let i = 1; i <= totalPages; i++) {
                  pageNumbers.push(i);
                }
              } else {
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(i);
                }
              }
              
              return pageNumbers.map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ));
            })()}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default ErrorLogs;