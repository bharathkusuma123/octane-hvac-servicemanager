// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import './ServicePool.css';
// import { useCompany } from "../AuthContext/CompanyContext";
// import { AuthContext } from "../AuthContext/AuthContext";
// import baseURL from '../ApiUrl/Apiurl';

// const ServiceRequestDetail = () => { 
//   const { requestId } = useParams();
//   const { userId } = useContext(AuthContext);
//   const [requestData, setRequestData] = useState(null);
//   const [assignmentHistory, setAssignmentHistory] = useState([]);
//   const [serviceItemData, setServiceItemData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [serviceItemLoading, setServiceItemLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('history'); // 'history' or 'serviceItem'
//   const location = useLocation();
//   const serviceItem = location.state?.service_item;
//   const { selectedCompany } = useCompany();

//   console.log("User ID from localStorage:", userId);
//   console.log("Selected Company from context:", selectedCompany);
//   console.log("Service Item ID:", serviceItem);

//   // Fetch assignment history and request details
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch request details
//         const requestResponse = await axios({
//           method: 'get',
//           url: `${baseURL}/service-pools/${requestId}/`,
//           params: {
//             user_id: userId,
//             company_id: selectedCompany
//           }
//         });

//         // Fetch assignment history
//         const historyResponse = await axios.get(`${baseURL}/assignment-history/`, {
//           params: {
//             user_id: userId,
//             company_id: selectedCompany
//           }
//         });

//         // Normalize history data
//         let historyData = historyResponse.data;
//         if (historyData && historyData.data && Array.isArray(historyData.data)) {
//           historyData = historyData.data;
//         }

//         // Filter by request and sort by assigned_at DESC
//         const filteredHistory = Array.isArray(historyData)
//           ? historyData
//               .filter(item => item.request === requestId)
//               .sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at))
//           : [];

//         if (requestResponse.data) {
//           setRequestData(requestResponse.data.data || requestResponse.data);
//           setAssignmentHistory(filteredHistory);
//         } else {
//           throw new Error('No data received from server');
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Failed to fetch data');
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [requestId, userId, selectedCompany]);

//   // Fetch service item details when serviceItem is available and tab is active
//   useEffect(() => {
//     const fetchServiceItem = async () => {
//       if (serviceItem && activeTab === 'serviceItem' && !serviceItemData) {
//         try {
//           setServiceItemLoading(true);
//           const response = await axios.get(`${baseURL}/service-items/${serviceItem}/`, {
//             params: {
//               user_id: userId,
//               company_id: selectedCompany
//             }
//           });
          
//           if (response.data && response.data.data) {
//             setServiceItemData(response.data.data);
//           } else {
//             throw new Error('No service item data received');
//           }
//         } catch (err) {
//           console.error('Error fetching service item:', err);
//           setError(err.response?.data?.message || err.message || 'Failed to fetch service item details');
//         } finally {
//           setServiceItemLoading(false);
//         }
//       }
//     };

//     fetchServiceItem();
//   }, [serviceItem, activeTab, serviceItemData, userId, selectedCompany]);

//   if (loading) return <div className="loading">Loading request details...</div>;
//   if (error) return <div className="error">Error: {error}</div>;
//   if (!requestData) return <div className="error">No request data found</div>;

//   return (
//     <div className="service-detail-container">
//       {/* Tab Navigation */}
//       <div className="tab-navigation">
//         <button 
//           className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
//           onClick={() => setActiveTab('history')}
//         >
//           Assignment History
//         </button>
//         <button 
//           className={`tab-button ${activeTab === 'serviceItem' ? 'active' : ''}`}
//           onClick={() => setActiveTab('serviceItem')}
//         >
//           Service Item Details
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div className="tab-content">
//         {activeTab === 'history' && (
//           <div className="assignment-history-section">
//             <h3 className="history-title">Assignment History</h3>
//             {assignmentHistory.length > 0 ? (
//               <div className="table history-table">
//                 <div className="history-header">
//                   <div className="history-header-cell">Service Request ID</div>
//                   <div className="history-header-cell">Assignment ID</div>
//                   <div className="history-header-cell">Assigned At</div>
//                   <div className="history-header-cell">Engineer</div>
//                   <div className="history-header-cell">Status</div>
//                   <div className="history-header-cell">Decline Reason</div>
//                   <div className="history-header-cell">Assigned By</div>
//                   <div className="history-header-cell">Service Item</div>
//                 </div>
//                 {assignmentHistory.map((assignment) => (
//                   <div key={assignment.assignment_id} className="history-row">
//                     <div className="history-cell">{assignment.request}</div>
//                     <div className="history-cell">{assignment.assignment_id}</div>
//                     <div className="history-cell">
//                       {new Date(assignment.assigned_at).toLocaleString()}
//                     </div>
//                     <div className="history-cell">{assignment.assigned_engineer || assignment.assigned_engineer}</div>
//                     <div className="history-cell">{assignment.status}</div>
//                     <div className="history-cell">{assignment.decline_reason || 'N/A'}</div>
//                     <div className="history-cell">{assignment.assigned_by}</div>
//                     <div className="history-cell">{serviceItem}</div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="no-history">No assignment history found for this request</div>
//             )}
//           </div>
//         )}

//         {activeTab === 'serviceItem' && (
//           <div className="service-item-section">
//             <h3 className="service-item-title">Service Item Details</h3>
            
//             {serviceItemLoading ? (
//               <div className="loading">Loading service item details...</div>
//             ) : serviceItemData ? (
//               <div className="table history-table">
//                 <div className="history-header">
//                   <div className="history-header-cell">Field</div>
//                   <div className="history-header-cell">Value</div>
//                 </div>
                
//                 {/* Service Item Details Rows */}
//                 <div className="history-row">
//                   <div className="history-cell">Service Item ID</div>
//                   <div className="history-cell">{serviceItemData.service_item_id}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Service Item Name</div>
//                   <div className="history-cell">{serviceItemData.service_item_name}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Serial Number</div>
//                   <div className="history-cell">{serviceItemData.serial_number}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">PCB Serial Number</div>
//                   <div className="history-cell">{serviceItemData.pcb_serial_number}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Location</div>
//                   <div className="history-cell">{serviceItemData.location}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Location Latitude</div>
//                   <div className="history-cell">{serviceItemData.location_latitude}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Location Longitude</div>
//                   <div className="history-cell">{serviceItemData.location_longitude}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Installation Date</div>
//                   <div className="history-cell">{serviceItemData.installation_date}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Warranty Start Date</div>
//                   <div className="history-cell">{serviceItemData.warranty_start_date}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Warranty End Date</div>
//                   <div className="history-cell">{serviceItemData.warranty_end_date}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Contract End Date</div>
//                   <div className="history-cell">{serviceItemData.contract_end_date}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Status</div>
//                   <div className="history-cell">{serviceItemData.status}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">IoT Status</div>
//                   <div className="history-cell">{serviceItemData.iot_status}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Last Checked</div>
//                   <div className="history-cell">
//                     {new Date(serviceItemData.last_checked).toLocaleString()}
//                   </div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Last Service</div>
//                   <div className="history-cell">
//                     {serviceItemData.last_service ? new Date(serviceItemData.last_service).toLocaleString() : 'N/A'}
//                   </div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Product Description</div>
//                   <div className="history-cell">{serviceItemData.product_description}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">BC Number</div>
//                   <div className="history-cell">{serviceItemData.bc_number || 'N/A'}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Ship to Code</div>
//                   <div className="history-cell">{serviceItemData.ship_to_code || 'N/A'}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Created At</div>
//                   <div className="history-cell">
//                     {new Date(serviceItemData.created_at).toLocaleString()}
//                   </div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Updated At</div>
//                   <div className="history-cell">
//                     {new Date(serviceItemData.updated_at).toLocaleString()}
//                   </div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Created By</div>
//                   <div className="history-cell">{serviceItemData.created_by}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Updated By</div>
//                   <div className="history-cell">{serviceItemData.updated_by}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Company</div>
//                   <div className="history-cell">{serviceItemData.company}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Product</div>
//                   <div className="history-cell">{serviceItemData.product}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Customer</div>
//                   <div className="history-cell">{serviceItemData.customer}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">PM Group</div>
//                   <div className="history-cell">{serviceItemData.pm_group}</div>
//                 </div>
//               </div>
//             ) : (
//               <div className="no-service-item">
//                 {serviceItem ? 'No service item details found' : 'No service item ID provided'}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ServiceRequestDetail;

// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './ServicePool.css';
// import { useCompany } from "../AuthContext/CompanyContext";
// import { AuthContext } from "../AuthContext/AuthContext";
// import baseURL from '../ApiUrl/Apiurl';

// const ServiceRequestDetail = () => { 
//   const { requestId } = useParams();
//    const { userId } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [requestData, setRequestData] = useState(null);
//   const [assignmentHistory, setAssignmentHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { selectedCompany } = useCompany(); // Get selected company from context
//     console.log("User ID from localStorage:", userId);
//     console.log("Selected Company from context:", selectedCompany);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//      // Fetch request details (user_id & company_id in request body)
// const requestResponse = await axios({
//   method: 'get',
//   url: `${baseURL}/service-pools/${requestId}/`,
//   params: {
//     user_id: userId,
//     company_id: selectedCompany
//   }
// });

// // Fetch assignment history (user_id & company_id in query params)
// const historyResponse = await axios.get(`${baseURL}/assignment-history/`, {
//   params: {
//     user_id: userId,
//     company_id: selectedCompany
//   }
// });

// // Normalize history data
// let historyData = historyResponse.data;
// if (historyData && historyData.data && Array.isArray(historyData.data)) {
//   historyData = historyData.data;
// }


//       // Filter by request and sort by assigned_at DESC
//       const filteredHistory = Array.isArray(historyData)
//         ? historyData
//             .filter(item => item.request === requestId)
//             .sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at))
//         : [];

//       if (requestResponse.data) {
//         setRequestData(requestResponse.data.data || requestResponse.data);
//         setAssignmentHistory(filteredHistory);
//       } else {
//         throw new Error('No data received from server');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to fetch data');
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, [requestId]);


//   if (loading) return <div className="loading">Loading request details...</div>;
//   if (error) return <div className="error">Error: {error}</div>;
//   if (!requestData) return <div className="error">No request data found</div>;

//   return (
//     <div className="service-detail-container">

//   <div className="assignment-history-section">
//         <h3 className="history-title">Assignment History</h3>
//         {assignmentHistory.length > 0 ? (
//           <div className=" table history-table">
//             <div className="history-header">
//               <div className="history-header-cell">Service Request ID</div>
//               <div className="history-header-cell">Assignment ID</div>
//               <div className="history-header-cell">Assigned At</div>
//               <div className="history-header-cell">Engineer</div>
//               <div className="history-header-cell">Status</div>
//               <div className="history-header-cell">Decline Reason</div>
//               <div className="history-header-cell">Assigned By</div>
//             </div>
//             {assignmentHistory.map((assignment) => (
//               <div key={assignment.assignment_id} className="history-row">
//                  <div className="history-cell">{assignment.request}</div>
//                 <div className="history-cell">{assignment.assignment_id}</div>
//                 <div className="history-cell">
//                   {new Date(assignment.assigned_at).toLocaleString()}
//                 </div>
//                 <div className="history-cell">{assignment.assigned_engineer || assignment.assigned_engineer}</div>
//                 <div className="history-cell">{assignment.status}</div>
//                 <div className="history-cell">{assignment.decline_reason || 'N/A'}</div>
//                 <div className="history-cell">{assignment.assigned_by}</div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="no-history">No assignment history found for this request</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ServiceRequestDetail;




import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ServicePool.css';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";
import baseURL from '../ApiUrl/Apiurl';
import { Edit, Save, X } from 'lucide-react';

const ServiceRequestDetail = () => { 
  const { requestId } = useParams();
  const { userId } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCompany } = useCompany();

  // Get all data passed from navigation
  const {
    serviceRequest,
    serviceItemDetails,
    engineerStatus,
    customerName
  } = location.state || {};

  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [problemTypes, setProblemTypes] = useState([]);
  const [serviceReport, setServiceReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('requestDetails');
  
  // Problem type editing state
  const [isEditingProblemType, setIsEditingProblemType] = useState(false);
  const [selectedProblemType, setSelectedProblemType] = useState('');
  const [problemTypeLoading, setProblemTypeLoading] = useState(false);

  // Format date and time functions
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

  // Fetch problem types
  useEffect(() => {
    const fetchProblemTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}/problem-types/`, {
          params: {
            user_id: userId,
            company_id: selectedCompany
          }
        });
        
        if (response.data.status === 'success') {
          setProblemTypes(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching problem types:', error);
      }
    };

    fetchProblemTypes();
  }, [userId, selectedCompany]);

  // Fetch only assignment history
  useEffect(() => {
    const fetchAssignmentHistory = async () => {
      try {
        setLoading(true);
        
        const historyResponse = await axios.get(`${baseURL}/assignment-history/`, {
          params: {
            user_id: userId,
            company_id: selectedCompany
          }
        });

        let historyData = historyResponse.data;
        if (historyData && historyData.data && Array.isArray(historyData.data)) {
          historyData = historyData.data;
        }

        const filteredHistory = Array.isArray(historyData)
          ? historyData
              .filter(item => item.request === requestId)
              .sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at))
          : [];

        setAssignmentHistory(filteredHistory);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch assignment history');
        console.error('Error fetching assignment history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentHistory();
  }, [requestId, userId, selectedCompany]);

  // Fetch service report data
  useEffect(() => {
    const fetchServiceReport = async () => {
      try {
        setReportLoading(true);
        
        const response = await axios.get(`${baseURL}/service-req-items-history/`, {
          params: {
            user_id: userId,
            company_id: selectedCompany
          }
        });

        let reportData = response.data;
        console.log("Raw service report data:", reportData);
        
        // Handle different response formats
        if (reportData && reportData.data && Array.isArray(reportData.data)) {
          reportData = reportData.data;
        } else if (Array.isArray(reportData)) {
          reportData = reportData;
        } else {
          reportData = [];
        }

        // Filter by current service request
        const filteredReport = reportData.filter(item => 
          item.service_request === requestId
        );
        console.log("Filtered service report data:", filteredReport);

        setServiceReport(filteredReport);
      } catch (err) {
        console.error('Error fetching service report:', err);
        // Don't set error state for service report to avoid breaking the UI
      } finally {
        setReportLoading(false);
      }
    };

    fetchServiceReport();
  }, [requestId, userId, selectedCompany]);

  // Get problem type name from ID
  const getProblemTypeName = () => {
    if (!serviceRequest?.problem_type) return 'Unknown';
    const problemType = problemTypes.find(pt => pt.problem_type_id === serviceRequest.problem_type);
    return problemType ? problemType.name : serviceRequest.problem_type;
  };

  // Handle problem type edit
  const handleProblemTypeEdit = () => {
    setIsEditingProblemType(true);
    setSelectedProblemType(serviceRequest?.problem_type || '');
  };

  // Handle problem type save
  const handleProblemTypeSave = async () => {
    if (!selectedProblemType) return;

    setProblemTypeLoading(true);
    try {
      const updateResponse = await axios.put(
        `${baseURL}/service-pools/${requestId}/`,
        {
          problem_type: selectedProblemType,
          user_id: userId,
          company_id: selectedCompany
        }
      );

      console.log("Update response:", updateResponse.data);

      if (updateResponse.data.status === "success") {
        // Update UI state
        if (location.state) {
          location.state.serviceRequest.problem_type = selectedProblemType;
        }

        setIsEditingProblemType(false);

        // Show success alert
        alert("Problem Type updated successfully!");

        // Navigate back to service pool page
        navigate("/servicemanager/service-pool");
      }
    } catch (error) {
      console.error("Error updating problem type:", error);
      alert("Failed to update problem type. Please try again.");
    } finally {
      setProblemTypeLoading(false);
    }
  };

  // Handle problem type cancel
  const handleProblemTypeCancel = () => {
    setIsEditingProblemType(false);
    setSelectedProblemType(serviceRequest?.problem_type || '');
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  // If no data was passed, show error
  if (!serviceRequest) {
    return (
      <div className="error">
        No service request data found. Please go back and click on a request ID from the table.
        <button 
          onClick={handleBackClick}
          className="btn btn-primary mt-3"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="service-detail-container">
      {/* Page Header with Back Button */}
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title">Service Request Details</h1>
          <p className="page-subtitle">Request ID: {requestId}</p>
        </div>
        <button 
          onClick={handleBackClick}
          className="btn btn-outline-primary"
          style={{
            borderColor: '#0096d6',
            color: '#0096d6',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#0096d6';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#0096d6';
          }}
        >
          ← Back
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation mb-4">
        <button 
          className={`tab-button ${activeTab === 'requestDetails' ? 'active' : ''}`}
          onClick={() => setActiveTab('requestDetails')}
        >
          Request Details
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Assignment History
        </button>
        {/* <button 
          className={`tab-button ${activeTab === 'serviceItem' ? 'active' : ''}`}
          onClick={() => setActiveTab('serviceItem')}
        >
          Service Item Details
        </button> */}
        <button 
          className={`tab-button ${activeTab === 'serviceReport' ? 'active' : ''}`}
          onClick={() => setActiveTab('serviceReport')}
        >
          Service Report
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'requestDetails' && (
          <div className="request-details-section">
            <h3 className="section-title">Service Request Information</h3>
            <div className="table details-table">
              <div className="history-header">
                <div className="history-header-cell">Field</div>
                <div className="history-header-cell">Value</div>
              </div>
              
              {/* Request Details - All data from table row */}
              <div className="history-row">
                <div className="history-cell">Request ID</div>
                <div className="history-cell">{serviceRequest.request_id}</div>
              </div>
              
              {/* Problem Type Row with Edit Functionality */}
              <div className="history-row">
                <div className="history-cell">Request/Problem Type</div>
                <div className="history-cell">
                  {isEditingProblemType ? (
                    <div className="problem-type-edit-container">
                      <select
                        value={selectedProblemType}
                        onChange={(e) => setSelectedProblemType(e.target.value)}
                        className="problem-type-select"
                        disabled={problemTypeLoading}
                      >
                        <option value="">Select Problem Type</option>
                        {problemTypes.map((type) => (
                          <option key={type.problem_type_id} value={type.problem_type_id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      <div className="problem-type-actions">
                        <button
                          onClick={handleProblemTypeSave}
                          disabled={problemTypeLoading || !selectedProblemType}
                          className="problem-type-save-btn"
                          title="Save"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleProblemTypeCancel}
                          disabled={problemTypeLoading}
                          className="problem-type-cancel-btn"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="problem-type-display-container">
                      <span>{getProblemTypeName()}</span>
                      <button 
                        onClick={handleProblemTypeEdit}
                        className="problem-type-edit-btn"
                        title="Edit Problem Type"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="history-row">
                <div className="history-cell">Requested By</div>
                <div className="history-cell">{customerName || serviceRequest.requested_by}</div>
              </div>
              <div className="history-row">
                <div className="history-cell">Request Details</div>
                <div className="history-cell">{serviceRequest.request_details || "N/A"}</div>
              </div>
              <div className="history-row">
                <div className="history-cell">Service Item ID</div>
                <div className="history-cell">{serviceRequest.service_item}</div>
              </div>
              <div className="history-row">
                <div className="history-cell">Location</div>
                <div className="history-cell">
                  {serviceItemDetails?.location || "Location not found"}
                </div>
              </div>
              <div className="history-row">
                <div className="history-cell">Preferred Date/Time</div>
                <div className="history-cell">
                  {serviceRequest.preferred_date && serviceRequest.preferred_time 
                    ? formatDateTime(`${serviceRequest.preferred_date}T${serviceRequest.preferred_time}`)
                    : serviceRequest.preferred_date 
                      ? formatDate(serviceRequest.preferred_date)
                      : '-'
                  }
                </div>
              </div>
              <div className="history-row">
                <div className="history-cell">Created Date/Time</div>
                <div className="history-cell">
                  {formatDateTime(serviceRequest.created_at)}
                </div>
              </div>
              <div className="history-row">
                <div className="history-cell">Status</div>
                <div className="history-cell">{serviceRequest.status}</div>
              </div>
              <div className="history-row">
                <div className="history-cell">Assigned Engineer</div>
                <div className="history-cell">{serviceRequest.assigned_engineer || "N/A"}</div>
              </div>
              <div className="history-row">
                <div className="history-cell">Engineer Status</div>
                <div className="history-cell">
                  {engineerStatus === "Pending" && (
                    <span className="badge bg-warning text-dark">Pending</span>
                  )}
                  {engineerStatus === "Accepted" && (
                    <span className="badge bg-success">Accepted</span>
                  )}
                  {engineerStatus === "Declined" && (
                    <span className="badge bg-danger">Rejected</span>
                  )}
                  {!engineerStatus || engineerStatus === "N/A" && "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="assignment-history-section">
            <h3 className="section-title">Assignment History</h3>
            {loading ? (
              <div className="loading">Loading assignment history...</div>
            ) : assignmentHistory.length > 0 ? (
              <div className="table history-table">
                <div className="history-header">
                  <div className="history-header-cell">Assignment ID</div>
                  <div className="history-header-cell">Assigned At</div>
                  <div className="history-header-cell">Engineer</div>
                  <div className="history-header-cell">Status</div>
                  <div className="history-header-cell">Decline Reason</div>
                  <div className="history-header-cell">Assigned By</div>
                </div>
                {assignmentHistory.map((assignment) => (
                  <div key={assignment.assignment_id} className="history-row">
                    <div className="history-cell">{assignment.assignment_id}</div>
                    <div className="history-cell">
                      {formatDateTime(assignment.assigned_at)}
                    </div>
                    <div className="history-cell">{assignment.assigned_engineer || 'N/A'}</div>
                    <div className="history-cell">{assignment.status}</div>
                    <div className="history-cell">{assignment.decline_reason || 'N/A'}</div>
                    <div className="history-cell">{assignment.assigned_by || 'N/A'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-history">No assignment history found for this request</div>
            )}
          </div>
        )}

        {activeTab === 'serviceItem' && (
          <div className="service-item-section">
            <h3 className="section-title">Service Item Details</h3>
            
            {serviceItemDetails ? (
              <div className="table history-table">
                <div className="history-header">
                  <div className="history-header-cell">Field</div>
                  <div className="history-header-cell">Value</div>
                </div>
                
                {/* Service Item Details */}
                <div className="history-row">
                  <div className="history-cell">Service Item ID</div>
                  <div className="history-cell">{serviceItemDetails.service_item_id}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Service Item Name</div>
                  <div className="history-cell">{serviceItemDetails.service_item_name || 'N/A'}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Serial Number</div>
                  <div className="history-cell">{serviceItemDetails.serial_number || 'N/A'}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Location</div>
                  <div className="history-cell">{serviceItemDetails.location || 'N/A'}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Installation Date</div>
                  <div className="history-cell">{serviceItemDetails.installation_date || 'N/A'}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Warranty Start Date</div>
                  <div className="history-cell">{serviceItemDetails.warranty_start_date || 'N/A'}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Warranty End Date</div>
                  <div className="history-cell">{serviceItemDetails.warranty_end_date || 'N/A'}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Status</div>
                  <div className="history-cell">{serviceItemDetails.status || 'N/A'}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Product Description</div>
                  <div className="history-cell">{serviceItemDetails.product_description || 'N/A'}</div>
                </div>
              </div>
            ) : (
              <div className="no-service-item">
                No service item details available
              </div>
            )}
          </div>
        )}

        {activeTab === 'serviceReport' && (
          <div className="service-report-section">
            <h3 className="section-title">Service Report</h3>
            
            {reportLoading ? (
              <div className="loading">Loading service report...</div>
            ) : serviceReport.length > 0 ? (
              <div className="table history-table">
                <div className="history-header">
                  <div className="history-header-cell">SR Item ID</div>
                  <div className="history-header-cell">Component Type</div>
                    <div className="history-header-cell">Component</div>
                  <div className="history-header-cell">Old Serial No</div>
                  <div className="history-header-cell">New Serial No</div>
                  <div className="history-header-cell">Task Type</div>
                  <div className="history-header-cell">Warranty Start</div>
                  <div className="history-header-cell">Warranty End</div>
                  <div className="history-header-cell">Action Taken</div>
                  <div className="history-header-cell">Remarks</div>
                  <div className="history-header-cell">Serviced At</div>
                  <div className="history-header-cell">Serviced By</div>
                </div>
                {serviceReport.map((report) => (
                  <div key={report.sr_item_id} className="history-row">
                    <div className="history-cell">{report.sr_item_id}</div>
                    <div className="history-cell">{report.component_type || 'N/A'}</div>
                    <div className="history-cell">{report.component || 'N/A'}</div>
                    <div className="history-cell">{report.old_comp_serial_no || 'N/A'}</div>
                    <div className="history-cell">{report.new_comp_serial_no || 'N/A'}</div>
                    <div className="history-cell">{report.task_type || 'N/A'}</div>
                    <div className="history-cell">{formatDate(report.warranty_start_date)}</div>
                    <div className="history-cell">{formatDate(report.warranty_end_date)}</div>
                    <div className="history-cell">{report.action_taken || 'N/A'}</div>
                    <div className="history-cell">{report.remarks || 'N/A'}</div>
                    <div className="history-cell">{formatDateTime(report.serviced_at)}</div>
                    <div className="history-cell">{report.serviced_by || 'N/A'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-report">No service report found for this request</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestDetail;