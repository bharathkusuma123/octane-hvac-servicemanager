// import React, { useState, useEffect, useContext } from "react";
// import "./ServicePool.css";
// import axios from "axios";
// import baseURL from "../ApiUrl/Apiurl";
// import { useNavigate } from 'react-router-dom';
// import { useCompany } from "../AuthContext/CompanyContext";
// import Swal from 'sweetalert2';
// import { AuthContext } from "../AuthContext/AuthContext";
// import AssignmentForm from "./AssignmentForm";
// import ServiceTableContent from "./ServiceTableContent";

// const ServicePoolTable = () => { 
//   const { userId } = useContext(AuthContext);
//   const { selectedCompany } = useCompany();
//   const navigate = useNavigate();
  
//   // State management
//   const [showAssignmentScreen, setShowAssignmentScreen] = useState(false);
//   const [currentRequest, setCurrentRequest] = useState(null);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [resources, setResources] = useState([]);
//   const [historyResponse, setHistoryResponse] = useState({ data: [] });
//   const [customers, setCustomers] = useState([]);
//   const [serviceItems, setServiceItems] = useState([]);
  
//   // Search and pagination states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filteredData, setFilteredData] = useState([]);

//   // Handle recall service
// const handleRecallService = async (item) => {
//   const result = await Swal.fire({
//     icon: 'warning',
//     title: 'Recall Assignment?',
//     text: `Are you sure you want to recall the assignment for request ${item.request_id}? The status will revert to Open.`,
//     showCancelButton: true,
//     confirmButtonText: 'Yes, Recall',
//     cancelButtonText: 'Cancel',
//     confirmButtonColor: '#d33',
//     cancelButtonColor: '#3085d6',
//   });

//   if (result.isConfirmed) {
//     try {
//       Swal.fire({
//         title: 'Recalling Assignment...',
//         text: 'Please wait...',
//         allowOutsideClick: false,
//         didOpen: () => { Swal.showLoading(); },
//       });

//       // Find the latest assignment history record for this request
//       const historyData = historyResponse.data || [];
//       const latestAssignment = Array.isArray(historyData)
//         ? historyData.find(h => h.request === item.request_id && h.status === 'Pending')
//         : null;

//       // PUT 1: Update assignment history status to "Recalled"
//       if (latestAssignment) {
//         await axios.put(`${baseURL}/assignment-history/${latestAssignment.assignment_id}/`, {
//           status: 'Recalled',
//           updated_by: userId,
//           user_id: userId,
//           company_id: selectedCompany,
//         });
//       }

//       // PUT 2: Revert service pool to Open with no engineer
//       await axios.put(`${baseURL}/service-pools/${item.request_id}/`, {
//         status: 'Open',
//         assigned_engineer: null,
//         est_start_datetime: null,
//         est_end_datetime: null,
//         estimated_completion_time: null,
//         estimated_price: null,
//         updated_by: userId,
//         user_id: userId,
//         company_id: selectedCompany,
//         dynamics_service_order_no: null,
//       });

//       Swal.fire({
//         icon: 'success',
//         title: 'Recalled Successfully!',
//         text: `Request ${item.request_id} has been recalled and is now Open for reassignment.`,
//         confirmButtonColor: '#3085d6',
//       });

//       await fetchPoolData();
//       await fetchAssignmentHistory();

//     } catch (error) {
//       console.error('Error recalling assignment:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Recall Failed',
//         text: error.response?.data?.message || 'Failed to recall assignment. Please try again.',
//         confirmButtonColor: '#3085d6',
//       });
//     }
//   }
// };

//   // Fetch customers
//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/customers/`, {
//         params: {
//           user_id: userId,
//           company_id: selectedCompany
//         }
//       });
      
//       if (response.data.status === "success" && Array.isArray(response.data.data)) {
//         setCustomers(response.data.data);
//       } else {
//         setCustomers([]);
//       }
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//       setCustomers([]);
//     }
//   };

//   // Fetch service items
//   const fetchServiceItems = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/service-items/`, {
//         params: {
//           user_id: userId,
//           company_id: selectedCompany
//         }
//       });

//       if (response.data && response.data.data) {
//         setServiceItems(response.data.data);
//       } else {
//         setServiceItems([]);
//       }
//     } catch (error) {
//       console.error("Error fetching service items:", error);
//       setServiceItems([]);
//     }
//   };

//   // Fetch engineers and resources
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (selectedCompany && userId) {
//           const resourcesResponse = await axios.get(`${baseURL}/resources/?company_id=${selectedCompany}&user_id=${userId}`);
//           const resourceArray = Array.isArray(resourcesResponse.data?.data) ? resourcesResponse.data.data : [];
//           setResources(resourceArray);
          
//           // Fetch customers and service items when company and user are available
//           await fetchCustomers();
//           await fetchServiceItems();
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [selectedCompany, userId]);

//   // Fetch service pool data
//   const fetchPoolData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${baseURL}/service-pools/?user_id=${userId}&company_id=${selectedCompany}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const result = await response.json(); 
//       const responseData = result.data || result;
//       let dataArray = Array.isArray(responseData) ? responseData : [responseData];

//       dataArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       setData(dataArray);
//       setFilteredData(dataArray);
//     } catch (err) {
//       setError(err.message);
//       setData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPoolData();
//   }, [userId, selectedCompany]);

//   // Fetch assignment history
//     // Fetch assignment history - standalone so it can be called on demand
// const fetchAssignmentHistory = async () => {
//   try {
//     const response = await axios.get(`${baseURL}/assignment-history/`, {
//       params: {
//         user_id: userId,
//         company_id: selectedCompany
//       }
//     });
    
//     const historyData = response.data?.data || response.data || [];
//     const sortedHistory = Array.isArray(historyData) 
//       ? historyData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//       : [];
    
//     setHistoryResponse({ data: sortedHistory });
//   } catch (error) {
//     console.error("Error fetching assignment history:", error);
//     setHistoryResponse({ data: [] });
//   }
// };

// useEffect(() => {
//     if (userId && selectedCompany) {
//       fetchAssignmentHistory();
//     }
//   }, [userId, selectedCompany]);

//   // Apply search filter
//   useEffect(() => {
//     let results = data;
    
//     if (selectedCompany) {
//       results = results.filter(item => item.company === selectedCompany);
//     }
    
//     if (searchTerm) {
//       results = results.filter(item =>
//         Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     setFilteredData(results);
//     setCurrentPage(1);
//   }, [selectedCompany, searchTerm, data]);

//   // Get customer name by ID
//   const getCustomerName = (customerId) => {
//     if (!customerId) return "N/A";
    
//     const customer = customers.find(cust => cust.customer_id === customerId);
//     return customer ? customer.full_name || customer.username || "N/A" : customerId;
//   };

//   // Get customer details by ID
//   const getCustomerDetails = (customerId) => {
//     if (!customerId) return null;
//     return customers.find(cust => cust.customer_id === customerId) || null;
//   };

//   // Get service item details by ID
//   const getServiceItemDetails = (serviceItemId) => {
//     if (!serviceItemId) return null;
//     return serviceItems.find(item => item.service_item_id === serviceItemId) || null;
//   };

//   // Handle assign click
//   const handleAssignClick = (request) => {
//     setCurrentRequest(request);
//     setShowAssignmentScreen(true);
//   };

//   // Handle reopen service (keep your existing implementation)
//   const handleReopenService = async (item) => {
//     const result = await Swal.fire({
//       icon: 'question',
//       title: 'Re-open Service?',
//       text: `Are you sure you want to re-open request ${item.request_id}?`,
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Re-open',
//       cancelButtonText: 'Cancel',
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//     });

//     if (result.isConfirmed) {
//       try {
//         Swal.fire({
//           title: 'Re-opening Service...',
//           text: 'Please wait while we create a new service request.',
//           allowOutsideClick: false,
//           didOpen: () => { Swal.showLoading(); },
//         });

//         const payload = {
//           source_type: 'Re-Opened',
//           status: 'Open',
//           company: item.company,
//           service_item: item.service_item?.id || item.service_item,
//           customer: item.customer?.id || item.customer,
//           request_details: `Reopened from request ${item.request_id}. Original issue: ${item.request_details || 'No details provided'}`,
//           alert_details: item.alert_details,
//           pm_group: item.pm_group?.id || item.pm_group,
//           requested_by: item.requested_by,
//           preferred_date: new Date().toISOString().split('T')[0],
//           preferred_time: '09:00:00',
//           assigned_engineer: null,
//           estimated_completion_time: null,
//           estimated_price: null,
//           est_start_datetime: null,
//           est_end_datetime: null,
//           dynamics_service_order_no: null,
//           created_by: userId,
//           updated_by: userId,
//           user_id: userId,
//           company_id: selectedCompany,
//           reopened_from: item.request_id
//         };

//         Object.keys(payload).forEach(key => {
//           if (payload[key] === undefined || payload[key] === null) {
//             delete payload[key];
//           }
//         });

//         await axios.post(`${baseURL}/service-pools/`, payload);

//         try {
//           await axios.put(`${baseURL}/service-pools/${item.request_id}/`, {
//             status: 'Reopened',
//             updated_by: userId,
//             user_id: userId,
//             company_id: selectedCompany
//           });
//         } catch (updateError) {
//           console.warn('Note: Original request status update failed:', updateError);
//         }

//         Swal.fire({
//           icon: 'success',
//           title: 'Reopened Successfully!',
//           html: `<div>
//             <p>Original request: <strong>${item.request_id}</strong></p>
//             <p class="text-muted">You can now assign this new request to an engineer with updated dates.</p>
//           </div>`,
//           confirmButtonColor: '#3085d6',
//         });

//         await fetchPoolData();
        
//       } catch (error) {
//         console.error('Error reopening service:', error);
//         let errorMessage = 'Failed to reopen service request. Please try again.';
        
//         if (error.response?.data?.errors) {
//           const fieldErrors = error.response.data.errors;
//           errorMessage = 'Validation errors: ' + Object.keys(fieldErrors)
//             .map(field => `${field}: ${fieldErrors[field].join(', ')}`)
//             .join('; ');
//         } else if (error.response?.data?.message) {
//           errorMessage = error.response.data.message;
//         }

//         Swal.fire({
//           icon: 'error',
//           title: 'Re-open Failed',
//           text: errorMessage,
//           confirmButtonColor: '#3085d6',
//         });
//       }
//     }
//   };

//   if (loading) return <div className="service-container">Loading...</div>;
//   if (error) return <div className="service-container">Error: {error}</div>;

//   return (
//     <div className="service-container pm-container">
//       {!showAssignmentScreen ? (
//         <ServiceTableContent
//           selectedCompany={selectedCompany}
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           entriesPerPage={entriesPerPage}
//           setEntriesPerPage={setEntriesPerPage}
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           filteredData={filteredData}
//           historyResponse={historyResponse}
//           navigate={navigate}
//           handleAssignClick={handleAssignClick}
//           handleReopenService={handleReopenService}
//           getCustomerName={getCustomerName}
//           userId={userId}
//           serviceItems={serviceItems}
//           handleRecallService={handleRecallService}
//         />
//       ) : (
//         <AssignmentForm
//           currentRequest={currentRequest}
//           resources={resources} 
//           selectedCompany={selectedCompany}
//           userId={userId}
//           onClose={() => setShowAssignmentScreen(false)}
//           onSuccess={fetchPoolData}
//           customers={customers}
//           serviceItems={serviceItems}
//           getCustomerDetails={getCustomerDetails}
//           getServiceItemDetails={getServiceItemDetails}
//           onSuccess={() => {
//   fetchPoolData();
//   fetchAssignmentHistory();
// }}
//         />
//       )}
//     </div>
//   );
// };

// export default ServicePoolTable;


// import React, { useState, useEffect, useContext } from "react";
// import "./ServicePool.css";
// import axios from "axios";
// import baseURL from "../ApiUrl/Apiurl";
// import { useNavigate } from 'react-router-dom';
// import { useCompany } from "../AuthContext/CompanyContext";
// import Swal from 'sweetalert2';
// import { AuthContext } from "../AuthContext/AuthContext";
// import AssignmentForm from "./AssignmentForm";
// import ServiceTableContent from "./ServiceTableContent";

// const ServicePoolTable = () => { 
//   const { userId } = useContext(AuthContext);
//   const { selectedCompany } = useCompany();
//   const navigate = useNavigate();
  
//   // State management
//   const [showAssignmentScreen, setShowAssignmentScreen] = useState(false);
//   const [currentRequest, setCurrentRequest] = useState(null);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [resources, setResources] = useState([]);
//   const [historyResponse, setHistoryResponse] = useState({ data: [] });
//   const [customers, setCustomers] = useState([]);
//   const [serviceItems, setServiceItems] = useState([]);
  
// const [searchTerm, setSearchTerm] = useState(() => {
//   return sessionStorage.getItem('servicePool_searchTerm') || '';
// });

// const [entriesPerPage, setEntriesPerPage] = useState(() => {
//   return Number(sessionStorage.getItem('servicePool_entriesPerPage')) || 5;
// });

// const [currentPage, setCurrentPage] = useState(() => {
//   return Number(sessionStorage.getItem('servicePool_currentPage')) || 1;
// });
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//   sessionStorage.setItem('servicePool_searchTerm', searchTerm);
// }, [searchTerm]);

// useEffect(() => {
//   sessionStorage.setItem('servicePool_entriesPerPage', entriesPerPage);
// }, [entriesPerPage]);

// useEffect(() => {
//   sessionStorage.setItem('servicePool_currentPage', currentPage);
// }, [currentPage]);

// const handleSearchChange = (value) => {
//   setSearchTerm(value);
//   setCurrentPage(1);
//   sessionStorage.setItem('servicePool_currentPage', 1);
// };

// const handleEntriesPerPageChange = (value) => {
//   setEntriesPerPage(value);
//   setCurrentPage(1);
//   sessionStorage.setItem('servicePool_currentPage', 1);
// };

//   // Handle browser back button and swipe gesture when assignment form is open
//   useEffect(() => {
//     if (showAssignmentScreen) {
//       // Push a new history state to trap the back button
//       window.history.pushState({ formOpen: true }, '', window.location.pathname);
      
//       const handlePopState = (event) => {
//         if (showAssignmentScreen) {
//           // Prevent default back navigation
//           event.preventDefault();
//           // Close the assignment form instead of navigating away
//           setShowAssignmentScreen(false);
//           setCurrentRequest(null);
//           // Push a new state to handle any further back attempts
//           window.history.pushState({ formOpen: true }, '', window.location.pathname);
//         }
//       };
      
//       window.addEventListener('popstate', handlePopState);
      
//       // Cleanup event listener when form closes
//       return () => {
//         window.removeEventListener('popstate', handlePopState);
//       };
//     }
//   }, [showAssignmentScreen]);

//   // Handle recall service
// const handleRecallService = async (item) => {
//   const result = await Swal.fire({
//     icon: 'warning',
//     title: 'Recall Assignment?',
//     text: `Are you sure you want to recall the assignment for request ${item.request_id}? The status will revert to Open.`,
//     showCancelButton: true,
//     confirmButtonText: 'Yes, Recall',
//     cancelButtonText: 'Cancel',
//     confirmButtonColor: '#d33',
//     cancelButtonColor: '#3085d6',
//   });

//   if (result.isConfirmed) {
//     try {
//       Swal.fire({
//         title: 'Recalling Assignment...',
//         text: 'Please wait...',
//         allowOutsideClick: false,
//         didOpen: () => { Swal.showLoading(); },
//       });

//       // Find the latest assignment history record for this request
//       const historyData = historyResponse.data || [];
//       const latestAssignment = Array.isArray(historyData)
//         ? historyData.find(h => h.request === item.request_id && h.status === 'Pending')
//         : null;

//       // PUT 1: Update assignment history status to "Recalled"
//       if (latestAssignment) {
//         await axios.put(`${baseURL}/assignment-history/${latestAssignment.assignment_id}/`, {
//           status: 'Recalled',
//           updated_by: userId,
//           user_id: userId,
//           company_id: selectedCompany,
//         });
//       }

//       // PUT 2: Revert service pool to Open with no engineer
//       await axios.put(`${baseURL}/service-pools/${item.request_id}/`, {
//         status: 'Open',
//         assigned_engineer: null,
//         est_start_datetime: null,
//         est_end_datetime: null,
//         estimated_completion_time: null,
//         estimated_price: null,
//         updated_by: userId,
//         user_id: userId,
//         company_id: selectedCompany,
//         dynamics_service_order_no: null,
//       });

//       Swal.fire({
//         icon: 'success',
//         title: 'Recalled Successfully!',
//         text: `Request ${item.request_id} has been recalled and is now Open for reassignment.`,
//         confirmButtonColor: '#3085d6',
//       });

//       await fetchPoolData();
//       await fetchAssignmentHistory();

//     } catch (error) {
//       console.error('Error recalling assignment:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Recall Failed',
//         text: error.response?.data?.message || 'Failed to recall assignment. Please try again.',
//         confirmButtonColor: '#3085d6',
//       });
//     }
//   }
// };

//   // Fetch customers
//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/customers/`, {
//         params: {
//           user_id: userId,
//           company_id: selectedCompany
//         }
//       });
      
//       if (response.data.status === "success" && Array.isArray(response.data.data)) {
//         setCustomers(response.data.data);
//       } else {
//         setCustomers([]);
//       }
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//       setCustomers([]);
//     }
//   };

//   // Fetch service items
//   const fetchServiceItems = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/service-items/`, {
//         params: {
//           user_id: userId,
//           company_id: selectedCompany
//         }
//       });

//       if (response.data && response.data.data) {
//         setServiceItems(response.data.data);
//       } else {
//         setServiceItems([]);
//       }
//     } catch (error) {
//       console.error("Error fetching service items:", error);
//       setServiceItems([]);
//     }
//   };

//   // Fetch engineers and resources
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (selectedCompany && userId) {
//           const resourcesResponse = await axios.get(`${baseURL}/resources/?company_id=${selectedCompany}&user_id=${userId}`);
//           const resourceArray = Array.isArray(resourcesResponse.data?.data) ? resourcesResponse.data.data : [];
//           setResources(resourceArray);
          
//           // Fetch customers and service items when company and user are available
//           await fetchCustomers();
//           await fetchServiceItems();
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [selectedCompany, userId]);

//   // Fetch service pool data
//   const fetchPoolData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${baseURL}/service-pools/?user_id=${userId}&company_id=${selectedCompany}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const result = await response.json(); 
//       const responseData = result.data || result;
//       let dataArray = Array.isArray(responseData) ? responseData : [responseData];

//       dataArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       setData(dataArray);
//       setFilteredData(dataArray);
//     } catch (err) {
//       setError(err.message);
//       setData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPoolData();
//   }, [userId, selectedCompany]);

//   // Fetch assignment history
//     // Fetch assignment history - standalone so it can be called on demand
// const fetchAssignmentHistory = async () => {
//   try {
//     const response = await axios.get(`${baseURL}/assignment-history/`, {
//       params: {
//         user_id: userId,
//         company_id: selectedCompany
//       }
//     });
    
//     const historyData = response.data?.data || response.data || [];
//     const sortedHistory = Array.isArray(historyData) 
//       ? historyData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//       : [];
    
//     setHistoryResponse({ data: sortedHistory });
//   } catch (error) {
//     console.error("Error fetching assignment history:", error);
//     setHistoryResponse({ data: [] });
//   }
// };

// useEffect(() => {
//     if (userId && selectedCompany) {
//       fetchAssignmentHistory();
//     }
//   }, [userId, selectedCompany]);

// useEffect(() => {
//   let results = data;

//   if (selectedCompany) {
//     results = results.filter(item => item.company === selectedCompany);
//   }

//   if (searchTerm) {
//     results = results.filter(item =>
//       Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }

//   setFilteredData(results);

//   // ✅ CLAMP PAGE instead of reset
//   const totalPagesNow = Math.ceil(results.length / entriesPerPage);
//   const savedPage = Number(sessionStorage.getItem('servicePool_currentPage')) || 1;

//   if (savedPage > totalPagesNow && totalPagesNow > 0) {
//     setCurrentPage(totalPagesNow);
//   }

// }, [selectedCompany, searchTerm, data, entriesPerPage]);

//   // Get customer name by ID
//   const getCustomerName = (customerId) => {
//     if (!customerId) return "N/A";
    
//     const customer = customers.find(cust => cust.customer_id === customerId);
//     return customer ? customer.full_name || customer.username || "N/A" : customerId;
//   };

//   // Get customer details by ID
//   const getCustomerDetails = (customerId) => {
//     if (!customerId) return null;
//     return customers.find(cust => cust.customer_id === customerId) || null;
//   };

//   // Get service item details by ID
//   const getServiceItemDetails = (serviceItemId) => {
//     if (!serviceItemId) return null;
//     return serviceItems.find(item => item.service_item_id === serviceItemId) || null;
//   };

//   // Handle assign click
//   const handleAssignClick = (request) => {
//     setCurrentRequest(request);
//     setShowAssignmentScreen(true);
//   };

//   // Handle reopen service (keep your existing implementation)
//   const handleReopenService = async (item) => {
//     const result = await Swal.fire({
//       icon: 'question',
//       title: 'Re-open Service?',
//       text: `Are you sure you want to re-open request ${item.request_id}?`,
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Re-open',
//       cancelButtonText: 'Cancel',
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//     });

//     if (result.isConfirmed) {
//       try {
//         Swal.fire({
//           title: 'Re-opening Service...',
//           text: 'Please wait while we create a new service request.',
//           allowOutsideClick: false,
//           didOpen: () => { Swal.showLoading(); },
//         });

//         const payload = {
//           source_type: 'Re-Opened',
//           status: 'Open',
//           company: item.company,
//           service_item: item.service_item?.id || item.service_item,
//           customer: item.customer?.id || item.customer,
//           request_details: `Reopened from request ${item.request_id}. Original issue: ${item.request_details || 'No details provided'}`,
//           alert_details: item.alert_details,
//           pm_group: item.pm_group?.id || item.pm_group,
//           requested_by: item.requested_by,
//           preferred_date: new Date().toISOString().split('T')[0],
//           preferred_time: '09:00:00',
//           assigned_engineer: null,
//           estimated_completion_time: null,
//           estimated_price: null,
//           est_start_datetime: null,
//           est_end_datetime: null,
//           dynamics_service_order_no: null,
//           created_by: userId,
//           updated_by: userId,
//           user_id: userId,
//           company_id: selectedCompany,
//           reopened_from: item.request_id
//         };

//         Object.keys(payload).forEach(key => {
//           if (payload[key] === undefined || payload[key] === null) {
//             delete payload[key];
//           }
//         });

//         await axios.post(`${baseURL}/service-pools/`, payload);

//         try {
//           await axios.put(`${baseURL}/service-pools/${item.request_id}/`, {
//             status: 'Reopened',
//             updated_by: userId,
//             user_id: userId,
//             company_id: selectedCompany
//           });
//         } catch (updateError) {
//           console.warn('Note: Original request status update failed:', updateError);
//         }

//         Swal.fire({
//           icon: 'success',
//           title: 'Reopened Successfully!',
//           html: `<div>
//             <p>Original request: <strong>${item.request_id}</strong></p>
//             <p class="text-muted">You can now assign this new request to an engineer with updated dates.</p>
//           </div>`,
//           confirmButtonColor: '#3085d6',
//         });

//         await fetchPoolData();
        
//       } catch (error) {
//         console.error('Error reopening service:', error);
//         let errorMessage = 'Failed to reopen service request. Please try again.';
        
//         if (error.response?.data?.errors) {
//           const fieldErrors = error.response.data.errors;
//           errorMessage = 'Validation errors: ' + Object.keys(fieldErrors)
//             .map(field => `${field}: ${fieldErrors[field].join(', ')}`)
//             .join('; ');
//         } else if (error.response?.data?.message) {
//           errorMessage = error.response.data.message;
//         }

//         Swal.fire({
//           icon: 'error',
//           title: 'Re-open Failed',
//           text: errorMessage,
//           confirmButtonColor: '#3085d6',
//         });
//       }
//     }
//   };

//   if (loading) return <div className="service-container">Loading...</div>;
//   if (error) return <div className="service-container">Error: {error}</div>;

//   return (
//     <div className="service-container pm-container">
//       {!showAssignmentScreen ? (
//         <ServiceTableContent
//           selectedCompany={selectedCompany}
//           searchTerm={searchTerm}
//           entriesPerPage={entriesPerPage}
//          setSearchTerm={handleSearchChange}
// setEntriesPerPage={handleEntriesPerPageChange}
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           filteredData={filteredData}
//           historyResponse={historyResponse}
//           navigate={navigate}
//           handleAssignClick={handleAssignClick}
//           handleReopenService={handleReopenService}
//           getCustomerName={getCustomerName}
//           userId={userId}
//           serviceItems={serviceItems}
//           handleRecallService={handleRecallService}
//         />
//       ) : (
//         <AssignmentForm
//           currentRequest={currentRequest}
//           resources={resources} 
//           selectedCompany={selectedCompany}
//           userId={userId}
//           onClose={() => setShowAssignmentScreen(false)}
//           onSuccess={fetchPoolData}
//           customers={customers}
//           serviceItems={serviceItems}
//           getCustomerDetails={getCustomerDetails}
//           getServiceItemDetails={getServiceItemDetails}
//           onSuccess={() => {
//             fetchPoolData();
//             fetchAssignmentHistory();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default ServicePoolTable;


import React, { useState, useEffect, useContext } from "react";
import "./ServicePool.css";
import axios from "axios";
import baseURL from "../ApiUrl/Apiurl";
import { useNavigate } from 'react-router-dom';
import { useCompany } from "../AuthContext/CompanyContext";
import Swal from 'sweetalert2';
import { AuthContext } from "../AuthContext/AuthContext";
import AssignmentForm from "./AssignmentForm";
import ServiceTableContent from "./ServiceTableContent";

const ServicePoolTable = () => { 
  const { userId } = useContext(AuthContext);
  const { selectedCompany } = useCompany();
  const navigate = useNavigate();
  
  // State management
  const [showAssignmentScreen, setShowAssignmentScreen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState([]);
  const [historyResponse, setHistoryResponse] = useState({ data: [] });
  const [customers, setCustomers] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  
  // Pagination states (server-side)
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem('servicePool_searchTerm') || '';
  });
  const [entriesPerPage, setEntriesPerPage] = useState(() => {
    return Number(sessionStorage.getItem('servicePool_entriesPerPage')) || 10;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(sessionStorage.getItem('servicePool_currentPage')) || 1;
  });
  
  // Server-side pagination data
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Save pagination state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('servicePool_searchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('servicePool_entriesPerPage', entriesPerPage);
  }, [entriesPerPage]);

  useEffect(() => {
    sessionStorage.setItem('servicePool_currentPage', currentPage);
  }, [currentPage]);

  // Handle browser back button and swipe gesture when assignment form is open
  useEffect(() => {
    if (showAssignmentScreen) {
      window.history.pushState({ formOpen: true }, '', window.location.pathname);
      
      const handlePopState = (event) => {
        if (showAssignmentScreen) {
          event.preventDefault();
          setShowAssignmentScreen(false);
          setCurrentRequest(null);
          window.history.pushState({ formOpen: true }, '', window.location.pathname);
        }
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showAssignmentScreen]);

  // Handle recall service
  const handleRecallService = async (item) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Recall Assignment?',
      text: `Are you sure you want to recall the assignment for request ${item.request_id}? The status will revert to Open.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Recall',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Recalling Assignment...',
          text: 'Please wait...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); },
        });

        const historyData = historyResponse.data || [];
        const latestAssignment = Array.isArray(historyData)
          ? historyData.find(h => h.request === item.request_id && h.status === 'Pending')
          : null;

        if (latestAssignment) {
          await axios.put(`${baseURL}/assignment-history/${latestAssignment.assignment_id}/`, {
            status: 'Recalled',
            updated_by: userId,
            user_id: userId,
            company_id: selectedCompany,
          });
        }

        await axios.put(`${baseURL}/service-pools/${item.request_id}/`, {
          status: 'Open',
          assigned_engineer: null,
          est_start_datetime: null,
          est_end_datetime: null,
          estimated_completion_time: null,
          estimated_price: null,
          updated_by: userId,
          user_id: userId,
          company_id: selectedCompany,
          dynamics_service_order_no: null,
        });

        Swal.fire({
          icon: 'success',
          title: 'Recalled Successfully!',
          text: `Request ${item.request_id} has been recalled and is now Open for reassignment.`,
          confirmButtonColor: '#3085d6',
        });

        await fetchPoolData(currentPage, entriesPerPage, searchTerm);
        await fetchAssignmentHistory();

      } catch (error) {
        console.error('Error recalling assignment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Recall Failed',
          text: error.response?.data?.message || 'Failed to recall assignment. Please try again.',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${baseURL}/customers/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany,
          page: 1,
          page_size: 100
        }
      });
      
      if (response.data.status === "success" && Array.isArray(response.data.data)) {
        setCustomers(response.data.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    }
  };

  // Fetch service items with pagination
  const fetchServiceItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/service-items/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany,
          page: 1,
          page_size: 100
        }
      });

      if (response.data && response.data.data) {
        setServiceItems(response.data.data);
      } else {
        setServiceItems([]);
      }
    } catch (error) {
      console.error("Error fetching service items:", error);
      setServiceItems([]);
    }
  };

  // Fetch engineers and resources with pagination
  const fetchResources = async () => {
    try {
      if (selectedCompany && userId) {
        const response = await axios.get(`${baseURL}/resources/?company_id=${selectedCompany}&user_id=${userId}&page=1&page_size=100`);
        const resourceArray = Array.isArray(response.data?.data) ? response.data.data : [];
        setResources(resourceArray);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources([]);
    }
  };

  // Fetch service pool data with pagination
  const fetchPoolData = async (page = currentPage, size = entriesPerPage, search = searchTerm) => {
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

      const response = await fetch(`${baseURL}/service-pools/?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const result = await response.json();
      const responseData = result.data || result;
      let dataArray = Array.isArray(responseData) ? responseData : [responseData];
      
      // Sort by created_at descending
      dataArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      const pagination = result.pagination || {};
      
      setData(dataArray);
      setTotalCount(pagination.total_count || dataArray.length);
      setTotalPages(pagination.total_pages || 1);
      setHasNextPage(pagination.has_next || false);
      setHasPreviousPage(pagination.has_previous || false);
      setCurrentPage(pagination.current_page || 1);
      
    } catch (err) {
      setError(err.message);
      setData([]);
      setTotalCount(0);
      setTotalPages(1);
      setHasNextPage(false);
      setHasPreviousPage(false);
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
          fetchResources(),
          fetchCustomers(),
          fetchServiceItems(),
          fetchPoolData(1, entriesPerPage, searchTerm),
          fetchAssignmentHistory()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
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
        fetchPoolData(currentPage, entriesPerPage, searchTerm);
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [currentPage, entriesPerPage, searchTerm]);

  // Fetch assignment history
  const fetchAssignmentHistory = async () => {
    try {
      const response = await axios.get(`${baseURL}/assignment-history/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany,
          page: 1,
          page_size: 100
        }
      });
      
      const historyData = response.data?.data || response.data || [];
      const sortedHistory = Array.isArray(historyData) 
        ? historyData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : [];
      
      setHistoryResponse({ data: sortedHistory });
    } catch (error) {
      console.error("Error fetching assignment history:", error);
      setHistoryResponse({ data: [] });
    }
  };

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    if (!customerId) return "N/A";
    
    const customer = customers.find(cust => cust.customer_id === customerId);
    return customer ? customer.full_name || customer.username || "N/A" : customerId;
  };

  // Get customer details by ID
  const getCustomerDetails = (customerId) => {
    if (!customerId) return null;
    return customers.find(cust => cust.customer_id === customerId) || null;
  };

  // Get service item details by ID
  const getServiceItemDetails = (serviceItemId) => {
    if (!serviceItemId) return null;
    return serviceItems.find(item => item.service_item_id === serviceItemId) || null;
  };

  // Handle assign click
  const handleAssignClick = (request) => {
    setCurrentRequest(request);
    setShowAssignmentScreen(true);
  };

  // Handle reopen service
  const handleReopenService = async (item) => {
    const result = await Swal.fire({
      icon: 'question',
      title: 'Re-open Service?',
      text: `Are you sure you want to re-open request ${item.request_id}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Re-open',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Re-opening Service...',
          text: 'Please wait while we create a new service request.',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); },
        });

        const payload = {
          source_type: 'Re-Opened',
          status: 'Open',
          company: item.company,
          service_item: item.service_item?.id || item.service_item,
          customer: item.customer?.id || item.customer,
          request_details: `Reopened from request ${item.request_id}. Original issue: ${item.request_details || 'No details provided'}`,
          alert_details: item.alert_details,
          pm_group: item.pm_group?.id || item.pm_group,
          requested_by: item.requested_by,
          preferred_date: new Date().toISOString().split('T')[0],
          preferred_time: '09:00:00',
          assigned_engineer: null,
          estimated_completion_time: null,
          estimated_price: null,
          est_start_datetime: null,
          est_end_datetime: null,
          dynamics_service_order_no: null,
          created_by: userId,
          updated_by: userId,
          user_id: userId,
          company_id: selectedCompany,
          reopened_from: item.request_id
        };

        Object.keys(payload).forEach(key => {
          if (payload[key] === undefined || payload[key] === null) {
            delete payload[key];
          }
        });

        await axios.post(`${baseURL}/service-pools/`, payload);

        try {
          await axios.put(`${baseURL}/service-pools/${item.request_id}/`, {
            status: 'Reopened',
            updated_by: userId,
            user_id: userId,
            company_id: selectedCompany
          });
        } catch (updateError) {
          console.warn('Note: Original request status update failed:', updateError);
        }

        Swal.fire({
          icon: 'success',
          title: 'Reopened Successfully!',
          html: `<div>
            <p>Original request: <strong>${item.request_id}</strong></p>
            <p class="text-muted">You can now assign this new request to an engineer with updated dates.</p>
          </div>`,
          confirmButtonColor: '#3085d6',
        });

        await fetchPoolData(currentPage, entriesPerPage, searchTerm);
        
      } catch (error) {
        console.error('Error reopening service:', error);
        let errorMessage = 'Failed to reopen service request. Please try again.';
        
        if (error.response?.data?.errors) {
          const fieldErrors = error.response.data.errors;
          errorMessage = 'Validation errors: ' + Object.keys(fieldErrors)
            .map(field => `${field}: ${fieldErrors[field].join(', ')}`)
            .join('; ');
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Re-open Failed',
          text: errorMessage,
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  // Handle entries per page change
  const handleEntriesPerPageChange = (value) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
    sessionStorage.setItem('servicePool_currentPage', 1);
  };

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    sessionStorage.setItem('servicePool_currentPage', 1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div className="service-container">Loading...</div>;
  if (error) return <div className="service-container">Error: {error}</div>;

  return (
    <div className="service-container pm-container">
      {!showAssignmentScreen ? (
        <ServiceTableContent
          selectedCompany={selectedCompany}
          searchTerm={searchTerm}
          entriesPerPage={entriesPerPage}
          setSearchTerm={handleSearchChange}
          setEntriesPerPage={handleEntriesPerPageChange}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          data={data} // Pass the paginated data directly
          historyResponse={historyResponse}
          navigate={navigate}
          handleAssignClick={handleAssignClick}
          handleReopenService={handleReopenService}
          handleRecallService={handleRecallService}
          getCustomerName={getCustomerName}
          userId={userId}
          serviceItems={serviceItems}
          fetching={fetching}
        />
      ) : (
        <AssignmentForm
          currentRequest={currentRequest}
          resources={resources} 
          selectedCompany={selectedCompany}
          userId={userId}
          onClose={() => setShowAssignmentScreen(false)}
          onSuccess={() => {
            fetchPoolData(currentPage, entriesPerPage, searchTerm);
            fetchAssignmentHistory();
          }}
          customers={customers}
          serviceItems={serviceItems}
          getCustomerDetails={getCustomerDetails}
          getServiceItemDetails={getServiceItemDetails}
        />
      )}
    </div>
  );
};

export default ServicePoolTable;