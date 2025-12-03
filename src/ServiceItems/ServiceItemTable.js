// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './NewServiceItem.css';
// import { FaEdit, FaTrash, FaFileContract } from 'react-icons/fa';
// import axios from 'axios';
// import baseURL from '../ApiUrl/Apiurl';

// const ServiceItemTable = ({ serviceItems, onAddNew, onEdit, onDelete, selectedCompany, userId, refreshContracts }) => { 
//   const [filteredItems, setFilteredItems] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();
//   const [contractData, setContractData] = useState([]);

//   const fetchContracts = async () => {
//     try {
//       const response = await axios.get(
//         `${baseURL}/service-contracts/`,
//         {
//           params: {
//             user_id: userId,
//             company_id: selectedCompany,
//           },
//         }
//       );

//       console.log("Contract response:", response.data);

//       const contracts = Array.isArray(response.data.data)
//         ? response.data.data
//         : [];

//       setContractData(contracts);
//     } catch (error) {
//       console.error("Failed to fetch contracts", error);
//       setContractData([]); // fallback to empty array
//     }
//   };

//   useEffect(() => {
//     fetchContracts();
//   }, [userId, selectedCompany, refreshContracts]);

//   // Function to get the latest contract for a service item
//   const getLatestContract = (serviceItemId) => {
//     if (!Array.isArray(contractData)) return null;
    
//     // Filter contracts for this service item
//     const serviceItemContracts = contractData.filter(
//       contract => contract.service_item === serviceItemId
//     );
    
//     if (serviceItemContracts.length === 0) return null;
    
//     // Sort by creation date to get the latest contract
//     const sortedContracts = serviceItemContracts.sort(
//       (a, b) => new Date(b.created_at || b.contract_create_date) - new Date(a.created_at || a.contract_create_date)
//     );
    
//     return sortedContracts[0];
//   };

//   const isContractButtonDisabled = (serviceItemId) => {
//     const latestContract = getLatestContract(serviceItemId);
    
//     // If no contract exists, button should be enabled
//     if (!latestContract) return false;
    
//     // If latest contract has is_alert_sent: false, button should be disabled
//     return latestContract.is_alert_sent === false;
//   };

//   const shouldShowRenewalButton = (serviceItemId) => {
//     const latestContract = getLatestContract(serviceItemId);
    
//     // If no contract exists, don't show renewal button
//     if (!latestContract) return false;
    
//     // Show renewal button only if is_alert_sent is true
//     return latestContract.is_alert_sent === true;
//   };

//   // Function to format date as dd/mm/yyyy
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Never';
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
 
//   useEffect(() => {
//     if (serviceItems) {
//       let filteredByCompany = serviceItems;
//       if (selectedCompany) {
//         filteredByCompany = serviceItems.filter(item => 
//           item.company === selectedCompany
//         );
//       }
      
//       const sortedData = [...filteredByCompany].sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//       );
//       setFilteredItems(sortedData);
//       setLoading(false);
//     }
//   }, [serviceItems, selectedCompany]);

//   useEffect(() => {
//     let results = serviceItems;
    
//     if (searchTerm) {
//       results = results.filter(item =>
//         Object.values(item)
//           .join(' ')
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     }
    
//     setFilteredItems(results);
//     setCurrentPage(1);
//   }, [searchTerm, serviceItems]); 

//   const handleContractClick = (item) => {
//     navigate('/servicemanager/service-contract', {
//       state: {
//         service_item_id: item.service_item_id,
//         customer: item.customer,
//         company: item.company
//       }
//     });
//   };

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentItems = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

//   const handleRenewalClick = (item) => {
//     // Find the latest contract for this service item
//     const latestContract = getLatestContract(item.service_item_id);
    
//     navigate('/servicemanager/service-renewal', {
//       state: {
//         service_item_id: item.service_item_id,
//         customer: item.customer,
//         company: item.company,
//         existing_contract: latestContract // Pass only serializable data
//       }
//     });
//   };

//   return (
//     <div className="service-item-container">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center flex-wrap">
//         <div>
//           <h2 className="service-item-title mb-0">Service Items</h2>
//           <p className="service-item-subtitle mb-0 text-muted">
//             {selectedCompany 
//               ? `Showing service items for ${selectedCompany}`
//               : 'Showing all service items'}
//           </p>
//           <p className="service-item-subtitle text-muted mb-0">Manage service items</p>
//         </div>
//         <button
//           onClick={onAddNew}
//           className="btn btn-primary service-item-btn service-item-save"
//         >
//           Add New Service Item
//         </button>
//       </div>

//       {/* Controls */}
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
//           placeholder="Search service items..."
//           className="form-control w-auto"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p>Loading service items...</p>
//       ) : filteredItems.length === 0 ? (
//         <div className="alert alert-info">No service items found.</div>
//       ) : (
//         <div className="table-responsive mb-4">
//           <table className="table">
//             <thead className="service-item-table-header">
//               <tr>
//                 <th>S.No</th>
//                 <th>Service Item ID</th>
//                 <th>Company</th>
//                 <th>Customer</th>
//                 <th>PM Group</th>
//                 <th>Product</th>
//                 <th>Location</th>
//                 <th>Latitude</th>
//                 <th>Longitude</th>
//                 <th>Installation Date</th>
//                 <th>Warranty End</th>
//                 <th>Status</th>
//                 <th>IoT Status</th>
//                 <th>Last Service</th>
//                 <th>Description</th>
//                 <th>Actions</th>
//                 <th>Contract</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length > 0 ? (
//                 currentItems.map((item, index) => (
//                   <tr key={item.service_item_id}>
//                     <td>{indexOfFirstEntry + index + 1}</td>
//                     <td>{item.service_item_id}</td>
//                     <td>{item.company}</td>
//                     <td>{item.customer}</td>
//                     <td>{item.pm_group}</td>
//                     <td>{item.product}</td>
//                     <td>{item.location}</td>
//                     <td>{item.location_latitude}</td>
//                     <td>{item.location_longitude}</td>
//                     <td>{formatDate(item.installation_date)}</td>
//                     <td>{formatDate(item.warranty_end_date)}</td>
//                     <td>
//                       <span className={`badge ${
//                         item.status === 'Active' ? 'bg-success' :
//                         item.status === 'Service Due' ? 'bg-warning text-dark' :
//                         'bg-secondary'
//                       }`}>
//                         {item.status}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={`badge ${
//                         item.iot_status === 'Online' ? 'bg-success' : 'bg-danger'
//                       }`}>
//                         {item.iot_status}
//                       </span>
//                     </td>
//                     <td>{formatDate(item.last_service)}</td>
//                     <td>{item.product_description || 'N/A'}</td>
//                     <td>
//                       <div className="d-flex gap-2">
//                         <FaEdit
//                           style={{ cursor: 'pointer', color: 'blue' }}
//                           onClick={() => onEdit(item)}
//                         />
//                         <FaTrash
//                           style={{ cursor: 'pointer', color: 'red' }}
//                           onClick={() => onDelete(item.service_item_id)}
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       {shouldShowRenewalButton(item.service_item_id) ? (
//                         <button
//                           className="btn btn-sm btn-warning"
//                           onClick={() => handleRenewalClick(item)}
//                         >
//                           Renewal
//                         </button>
//                       ) : (
//                         <button
//                           className="btn btn-sm btn-primary"
//                           disabled={isContractButtonDisabled(item.service_item_id)}
//                           onClick={() => handleContractClick(item)}
//                         >
//                           Contract
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="17" className="text-center">No service items found.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {totalPages > 1 && (
//         <nav aria-label="Page navigation">
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage - 1)}
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

// export default ServiceItemTable;



// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './NewServiceItem.css';
// import { FaEdit, FaTrash, FaFileContract } from 'react-icons/fa';
// import axios from 'axios';
// import baseURL from '../ApiUrl/Apiurl';

// const ServiceItemTable = ({ serviceItems, onAddNew, onEdit, onDelete, selectedCompany, userId, refreshContracts }) => { 
//   const [filteredItems, setFilteredItems] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();
//   const [contractData, setContractData] = useState([]);
//   const [companiesData, setCompaniesData] = useState([]);

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

//   // Function to get company display name in compact format: "COMP1 (TCS)"
// const getCompanyDisplayName = (companyId) => {
//   if (!companiesData || companiesData.length === 0) return companyId;
  
//   const company = companiesData.find(comp => comp.company_id === companyId);
//   if (company) {
//     return `${company.company_name} (${company.company_id})`;
//   }
//   return companyId;
// };

//   const fetchContracts = async () => {
//     try {
//       const response = await axios.get(
//         `${baseURL}/service-contracts/`,
//         {
//           params: {
//             user_id: userId,
//             company_id: selectedCompany,
//           },
//         }
//       );

//       console.log("Contract response:", response.data);

//       const contracts = Array.isArray(response.data.data)
//         ? response.data.data
//         : [];

//       setContractData(contracts);
//     } catch (error) {
//       console.error("Failed to fetch contracts", error);
//       setContractData([]); // fallback to empty array
//     }
//   };

//   useEffect(() => {
//     // Fetch companies first, then contracts
//     fetchCompanies().then(() => {
//       fetchContracts();
//     });
//   }, [userId, selectedCompany, refreshContracts]);

//   // Function to get the latest contract for a service item
//   const getLatestContract = (serviceItemId) => {
//     if (!Array.isArray(contractData)) return null;
    
//     // Filter contracts for this service item
//     const serviceItemContracts = contractData.filter(
//       contract => contract.service_item === serviceItemId
//     );
    
//     if (serviceItemContracts.length === 0) return null;
    
//     // Sort by creation date to get the latest contract
//     const sortedContracts = serviceItemContracts.sort(
//       (a, b) => new Date(b.created_at || b.contract_create_date) - new Date(a.created_at || a.contract_create_date)
//     );
    
//     return sortedContracts[0];
//   };

//   const isContractButtonDisabled = (serviceItemId) => {
//     const latestContract = getLatestContract(serviceItemId);
    
//     // If no contract exists, button should be enabled
//     if (!latestContract) return false;
    
//     // If latest contract has is_alert_sent: false, button should be disabled
//     return latestContract.is_alert_sent === false;
//   };

//   const shouldShowRenewalButton = (serviceItemId) => {
//     const latestContract = getLatestContract(serviceItemId);
    
//     // If no contract exists, don't show renewal button
//     if (!latestContract) return false;
    
//     // Show renewal button only if is_alert_sent is true
//     return latestContract.is_alert_sent === true;
//   };

//   // Function to format date as dd/mm/yyyy
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Never';
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
 
//   useEffect(() => {
//     if (serviceItems) {
//       let filteredByCompany = serviceItems;
//       if (selectedCompany) {
//         filteredByCompany = serviceItems.filter(item => 
//           item.company === selectedCompany
//         );
//       }
      
//       const sortedData = [...filteredByCompany].sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//       );
//       setFilteredItems(sortedData);
//       setLoading(false);
//     }
//   }, [serviceItems, selectedCompany]);

//   useEffect(() => {
//     let results = serviceItems;
    
//     if (searchTerm) {
//       results = results.filter(item =>
//         Object.values(item)
//           .join(' ')
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     }
    
//     setFilteredItems(results);
//     setCurrentPage(1);
//   }, [searchTerm, serviceItems]); 

//   const handleContractClick = (item) => {
//     navigate('/servicemanager/service-contract', {
//       state: {
//         service_item_id: item.service_item_id,
//         customer: item.customer,
//         company: item.company
//       }
//     });
//   };

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentItems = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

//   const handleRenewalClick = (item) => {
//     // Find the latest contract for this service item
//     const latestContract = getLatestContract(item.service_item_id);
    
//     navigate('/servicemanager/service-renewal', {
//       state: {
//         service_item_id: item.service_item_id,
//         customer: item.customer,
//         company: item.company,
//         existing_contract: latestContract // Pass only serializable data
//       }
//     });
//   };

//   return (
//     <div className="service-item-container">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center flex-wrap">
//         <div>
//           <h2 className="service-item-title mb-0">Service Items</h2>
//           <p className="service-item-subtitle mb-0 text-muted">
//             {selectedCompany 
//               ? `Showing service items for ${getCompanyDisplayName(selectedCompany)}`
//               : 'Showing all service items'}
//           </p>
//           <p className="service-item-subtitle text-muted mb-0">Manage service items</p>
//         </div>
//         <button
//           onClick={onAddNew}
//           className="btn btn-primary service-item-btn service-item-save"
//         >
//           Add New Service Item
//         </button>
//       </div>

//       {/* Controls */}
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
//           placeholder="Search service items..."
//           className="form-control w-auto"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p>Loading service items...</p>
//       ) : filteredItems.length === 0 ? (
//         <div className="alert alert-info">
//           {selectedCompany 
//             ? `No service items found for ${getCompanyDisplayName(selectedCompany)}`
//             : 'No service items found'}
//         </div>
//       ) : (
//         <div className="table-responsive mb-4">
//           <table className="table">
//             <thead className="service-item-table-header">
//               <tr>
//                 <th>S.No</th>
//                 <th>Service Item ID</th>
//                 <th>Company</th>
//                 <th>Customer</th>
//                 <th>PM Group</th>
//                 <th>Product</th>
//                 <th>Location</th>
//                 {/* <th>Latitude</th>
//                 <th>Longitude</th> */}
//                 <th>Installation Date</th>
//                 <th>Warranty End</th>
//                 <th>Status</th>
//                 <th>IoT Status</th>
//                 <th>Last Service</th>
//                 <th>Description</th>
//                 <th>Actions</th>
//                 <th>Contract</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length > 0 ? (
//                 currentItems.map((item, index) => (
//                   <tr key={item.service_item_id}>
//                     <td>{indexOfFirstEntry + index + 1}</td>
//                     <td>{item.service_item_id}</td>
//                     <td title={getCompanyDisplayName(item.company)}>
//                       {getCompanyDisplayName(item.company)}
//                     </td>
//                     <td>{item.customer}</td>
//                     <td>{item.pm_group}</td>
//                     <td>{item.product}</td>
//                     <td>{item.location}</td>
//                     {/* <td>{item.location_latitude}</td>
//                     <td>{item.location_longitude}</td> */}
//                     <td>{formatDate(item.installation_date)}</td>
//                     <td>{formatDate(item.warranty_end_date)}</td>
//                     <td>
//                       <span className={`badge ${
//                         item.status === 'Active' ? 'bg-success' :
//                         item.status === 'Service Due' ? 'bg-warning text-dark' :
//                         'bg-secondary'
//                       }`}>
//                         {item.status}
//                       </span>
//                     </td>
//                     <td>
//                       <span className={`badge ${
//                         item.iot_status === 'Online' ? 'bg-success' : 'bg-danger'
//                       }`}>
//                         {item.iot_status}
//                       </span>
//                     </td>
//                     <td>{formatDate(item.last_service)}</td>
//                     <td>{item.product_description || 'N/A'}</td>
//                     <td>
//                       <div className="d-flex gap-2">
//                         <FaEdit
//                           style={{ cursor: 'pointer', color: 'blue' }}
//                           onClick={() => onEdit(item)}
//                         />
//                         <FaTrash
//                           style={{ cursor: 'pointer', color: 'red' }}
//                           onClick={() => onDelete(item.service_item_id)}
//                         />
//                       </div>
//                     </td>
//                     <td>
//                       {shouldShowRenewalButton(item.service_item_id) ? (
//                         <button
//                           className="btn btn-sm btn-warning"
//                           onClick={() => handleRenewalClick(item)}
//                         >
//                           Renewal
//                         </button>
//                       ) : (
//                         <button
//                           className="btn btn-sm btn-primary"
//                           disabled={isContractButtonDisabled(item.service_item_id)}
//                           onClick={() => handleContractClick(item)}
//                         >
//                           Contract
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="17" className="text-center">
//                     {selectedCompany 
//                       ? `No service items found for ${getCompanyDisplayName(selectedCompany)}${searchTerm ? ' matching your search' : ''}`
//                       : 'No service items found'}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {totalPages > 1 && (
//         <nav aria-label="Page navigation">
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage - 1)}
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

// export default ServiceItemTable;
//========================================================




// add filters for each coloumn

// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './NewServiceItem.css';
// import { FaEdit, FaTrash, FaFileContract, FaExternalLinkAlt, FaFilter, FaTimes } from 'react-icons/fa';
// import axios from 'axios';
// import baseURL from '../ApiUrl/Apiurl';

// const ServiceItemTable = ({ serviceItems, onAddNew, onEdit, onDelete, selectedCompany, userId, refreshContracts }) => { 
//   const [filteredItems, setFilteredItems] = useState([]); 
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();
//   const [contractData, setContractData] = useState([]);
//   const [companiesData, setCompaniesData] = useState([]);
//   const [productsData, setProductsData] = useState([]);
//   const [pmGroupsData, setPmGroupsData] = useState([]);
//   const [customersData, setCustomersData] = useState([]);
  
//   // Column-level filter states
//   const [columnFilters, setColumnFilters] = useState({
//     service_item_id: '',
//     company: '',
//     customer_name: '',
//     customer_id: '',
//     pcb_serial_number: '',
//     pm_group: '',
//     product: '',
//     location: '',
//     status: '',
//     iot_status: '',
//     description: '',
//   });
  
//   // Available options for dropdown filters
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [iotStatusOptions, setIotStatusOptions] = useState([]);
//   const [companyOptions, setCompanyOptions] = useState([]);
//   const [pmGroupOptions, setPmGroupOptions] = useState([]);
//   const [productOptions, setProductOptions] = useState([]);

//   // Fetch products data
//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/products/`);
//       if (response.data.status === "success") {
//         setProductsData(response.data.data);
//         // Extract unique product names for filter dropdown
//         const uniqueProducts = [...new Set(response.data.data.map(p => p.product_name))];
//         setProductOptions(uniqueProducts);
//       }
//     } catch (error) {
//       console.error("Failed to load products data", error);
//     }
//   };

//   // Fetch PM groups data
//   const fetchPmGroups = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/pm-groups/`);
//       if (response.data.status === "success") {
//         setPmGroupsData(response.data.data);
//         // Extract unique PM group names for filter dropdown
//         const uniqueGroups = [...new Set(response.data.data.map(p => p.pm_group_name))];
//         setPmGroupOptions(uniqueGroups);
//       }
//     } catch (error) {
//       console.error("Failed to load PM groups data", error);
//     }
//   };

//   // Fetch customers data
//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/customers/`, {
//         params: {
//           user_id: userId,
//           company_id: selectedCompany
//         }
//       });
//       if (response.data.status === "success") {
//         setCustomersData(response.data.data);
//       }
//     } catch (error) {
//       console.error("Failed to load customers data", error);
//     }
//   };

//   // Fetch companies data
//   const fetchCompanies = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/companies/`);
//       if (response.data.status === "success") {
//         setCompaniesData(response.data.data);
//         // Extract unique company display names for filter dropdown
//         const uniqueCompanies = [...new Set(response.data.data.map(c => 
//           `${c.company_name} (${c.company_id})`
//         ))];
//         setCompanyOptions(uniqueCompanies);
//       }
//     } catch (error) {
//       console.error("Failed to load companies data", error);
//     }
//   };

//   // Function to get product name by product ID
//   const getProductName = (productId) => {
//     if (!productsData || productsData.length === 0) return productId;
    
//     const product = productsData.find(prod => prod.product_id === productId);
//     return product ? product.product_name : productId;
//   };

//   // Function to get PM group name by PM group ID
//   const getPmGroupName = (pmGroupId) => {
//     if (!pmGroupsData || pmGroupsData.length === 0) return pmGroupId;
    
//     const pmGroup = pmGroupsData.find(pm => pm.pm_group_id === pmGroupId);
//     return pmGroup ? pmGroup.pm_group_name : pmGroupId;
//   };

//   // Function to get customer username by customer ID
//   const getCustomerUsername = (customerId) => {
//     if (!customersData || customersData.length === 0) return customerId;
    
//     const customer = customersData.find(cust => cust.customer_id === customerId);
//     return customer ? customer.username : customerId;
//   };

//   // Function to get customer details by customer ID
//   const getCustomerDetails = (customerId) => {
//     if (!customersData || customersData.length === 0) return null;
    
//     const customer = customersData.find(cust => cust.customer_id === customerId);
//     return customer;
//   };

//   // Function to get company display name in compact format: "COMP1 (TCS)"
//   const getCompanyDisplayName = (companyId) => {
//     if (!companiesData || companiesData.length === 0) return companyId;
    
//     const company = companiesData.find(comp => comp.company_id === companyId);
//     if (company) {
//       return `${company.company_name} (${company.company_id})`;
//     }
//     return companyId;
//   };

//   const fetchContracts = async () => {
//     try {
//       const response = await axios.get(
//         `${baseURL}/service-contracts/`,
//         {
//           params: {
//             user_id: userId,
//             company_id: selectedCompany,
//           },
//         }
//       );

//       console.log("Contract response:", response.data);

//       const contracts = Array.isArray(response.data.data)
//         ? response.data.data
//         : [];

//       setContractData(contracts);
//     } catch (error) {
//       console.error("Failed to fetch contracts", error);
//       setContractData([]);
//     }
//   };

//   useEffect(() => {
//     // Fetch all data in sequence
//     const fetchAllData = async () => {
//       setLoading(true);
//       try {
//         await fetchCompanies();
//         await fetchProducts();
//         await fetchPmGroups();
//         await fetchCustomers();
//         await fetchContracts();
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [userId, selectedCompany, refreshContracts]);

//   // Extract unique status and IoT status options from data
//   useEffect(() => {
//     if (serviceItems && serviceItems.length > 0) {
//       // Extract unique status values
//       const uniqueStatuses = [...new Set(serviceItems.map(item => item.status))].filter(Boolean);
//       setStatusOptions(uniqueStatuses);
      
//       // Extract unique IoT status values
//       const uniqueIotStatuses = [...new Set(serviceItems.map(item => item.iot_status))].filter(Boolean);
//       setIotStatusOptions(uniqueIotStatuses);
//     }
//   }, [serviceItems]);

//   // Function to get the latest contract for a service item
//   const getLatestContract = (serviceItemId) => {
//     if (!Array.isArray(contractData)) return null;
    
//     const serviceItemContracts = contractData.filter(
//       contract => contract.service_item === serviceItemId
//     );
    
//     if (serviceItemContracts.length === 0) return null;
    
//     const sortedContracts = serviceItemContracts.sort(
//       (a, b) => new Date(b.created_at || b.contract_create_date) - new Date(a.created_at || a.contract_create_date)
//     );
    
//     return sortedContracts[0];
//   };

//   const isContractButtonDisabled = (serviceItemId) => {
//     const latestContract = getLatestContract(serviceItemId);
    
//     if (!latestContract) return false;
    
//     return latestContract.is_alert_sent === false;
//   };

//   const shouldShowRenewalButton = (serviceItemId) => {
//     const latestContract = getLatestContract(serviceItemId);
    
//     if (!latestContract) return false;
    
//     return latestContract.is_alert_sent === true;
//   };

//   // Function to format date as dd/mm/yyyy
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Never';
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

//   // Handle Add Component button click
//   const handleAddComponent = (serviceItem) => {
//     navigate('/servicemanager/service-item-components/add', {
//       state: {
//         service_item: serviceItem.service_item_id,
//         company: serviceItem.company,
//         customer: serviceItem.customer
//       }
//     });
//   };

//   // Handle View Component button click
//   const handleViewComponent = (serviceItem) => {
//     navigate('/servicemanager/service-item-components', {
//       state: {
//         service_item: serviceItem.service_item_id,
//         company: serviceItem.company,
//         customer: serviceItem.customer,
//         viewMode: true
//       }
//     });
//   };
  
//   // Handle column filter change
//   const handleColumnFilterChange = (column, value) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: value
//     }));
//     setCurrentPage(1); // Reset to first page when filter changes
//   };
  
//   // Clear all column filters
//   const clearAllColumnFilters = () => {
//     setColumnFilters({
//       service_item_id: '',
//       company: '',
//       customer_name: '',
//       customer_id: '',
//       pcb_serial_number: '',
//       pm_group: '',
//       product: '',
//       location: '',
//       status: '',
//       iot_status: '',
//       description: '',
//     });
//   };
  
//   // Clear specific column filter
//   const clearColumnFilter = (column) => {
//     setColumnFilters(prev => ({
//       ...prev,
//       [column]: ''
//     }));
//   };
  
//   // Apply all filters (global search + column filters)
//   const applyAllFilters = useMemo(() => {
//     return (items) => {
//       if (!items) return [];
      
//       let filtered = [...items];
      
//       // Apply global search
//       if (searchTerm) {
//         filtered = filtered.filter(item =>
//           Object.values(item)
//             .join(' ')
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())
//         );
//       }
      
//       // Apply column filters
//       Object.keys(columnFilters).forEach(column => {
//         const filterValue = columnFilters[column];
//         if (filterValue) {
//           filtered = filtered.filter(item => {
//             switch (column) {
//               case 'service_item_id':
//                 return item.service_item_id?.toLowerCase().includes(filterValue.toLowerCase());
              
//               case 'company':
//                 const companyDisplay = getCompanyDisplayName(item.company);
//                 return companyDisplay?.toLowerCase().includes(filterValue.toLowerCase());
              
//               case 'customer_name':
//                 const customerName = getCustomerUsername(item.customer);
//                 return customerName?.toLowerCase().includes(filterValue.toLowerCase());
              
//               case 'customer_id':
//                 return item.customer?.toLowerCase().includes(filterValue.toLowerCase());
              
//               case 'pcb_serial_number':
//                 return item.pcb_serial_number?.toLowerCase().includes(filterValue.toLowerCase());
              
//               case 'pm_group':
//                 const pmGroupName = getPmGroupName(item.pm_group);
//                 return pmGroupName?.toLowerCase().includes(filterValue.toLowerCase());
              
//               case 'product':
//                 const productName = getProductName(item.product);
//                 return productName?.toLowerCase().includes(filterValue.toLowerCase());
              
//               case 'location':
//                 return item.location?.toLowerCase().includes(filterValue.toLowerCase());
              
//               case 'status':
//                 return item.status?.toLowerCase() === filterValue.toLowerCase();
              
//               case 'iot_status':
//                 return item.iot_status?.toLowerCase() === filterValue.toLowerCase();
              
//               case 'description':
//                 return item.product_description?.toLowerCase().includes(filterValue.toLowerCase());
              
//               default:
//                 return true;
//             }
//           });
//         }
//       });
      
//       return filtered;
//     };
//   }, [searchTerm, columnFilters, companiesData, customersData, productsData, pmGroupsData]);

//   useEffect(() => {
//     if (serviceItems) {
//       let filteredByCompany = serviceItems;
//       if (selectedCompany) {
//         filteredByCompany = serviceItems.filter(item => 
//           item.company === selectedCompany
//         );
//       }
      
//       // Apply all filters
//       const filtered = applyAllFilters(filteredByCompany);
      
//       // Sort by creation date
//       const sortedData = [...filtered].sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//       );
//       setFilteredItems(sortedData);
//     }
//   }, [serviceItems, selectedCompany, applyAllFilters]);

//   const handleContractClick = (item) => {
//     navigate('/servicemanager/service-contract', {
//       state: {
//         service_item_id: item.service_item_id,
//         customer: item.customer,
//         company: item.company
//       }
//     });
//   };

//   // Handle Customer ID click - navigate to customer page
//   const handleCustomerIdClick = (customerId) => {
//     navigate(`/servicemanager/customers/${customerId}`, {
//       state: { 
//         customerId: customerId,
//         companyId: selectedCompany
//       }
//     });
//   };

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentItems = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

//   const handleRenewalClick = (item) => {
//     const latestContract = getLatestContract(item.service_item_id);
    
//     navigate('/servicemanager/service-renewal', {
//       state: {
//         service_item_id: item.service_item_id,
//         customer: item.customer,
//         company: item.company,
//         existing_contract: latestContract
//       }
//     });
//   };

//   return (
//     <div className="service-item-container">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center flex-wrap">
//         <div>
//           <h2 className="service-item-title mb-0">Service Items</h2>
//           <p className="service-item-subtitle mb-0 text-muted">
//             {selectedCompany 
//               ? `Showing service items for ${getCompanyDisplayName(selectedCompany)}`
//               : 'Showing all service items'}
//           </p>
//           <p className="service-item-subtitle text-muted mb-0">Manage service items</p>
//         </div>
//         <button
//           onClick={onAddNew}
//           className="btn btn-primary service-item-btn service-item-save"
//         >
//           Add New Service Item
//         </button>
//       </div>

//       {/* Filters Summary */}
//       <div className="mb-3 p-2 border rounded bg-light">
//         <div className="d-flex justify-content-between align-items-center">
//           <div>
//             <small className="text-muted">
//               <FaFilter className="me-1" />
//               Active Filters: 
//               {Object.values(columnFilters).some(v => v) || searchTerm ? (
//                 <span className="ms-2">
//                   {searchTerm && <span className="badge bg-info me-2">Global: "{searchTerm}"</span>}
//                   {Object.entries(columnFilters).map(([key, value]) => 
//                     value && (
//                       <span key={key} className="badge bg-secondary me-2">
//                         {key.replace('_', ' ')}: {value}
//                         <FaTimes 
//                           size={10} 
//                           className="ms-1 cursor-pointer" 
//                           onClick={() => clearColumnFilter(key)}
//                           style={{ cursor: 'pointer' }}
//                         />
//                       </span>
//                     )
//                   )}
//                 </span>
//               ) : (
//                 <span className="ms-2 text-muted">None</span>
//               )}
//             </small>
//           </div>
//           {(Object.values(columnFilters).some(v => v) || searchTerm) && (
//             <button 
//               className="btn btn-sm btn-outline-secondary"
//               onClick={() => {
//                 setSearchTerm('');
//                 clearAllColumnFilters();
//               }}
//             >
//               Clear All Filters
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
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

//         <div className="d-flex align-items-center gap-2">
//           <input
//             type="text"
//             placeholder="Global search..."
//             className="form-control"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ minWidth: '250px' }}
//           />
//           <button 
//             className="btn btn-outline-secondary"
//             onClick={() => setSearchTerm('')}
//             disabled={!searchTerm}
//           >
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p>Loading service items...</p>
//       ) : filteredItems.length === 0 ? (
//         <div className="alert alert-info">
//           {selectedCompany 
//             ? `No service items found for ${getCompanyDisplayName(selectedCompany)}`
//             : 'No service items found'}
//           {(searchTerm || Object.values(columnFilters).some(v => v)) && 
//             " with the current filters"}
//         </div>
//       ) : (
//         <div className="table-responsive mb-4">
//           <table className="table">
//             <thead className="service-item-table-header">
//               <tr>
//                 <th>S.No</th>
//                 <th>
//                   Service Item ID
//                   <input 
//                     type="text" 
//                     value={columnFilters.service_item_id}
//                     onChange={(e) => handleColumnFilterChange('service_item_id', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                     placeholder="Filter ID..."
//                   />
//                 </th>
//                 <th>
//                   Company
//                   <select 
//                     value={columnFilters.company}
//                     onChange={(e) => handleColumnFilterChange('company', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                   >
//                     <option value="">All Companies</option>
//                     {companyOptions.map((company, index) => (
//                       <option key={index} value={company}>{company}</option>
//                     ))}
//                   </select>
//                 </th>
//                 <th>
//                   Customer Name
//                   <input 
//                     type="text" 
//                     value={columnFilters.customer_name}
//                     onChange={(e) => handleColumnFilterChange('customer_name', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                     placeholder="Filter name..."
//                   />
//                 </th>
//                 <th>
//                   Customer ID
//                   <input 
//                     type="text" 
//                     value={columnFilters.customer_id}
//                     onChange={(e) => handleColumnFilterChange('customer_id', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                     placeholder="Filter ID..."
//                   />
//                 </th>
//                 <th>
//                   PCB Serial
//                   <input 
//                     type="text" 
//                     value={columnFilters.pcb_serial_number}
//                     onChange={(e) => handleColumnFilterChange('pcb_serial_number', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                     placeholder="Filter serial..."
//                   />
//                 </th>
//                 <th>
//                   PM Group
//                   <select 
//                     value={columnFilters.pm_group}
//                     onChange={(e) => handleColumnFilterChange('pm_group', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                   >
//                     <option value="">All Groups</option>
//                     {pmGroupOptions.map((group, index) => (
//                       <option key={index} value={group}>{group}</option>
//                     ))}
//                   </select>
//                 </th>
//                 <th>
//                   Product
//                   <select 
//                     value={columnFilters.product}
//                     onChange={(e) => handleColumnFilterChange('product', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                   >
//                     <option value="">All Products</option>
//                     {productOptions.map((product, index) => (
//                       <option key={index} value={product}>{product}</option>
//                     ))}
//                   </select>
//                 </th>
//                 <th>
//                   Location
//                   <input 
//                     type="text" 
//                     value={columnFilters.location}
//                     onChange={(e) => handleColumnFilterChange('location', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                     placeholder="Filter location..."
//                   />
//                 </th>
//                 <th>Installation Date</th>
//                 <th>Warranty End</th>
//                 <th>
//                   Status
//                   <select 
//                     value={columnFilters.status}
//                     onChange={(e) => handleColumnFilterChange('status', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                   >
//                     <option value="">All Status</option>
//                     {statusOptions.map((status, index) => (
//                       <option key={index} value={status}>{status}</option>
//                     ))}
//                   </select>
//                 </th>
//                 <th>
//                   IoT Status
//                   <select 
//                     value={columnFilters.iot_status}
//                     onChange={(e) => handleColumnFilterChange('iot_status', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                   >
//                     <option value="">All IoT Status</option>
//                     {iotStatusOptions.map((status, index) => (
//                       <option key={index} value={status}>{status}</option>
//                     ))}
//                   </select>
//                 </th>
//                 <th>Last Service</th>
//                 <th>
//                   Description
//                   <input 
//                     type="text" 
//                     value={columnFilters.description}
//                     onChange={(e) => handleColumnFilterChange('description', e.target.value)}
//                     className="form-control form-control-sm mt-1"
//                     placeholder="Filter description..."
//                   />
//                 </th>
//                 <th>Actions</th>
//                 <th>Contract</th>
//                 <th>Service Components</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length > 0 ? (
//                 currentItems.map((item, index) => {
//                   const customerDetails = getCustomerDetails(item.customer);
                  
//                   return (
//                     <tr key={item.service_item_id}>
//                       <td>{indexOfFirstEntry + index + 1}</td>
//                       <td>
//                         <button 
//                           className="btn btn-link p-0 text-primary text-decoration-underline"
//                           onClick={() => navigate(`/servicemanager/service-item-details/${item.service_item_id}`)}
//                           style={{
//                             color: '#0d6efd',
//                             textDecoration: 'underline',
//                             border: 'none',
//                             background: 'none',
//                             cursor: 'pointer',
//                             fontSize: 'inherit'
//                           }}
//                         >
//                           {item.service_item_id}
//                         </button>
//                       </td>
//                       <td title={getCompanyDisplayName(item.company)}>
//                         {getCompanyDisplayName(item.company)}
//                       </td>
//                       <td title={`Customer ID: ${item.customer}`}>
//                         {getCustomerUsername(item.customer)}
//                       </td>
//                       <td>
//                         <button 
//                           className="btn btn-link p-0 text-primary d-flex align-items-center gap-1"
//                           onClick={() => handleCustomerIdClick(item.customer)}
//                           style={{
//                             color: '#0d6efd',
//                             textDecoration: 'underline',
//                             border: 'none',
//                             background: 'none',
//                             cursor: 'pointer',
//                             fontSize: 'inherit'
//                           }}
//                           title={`View Customer Details: ${item.customer}`}
//                         >
//                           {item.customer}
//                           <FaExternalLinkAlt size={10} />
//                         </button>
//                       </td>
//                       <td>
//                         <button 
//                           className="btn btn-link p-0 text-primary text-decoration-underline"
//                           onClick={() => navigate(`/servicemanager/service-item-machine-details/${item.pcb_serial_number}`)}
//                           style={{
//                             color: '#0d6efd',
//                             textDecoration: 'underline',
//                             border: 'none',
//                             background: 'none',
//                             cursor: 'pointer',
//                             fontSize: 'inherit'
//                           }}
//                         >
//                           {item.pcb_serial_number}
//                         </button>
//                       </td>
//                       <td title={`ID: ${item.pm_group}`}>
//                         {getPmGroupName(item.pm_group)}
//                       </td>
//                       <td title={`ID: ${item.product}`}>
//                         {getProductName(item.product)}
//                       </td>
//                       <td>{item.location}</td>
//                       <td>{formatDate(item.installation_date)}</td>
//                       <td>{formatDate(item.warranty_end_date)}</td>
//                       <td>
//                         <span className={`badge ${
//                           item.status === 'Active' ? 'bg-success' :
//                           item.status === 'Service Due' ? 'bg-warning text-dark' :
//                           'bg-secondary'
//                         }`}>
//                           {item.status}
//                         </span>
//                       </td>
//                       <td>
//                         <span className={`badge ${
//                           item.iot_status === 'Online' ? 'bg-success' : 'bg-danger'
//                         }`}>
//                           {item.iot_status}
//                         </span>
//                       </td>
//                       <td>{formatDate(item.last_service)}</td>
//                       <td>{item.product_description || 'N/A'}</td>
//                       <td>
//                         <div className="d-flex gap-2">
//                           <FaEdit
//                             style={{ cursor: 'pointer', color: 'blue' }}
//                             onClick={() => onEdit(item)}
//                             title="Edit"
//                           />
//                           <FaTrash
//                             style={{ cursor: 'pointer', color: 'red' }}
//                             onClick={() => onDelete(item.service_item_id)}
//                             title="Delete"
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         {shouldShowRenewalButton(item.service_item_id) ? (
//                           <button
//                             className="btn btn-sm btn-warning"
//                             onClick={() => handleRenewalClick(item)}
//                             title="Renew Contract"
//                           >
//                             Renewal
//                           </button>
//                         ) : (
//                           <button
//                             className="btn btn-sm btn-primary"
//                             disabled={isContractButtonDisabled(item.service_item_id)}
//                             onClick={() => handleContractClick(item)}
//                             title={isContractButtonDisabled(item.service_item_id) ? "Contract in progress" : "Create Contract"}
//                           >
//                             Contract
//                           </button>
//                         )}
//                       </td>
//                       <td>
//                         <div className="d-flex justify-content-center gap-2">
//                           <button
//                             className="btn btn-sm btn-secondary"
//                             onClick={() => handleViewComponent(item)}
//                             title="View Components"
//                           >
//                             View
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="18" className="text-center">
//                     {selectedCompany 
//                       ? `No service items found for ${getCompanyDisplayName(selectedCompany)}${searchTerm ? ' matching your search' : ''}`
//                       : 'No service items found'}
//                     {(searchTerm || Object.values(columnFilters).some(v => v)) && 
//                       " with the current filters"}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {totalPages > 1 && (
//         <nav aria-label="Page navigation">
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage - 1)}
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

// export default ServiceItemTable;


//======================================================================
// Added customer_id hyperlink 

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewServiceItem.css';
import { FaEdit, FaTrash, FaFileContract, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import baseURL from '../ApiUrl/Apiurl';

const ServiceItemTable = ({ serviceItems, onAddNew, onEdit, onDelete, selectedCompany, userId, refreshContracts }) => { 
  const [filteredItems, setFilteredItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [contractData, setContractData] = useState([]);
  const [companiesData, setCompaniesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [pmGroupsData, setPmGroupsData] = useState([]);
  const [customersData, setCustomersData] = useState([]);

  // Fetch products data
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/products/`);
      if (response.data.status === "success") {
        setProductsData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load products data", error);
    }
  };

  // Fetch PM groups data
  const fetchPmGroups = async () => {
    try {
      const response = await axios.get(`${baseURL}/pm-groups/`);
      if (response.data.status === "success") {
        setPmGroupsData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load PM groups data", error);
    }
  };

  // Fetch customers data
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${baseURL}/customers/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany
        }
      });
      if (response.data.status === "success") {
        setCustomersData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load customers data", error);
    }
  };

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

  // Function to get product name by product ID
  const getProductName = (productId) => {
    if (!productsData || productsData.length === 0) return productId;
    
    const product = productsData.find(prod => prod.product_id === productId);
    return product ? product.product_name : productId;
  };

  // Function to get PM group name by PM group ID
  const getPmGroupName = (pmGroupId) => {
    if (!pmGroupsData || pmGroupsData.length === 0) return pmGroupId;
    
    const pmGroup = pmGroupsData.find(pm => pm.pm_group_id === pmGroupId);
    return pmGroup ? pmGroup.pm_group_name : pmGroupId;
  };

  // Function to get customer username by customer ID
  const getCustomerUsername = (customerId) => {
    if (!customersData || customersData.length === 0) return customerId;
    
    const customer = customersData.find(cust => cust.customer_id === customerId);
    return customer ? customer.username : customerId;
  };

  // Function to get customer details by customer ID
  const getCustomerDetails = (customerId) => {
    if (!customersData || customersData.length === 0) return null;
    
    const customer = customersData.find(cust => cust.customer_id === customerId);
    return customer;
  };

  // Function to get company display name in compact format: "COMP1 (TCS)"
  const getCompanyDisplayName = (companyId) => {
    if (!companiesData || companiesData.length === 0) return companyId;
    
    const company = companiesData.find(comp => comp.company_id === companyId);
    if (company) {
      return `${company.company_name} (${company.company_id})`;
    }
    return companyId;
  };

  const fetchContracts = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/service-contracts/`,
        {
          params: {
            user_id: userId,
            company_id: selectedCompany,
          },
        }
      );

      console.log("Contract response:", response.data);

      const contracts = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setContractData(contracts);
    } catch (error) {
      console.error("Failed to fetch contracts", error);
      setContractData([]);
    }
  };

  useEffect(() => {
    // Fetch all data in sequence
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await fetchCompanies();
        await fetchProducts();
        await fetchPmGroups();
        await fetchCustomers();
        await fetchContracts();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId, selectedCompany, refreshContracts]);

  // Function to get the latest contract for a service item
  const getLatestContract = (serviceItemId) => {
    if (!Array.isArray(contractData)) return null;
    
    const serviceItemContracts = contractData.filter(
      contract => contract.service_item === serviceItemId
    );
    
    if (serviceItemContracts.length === 0) return null;
    
    const sortedContracts = serviceItemContracts.sort(
      (a, b) => new Date(b.created_at || b.contract_create_date) - new Date(a.created_at || a.contract_create_date)
    );
    
    return sortedContracts[0];
  };

  const isContractButtonDisabled = (serviceItemId) => {
    const latestContract = getLatestContract(serviceItemId);
    
    if (!latestContract) return false;
    
    return latestContract.is_alert_sent === false;
  };

  const shouldShowRenewalButton = (serviceItemId) => {
    const latestContract = getLatestContract(serviceItemId);
    
    if (!latestContract) return false;
    
    return latestContract.is_alert_sent === true;
  };

  // Function to format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
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

  // Handle Add Component button click
  const handleAddComponent = (serviceItem) => {
    navigate('/servicemanager/service-item-components/add', {
      state: {
        service_item: serviceItem.service_item_id,
        company: serviceItem.company,
        customer: serviceItem.customer
      }
    });
  };

  // Handle View Component button click
  const handleViewComponent = (serviceItem) => {
    navigate('/servicemanager/service-item-components', {
      state: {
        service_item: serviceItem.service_item_id,
        company: serviceItem.company,
        customer: serviceItem.customer,
        viewMode: true
      }
    });
  };
 
  useEffect(() => {
    if (serviceItems) {
      let filteredByCompany = serviceItems;
      if (selectedCompany) {
        filteredByCompany = serviceItems.filter(item => 
          item.company === selectedCompany
        );
      }
      
      const sortedData = [...filteredByCompany].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFilteredItems(sortedData);
    }
  }, [serviceItems, selectedCompany]);

  useEffect(() => {
    let results = serviceItems;
    
    if (searchTerm) {
      results = results.filter(item =>
        Object.values(item)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(results);
    setCurrentPage(1);
  }, [searchTerm, serviceItems]); 

  const handleContractClick = (item) => {
    navigate('/servicemanager/service-contract', {
      state: {
        service_item_id: item.service_item_id,
        customer: item.customer,
        company: item.company
      }
    });
  };

  // Handle Customer ID click - navigate to customer page
  const handleCustomerIdClick = (customerId) => {
    navigate(`/servicemanager/customers/${customerId}`, {
      state: { 
        customerId: customerId,
        companyId: selectedCompany
      }
    });
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

  const handleRenewalClick = (item) => {
    const latestContract = getLatestContract(item.service_item_id);
    
    navigate('/servicemanager/service-renewal', {
      state: {
        service_item_id: item.service_item_id,
        customer: item.customer,
        company: item.company,
        existing_contract: latestContract
      }
    });
  };

  return (
    <div className="service-item-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <h2 className="service-item-title mb-0">Service Items</h2>
          <p className="service-item-subtitle mb-0 text-muted">
            {selectedCompany 
              ? `Showing service items for ${getCompanyDisplayName(selectedCompany)}`
              : 'Showing all service items'}
          </p>
          <p className="service-item-subtitle text-muted mb-0">Manage service items</p>
        </div>
        <button
          onClick={onAddNew}
          className="btn btn-primary service-item-btn service-item-save"
        >
          Add New Service Item
        </button>
      </div>

      {/* Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
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
          placeholder="Search service items..."
          className="form-control w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading service items...</p>
      ) : filteredItems.length === 0 ? (
        <div className="alert alert-info">
          {selectedCompany 
            ? `No service items found for ${getCompanyDisplayName(selectedCompany)}`
            : 'No service items found'}
        </div>
      ) : (
        <div className="table-responsive mb-4">
          <table className="table">
            <thead className="service-item-table-header">
              <tr>
                <th>S.No</th>
                <th>Service Item ID</th>
                <th>Company</th>
                <th>Customer Name</th>
                <th>Customer ID</th> {/* New column */}
                <th>PCB Serial Number</th>
                <th>PM Group</th>
                <th>Product</th>
                <th>Location</th>
                <th>Installation Date</th>
                <th>Warranty End</th>
                <th>Status</th>
                <th>IoT Access</th>
                <th>Last Service</th>
                <th>Description</th>
                <th>Actions</th>
                <th>Contract</th>
                <th>Service Components</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                  const customerDetails = getCustomerDetails(item.customer);
                  
                  return (
                    <tr key={item.service_item_id}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>
                        <button 
                          className="btn btn-link p-0 text-primary text-decoration-underline"
                          onClick={() => navigate(`/servicemanager/service-item-details/${item.service_item_id}`)}
                          style={{
                            color: '#0d6efd',
                            textDecoration: 'underline',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: 'inherit'
                          }}
                        >
                          {item.service_item_id}
                        </button>
                      </td>
                      <td title={getCompanyDisplayName(item.company)}>
                        {getCompanyDisplayName(item.company)}
                      </td>
                      <td title={`Customer ID: ${item.customer}`}>
                        {getCustomerUsername(item.customer)}
                      </td>
                      <td>
                        <button 
                          className="btn btn-link p-0 text-primary d-flex align-items-center gap-1"
                          onClick={() => handleCustomerIdClick(item.customer)}
                          style={{
                            color: '#0d6efd',
                            textDecoration: 'underline',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: 'inherit'
                          }}
                          title={`View Customer Details: ${item.customer}`}
                        >
                          {item.customer}
                        </button>
                      </td>
                      <td>
                        <button 
                          className="btn btn-link p-0 text-primary text-decoration-underline"
                          onClick={() => navigate(`/servicemanager/service-item-machine-details/${item.pcb_serial_number}`)}
                          style={{
                            color: '#0d6efd',
                            textDecoration: 'underline',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: 'inherit'
                          }}
                        >
                          {item.pcb_serial_number}
                        </button>
                      </td>
                      <td title={`ID: ${item.pm_group}`}>
                        {getPmGroupName(item.pm_group)}
                      </td>
                      <td title={`ID: ${item.product}`}>
                        {getProductName(item.product)}
                      </td>
                      <td>{item.location}</td>
                      <td>{formatDate(item.installation_date)}</td>
                      <td>{formatDate(item.warranty_end_date)}</td>
                      <td>
                        <span className={`badge ${
                          item.status === 'Active' ? 'bg-success' :
                          item.status === 'Service Due' ? 'bg-warning text-dark' :
                          'bg-secondary'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          item.iot_status === 'Online' ? 'bg-success' : 'bg-danger'
                        }`}>
                          {item.iot_status}
                        </span>
                      </td>
                      <td>{formatDate(item.last_service)}</td>
                      <td>{item.product_description || 'N/A'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <FaEdit
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={() => onEdit(item)}
                          />
                          <FaTrash
                            style={{ cursor: 'pointer', color: 'red' }}
                            onClick={() => onDelete(item.service_item_id)}
                          />
                        </div>
                      </td>
                      <td>
                        {shouldShowRenewalButton(item.service_item_id) ? (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleRenewalClick(item)}
                          >
                            Renewal
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-primary"
                            disabled={isContractButtonDisabled(item.service_item_id)}
                            onClick={() => handleContractClick(item)}
                          >
                            Contract
                          </button>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleViewComponent(item)}
                            title="View Components"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="18" className="text-center">
                    {selectedCompany 
                      ? `No service items found for ${getCompanyDisplayName(selectedCompany)}${searchTerm ? ' matching your search' : ''}`
                      : 'No service items found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
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

export default ServiceItemTable;
