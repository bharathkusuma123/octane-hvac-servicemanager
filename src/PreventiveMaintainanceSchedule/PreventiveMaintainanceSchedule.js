import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';

const PreventiveMaintenanceSchedule = () => {
  const { userId } = useContext(AuthContext);
  const { selectedCompany } = useCompany();
  const [activeTab, setActiveTab] = useState('factory');
  const [pmSchedules, setPmSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null); // Track which schedule is being processed

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://175.29.21.7:8006/service-item-pm-schedules/?user_id=${userId}&company_id=${selectedCompany}`);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        if (data.status === 'success') {
          setPmSchedules(data.data);
        } else {
          throw new Error(data.message || 'Failed to retrieve PM schedules');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany, activeTab]);

  // Filter schedules based on active tab
  const filteredSchedules = pmSchedules.filter(schedule =>
    activeTab === 'factory'
      ? schedule.responsible.toLowerCase() === 'factory'
      : schedule.responsible.toLowerCase() === 'customer'
  );

  // Handle raise request button click
  const handleRaiseRequest = async (schedule) => {
    setProcessingId(schedule.pm_schedule_id);
    
    try {
      const response = await fetch(`http://175.29.21.7:8006/pm-schedules/${schedule.pm_schedule_id}/create-service-request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      // Check if the response contains a success message
      if (response.ok && result.message && result.message.includes("successfully")) {
        // Update the schedule status to "Processed"
        setPmSchedules(prevSchedules => 
          prevSchedules.map(s => 
            s.pm_schedule_id === schedule.pm_schedule_id 
              ? { ...s, status: 'Processed', is_alert_sent: true } 
              : s
          )
        );
        
        alert(`Service request created successfully for PM Schedule ID: ${schedule.pm_schedule_id}`);
      } else {
        throw new Error(result.message || 'Failed to create service request');
      }
    } catch (err) {
      console.error('Error creating service request:', err);
      alert(`Failed to create service request: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  // Check if button should be disabled
  const isButtonDisabled = (schedule) => {
    // Case 1: is_alert_sent: false AND status: Pending
    if (!schedule.is_alert_sent && schedule.status === 'Pending') {
      return true;
    }
    
    // Case 2: is_alert_sent: true AND status is not Pending
    if (schedule.is_alert_sent && schedule.status !== 'Pending') {
      return true;
    }
    
    // Enable button only if is_alert_sent is true AND status is still Pending
    return false;
  };

  // Define the blue color for consistency
  const blueColor = '#0096D6';

  // Format date for display as dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="pm-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div>Loading PM schedules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pm-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="pm-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="delegate-title" style={{ color: '#333', marginBottom: '20px' }}>Preventive Maintenance Schedules</h1>

      {/* Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('factory')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'factory' ? blueColor : '#f1f1f1',
            color: activeTab === 'factory' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Factory
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'customer' ? blueColor : '#f1f1f1',
            color: activeTab === 'customer' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Customer
        </button>
      </div>

      {/* Factory Tab Content */}
      {activeTab === 'factory' && (
        <div>
          <h2 className="pm-title" style={{ color: '#333', marginBottom: '15px' }}>Factory PM Schedules</h2>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>PM Schedule ID</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Service Item</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Task Type</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Due Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Alert Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Overdue Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule) => {
                  const disabled = isButtonDisabled(schedule);
                  const isProcessing = processingId === schedule.pm_schedule_id;
                  
                  return (
                    <tr key={schedule.pm_schedule_id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px' }}>{schedule.pm_schedule_id}</td>
                      <td style={{ padding: '12px' }}>{schedule.service_item}</td>
                      <td style={{ padding: '12px' }}>{schedule.description}</td>
                      <td style={{ padding: '12px' }}>{schedule.task_type}</td>
                      <td style={{ padding: '12px' }}>{formatDate(schedule.due_date)}</td>
                      <td style={{ padding: '12px' }}>{formatDate(schedule.alert_date)}</td>
                      <td style={{ padding: '12px' }}>{formatDate(schedule.overdue_alert_date)}</td>
                      <td style={{ padding: '12px' }}>{schedule.status}</td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleRaiseRequest(schedule)}
                          disabled={disabled || isProcessing}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: disabled ? '#ccc' : blueColor,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: disabled ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isProcessing ? 'Processing...' : 'Raise Request'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredSchedules.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ padding: '12px', textAlign: 'center' }}>
                      No factory PM schedules found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Tab Content */}
      {activeTab === 'customer' && (
        <div>
          <h2 className="pm-title" style={{ color: '#333', marginBottom: '15px' }}>Customer PM Schedules</h2>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>PM Schedule ID</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Service Item</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Task Type</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Due Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Alert Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Overdue Date</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.pm_schedule_id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px' }}>{schedule.pm_schedule_id}</td>
                    <td style={{ padding: '12px' }}>{schedule.service_item}</td>
                    <td style={{ padding: '12px' }}>{schedule.description}</td>
                    <td style={{ padding: '12px' }}>{schedule.task_type}</td>
                    <td style={{ padding: '12px' }}>{formatDate(schedule.due_date)}</td>
                    <td style={{ padding: '12px' }}>{formatDate(schedule.alert_date)}</td>
                    <td style={{ padding: '12px' }}>{formatDate(schedule.overdue_alert_date)}</td>
                    <td style={{ padding: '12px' }}>{schedule.status}</td>
                  </tr>
                ))}
                {filteredSchedules.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ padding: '12px', textAlign: 'center' }}>
                      No customer PM schedules found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreventiveMaintenanceSchedule;