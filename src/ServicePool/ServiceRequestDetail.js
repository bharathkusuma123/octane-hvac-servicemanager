import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ServicePool.css'; // Make sure to create this CSS file

const ServiceRequestDetail = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://175.29.21.7:8006/service-pools/${requestId}/`);
        
        // Check if response.data exists and has the expected structure
        if (response.data) {
          setRequestData(response.data.data || response.data); // Handle both wrapped and direct responses
        } else {
          throw new Error('No data received from server');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch request details');
        console.error('Error fetching request details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  if (loading) return <div className="loading">Loading request details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!requestData) return <div className="error">No request data found</div>;

  return (
    <div className="service-detail-container">
      <div className="header-section">
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
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default ServiceRequestDetail;