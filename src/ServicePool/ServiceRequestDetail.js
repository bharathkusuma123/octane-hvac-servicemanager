import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ServicePool.css';

const ServiceRequestDetail = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState(null);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch request details
        const requestResponse = await axios.get(`http://175.29.21.7:8006/service-pools/${requestId}/`);
        
        // Fetch assignment history
        const historyResponse = await axios.get(`http://175.29.21.7:8006/assignment-history/`);
        
        // Check the actual structure of the response
        let historyData = historyResponse.data;
        
        // If the data is nested in a 'data' property (common in many APIs)
        if (historyData && historyData.data && Array.isArray(historyData.data)) {
          historyData = historyData.data;
        }
        
        // Ensure we have an array before filtering
        const filteredHistory = Array.isArray(historyData) 
          ? historyData.filter(item => item.request === requestId)
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
  }, [requestId]);

  if (loading) return <div className="loading">Loading request details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!requestData) return <div className="error">No request data found</div>;

  return (
    <div className="service-detail-container">
      {/* <div className="header-section">
        <button onClick={() => navigate(-1)} className="btn btn-secondary back-button">
           Back to Service Pool
        </button>
        <h2 className="detail-title">Service Request Details - ID: {requestId}</h2>
      </div>
      
      <div className="detail-card">
        <div className="detail-row">
          <span className="detail-label">Requested By:</span>
          <span className="detail-value">{requestData.requested_by || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Source Type:</span>
          <span className="detail-value">{requestData.source_type || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Service Item:</span>
          <span className="detail-value">{requestData.service_item || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className="detail-value">{requestData.status || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Assigned Engineer:</span>
          <span className="detail-value">{requestData.assigned_engineer || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Preferred Date:</span>
          <span className="detail-value">
            {requestData.preferred_date ? new Date(requestData.preferred_date).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Preferred Time:</span>
          <span className="detail-value">{requestData.preferred_time || 'N/A'}</span>
        </div>
      </div> */}

      {/* Assignment History Section */}
  <div className="assignment-history-section">
        <h3 className="history-title">Assignment History</h3>
        {assignmentHistory.length > 0 ? (
          <div className=" table history-table">
            <div className="history-header">
              <div className="history-header-cell">Service Request ID</div>
              <div className="history-header-cell">Assignment ID</div>
              <div className="history-header-cell">Assigned At</div>
              <div className="history-header-cell">Engineer</div>
              <div className="history-header-cell">Status</div>
              <div className="history-header-cell">Decline Reason</div>
              <div className="history-header-cell">Assigned By</div>
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
              </div>
            ))}
          </div>
        ) : (
          <div className="no-history">No assignment history found for this request</div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestDetail;