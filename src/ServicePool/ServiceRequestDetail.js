import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ServicePool.css';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";
import baseURL from '../ApiUrl/Apiurl';

const ServiceRequestDetail = () => { 
  const { requestId } = useParams();
  const { userId } = useContext(AuthContext);
  const [requestData, setRequestData] = useState(null);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [serviceItemData, setServiceItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceItemLoading, setServiceItemLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'serviceItem'
  const location = useLocation();
  const serviceItem = location.state?.service_item;
  const { selectedCompany } = useCompany();

  console.log("User ID from localStorage:", userId);
  console.log("Selected Company from context:", selectedCompany);
  console.log("Service Item ID:", serviceItem);

  // Fetch assignment history and request details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch request details
        const requestResponse = await axios({
          method: 'get',
          url: `${baseURL}/service-pools/${requestId}/`,
          params: {
            user_id: userId,
            company_id: selectedCompany
          }
        });

        // Fetch assignment history
        const historyResponse = await axios.get(`${baseURL}/assignment-history/`, {
          params: {
            user_id: userId,
            company_id: selectedCompany
          }
        });

        // Normalize history data
        let historyData = historyResponse.data;
        if (historyData && historyData.data && Array.isArray(historyData.data)) {
          historyData = historyData.data;
        }

        // Filter by request and sort by assigned_at DESC
        const filteredHistory = Array.isArray(historyData)
          ? historyData
              .filter(item => item.request === requestId)
              .sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at))
          : [];

        if (requestResponse.data) {
          setRequestData(requestResponse.data.data || requestResponse.data);
          setAssignmentHistory(filteredHistory);
        } else {
          throw new Error('No data received from server');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [requestId, userId, selectedCompany]);

  // Fetch service item details when serviceItem is available and tab is active
  useEffect(() => {
    const fetchServiceItem = async () => {
      if (serviceItem && activeTab === 'serviceItem' && !serviceItemData) {
        try {
          setServiceItemLoading(true);
          const response = await axios.get(`${baseURL}/service-items/${serviceItem}/`, {
            params: {
              user_id: userId,
              company_id: selectedCompany
            }
          });
          
          if (response.data && response.data.data) {
            setServiceItemData(response.data.data);
          } else {
            throw new Error('No service item data received');
          }
        } catch (err) {
          console.error('Error fetching service item:', err);
          setError(err.response?.data?.message || err.message || 'Failed to fetch service item details');
        } finally {
          setServiceItemLoading(false);
        }
      }
    };

    fetchServiceItem();
  }, [serviceItem, activeTab, serviceItemData, userId, selectedCompany]);

  if (loading) return <div className="loading">Loading request details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!requestData) return <div className="error">No request data found</div>;

  return (
    <div className="service-detail-container">
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Assignment History
        </button>
        <button 
          className={`tab-button ${activeTab === 'serviceItem' ? 'active' : ''}`}
          onClick={() => setActiveTab('serviceItem')}
        >
          Service Item Details
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'history' && (
          <div className="assignment-history-section">
            <h3 className="history-title">Assignment History</h3>
            {assignmentHistory.length > 0 ? (
              <div className="table history-table">
                <div className="history-header">
                  <div className="history-header-cell">Service Request ID</div>
                  <div className="history-header-cell">Assignment ID</div>
                  <div className="history-header-cell">Assigned At</div>
                  <div className="history-header-cell">Engineer</div>
                  <div className="history-header-cell">Status</div>
                  <div className="history-header-cell">Decline Reason</div>
                  <div className="history-header-cell">Assigned By</div>
                  <div className="history-header-cell">Service Item</div>
                </div>
                {assignmentHistory.map((assignment) => (
                  <div key={assignment.assignment_id} className="history-row">
                    <div className="history-cell">{assignment.request}</div>
                    <div className="history-cell">{assignment.assignment_id}</div>
                    <div className="history-cell">
                      {new Date(assignment.assigned_at).toLocaleString()}
                    </div>
                    <div className="history-cell">{assignment.assigned_engineer || assignment.assigned_engineer}</div>
                    <div className="history-cell">{assignment.status}</div>
                    <div className="history-cell">{assignment.decline_reason || 'N/A'}</div>
                    <div className="history-cell">{assignment.assigned_by}</div>
                    <div className="history-cell">{serviceItem}</div>
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
            <h3 className="service-item-title">Service Item Details</h3>
            
            {serviceItemLoading ? (
              <div className="loading">Loading service item details...</div>
            ) : serviceItemData ? (
              <div className="table history-table">
                <div className="history-header">
                  <div className="history-header-cell">Field</div>
                  <div className="history-header-cell">Value</div>
                </div>
                
                {/* Service Item Details Rows */}
                <div className="history-row">
                  <div className="history-cell">Service Item ID</div>
                  <div className="history-cell">{serviceItemData.service_item_id}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Service Item Name</div>
                  <div className="history-cell">{serviceItemData.service_item_name}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Serial Number</div>
                  <div className="history-cell">{serviceItemData.serial_number}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">PCB Serial Number</div>
                  <div className="history-cell">{serviceItemData.pcb_serial_number}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Location</div>
                  <div className="history-cell">{serviceItemData.location}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Location Latitude</div>
                  <div className="history-cell">{serviceItemData.location_latitude}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Location Longitude</div>
                  <div className="history-cell">{serviceItemData.location_longitude}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Installation Date</div>
                  <div className="history-cell">{serviceItemData.installation_date}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Warranty Start Date</div>
                  <div className="history-cell">{serviceItemData.warranty_start_date}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Warranty End Date</div>
                  <div className="history-cell">{serviceItemData.warranty_end_date}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Contract End Date</div>
                  <div className="history-cell">{serviceItemData.contract_end_date}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Status</div>
                  <div className="history-cell">{serviceItemData.status}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">IoT Status</div>
                  <div className="history-cell">{serviceItemData.iot_status}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Last Checked</div>
                  <div className="history-cell">
                    {new Date(serviceItemData.last_checked).toLocaleString()}
                  </div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Last Service</div>
                  <div className="history-cell">
                    {serviceItemData.last_service ? new Date(serviceItemData.last_service).toLocaleString() : 'N/A'}
                  </div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Product Description</div>
                  <div className="history-cell">{serviceItemData.product_description}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">BC Number</div>
                  <div className="history-cell">{serviceItemData.bc_number || 'N/A'}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Ship to Code</div>
                  <div className="history-cell">{serviceItemData.ship_to_code || 'N/A'}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Created At</div>
                  <div className="history-cell">
                    {new Date(serviceItemData.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Updated At</div>
                  <div className="history-cell">
                    {new Date(serviceItemData.updated_at).toLocaleString()}
                  </div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Created By</div>
                  <div className="history-cell">{serviceItemData.created_by}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Updated By</div>
                  <div className="history-cell">{serviceItemData.updated_by}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Company</div>
                  <div className="history-cell">{serviceItemData.company}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Product</div>
                  <div className="history-cell">{serviceItemData.product}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">Customer</div>
                  <div className="history-cell">{serviceItemData.customer}</div>
                </div>
                <div className="history-row">
                  <div className="history-cell">PM Group</div>
                  <div className="history-cell">{serviceItemData.pm_group}</div>
                </div>
              </div>
            ) : (
              <div className="no-service-item">
                {serviceItem ? 'No service item details found' : 'No service item ID provided'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestDetail;

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