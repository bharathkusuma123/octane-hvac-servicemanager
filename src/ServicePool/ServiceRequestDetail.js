// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './ServicePool.css';
// import { useCompany } from "../AuthContext/CompanyContext";
// import { AuthContext } from "../AuthContext/AuthContext";
// import baseURL from '../ApiUrl/Apiurl';
// import { Edit, Save, X } from 'lucide-react';

// const ServiceRequestDetail = () => { 
//   const { requestId } = useParams();
//   const { userId } = useContext(AuthContext);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { selectedCompany } = useCompany();

//   // Get all data passed from navigation
//   const {
//     serviceRequest,
//     serviceItemDetails,
//     engineerStatus,
//     customerName
//   } = location.state || {};

//   const [assignmentHistory, setAssignmentHistory] = useState([]);
//   const [problemTypes, setProblemTypes] = useState([]);
//   const [serviceReport, setServiceReport] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [reportLoading, setReportLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('requestDetails');
  
//   // Problem type editing state
//   const [isEditingProblemType, setIsEditingProblemType] = useState(false);
//   const [selectedProblemType, setSelectedProblemType] = useState('');
//   const [mediaFiles, setMediaFiles] = useState([]);

//   const [problemTypeLoading, setProblemTypeLoading] = useState(false);

//   // Format date and time functions
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '-';
      
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
//       return `${day}/${month}/${year}`;
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return '-';
//     }
//   };

//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '-';
//     try {
//       const date = new Date(dateTimeString);
//       if (isNaN(date.getTime())) return '-';
      
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
      
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

//   useEffect(() => {
//   const fetchMediaFiles = async () => {
//     try {
//       const res = await axios.get(
//         `${baseURL}/service-pools/${serviceRequest.request_id}/media/`,
//         {
//           params: {
//             user_id: userId,
//             company_id: selectedCompany
//           }
//         }
//       );

//       if (res.data.status === "success" && Array.isArray(res.data.data)) {
//         setMediaFiles(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching media:", error);
//     }
//   };

//   if (serviceRequest?.request_id) {
//     fetchMediaFiles();
//   }
// }, [serviceRequest, userId, selectedCompany]);


//   // Fetch problem types
//   useEffect(() => {
//     const fetchProblemTypes = async () => {
//       try {
//         const response = await axios.get(`${baseURL}/problem-types/`, {
//           params: {
//             user_id: userId,
//             company_id: selectedCompany
//           }
//         });
        
//         if (response.data.status === 'success') {
//           setProblemTypes(response.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching problem types:', error);
//       }
//     };

//     fetchProblemTypes();
//   }, [userId, selectedCompany]);

//   // Fetch only assignment history
//   useEffect(() => {
//     const fetchAssignmentHistory = async () => {
//       try {
//         setLoading(true);
        
//         const historyResponse = await axios.get(`${baseURL}/assignment-history/`, {
//           params: {
//             user_id: userId,
//             company_id: selectedCompany
//           }
//         });

//         let historyData = historyResponse.data;
//         if (historyData && historyData.data && Array.isArray(historyData.data)) {
//           historyData = historyData.data;
//         }

//         const filteredHistory = Array.isArray(historyData)
//           ? historyData
//               .filter(item => item.request === requestId)
//               .sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at))
//           : [];

//         setAssignmentHistory(filteredHistory);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message || 'Failed to fetch assignment history');
//         console.error('Error fetching assignment history:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignmentHistory();
//   }, [requestId, userId, selectedCompany]);

//   // Fetch service report data
//   useEffect(() => {
//     const fetchServiceReport = async () => {
//       try {
//         setReportLoading(true);
        
//         const response = await axios.get(`${baseURL}/service-req-items-history/`, {
//           params: {
//             user_id: userId,
//             company_id: selectedCompany
//           }
//         });

//         let reportData = response.data;
//         console.log("Raw service report data:", reportData);
        
//         // Handle different response formats
//         if (reportData && reportData.data && Array.isArray(reportData.data)) {
//           reportData = reportData.data;
//         } else if (Array.isArray(reportData)) {
//           reportData = reportData;
//         } else {
//           reportData = [];
//         }

//         // Filter by current service request
//         const filteredReport = reportData.filter(item => 
//           item.service_request === requestId
//         );
//         console.log("Filtered service report data:", filteredReport);

//         setServiceReport(filteredReport);
//       } catch (err) {
//         console.error('Error fetching service report:', err);
//         // Don't set error state for service report to avoid breaking the UI
//       } finally {
//         setReportLoading(false);
//       }
//     };

//     fetchServiceReport();
//   }, [requestId, userId, selectedCompany]);

//   // Get problem type name from ID
//   const getProblemTypeName = () => {
//     if (!serviceRequest?.problem_type) return 'Unknown';
//     const problemType = problemTypes.find(pt => pt.problem_type_id === serviceRequest.problem_type);
//     return problemType ? problemType.name : serviceRequest.problem_type;
//   };

//   // Handle problem type edit
//   const handleProblemTypeEdit = () => {
//     setIsEditingProblemType(true);
//     setSelectedProblemType(serviceRequest?.problem_type || '');
//   };

//   // Handle problem type save
//   const handleProblemTypeSave = async () => {
//     if (!selectedProblemType) return;

//     setProblemTypeLoading(true);
//     try {
//       const updateResponse = await axios.put(
//         `${baseURL}/service-pools/${requestId}/`,
//         {
//           problem_type: selectedProblemType,
//           user_id: userId,
//           company_id: selectedCompany
//         }
//       );

//       console.log("Update response:", updateResponse.data);

//       if (updateResponse.data.status === "success") {
//         // Update UI state
//         if (location.state) {
//           location.state.serviceRequest.problem_type = selectedProblemType;
//         }

//         setIsEditingProblemType(false);

//         // Show success alert
//         alert("Problem Type updated successfully!");

//         // Navigate back to service pool page
//         navigate("/servicemanager/service-pool");
//       }
//     } catch (error) {
//       console.error("Error updating problem type:", error);
//       alert("Failed to update problem type. Please try again.");
//     } finally {
//       setProblemTypeLoading(false);
//     }
//   };

//   // Handle problem type cancel
//   const handleProblemTypeCancel = () => {
//     setIsEditingProblemType(false);
//     setSelectedProblemType(serviceRequest?.problem_type || '');
//   };

//   // Handle back button click
//   const handleBackClick = () => {
//     navigate(-1); // Go back to previous page
//   };

//   // If no data was passed, show error
//   if (!serviceRequest) {
//     return (
//       <div className="error">
//         No service request data found. Please go back and click on a request ID from the table.
//         <button 
//           onClick={handleBackClick}
//           className="btn btn-primary mt-3"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="service-detail-container">
//       {/* Page Header with Back Button */}
//       <div className="page-header d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h1 className="page-title">Service Request Details</h1>
//           <p className="page-subtitle">Request ID: {requestId}</p>
//         </div>
//         <button 
//           onClick={handleBackClick}
//           className="btn btn-outline-primary"
//           style={{
//             borderColor: '#0096d6',
//             color: '#0096d6',
//             transition: 'all 0.3s ease'
//           }}
//           onMouseOver={(e) => {
//             e.target.style.backgroundColor = '#0096d6';
//             e.target.style.color = 'white';
//           }}
//           onMouseOut={(e) => {
//             e.target.style.backgroundColor = 'transparent';
//             e.target.style.color = '#0096d6';
//           }}
//         >
//           ← Back
//         </button>
//       </div>

//       {/* Tab Navigation */}
//       <div className="tab-navigation mb-4">
//         <button 
//           className={`tab-button ${activeTab === 'requestDetails' ? 'active' : ''}`}
//           onClick={() => setActiveTab('requestDetails')}
//         >
//           Request Details
//         </button>

//         <button 
//           className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
//           onClick={() => setActiveTab('history')}
//         >
//           Assignment History
//         </button>
//         {/* <button 
//           className={`tab-button ${activeTab === 'serviceItem' ? 'active' : ''}`}
//           onClick={() => setActiveTab('serviceItem')}
//         >
//           Service Item Details
//         </button> */}
//         <button 
//           className={`tab-button ${activeTab === 'serviceReport' ? 'active' : ''}`}
//           onClick={() => setActiveTab('serviceReport')}
//         >
//           Service Report
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div className="tab-content">
//         {activeTab === 'requestDetails' && (
//           <div className="request-details-section">
//             <h3 className="section-title">Service Request Information</h3>
//             <div className="table details-table">
//               <div className="history-header">
//                 <div className="history-header-cell">Field</div>
//                 <div className="history-header-cell">Value</div>
//               </div>
              
//               {/* Request Details - All data from table row */}
//               <div className="history-row">
//                 <div className="history-cell">Request ID</div>
//                 <div className="history-cell">{serviceRequest.request_id}</div>
//               </div>
              
//               {/* Problem Type Row with Edit Functionality */}
//               <div className="history-row">
//                 <div className="history-cell">Request/Problem Type</div>
//                 <div className="history-cell">
//                   {isEditingProblemType ? (
//                     <div className="problem-type-edit-container">
//                       <select
//                         value={selectedProblemType}
//                         onChange={(e) => setSelectedProblemType(e.target.value)}
//                         className="problem-type-select"
//                         disabled={problemTypeLoading}
//                       >
//                         <option value="">Select Problem Type</option>
//                         {problemTypes.map((type) => (
//                           <option key={type.problem_type_id} value={type.problem_type_id}>
//                             {type.name}
//                           </option>
//                         ))}
//                       </select>
//                       <div className="problem-type-actions">
//                         <button
//                           onClick={handleProblemTypeSave}
//                           disabled={problemTypeLoading || !selectedProblemType}
//                           className="problem-type-save-btn"
//                           title="Save"
//                         >
//                           <Save size={16} />
//                         </button>
//                         <button
//                           onClick={handleProblemTypeCancel}
//                           disabled={problemTypeLoading}
//                           className="problem-type-cancel-btn"
//                           title="Cancel"
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="problem-type-display-container">
//                       <span>{getProblemTypeName()}</span>
//                       <button 
//                         onClick={handleProblemTypeEdit}
//                         className="problem-type-edit-btn"
//                         title="Edit Problem Type"
//                       >
//                         <Edit size={16} />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="history-row">
//                 <div className="history-cell">Requested By</div>
//                 <div className="history-cell">{customerName || serviceRequest.requested_by}</div>
//               </div>
//               <div className="history-row">
//                 <div className="history-cell">Request Details</div>
//                 <div className="history-cell">{serviceRequest.request_details || "N/A"}</div>
//               </div>
//               <div className="history-row">
//                 <div className="history-cell">Service Item ID</div>
//                 <div className="history-cell">{serviceRequest.service_item}</div>
//               </div>
//               <div className="history-row">
//                 <div className="history-cell">Location</div>
//                 <div className="history-cell">
//                   {serviceItemDetails?.location || "Location not found"}
//                 </div>
//               </div>
//               <div className="history-row">
//                 <div className="history-cell">Preferred Date/Time</div>
//                 <div className="history-cell">
//                   {serviceRequest.preferred_date && serviceRequest.preferred_time 
//                     ? formatDateTime(`${serviceRequest.preferred_date}T${serviceRequest.preferred_time}`)
//                     : serviceRequest.preferred_date 
//                       ? formatDate(serviceRequest.preferred_date)
//                       : '-'
//                   }
//                 </div>
//               </div>
//               <div className="history-row">
//                 <div className="history-cell">Created Date/Time</div>
//                 <div className="history-cell">
//                   {formatDateTime(serviceRequest.created_at)}
//                 </div>
//               </div>
//               <div className="history-row">
//                 <div className="history-cell">Status</div>
//                 <div className="history-cell">{serviceRequest.status}</div>
//               </div>
//               <div className="history-row">
//                 <div className="history-cell">Assigned Engineer</div>
//                 <div className="history-cell">{serviceRequest.assigned_engineer || "N/A"}</div>
//               </div>
//               <div className="history-row">
//                 <div className="history-cell">Engineer Status</div>
//                 <div className="history-cell">
//                   {engineerStatus === "Pending" && (
//                     <span className="badge bg-warning text-dark">Pending</span>
//                   )}
//                   {engineerStatus === "Accepted" && (
//                     <span className="badge bg-success">Accepted</span>
//                   )}
//                   {engineerStatus === "Declined" && (
//                     <span className="badge bg-danger">Rejected</span>
//                   )}
//                   {!engineerStatus || engineerStatus === "N/A" && "N/A"}
//                 </div>
//               </div>
//             </div>
//                     <div className="history-row">
//   <div className="history-cell">Media Files</div>
//   <div className="history-cell">
//     {mediaFiles.length === 0 ? (
//       "No media files available"
//     ) : (
//       mediaFiles.map((media) => {
//         const fileUrl = `${baseURL.replace('/api', '')}${media.file}`;
//         return (
//           <div key={media.media_id} style={{ marginBottom: "6px" }}>
//             <a 
//               href={fileUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ color: "#0d6efd", textDecoration: "underline" }}
//             >
//               {media.media_type} - {media.media_id}
//             </a>
//           </div>
//         );
//       })
//     )}
//   </div>
// </div>
//           </div>
//         )}

//         {activeTab === 'history' && (
//           <div className="assignment-history-section">
//             <h3 className="section-title">Assignment History</h3>
//             {loading ? (
//               <div className="loading">Loading assignment history...</div>
//             ) : assignmentHistory.length > 0 ? (
//               <div className="table history-table">
//                 <div className="history-header">
//                   <div className="history-header-cell">Assignment ID</div>
//                   <div className="history-header-cell">Assigned At</div>
//                   <div className="history-header-cell">Engineer</div>
//                   <div className="history-header-cell">Status</div>
//                   <div className="history-header-cell">Decline Reason</div>
//                   <div className="history-header-cell">Assigned By</div>
//                 </div>
//                 {assignmentHistory.map((assignment) => (
//                   <div key={assignment.assignment_id} className="history-row">
//                     <div className="history-cell">{assignment.assignment_id}</div>
//                     <div className="history-cell">
//                       {formatDateTime(assignment.assigned_at)}
//                     </div>
//                     <div className="history-cell">{assignment.assigned_engineer || 'N/A'}</div>
//                     <div className="history-cell">{assignment.status}</div>
//                     <div className="history-cell">{assignment.decline_reason || 'N/A'}</div>
//                     <div className="history-cell">{assignment.assigned_by || 'N/A'}</div>
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
//             <h3 className="section-title">Service Item Details</h3>
            
//             {serviceItemDetails ? (
//               <div className="table history-table">
//                 <div className="history-header">
//                   <div className="history-header-cell">Field</div>
//                   <div className="history-header-cell">Value</div>
//                 </div>
                
//                 {/* Service Item Details */}
//                 <div className="history-row">
//                   <div className="history-cell">Service Item ID</div>
//                   <div className="history-cell">{serviceItemDetails.service_item_id}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Service Item Name</div>
//                   <div className="history-cell">{serviceItemDetails.service_item_name || 'N/A'}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Serial Number</div>
//                   <div className="history-cell">{serviceItemDetails.serial_number || 'N/A'}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Location</div>
//                   <div className="history-cell">{serviceItemDetails.location || 'N/A'}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Installation Date</div>
//                   <div className="history-cell">{serviceItemDetails.installation_date || 'N/A'}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Warranty Start Date</div>
//                   <div className="history-cell">{serviceItemDetails.warranty_start_date || 'N/A'}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Warranty End Date</div>
//                   <div className="history-cell">{serviceItemDetails.warranty_end_date || 'N/A'}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Status</div>
//                   <div className="history-cell">{serviceItemDetails.status || 'N/A'}</div>
//                 </div>
//                 <div className="history-row">
//                   <div className="history-cell">Product Description</div>
//                   <div className="history-cell">{serviceItemDetails.product_description || 'N/A'}</div>
//                 </div>
//               </div>
//             ) : (
//               <div className="no-service-item">
//                 No service item details available
//               </div>
//             )}
//           </div>
//         )}

// {activeTab === 'serviceReport' && (
//   <div className="service-report-section">
//     <h3 className="section-title">Service Report</h3>
    
//     {reportLoading ? (
//       <div className="loading">Loading service report...</div>
//     ) : serviceReport.length > 0 ? (
//       <div className="table history-table">
//         <div className="history-header">
//           <div className="history-header-cell">SR Item ID</div>
//           <div className="history-header-cell">Component Type</div>
//           <div className="history-header-cell">Component</div>
//           <div className="history-header-cell">Old Serial No</div>
//           <div className="history-header-cell">New Serial No</div>
//           <div className="history-header-cell">Task Type</div>
//           <div className="history-header-cell">Warranty Start</div>
//           <div className="history-header-cell">Warranty End</div>
//           <div className="history-header-cell">Action Taken</div>
//           <div className="history-header-cell">Remarks</div>
//           <div className="history-header-cell">Serviced At</div>
//           <div className="history-header-cell">Serviced By</div>
//           <div className="history-header-cell">Actions</div> {/* New Column */}
//         </div>
//         {serviceReport.map((report) => (
//           <div key={report.sr_item_id} className="history-row">
//             <div className="history-cell">{report.sr_item_id}</div>
//             <div className="history-cell">{report.component_type || 'N/A'}</div>
//             <div className="history-cell">{report.component || 'N/A'}</div>
//             <div className="history-cell">{report.old_comp_serial_no || 'N/A'}</div>
//             <div className="history-cell">{report.new_comp_serial_no || 'N/A'}</div>
//             <div className="history-cell">{report.task_type || 'N/A'}</div>
//             <div className="history-cell">{formatDate(report.warranty_start_date)}</div>
//             <div className="history-cell">{formatDate(report.warranty_end_date)}</div>
//             <div className="history-cell">{report.action_taken || 'N/A'}</div>
//             <div className="history-cell">{report.remarks || 'N/A'}</div>
//             <div className="history-cell">{formatDateTime(report.serviced_at)}</div>
//             <div className="history-cell">{report.serviced_by || 'N/A'}</div>
//             <div className="history-cell">
//               <button
//                 className="btn btn-sm btn-outline-primary"
//                 onClick={() => navigate(`/servicemanager/service-request-item-history/${serviceRequest.request_id}`, {
//                   state: {
//                     serviceRequest: serviceRequest,
//                     serviceItemDetails: serviceItemDetails,
//                     engineerStatus: engineerStatus,
//                     customerName: customerName,
//                     userId: userId,
//                     editItemId: report.sr_item_id
//                   }
//                 })}
//                 title="Edit this service item"
//               >
//                 <Edit />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="no-report">No service report found for this request</div>
//     )}
//   </div>
// )}
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
  const [mediaFiles, setMediaFiles] = useState([]);

  // Dynamics Service Order No editing state
  const [isEditingDynamicsOrder, setIsEditingDynamicsOrder] = useState(false);
  const [dynamicsOrderNo, setDynamicsOrderNo] = useState('');

  const [problemTypeLoading, setProblemTypeLoading] = useState(false);
  const [dynamicsOrderLoading, setDynamicsOrderLoading] = useState(false);

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

  useEffect(() => {
    const fetchMediaFiles = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/service-pools/${serviceRequest.request_id}/media/`,
          {
            params: {
              user_id: userId,
              company_id: selectedCompany
            }
          }
        );

        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          setMediaFiles(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };

    if (serviceRequest?.request_id) {
      fetchMediaFiles();
    }
  }, [serviceRequest, userId, selectedCompany]);

  // Initialize dynamicsOrderNo when serviceRequest changes
  useEffect(() => {
    if (serviceRequest?.dynamics_service_order_no) {
      setDynamicsOrderNo(serviceRequest.dynamics_service_order_no);
    }
  }, [serviceRequest]);

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

  // Handle dynamics order edit
  const handleDynamicsOrderEdit = () => {
    setIsEditingDynamicsOrder(true);
    setDynamicsOrderNo(serviceRequest?.dynamics_service_order_no || '');
  };

  // Handle dynamics order save
  const handleDynamicsOrderSave = async () => {
    setDynamicsOrderLoading(true);
    try {
      const updateResponse = await axios.put(
        `${baseURL}/service-pools/${requestId}/`,
        {
          dynamics_service_order_no: dynamicsOrderNo,
          user_id: userId,
          company_id: selectedCompany
        }
      );

      console.log("Update response:", updateResponse.data);

      if (updateResponse.data.status === "success") {
        // Update UI state
        if (location.state) {
          location.state.serviceRequest.dynamics_service_order_no = dynamicsOrderNo;
        }

        setIsEditingDynamicsOrder(false);

        // Show success alert
        alert("Dynamics Service Order No updated successfully!");

        // Navigate back to service pool page
        navigate("/servicemanager/service-pool");
      }
    } catch (error) {
      console.error("Error updating dynamics service order no:", error);
      alert("Failed to update dynamics service order no. Please try again.");
    } finally {
      setDynamicsOrderLoading(false);
    }
  };

  // Handle dynamics order cancel
  const handleDynamicsOrderCancel = () => {
    setIsEditingDynamicsOrder(false);
    setDynamicsOrderNo(serviceRequest?.dynamics_service_order_no || '');
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
              <div className="history-row">
                <div className="history-cell">Media Files</div>
                <div className="history-cell">
                  {mediaFiles.length === 0 ? (
                    "No media files available"
                  ) : (
                    mediaFiles.map((media) => {
                      const fileUrl = `${baseURL.replace('/api', '')}${media.file}`;
                      return (
                        <div key={media.media_id} style={{ marginBottom: "6px" }}>
                          <a 
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#0d6efd", textDecoration: "underline" }}
                          >
                            {media.media_type} - {media.media_id}
                          </a>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              
              {/* Dynamics Service Order No Field - Added at the end */}
             {/* Dynamics Service Order No Field - Added at the end */}
<div className="history-row">
  <div className="history-cell">Dynamics Service Order No</div>
  <div className="history-cell">
    {isEditingDynamicsOrder ? (
      <div className="dynamics-order-edit-container">
        <input
          type="text"
          value={dynamicsOrderNo}
          onChange={(e) => setDynamicsOrderNo(e.target.value)}
          className="dynamics-order-input"
          disabled={dynamicsOrderLoading}
          placeholder="Enter Dynamics Service Order No"
        />
        <div className="dynamics-order-actions">
          <button
            onClick={handleDynamicsOrderSave}
            disabled={dynamicsOrderLoading}
            className="dynamics-order-save-btn"
            title="Save"
          >
            <Save size={16} />
          </button>
          <button
            onClick={handleDynamicsOrderCancel}
            disabled={dynamicsOrderLoading}
            className="dynamics-order-cancel-btn"
            title="Cancel"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    ) : (
      <div className="dynamics-order-display-container">
        <span>{serviceRequest.dynamics_service_order_no || "N/A"}</span>
        <button 
          onClick={handleDynamicsOrderEdit}
          className="dynamics-order-edit-btn"
          title="Edit Dynamics Service Order No"
        >
          <Edit size={16} />
        </button>
      </div>
    )}
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
                  <div className="history-header-cell">Actions</div> {/* New Column */}
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
                    <div className="history-cell">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/servicemanager/service-request-item-history/${serviceRequest.request_id}`, {
                          state: {
                            serviceRequest: serviceRequest,
                            serviceItemDetails: serviceItemDetails,
                            engineerStatus: engineerStatus,
                            customerName: customerName,
                            userId: userId,
                            editItemId: report.sr_item_id
                          }
                        })}
                        title="Edit this service item"
                      >
                        <Edit />
                      </button>
                    </div>
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