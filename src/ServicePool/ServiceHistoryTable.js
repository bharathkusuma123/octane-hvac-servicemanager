// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import baseURL from '../ApiUrl/Apiurl';
// import { useCompany } from "../AuthContext/CompanyContext";
// import { AuthContext } from "../AuthContext/AuthContext";
// import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';

// const ServiceRequestItemsTable = ({ toggleForm, onEditItem, onViewItem }) => {
//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { selectedCompany } = useCompany();
//   const { userId } = useContext(AuthContext);

//   const fetchServiceRequestItems = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       if (!userId || !selectedCompany) {
//         setError('Missing user ID or company ID');
//         return;
//       }
      
//       const response = await axios.get(
//         `${baseURL}/service-req-items-history/?user_id=${userId}&company_id=${selectedCompany}`
//       );
      
//       if (response.data.status === "success") {
//         const sortedItems = response.data.data.sort((a, b) => 
//           new Date(b.created_at) - new Date(a.created_at)
//         );
//         setItems(sortedItems);
//       } else {
//         setError('Failed to load service request items');
//       }
//     } catch (error) {
//       console.error('Error fetching service request items:', error);
//       setError('Failed to load service request items');
//     } finally {
//       setLoading(false); 
//     }
//   };

//   useEffect(() => {
//     fetchServiceRequestItems();
//   }, [selectedCompany, userId]);

//   useEffect(() => {
//     let results = items;
    
//     if (selectedCompany) {
//       results = results.filter(item => 
//         item.company === selectedCompany
//       );
//     }
    
//     if (searchTerm) {
//       results = results.filter(item =>
//         Object.values(item)
//           .join(" ")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     }
    
//     setFilteredItems(results);
//     setCurrentPage(1);
//   }, [selectedCompany, searchTerm, items]);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '-';
//     const date = new Date(dateTimeString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     return `${day}/${month}/${year} ${hours}:${minutes}`;
//   };

//   const handleDeleteItem = (srItemId) => {
//     if (window.confirm('Are you sure you want to delete this service request item? This action cannot be undone.')) {
//       axios
//         .delete(`${baseURL}/service-req-items-history/${srItemId}/?user_id=${userId}&company_id=${selectedCompany}`)
//         .then(response => {
//           console.log("Service request item deleted successfully", response);
//           alert('Service request item deleted successfully');
//           fetchServiceRequestItems();
//         })
//         .catch(error => {
//           console.error("Error deleting service request item:", error);
//           alert("Failed to delete service request item. Please try again.");
//         });
//     }
//   };

//   if (loading) return <div className="text-center my-4">Loading service request items...</div>;
//   if (error) return <div className="alert alert-danger my-4">{error}</div>;

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap">
//         <div>
//           <h2 className="customer-title mb-0">Service Request Items History</h2>
//           <p className="customer-subtitle mb-0 text-muted">
//             {selectedCompany ? `Showing service request items for ${selectedCompany}` : 'Showing all service request items'}
//           </p>
//         </div>
//         {/* <button onClick={toggleForm} className="btn btn-primary">
//           Add New Item
//         </button> */}
//       </div>
      
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
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
//           </select>
//           entries
//         </div>

//         <input
//           type="text"
//           placeholder="Search service request items..."
//           className="form-control w-auto"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="table-responsive mb-4">
//         <table className="table">
//           <thead className="new-customer-table-header">
//             <tr>
//               <th>S.No</th>
//               <th>SR Item ID</th>
//               <th>Service Request</th>
//               <th>Component Type</th>
//               <th>Component</th>
//               <th>Task Type</th>
//               <th>Old Serial No</th>
//               <th>New Serial No</th>
//               <th>Warranty Start</th>
//               <th>Warranty End</th>
//               <th>Action Taken</th>
//               <th>Serviced By</th>
//               {/* <th>Serviced At</th> */}
//               <th>Created At</th>
//               {/* <th>Actions</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {currentEntries.length > 0 ? (
//               currentEntries.map((item, index) => (
//                 <tr key={index}>
//                   <td>{indexOfFirstEntry + index + 1}</td>
//                   <td>{item.sr_item_id}</td>
//                   <td>{item.service_request}</td>
//                   <td>{item.component_type}</td>
//                   <td>{item.component}</td>
//                   <td>{item.task_type}</td>
//                   <td>{item.old_comp_serial_no || '-'}</td>
//                   <td>{item.new_comp_serial_no || '-'}</td>
//                   <td>{formatDate(item.warranty_start_date)}</td>
//                   <td>{formatDate(item.warranty_end_date)}</td>
//                   <td>{item.action_taken || '-'}</td>
//                   <td>{item.serviced_by}</td>
//                   {/* <td>{formatDateTime(item.serviced_at)}</td> */}
//                   <td>{formatDateTime(item.created_at)}</td>
//                   {/* <td>
//                     <div className="d-flex gap-2">
//                       <FaEye 
//                         style={{ 
//                           color: "#0d6efd", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => onViewItem(item)}
//                         title="View Item"
//                       />
//                       <FaEdit 
//                         style={{ 
//                           color: "#ffc107", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => onEditItem(item)}
//                         title="Edit Item"
//                       />
//                       <FaTrashAlt 
//                         style={{ 
//                           color: "#dc3545", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => handleDeleteItem(item.sr_item_id)}
//                         title="Delete Item"
//                       />
//                     </div>
//                   </td> */}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="15" className="text-center">
//                   {selectedCompany 
//                     ? `No service request items found for ${selectedCompany}${searchTerm ? ' matching your search' : ''}`
//                     : 'No service request items found'}
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

// export default ServiceRequestItemsTable;




//===============================================================
// After fixing filter -Global search issue 


// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import baseURL from '../ApiUrl/Apiurl';
// import { useCompany } from "../AuthContext/CompanyContext";
// import { AuthContext } from "../AuthContext/AuthContext";
// import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const ServiceRequestItemsTable = ({ toggleForm, onEditItem, onViewItem }) => { 
//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//  const [searchTerm, setSearchTerm] = useState(() => {
//   return sessionStorage.getItem('srItems_searchTerm') || '';
// });

// const [entriesPerPage, setEntriesPerPage] = useState(() => {
//   return Number(sessionStorage.getItem('srItems_entriesPerPage')) || 5;
// });

// const [currentPage, setCurrentPage] = useState(() => {
//   return Number(sessionStorage.getItem('srItems_currentPage')) || 1;
// });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { selectedCompany } = useCompany();
//   const { userId } = useContext(AuthContext);
//   const [users, setUsers] = useState([]); // To store user data for search
//   const [components, setComponents] = useState([]); // To store component data for search
//   const [servicePools, setServicePools] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//   sessionStorage.setItem('srItems_searchTerm', searchTerm);
// }, [searchTerm]);

// useEffect(() => {
//   sessionStorage.setItem('srItems_entriesPerPage', entriesPerPage);
// }, [entriesPerPage]);

// useEffect(() => {
//   sessionStorage.setItem('srItems_currentPage', currentPage);
// }, [currentPage]);

// const handleSearchChange = (value) => {
//   setSearchTerm(value);
//   setCurrentPage(1);
//   sessionStorage.setItem('srItems_currentPage', 1);
// };

// const handleEntriesPerPageChange = (value) => {
//   setEntriesPerPage(value);
//   setCurrentPage(1);
//   sessionStorage.setItem('srItems_currentPage', 1);
// };

//   // Fetch users data for username search
//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/users/`);
//       if (response.data && Array.isArray(response.data)) {
//         setUsers(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   // Fetch components data for component name search
//   const fetchComponents = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/components/`);
//       if (response.data.status === "success" && Array.isArray(response.data.data)) {
//         setComponents(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching components:', error);
//     }
//   };

// const fetchServicePools = async () => {
//   try {
//     const response = await axios.get(
//       `${baseURL}/service-pools/?user_id=${userId}&company_id=${selectedCompany}`
//     );

//     console.log("FULL RESPONSE:", response.data); // 🔍 DEBUG

//     if (response.data?.status === "success" && Array.isArray(response.data.data)) {
//       setServicePools(response.data.data);
//       console.log("Fetched service pools:", response.data.data);
//     } else {
//       console.warn("Unexpected API format:", response.data);
//     }

//   } catch (error) {
//     console.error("Error fetching service pools:", error);
//   }
// };

//   const fetchServiceRequestItems = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       if (!userId || !selectedCompany) {
//         setError('Missing user ID or company ID');
//         return;
//       }
      
//       const response = await axios.get(
//         `${baseURL}/service-req-items-history/?user_id=${userId}&company_id=${selectedCompany}`
//       );
      
//       if (response.data.status === "success") {
//         const sortedItems = response.data.data.sort((a, b) => 
//           new Date(b.created_at) - new Date(a.created_at)
//         );
//         setItems(sortedItems);
//       } else {
//         setError('Failed to load service request items');
//       }
//     } catch (error) {
//       console.error('Error fetching service request items:', error);
//       setError('Failed to load service request items');
//     } finally {
//       setLoading(false); 
//     }
//   };

//   const getServiceItem = (requestId) => {
//   if (!requestId || servicePools.length === 0) return "-";
//   const match = servicePools.find(
//     (item) => item.request_id === requestId
//   );
//   return match ? match.service_item : "-";
// };

// const getCustomer = (requestId) => {
//   if (!requestId || servicePools.length === 0) return "-";
//   const match = servicePools.find(
//     (item) => item.request_id === requestId
//   );
//   return match ? match.customer : "-";
// };

//   useEffect(() => {
//     fetchUsers();
//     fetchComponents();
//     fetchServiceRequestItems();
//      fetchServicePools();   // ✅ ADD THIS
//   }, [selectedCompany, userId]);

//   // Function to get username from user_id
//   const getUsernameById = (userId) => {
//     if (!userId || users.length === 0) return userId;
    
//     const user = users.find(user => user.user_id === userId);
//     return user ? user.username : userId;
//   };

//   // Function to get component name from component_id
//   const getComponentName = (componentId) => {
//     if (!componentId || components.length === 0) return componentId;
    
//     const component = components.find(comp => comp.component_id === componentId);
//     return component ? component.component_name : componentId;
//   };

//   // Function to get user search data (both ID and username)
//   const getUserSearchData = (userId) => {
//     if (!userId) return '';
//     const user = users.find(user => user.user_id === userId);
//     return user ? `${userId} ${user.username}` : userId;
//   };

//   // Function to get component search data (both ID and name)
//   const getComponentSearchData = (componentId) => {
//     if (!componentId) return '';
//     const component = components.find(comp => comp.component_id === componentId);
//     return component ? `${componentId} ${component.component_name}` : componentId;
//   };

//   // Function to format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   // Function to format date-time for display
//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '-';
//     const date = new Date(dateTimeString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     return `${day}/${month}/${year} ${hours}:${minutes}`;
//   };

//   // Function to format date in multiple formats for search
//   const formatDateForSearch = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
    
//     if (isNaN(date.getTime())) return '';
    
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     const monthName = date.toLocaleString('en-IN', { month: 'long' });
//     const monthShort = date.toLocaleString('en-IN', { month: 'short' });
//     const hour = date.getHours().toString().padStart(2, '0');
//     const minute = date.getMinutes().toString().padStart(2, '0');
//     const second = date.getSeconds().toString().padStart(2, '0');
    
//     // Return multiple formats for better searchability
//     return [
//       `${day}/${month}/${year}`,                    // DD/MM/YYYY
//       `${day}/${month}/${year} ${hour}:${minute}:${second}`, // DD/MM/YYYY HH:MM:SS
//       `${month}/${day}/${year}`,                    // MM/DD/YYYY
//       `${year}-${month}-${day}`,                    // YYYY-MM-DD
//       `${year}${month}${day}`,                      // YYYYMMDD
//       `${day}-${month}-${year}`,                    // DD-MM-YYYY
//       date.toISOString(),                           // ISO string
//       monthName,                                    // January, February
//       monthShort,                                   // Jan, Feb
//       `${year}`,                                    // 2024
//       `${month}/${year}`,                           // MM/YYYY
//       `${day} ${monthName} ${year}`,               // 15 January 2024
//       `${day} ${monthShort} ${year}`,              // 15 Jan 2024
//       `${hour}:${minute}`,                          // HH:MM
//       `${hour}:${minute}:${second}`,               // HH:MM:SS
//     ].join(' ');
//   };

//  useEffect(() => {
//   let results = items;

//   if (!searchTerm.trim()) {
//     if (selectedCompany) {
//       results = results.filter(item => item.company === selectedCompany);
//     }

//     setFilteredItems(results);

//     // ✅ Clamp page
//     const totalPagesNow = Math.ceil(results.length / entriesPerPage);
//     const savedPage = Number(sessionStorage.getItem('srItems_currentPage')) || 1;

//     if (savedPage > totalPagesNow && totalPagesNow > 0) {
//       setCurrentPage(totalPagesNow);
//     }

//     return;
//   }

//   const searchLower = searchTerm.toLowerCase().trim();

//   const filtered = items.filter((item) => {
//     if (selectedCompany && item.company !== selectedCompany) return false;

//     const searchableText = Object.values(item).join(' ').toLowerCase();

//     return searchableText.includes(searchLower);
//   });

//   setFilteredItems(filtered);

//   // ✅ Clamp page after filtering
//   const totalPagesNow = Math.ceil(filtered.length / entriesPerPage);
//   const savedPage = Number(sessionStorage.getItem('srItems_currentPage')) || 1;

//   if (savedPage > totalPagesNow && totalPagesNow > 0) {
//     setCurrentPage(totalPagesNow);
//   }

// }, [searchTerm, items, selectedCompany, entriesPerPage]);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

//   const handleDeleteItem = (srItemId) => {
//     if (window.confirm('Are you sure you want to delete this service request item? This action cannot be undone.')) {
//       axios
//         .delete(`${baseURL}/service-req-items-history/${srItemId}/?user_id=${userId}&company_id=${selectedCompany}`)
//         .then(response => {
//           console.log("Service request item deleted successfully", response);
//           alert('Service request item deleted successfully');
//           fetchServiceRequestItems();
//         })
//         .catch(error => {
//           console.error("Error deleting service request item:", error);
//           alert("Failed to delete service request item. Please try again.");
//         });
//     }
//   };

//   if (loading) return <div className="text-center my-4">Loading service request items...</div>;
//   if (error) return <div className="alert alert-danger my-4">{error}</div>;

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap">
//         <div>
//           <h2 className="customer-title mb-0">Service Request Items History</h2>
//           <p className="customer-subtitle mb-0 text-muted">
//             {selectedCompany ? `Showing service request items for ${selectedCompany}` : 'Showing all service request items'}
//           </p>
//         </div>
//       </div>
      
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
//         <div className="d-flex align-items-center gap-2">
//           Show
//           <select
//             value={entriesPerPage}
//             onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
//             className="form-select form-select-sm w-auto"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//           </select>
//           entries
//         </div>

//         <div className="d-flex align-items-center gap-2">
//           <input
//             type="text"
//             placeholder="Search in all columns..."
//             className="form-control"
//             value={searchTerm}
//          onChange={(e) => handleSearchChange(e.target.value)}
//             style={{ minWidth: '250px' }}
//           />
//           {searchTerm && (
//             <button 
//               className="btn btn-sm btn-outline-secondary"
//              onClick={() => handleSearchChange('')}
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Search Results Info */}
//       {searchTerm && (
//         <div className="alert alert-info mb-3">
//           <strong>Search Results:</strong> Found {filteredItems.length} item(s) matching "{searchTerm}"
//         </div>
//       )}

//       <div className="table-responsive mb-4">
//         <table className="table">
//           <thead className="new-customer-table-header">
//             <tr>
//               <th>S.No</th>
//               <th>SR Item ID</th>
//               <th>Service Request</th>
//               <th>Service Item</th>
// <th>Customer</th>
//               <th>Component Type</th>
//               <th>Component</th>
//               <th>Task Type</th>
//               <th>Old Serial No</th>
//               <th>New Serial No</th>
//               <th>Warranty Start</th>
//               <th>Warranty End</th>
//               <th>Action Taken</th>
//               <th>Serviced By</th>
//               <th>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentEntries.length > 0 ? (
//               currentEntries.map((item, index) => (
//                 <tr key={index}>
//                   <td>{indexOfFirstEntry + index + 1}</td>
//                   <td>{item.sr_item_id}</td>
//                   <td>{item.service_request}</td>
//                  <td>
//   {(() => {
//     const customerId = getCustomer(item.service_request);

//     return customerId && customerId !== '-' ? (
//       <button
//         className="btn btn-link p-0 text-primary text-decoration-underline"
//         onClick={() => navigate(`/servicemanager/customers/${customerId}`)}
//         style={{
//           border: 'none',
//           background: 'none',
//           cursor: 'pointer',
//           fontSize: 'inherit'
//         }}
//         title={`View Customer: ${customerId}`}
//       >
//         {customerId}
//       </button>
//     ) : (
//       '-'
//     );
//   })()}
// </td>

// <td>
//   {(() => {
//     const serviceItem = getServiceItem(item.service_request);

//     return serviceItem && serviceItem !== '-' ? (
//       <button
//         className="btn btn-link p-0 text-primary text-decoration-underline"
//         onClick={() =>
//           navigate(`/servicemanager/service-item-details/${serviceItem}`)
//         }
//         style={{
//           border: 'none',
//           background: 'none',
//           cursor: 'pointer',
//           fontSize: 'inherit'
//         }}
//         title={`View Service Item: ${serviceItem}`}
//       >
//         {serviceItem}
//       </button>
//     ) : (
//       '-'
//     );
//   })()}
// </td>
//                   <td>{item.component_type}</td>
//                   <td>{getComponentName(item.component)}</td>
//                   <td>{item.task_type}</td>
//                   <td>{item.old_comp_serial_no || '-'}</td>
//                   <td>{item.new_comp_serial_no || '-'}</td>
//                   <td>{formatDate(item.warranty_start_date)}</td>
//                   <td>{formatDate(item.warranty_end_date)}</td>
//                   <td>{item.action_taken || '-'}</td>
//                   <td>{getUsernameById(item.serviced_by)}</td>
//                   <td>{formatDateTime(item.created_at)}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="13" className="text-center">
//                   {searchTerm 
//                     ? `No service request items found matching "${searchTerm}"`
//                     : selectedCompany 
//                       ? `No service request items found for ${selectedCompany}`
//                       : 'No service request items found'}
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

//             {(() => {
//               const maxVisiblePages = 5;
//               let pageNumbers = [];
              
//               if (totalPages <= maxVisiblePages) {
//                 for (let i = 1; i <= totalPages; i++) {
//                   pageNumbers.push(i);
//                 }
//               } else {
//                 let startPage = Math.max(1, currentPage - 2);
//                 let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
//                 if (endPage - startPage + 1 < maxVisiblePages) {
//                   startPage = Math.max(1, endPage - maxVisiblePages + 1);
//                 }
                
//                 for (let i = startPage; i <= endPage; i++) {
//                   pageNumbers.push(i);
//                 }
//               }
              
//               return pageNumbers.map((page) => (
//                 <li
//                   key={page}
//                   className={`page-item ${currentPage === page ? "active" : ""}`}
//                 >
//                   <button className="page-link" onClick={() => setCurrentPage(page)}>
//                     {page}
//                   </button>
//                 </li>
//               ));
//             })()}

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

// export default ServiceRequestItemsTable;


import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import baseURL from '../ApiUrl/Apiurl';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";
import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ServiceRequestItemsTable = ({ toggleForm, onEditItem, onViewItem }) => { 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [components, setComponents] = useState([]);
  const [servicePools, setServicePools] = useState([]);
  const navigate = useNavigate();
  
  // Pagination states (server-side)
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem('srItems_searchTerm') || '';
  });
  const [entriesPerPage, setEntriesPerPage] = useState(() => {
    return Number(sessionStorage.getItem('srItems_entriesPerPage')) || 10;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(sessionStorage.getItem('srItems_currentPage')) || 1;
  });
  
  // Server-side pagination data
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Save pagination state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('srItems_searchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('srItems_entriesPerPage', entriesPerPage);
  }, [entriesPerPage]);

  useEffect(() => {
    sessionStorage.setItem('srItems_currentPage', currentPage);
  }, [currentPage]);

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/?page=1&page_size=100`);
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch components data with pagination
  const fetchComponents = async () => {
    try {
      const response = await axios.get(`${baseURL}/components/?page=1&page_size=100`);
      if (response.data.status === "success" && Array.isArray(response.data.data)) {
        setComponents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  // Fetch service pools with pagination
  const fetchServicePools = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/service-pools/?user_id=${userId}&company_id=${selectedCompany}&page=1&page_size=100`
      );

      if (response.data?.status === "success" && Array.isArray(response.data.data)) {
        setServicePools(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching service pools:", error);
    }
  };

  // Fetch service request items with pagination
  const fetchServiceRequestItems = async (page = currentPage, size = entriesPerPage, search = searchTerm) => {
    setFetching(true);
    setError(null);
    
    try {
      if (!userId || !selectedCompany) {
        setError('Missing user ID or company ID');
        setFetching(false);
        return;
      }

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

      const response = await axios.get(`${baseURL}/service-req-items-history/?${params.toString()}`);
      
      if (response.data.status === "success") {
        const data = response.data.data || [];
        const pagination = response.data.pagination || {};
        
        // Sort by created_at descending
        const sortedItems = data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        setItems(sortedItems);
        setTotalCount(pagination.total_count || 0);
        setTotalPages(pagination.total_pages || 1);
        setHasNextPage(pagination.has_next || false);
        setHasPreviousPage(pagination.has_previous || false);
        setCurrentPage(pagination.current_page || 1);
      } else {
        setError('Failed to load service request items');
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching service request items:', error);
      setError('Failed to load service request items');
      setItems([]);
    } finally {
      setFetching(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchComponents(),
          fetchServicePools(),
          fetchServiceRequestItems(1, entriesPerPage, searchTerm)
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (userId && selectedCompany) {
      fetchAllData();
    }
  }, [selectedCompany, userId]);

  // Refetch when pagination or search changes
  useEffect(() => {
    if (userId && selectedCompany && !loading) {
      const debounceTimer = setTimeout(() => {
        fetchServiceRequestItems(currentPage, entriesPerPage, searchTerm);
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [currentPage, entriesPerPage, searchTerm]);

  // Function to get username from user_id
  const getUsernameById = (userId) => {
    if (!userId || users.length === 0) return userId;
    const user = users.find(user => user.user_id === userId);
    return user ? user.username : userId;
  };

  // Function to get component name from component_id
  const getComponentName = (componentId) => {
    if (!componentId || components.length === 0) return componentId;
    const component = components.find(comp => comp.component_id === componentId);
    return component ? component.component_name : componentId;
  };

  // Function to get service item from request ID
  const getServiceItem = (requestId) => {
    if (!requestId || servicePools.length === 0) return "-";
    const match = servicePools.find(
      (item) => item.request_id === requestId
    );
    return match ? match.pcb_serial_number : "-";
  };

  // Function to get customer from request ID
  const getCustomer = (requestId) => {
    if (!requestId || servicePools.length === 0) return "-";
    const match = servicePools.find(
      (item) => item.request_id === requestId
    );
    return match ? match.full_name : "-";
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Function to format date-time for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${day}/${month}/${year} ${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Handle entries per page change
  const handleEntriesPerPageChange = (value) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
    sessionStorage.setItem('srItems_currentPage', 1);
  };

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    sessionStorage.setItem('srItems_currentPage', 1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteItem = (srItemId) => {
    if (window.confirm('Are you sure you want to delete this service request item? This action cannot be undone.')) {
      axios
        .delete(`${baseURL}/service-req-items-history/${srItemId}/?user_id=${userId}&company_id=${selectedCompany}`)
        .then(response => {
          console.log("Service request item deleted successfully", response);
          alert('Service request item deleted successfully');
          fetchServiceRequestItems(currentPage, entriesPerPage, searchTerm);
        })
        .catch(error => {
          console.error("Error deleting service request item:", error);
          alert("Failed to delete service request item. Please try again.");
        });
    }
  };

  if (loading) return <div className="text-center my-4">Loading service request items...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  // Calculate index for display
  const indexOfFirstEntry = (currentPage - 1) * entriesPerPage;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap">
        <div>
          <h2 className="customer-title mb-0">Service Request Items History</h2>
          <p className="customer-subtitle mb-0 text-muted">
            {selectedCompany ? `Showing service request items for ${selectedCompany}` : 'Showing all service request items'}
          </p>
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          Show
          <select
            value={entriesPerPage}
            onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
            className="form-select form-select-sm w-auto"
          >
            <option value={5}>5</option>
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
            placeholder="Search in all columns..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ minWidth: '250px' }}
          />
          {searchTerm && (
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleSearchChange('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="alert alert-info mb-3">
          <strong>Search Results:</strong> Found {totalCount} item(s) matching "{searchTerm}"
        </div>
      )}

      <div className="table-responsive mb-4">
        <table className="table">
          <thead className="new-customer-table-header">
            <tr>
              <th>S.No</th>
              <th>SR Item ID</th>
              <th>Service Request</th>
              <th>Service Item</th>
              <th>Customer</th>
              <th>Component Type</th>
              <th>Component</th>
              <th>Task Type</th>
              <th>Old Serial No</th>
              <th>New Serial No</th>
              <th>Warranty Start</th>
              <th>Warranty End</th>
              <th>Action Taken</th>
              <th>Serviced By</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <tr>
                <td colSpan="15" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 mb-0 text-muted">Loading service request items...</p>
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.sr_item_id || index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{item.sr_item_id}</td>
                  <td>{item.service_request}</td>
                  <td>
                    {(() => {
                      const serviceItem = getServiceItem(item.service_request);
                      return serviceItem && serviceItem !== '-' ? (
                        <button
                          className="btn btn-link p-0 text-primary text-decoration-underline"
                          onClick={() =>
                            navigate(`/servicemanager/service-item-details/${serviceItem}`)
                          }
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: 'inherit'
                          }}
                          title={`View Service Item: ${serviceItem}`}
                        >
                          {serviceItem}
                        </button>
                      ) : (
                        '-'
                      );
                    })()}
                  </td>
                  <td>
                    {(() => {
                      const customerId = getCustomer(item.service_request);
                      return customerId && customerId !== '-' ? (
                        <button
                          className="btn btn-link p-0 text-primary text-decoration-underline"
                          onClick={() => navigate(`/servicemanager/customers/${customerId}`)}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: 'inherit'
                          }}
                          title={`View Customer: ${customerId}`}
                        >
                          {customerId}
                        </button>
                      ) : (
                        '-'
                      );
                    })()}
                  </td>
                  <td>{item.component_type}</td>
                  <td>{getComponentName(item.component)}</td>
                  <td>{item.task_type}</td>
                  <td>{item.old_comp_serial_no || '-'}</td>
                  <td>{item.new_comp_serial_no || '-'}</td>
                  <td>{formatDate(item.warranty_start_date)}</td>
                  <td>{formatDate(item.warranty_end_date)}</td>
                  <td>{item.action_taken || '-'}</td>
                  <td>{getUsernameById(item.serviced_by)}</td>
                  <td>{formatDateTime(item.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="text-center py-4">
                  <div className="text-muted">
                    <p className="mb-0">
                      {searchTerm 
                        ? `No service request items found matching "${searchTerm}"`
                        : selectedCompany 
                          ? `No service request items found for ${selectedCompany}`
                          : 'No service request items found'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {(totalPages > 1 || hasNextPage || currentPage > 1) && (
        <nav aria-label="Page navigation">
          <div
            style={{
              overflowX: totalPages > 10 ? "auto" : "visible",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            <ul className="pagination justify-content-center flex-nowrap">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ));
              })()}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </nav>
      )}
      
      {/* Total count display */}
      {totalCount > 0 && (
        <div className="text-center text-muted mt-2">
          <small>Showing {items.length} of {totalCount} service request items</small>
        </div>
      )}
    </>
  );
};

export default ServiceRequestItemsTable;