// import React, { useState, useEffect, useContext } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import baseURL from '../ApiUrl/Apiurl';
// import Swal from 'sweetalert2';
// import "./ServiceItemComponents.css";
// import { AuthContext } from '../AuthContext/AuthContext';
// import { useCompany } from '../AuthContext/CompanyContext';
// import { useNavigate, useLocation } from 'react-router-dom';

// const ServiceItemComponentsTable = () => { 
//   const [components, setComponents] = useState([]);
//   const [serviceItemsOptions, setServiceItemsOptions] = useState([]);
//   const [componentOptions, setComponentOptions] = useState([]);
//   const { selectedCompany } = useCompany();
//   const { userId } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredComponents, setFilteredComponents] = useState([]);
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
  
//   // Get service item from navigation state
//   const serviceItemFromState = location.state?.service_item;

//   // Initial fetches
//   useEffect(() => {
//     fetchComponents();
//     fetchServiceItems();
//     fetchComponentOptions();
//   }, [userId, selectedCompany]);

//   const fetchComponents = () => {
//     fetch(`${baseURL}/service-item-components/?user_id=${userId}&company_id=${selectedCompany}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.data) {
//           let filteredData = data.data;
          
//           // Filter by service item if provided in state
//           if (serviceItemFromState) {
//             filteredData = data.data.filter(comp => 
//               comp.service_item === serviceItemFromState
//             );
//           }
          
//           setComponents(filteredData);
//         }
//       })
//       .catch(console.error);
//   };

//   const fetchServiceItems = () => {
//     fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${selectedCompany}`)
//       .then((res) => res.json())
//       .then((data) => data.data && setServiceItemsOptions(data.data))
//       .catch(console.error);
//   };

//   const fetchComponentOptions = () => {
//     fetch(`${baseURL}/components/`)
//       .then((res) => res.json())
//       .then((data) => data.data && setComponentOptions(data.data))
//       .catch(console.error);
//   };

//   // Filtering effect
//   useEffect(() => {
//     const filtered = components.filter((comp) =>
//       Object.values(comp).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredComponents(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, components]);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentComponents = filteredComponents.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredComponents.length / entriesPerPage);

//   const startEdit = (comp) => {
//     navigate('/servicemanager/service-item-components/edit', {
//       state: {
//         service_component_id: comp.service_component_id,
//         service_item_id: comp.service_item,
//         component_id: comp.component,
//         component_serial_number: comp.component_serial_number,
//         warranty_start_date: comp.warranty_start_date,
//         warranty_end_date: comp.warranty_end_date,
//         vendor_id: comp.vendor_id || "",
//       }
//     });
//   };

//   const deleteComponent = async (id) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const res = await fetch(`${baseURL}/service-item-components/${id}/`, { 
//             method: "DELETE" 
//           });
          
//           if (!res.ok) throw new Error(await res.text());
          
//           setComponents((prev) => prev.filter((c) => c.service_component_id !== id));
          
//           Swal.fire({
//             icon: 'success',
//             title: 'Deleted!',
//             text: 'The component has been deleted.',
//             confirmButtonColor: '#3085d6',
//           });
//         } catch (err) {
//           console.error(err);
//           Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Delete failed',
//             confirmButtonColor: '#d33',
//           });
//         }
//       }
//     });
//   };

//   const handleAddNew = () => {
//     navigate('/servicemanager/service-item-components/add', {
//       state: {
//         service_item: serviceItemFromState // Pass service item if available
//       }
//     });
//   };

//   // Add this date formatting function
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Invalid date';
      
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
      
//       return `${day}/${month}/${year}`;
//     } catch (e) {
//       return 'Invalid date';
//     }
//   };

//   // Function to get service item display name
//   const getServiceItemDisplay = (serviceItemId) => {
//     const serviceItem = serviceItemsOptions.find(item => item.service_item_id === serviceItemId);
//     return serviceItem ? `${serviceItem.service_item_id}` : serviceItemId;
//   };

//   // Function to get component display name
// const getComponentDisplay = (componentId) => {
//   const component = componentOptions.find(comp => comp.component_id === componentId);
//   return component ? component.component_name : componentId;
// };


//   return (
//     <div className="svc-form-wrapper shadow-sm">
//       <div className="svc-header mb-4 d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <div>
//           <h2 className="svc-title">Service Item Components</h2>
//           <p className="svc-subtitle">
//             {serviceItemFromState 
//               ? `Components for Service Item: ${serviceItemFromState}`
//               : 'Manage service item components'
//             }
//           </p>
//         </div>
//         <button onClick={handleAddNew} className="btn btn-primary svc-btn-save">
//           Add Component
//         </button>
//       </div>

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
//           </select>
//           entries
//         </div>
//         <div className="d-flex gap-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search components..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="table-responsive mb-4">
//         <table className="table">
//           <thead className="service-component-table-header">
//             <tr>
//               <th>S.No</th>
//               <th>ID</th>
//               <th>Service Item</th>
//               <th>Component Name</th>
//               <th>Serial Number</th>
//               <th>Warranty Start</th>
//               <th>Warranty End</th>
//               <th>Vendor</th>
//               <th>Created By</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentComponents.length > 0 ? (
//               currentComponents.map((comp, idx) => (
//                 <tr key={comp.service_component_id}>
//                   <td>{indexOfFirstEntry + idx + 1}</td>
//                   <td>{comp.service_component_id}</td>
//                   <td>{getServiceItemDisplay(comp.service_item)}</td>
//                   <td>{getComponentDisplay(comp.component)}</td>
//                   <td>{comp.component_serial_number}</td>
//                   <td>{formatDate(comp.warranty_start_date)}</td>
//                   <td>{formatDate(comp.warranty_end_date)}</td>
//                   <td>{comp.vendor_id || "-"}</td>
//                   <td>{comp.created_by}</td>
//                   <td>
//                     <FaEdit
//                       style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
//                       onClick={() => startEdit(comp)}
//                     />
//                     <FaTrash
//                       style={{ cursor: 'pointer', color: 'red' }}
//                       onClick={() => deleteComponent(comp.service_component_id)}
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="10" className="text-center">
//                   {serviceItemFromState 
//                     ? `No components found for service item: ${serviceItemFromState}`
//                     : 'No components found.'
//                   }
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <nav>
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${currentPage === 1 && "disabled"}`}>
//               <button className="page-link" onClick={() => setCurrentPage((p) => p - 1)}>
//                 Previous
//               </button>
//             </li>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <li key={page} className={`page-item ${currentPage === page && "active"}`}>
//                 <button className="page-link" onClick={() => setCurrentPage(page)}>
//                   {page}
//                 </button>
//               </li>
//             ))}
//             <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
//               <button className="page-link" onClick={() => setCurrentPage((p) => p + 1)}>
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       )}
//     </div>
//   );
// };

// export default ServiceItemComponentsTable;


// import React, { useState, useEffect, useContext } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import baseURL from '../ApiUrl/Apiurl';
// import Swal from 'sweetalert2';
// import "./ServiceItemComponents.css";
// import { AuthContext } from '../AuthContext/AuthContext';
// import { useCompany } from '../AuthContext/CompanyContext';
// import { useNavigate, useLocation } from 'react-router-dom';

// const ServiceItemComponentsTable = () => { 
//   const [components, setComponents] = useState([]);
//   const [serviceItemsOptions, setServiceItemsOptions] = useState([]);
//   const [componentOptions, setComponentOptions] = useState([]);
//   const { selectedCompany } = useCompany();
//   const { userId } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredComponents, setFilteredComponents] = useState([]);
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
  
//   // Get service item from navigation state
//   const serviceItemFromState = location.state?.service_item;

//   // Initial fetches
//   useEffect(() => {
//     fetchComponents();
//     fetchServiceItems();
//     fetchComponentOptions();
//   }, [userId, selectedCompany]);

//   const fetchComponents = () => {
//     fetch(`${baseURL}/service-item-components/?user_id=${userId}&company_id=${selectedCompany}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.data) {
//           let filteredData = data.data;
          
//           // Filter by service item if provided in state
//           if (serviceItemFromState) {
//             filteredData = data.data.filter(comp => 
//               comp.service_item === serviceItemFromState
//             );
//           }
          
//           setComponents(filteredData);
//         }
//       })
//       .catch(console.error);
//   };

//   const fetchServiceItems = () => {
//     fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${selectedCompany}`)
//       .then((res) => res.json())
//       .then((data) => data.data && setServiceItemsOptions(data.data))
//       .catch(console.error);
//   };

//   const fetchComponentOptions = () => {
//     fetch(`${baseURL}/components/`)
//       .then((res) => res.json())
//       .then((data) => data.data && setComponentOptions(data.data))
//       .catch(console.error);
//   };

//   // Filtering effect
//   useEffect(() => {
//     const filtered = components.filter((comp) =>
//       Object.values(comp).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredComponents(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, components]);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentComponents = filteredComponents.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredComponents.length / entriesPerPage);

//   const startEdit = (comp) => {
//     navigate('/servicemanager/service-item-components/edit', {
//       state: {
//         service_component_id: comp.service_component_id,
//         service_item_id: comp.service_item,
//         component_id: comp.component,
//         component_serial_number: comp.component_serial_number,
//         warranty_start_date: comp.warranty_start_date,
//         warranty_end_date: comp.warranty_end_date,
//         vendor_id: comp.vendor_id || "",
//       }
//     });
//   };

//   // Handle Service Item click - navigate to service item details page
//   const handleServiceItemClick = (serviceItemId) => {
//     navigate(`/servicemanager/service-item-details/${serviceItemId}`, {
//       state: {
//         serviceItemId: serviceItemId,
//         companyId: selectedCompany
//       }
//     });
//   };

//   const deleteComponent = async (id) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: "You won't be able to revert this!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const res = await fetch(`${baseURL}/service-item-components/${id}/`, { 
//             method: "DELETE" 
//           });
          
//           if (!res.ok) throw new Error(await res.text());
          
//           setComponents((prev) => prev.filter((c) => c.service_component_id !== id));
          
//           Swal.fire({
//             icon: 'success',
//             title: 'Deleted!',
//             text: 'The component has been deleted.',
//             confirmButtonColor: '#3085d6',
//           });
//         } catch (err) {
//           console.error(err);
//           Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Delete failed',
//             confirmButtonColor: '#d33',
//           });
//         }
//       }
//     });
//   };

//   const handleAddNew = () => {
//     navigate('/servicemanager/service-item-components/add', {
//       state: {
//         service_item: serviceItemFromState // Pass service item if available
//       }
//     });
//   };

//   // Add this date formatting function
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Invalid date';
      
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
      
//       return `${day}/${month}/${year}`;
//     } catch (e) {
//       return 'Invalid date';
//     }
//   };

//   // Function to get service item display name
//   const getServiceItemDisplay = (serviceItemId) => {
//     const serviceItem = serviceItemsOptions.find(item => item.service_item_id === serviceItemId);
//     return serviceItem ? `${serviceItem.service_item_id}` : serviceItemId;
//   };

//   // Function to get component display name
//   const getComponentDisplay = (componentId) => {
//     const component = componentOptions.find(comp => comp.component_id === componentId);
//     return component ? component.component_name : componentId;
//   };

//   return (
//     <div className="svc-form-wrapper shadow-sm">
//       <div className="svc-header mb-4 d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <div>
//           <h2 className="svc-title">Service Item Components</h2>
//           <p className="svc-subtitle">
//             {serviceItemFromState 
//               ? `Components for Service Item: ${serviceItemFromState}`
//               : 'Manage service item components'
//             }
//           </p>
//         </div>
//         <button onClick={handleAddNew} className="btn btn-primary svc-btn-save">
//           Add Component
//         </button>
//       </div>

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
//           </select>
//           entries
//         </div>
//         <div className="d-flex gap-2">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search components..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="table-responsive mb-4">
//         <table className="table">
//           <thead className="service-component-table-header">
//             <tr>
//               <th>S.No</th>
//               <th>ID</th>
//               <th>Service Item</th>
//               <th>Component Name</th>
//               <th>Serial Number</th>
//               <th>Warranty Start</th>
//               <th>Warranty End</th>
//               <th>Vendor</th>
//               <th>Created By</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentComponents.length > 0 ? (
//               currentComponents.map((comp, idx) => (
//                 <tr key={comp.service_component_id}>
//                   <td>{indexOfFirstEntry + idx + 1}</td>
//                   <td>{comp.service_component_id}</td>
//                   <td>
//                     <button 
//                       className="btn btn-link p-0 text-primary text-decoration-underline"
//                       onClick={() => handleServiceItemClick(comp.service_item)}
//                       style={{
//                         color: '#0d6efd',
//                         textDecoration: 'underline',
//                         border: 'none',
//                         background: 'none',
//                         cursor: 'pointer',
//                         fontSize: 'inherit'
//                       }}
//                       title={`View Service Item Details: ${comp.service_item}`}
//                     >
//                       {getServiceItemDisplay(comp.service_item)}
//                     </button>
//                   </td>
//                   <td>{getComponentDisplay(comp.component)}</td>
//                   <td>{comp.component_serial_number}</td>
//                   <td>{formatDate(comp.warranty_start_date)}</td>
//                   <td>{formatDate(comp.warranty_end_date)}</td>
//                   <td>{comp.vendor_id || "-"}</td>
//                   <td>{comp.created_by}</td>
//                   <td>
//                     <FaEdit
//                       style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
//                       onClick={() => startEdit(comp)}
//                       title="Edit Component"
//                     />
//                     <FaTrash
//                       style={{ cursor: 'pointer', color: 'red' }}
//                       onClick={() => deleteComponent(comp.service_component_id)}
//                       title="Delete Component"
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="10" className="text-center">
//                   {serviceItemFromState 
//                     ? `No components found for service item: ${serviceItemFromState}`
//                     : 'No components found.'
//                   }
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <nav>
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${currentPage === 1 && "disabled"}`}>
//               <button 
//                 className="page-link" 
//                 onClick={() => setCurrentPage((p) => p - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//             </li>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <li key={page} className={`page-item ${currentPage === page && "active"}`}>
//                 <button className="page-link" onClick={() => setCurrentPage(page)}>
//                   {page}
//                 </button>
//               </li>
//             ))}
//             <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
//               <button 
//                 className="page-link" 
//                 onClick={() => setCurrentPage((p) => p + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       )}
//     </div>
//   );
// };

// export default ServiceItemComponentsTable;

//===============================================================
// After fixing filter -Global search issue 


import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import baseURL from '../ApiUrl/Apiurl';
import Swal from 'sweetalert2';
import "./ServiceItemComponents.css";
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ServiceItemComponentsTable = () => { 
  const [components, setComponents] = useState([]);
  const [serviceItemsOptions, setServiceItemsOptions] = useState([]);
  const [componentOptions, setComponentOptions] = useState([]);
  const [vendorsData, setVendorsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get service item from navigation state
  const serviceItemFromState = location.state?.service_item;

  // Fetch users data for created_by search
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${baseURL}/users/`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsersData(data);
        }
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch vendors data
  const fetchVendors = async () => {
    try {
      const response = await fetch(`${baseURL}/vendors/`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setVendorsData(data.data || []);
        }
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  // Initial fetches
  useEffect(() => {
    fetchAllData();
  }, [userId, selectedCompany]);

  const fetchAllData = async () => {
    try {
      await fetchUsers();
      await fetchVendors();
      await fetchComponents();
      await fetchServiceItems();
      await fetchComponentOptions();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchComponents = () => {
    fetch(`${baseURL}/service-item-components/?user_id=${userId}&company_id=${selectedCompany}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          let filteredData = data.data;
          
          // Filter by service item if provided in state
          if (serviceItemFromState) {
            filteredData = data.data.filter(comp => 
              comp.service_item === serviceItemFromState
            );
          }
          
          setComponents(filteredData);
        }
      })
      .catch(console.error);
  };

  const fetchServiceItems = () => {
    fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${selectedCompany}`)
      .then((res) => res.json())
      .then((data) => data.data && setServiceItemsOptions(data.data))
      .catch(console.error);
  };

  const fetchComponentOptions = () => {
    fetch(`${baseURL}/components/`)
      .then((res) => res.json())
      .then((data) => data.data && setComponentOptions(data.data))
      .catch(console.error);
  };

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

  // Function to get vendor name by vendor ID
  const getVendorName = (vendorId) => {
    if (!vendorId || vendorsData.length === 0) return vendorId;
    
    const vendor = vendorsData.find(vendor => vendor.vendor_id === vendorId);
    return vendor ? vendor.vendor_name : vendorId;
  };

  // Function to get vendor search data (both ID and name)
  const getVendorSearchData = (vendorId) => {
    if (!vendorId) return '';
    const vendor = vendorsData.find(vendor => vendor.vendor_id === vendorId);
    return vendor ? `${vendorId} ${vendor.vendor_name}` : vendorId;
  };

  // Function to get service item display name
  const getServiceItemDisplay = (serviceItemId) => {
    const serviceItem = serviceItemsOptions.find(item => item.service_item_id === serviceItemId);
    return serviceItem ? `${serviceItem.service_item_id}` : serviceItemId;
  };

  // Function to get service item search data
  const getServiceItemSearchData = (serviceItemId) => {
    if (!serviceItemId) return '';
    const serviceItem = serviceItemsOptions.find(item => item.service_item_id === serviceItemId);
    if (!serviceItem) return serviceItemId;
    
    return [
      serviceItemId,
      serviceItem.serial_number || '',
      serviceItem.service_item_name || '',
      serviceItem.pcb_serial_number || '',
      serviceItem.location || '',
      serviceItem.product_description || '',
    ].filter(Boolean).join(' ');
  };

  // Function to get component display name
  const getComponentDisplay = (componentId) => {
    const component = componentOptions.find(comp => comp.component_id === componentId);
    return component ? component.component_name : componentId;
  };

  // Function to get component search data (both ID and name)
  const getComponentSearchData = (componentId) => {
    if (!componentId) return '';
    const component = componentOptions.find(comp => comp.component_id === componentId);
    return component ? `${componentId} ${component.component_name} ${component.description || ''}` : componentId;
  };

  // Function to format date as dd/mm/yyyy
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

  // Function to format date-time for detailed timestamps
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      return 'Invalid date';
    }
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
    
    return [
      `${day}/${month}/${year}`,                    // DD/MM/YYYY
      `${month}/${day}/${year}`,                    // MM/DD/YYYY
      `${year}-${month}-${day}`,                    // YYYY-MM-DD
      `${year}${month}${day}`,                      // YYYYMMDD
      `${day}-${month}-${year}`,                    // DD-MM-YYYY
      monthName,                                    // January, February
      monthShort,                                   // Jan, Feb
      `${year}`,                                    // 2024
      `${month}/${year}`,                           // MM/YYYY
      `${day} ${monthName} ${year}`,               // 15 January 2024
      `${day} ${monthShort} ${year}`,              // 15 Jan 2024
    ].join(' ');
  };

  // Enhanced global search functionality
  const enhancedFilteredComponents = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return components;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return components.filter((comp) => {
      // Get user data for search
      const createdBySearch = getUserSearchData(comp.created_by);
      const updatedBySearch = getUserSearchData(comp.updated_by);
      
      // Get other relational data for search
      const serviceItemSearch = getServiceItemSearchData(comp.service_item);
      const componentSearch = getComponentSearchData(comp.component);
      const vendorSearch = getVendorSearchData(comp.vendor_id);
      
      // Get dates in multiple formats for search
      const warrantyStartFormats = formatDateForSearch(comp.warranty_start_date);
      const warrantyEndFormats = formatDateForSearch(comp.warranty_end_date);
      const createdDateFormats = formatDateForSearch(comp.created_at);
      const updatedDateFormats = formatDateForSearch(comp.updated_at);
      
      // Create a comprehensive search string
      const searchableText = [
        // Raw component data
        comp.service_component_id || '',
        comp.component_serial_number || '',
        comp.vendor_id || '',
        comp.created_by || '',
        comp.updated_by || '',
        comp.service_item || '',
        comp.component || '',
        comp.warranty_start_date || '',
        comp.warranty_end_date || '',
        comp.created_at || '',
        comp.updated_at || '',
        
        // Formatted relational data
        createdBySearch,
        updatedBySearch,
        serviceItemSearch,
        componentSearch,
        vendorSearch,
        
        // Dates in multiple formats
        warrantyStartFormats,
        warrantyEndFormats,
        createdDateFormats,
        updatedDateFormats,
        
        // Display values (exactly as shown in table)
        formatDate(comp.warranty_start_date),
        formatDate(comp.warranty_end_date),
        formatDateTime(comp.created_at),
        formatDateTime(comp.updated_at),
        getUsernameById(comp.created_by),
        getUsernameById(comp.updated_by),
        getServiceItemDisplay(comp.service_item),
        getComponentDisplay(comp.component),
        getVendorName(comp.vendor_id),
        
        // Status variations for search (if any status field exists)
        comp.status === 'Active' ? 'active working operational' : '',
        comp.status === 'Inactive' ? 'inactive disabled stopped' : '',
        
        // Vendor variations
        comp.vendor_id ? `vendor ${getVendorName(comp.vendor_id)}` : '',
        
        // Component variations
        getComponentDisplay(comp.component) ? `component ${getComponentDisplay(comp.component)}` : '',
        
        // Service item variations
        getServiceItemDisplay(comp.service_item) ? `service item ${getServiceItemDisplay(comp.service_item)}` : '',
        
        // Serial number variations
        comp.component_serial_number ? `serial number ${comp.component_serial_number}` : '',
        
        // Add any other properties that might exist
        ...Object.values(comp).filter(val => 
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
  }, [searchTerm, components, usersData, vendorsData, serviceItemsOptions, componentOptions]);

  // Update filteredComponents based on search
  useEffect(() => {
    setFilteredComponents(enhancedFilteredComponents);
    setCurrentPage(1);
  }, [enhancedFilteredComponents]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentComponents = filteredComponents.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredComponents.length / entriesPerPage);

  const startEdit = (comp) => {
    navigate('/servicemanager/service-item-components/edit', {
      state: {
        service_component_id: comp.service_component_id,
        service_item_id: comp.service_item,
        component_id: comp.component,
        component_serial_number: comp.component_serial_number,
        warranty_start_date: comp.warranty_start_date,
        warranty_end_date: comp.warranty_end_date,
        vendor_id: comp.vendor_id || "",
      }
    });
  };

  // Handle Service Item click - navigate to service item details page
  const handleServiceItemClick = (serviceItemId) => {
    navigate(`/servicemanager/service-item-details/${serviceItemId}`, {
      state: {
        serviceItemId: serviceItemId,
        companyId: selectedCompany
      }
    });
  };

  const deleteComponent = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${baseURL}/service-item-components/${id}/`, { 
            method: "DELETE" 
          });
          
          if (!res.ok) throw new Error(await res.text());
          
          setComponents((prev) => prev.filter((c) => c.service_component_id !== id));
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The component has been deleted.',
            confirmButtonColor: '#3085d6',
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Delete failed',
            confirmButtonColor: '#d33',
          });
        }
      }
    });
  };

  const handleAddNew = () => {
    navigate('/servicemanager/service-item-components/add', {
      state: {
        service_item: serviceItemFromState // Pass service item if available
      }
    });
  };

  return (
    <div className="svc-form-wrapper shadow-sm">
      <div className="svc-header mb-4 d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div>
          <h2 className="svc-title">Service Item Components</h2>
          <p className="svc-subtitle">
            {serviceItemFromState 
              ? `Components for Service Item: ${serviceItemFromState}`
              : 'Manage service item components'
            }
          </p>
        </div>
        <button onClick={handleAddNew} className="btn btn-primary svc-btn-save">
          Add Component
        </button>
      </div>

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

      {/* Search Results Info */}
      {searchTerm && (
        <div className="alert alert-info mb-3">
          <strong>Search Results:</strong> Found {filteredComponents.length} component(s) matching "{searchTerm}"
        </div>
      )}

      <div className="table-responsive mb-4">
        <table className="table">
          <thead className="service-component-table-header">
            <tr>
              <th>S.No</th>
              <th>ID</th>
              <th>Service Item</th>
              <th>Component Name</th>
              <th>Serial Number</th>
              <th>Warranty Start</th>
              <th>Warranty End</th>
              <th>Vendor</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentComponents.length > 0 ? (
              currentComponents.map((comp, idx) => (
                <tr key={comp.service_component_id}>
                  <td>{indexOfFirstEntry + idx + 1}</td>
                  <td>{comp.service_component_id}</td>
                  <td>
                    <button 
                      className="btn btn-link p-0 text-primary text-decoration-underline"
                      onClick={() => handleServiceItemClick(comp.service_item)}
                      style={{
                        color: '#0d6efd',
                        textDecoration: 'underline',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: 'inherit'
                      }}
                      title={`View Service Item Details: ${comp.service_item}`}
                    >
                      {getServiceItemDisplay(comp.service_item)}
                    </button>
                  </td>
                  <td title={`ID: ${comp.component}`}>
                    {getComponentDisplay(comp.component)}
                  </td>
                  <td>{comp.component_serial_number}</td>
                  <td>{formatDate(comp.warranty_start_date)}</td>
                  <td>{formatDate(comp.warranty_end_date)}</td>
                  <td title={`ID: ${comp.vendor_id}`}>
                    {getVendorName(comp.vendor_id) || "-"}
                  </td>
                  <td title={`ID: ${comp.created_by}`}>
                    {getUsernameById(comp.created_by)}
                  </td>
                  <td>
                    <FaEdit
                      style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
                      onClick={() => startEdit(comp)}
                      title="Edit Component"
                    />
                    <FaTrash
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() => deleteComponent(comp.service_component_id)}
                      title="Delete Component"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  {searchTerm 
                    ? `No components found matching "${searchTerm}"`
                    : serviceItemFromState 
                      ? `No components found for service item: ${serviceItemFromState}`
                      : 'No components found.'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page && "active"}`}>
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
              <button 
                className="page-link" 
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ServiceItemComponentsTable;