import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';

const ServiceRenewalForm = () => {
  const { userId } = useContext(AuthContext);
  const { selectedCompany } = useCompany();
  const location = useLocation();
  const navigate = useNavigate();
  const { service_item_id, customer, company, existing_contract } = location.state || {};
  
  const [renewalData, setRenewalData] = useState({
    contract_create_date: new Date().toISOString().split('T')[0],
    start_date: '',
    end_date: '',
    contract_value: '',
    payment_term: 'Monthly',
    service_case_covered: 'PM',
    max_visits: '',
    spare_parts_limit: '',
    man_hour_limit: '',
    alert_days: '',
    alert_date: '',
    contract_attachment: null,
    overdue_alert_days: '',
    overdue_alert_date: '',
    is_alert_sent: false,
    remarks: '',
    created_by: 'Service Manager',
    updated_by: 'Service Manager',
    service_item: service_item_id || '',
    customer: customer || '',
    company: company || '',
    user_id: userId || '',
    company_id: selectedCompany || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  // Function to calculate alert date based on end date and alert days
  const calculateAlertDate = (endDate, alertDays) => {
    if (!endDate || !alertDays) return '';
    
    const end = new Date(endDate);
    const alertDate = new Date(end);
    alertDate.setDate(alertDate.getDate() - parseInt(alertDays));
    
    return alertDate.toISOString().split('T')[0];
  };

  // Function to calculate overdue alert date based on end date and overdue alert days
  const calculateOverdueAlertDate = (endDate, overdueDays) => {
    if (!endDate || !overdueDays) return '';
    
    const end = new Date(endDate);
    const overdueDate = new Date(end);
    overdueDate.setDate(overdueDate.getDate() + parseInt(overdueDays));
    
    return overdueDate.toISOString().split('T')[0];
  };

  // Update alert and overdue dates when relevant fields change
  useEffect(() => {
    if (renewalData.end_date && renewalData.alert_days) {
      const newAlertDate = calculateAlertDate(renewalData.end_date, renewalData.alert_days);
      setRenewalData(prev => ({ ...prev, alert_date: newAlertDate }));
    }
  }, [renewalData.end_date, renewalData.alert_days]);

  useEffect(() => {
    if (renewalData.end_date && renewalData.overdue_alert_days) {
      const newOverdueDate = calculateOverdueAlertDate(renewalData.end_date, renewalData.overdue_alert_days);
      setRenewalData(prev => ({ ...prev, overdue_alert_date: newOverdueDate }));
    }
  }, [renewalData.end_date, renewalData.overdue_alert_days]);

  useEffect(() => {
    if (!service_item_id || !customer || !company || !existing_contract) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Required data is missing. Please go back and try again.',
      }).then(() => {
        navigate(-1);
      });
    }

    // Pre-fill some fields from the existing contract
    if (existing_contract) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      setRenewalData(prev => ({
        ...prev,
        start_date: today.toISOString().split('T')[0],
        end_date: tomorrow.toISOString().split('T')[0],
        contract_value: existing_contract.contract_value || '',
        payment_term: existing_contract.payment_term || 'Monthly',
        service_case_covered: existing_contract.service_case_covered || 'PM',
        max_visits: existing_contract.max_visits || '',
        spare_parts_limit: existing_contract.spare_parts_limit || '',
        man_hour_limit: existing_contract.man_hour_limit || '',
        alert_days: existing_contract.alert_days || '',
        overdue_alert_days: existing_contract.overdue_alert_days || '',
        remarks: `Renewal of contract ${existing_contract.contract_id}`
      }));
    }
  }, [service_item_id, customer, company, existing_contract, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRenewalData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true); // Disable the button

    try {
      const formData = new FormData();

      // Append all fields with is_alert_sent set to false
      for (let key in renewalData) {
        if (key === "is_alert_sent") {
          formData.append(key, "false"); // Force is_alert_sent to false
        } else if (key === "contract_attachment") {
          if (renewalData[key]) {
            formData.append(key, renewalData[key]);
          }
        } else {
          formData.append(key, renewalData[key]);
        }
      }

      const response = await axios.post(
        `${baseURL}/service-contracts/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Service contract renewed successfully',
      }).then(() => {
        navigate('/servicemanager/new-service-item');
      });
    } catch (error) {
      console.error('Error renewing service contract:', error.response?.data || error.message);
      
      // Re-enable the button on error
      setIsSubmitting(false);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to renew service contract',
      });
    }
  };

  if (!service_item_id || !customer || !company || !existing_contract) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Renew Service Contract</h2>
          <p className="text-muted mb-0">
            For Service Item: {service_item_id} | Customer: {customer} | Company: {company}
          </p>
          <p className="text-muted mb-0">
            Renewing contract: {existing_contract.contract_id}
          </p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Contract Create Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="contract_create_date"
                  value={renewalData.contract_create_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="start_date"
                  value={renewalData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="end_date"
                  value={renewalData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Contract Value</label>
                <input
                  type="number"
                  className="form-control"
                  name="contract_value"
                  value={renewalData.contract_value}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Payment Term</label>
                <select
                  className="form-select"
                  name="payment_term"
                  value={renewalData.payment_term}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Service Case Covered</label>
                <select
                  className="form-select"
                  name="service_case_covered"
                  value={renewalData.service_case_covered}
                  onChange={handleInputChange}
                  required
                >
                  <option value="PM">PM</option>
                  <option value="Breakdown">Breakdown</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Max Visits</label>
                <input
                  type="text"
                  className="form-control"
                  name="max_visits"
                  value={renewalData.max_visits}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Spare Parts Limit</label>
                <input
                  type="text"
                  className="form-control"
                  name="spare_parts_limit"
                  value={renewalData.spare_parts_limit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Man Hour Limit</label>
                <input
                  type="text"
                  className="form-control"
                  name="man_hour_limit"
                  value={renewalData.man_hour_limit}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Alert Days</label>
                <input
                  type="number"
                  className="form-control"
                  name="alert_days"
                  value={renewalData.alert_days}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Alert Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="alert_date"
                  value={renewalData.alert_date}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Overdue Alert Days</label>
                <input
                  type="number"
                  className="form-control"
                  name="overdue_alert_days"
                  value={renewalData.overdue_alert_days}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Overdue Alert Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="overdue_alert_date"
                  value={renewalData.overdue_alert_date}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Contract Attachment</label>
              <input
                type="file"
                className="form-control"
                name="contract_attachment"
                onChange={(e) => {
                  setRenewalData({
                    ...renewalData,
                    contract_attachment: e.target.files[0],
                  });
                }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Remarks</label>
              <textarea
                className="form-control"
                name="remarks"
                value={renewalData.remarks}
                onChange={handleInputChange}
                rows="3"
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                disabled={isSubmitting} // Disable cancel button too during submission
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting} // Disable submit button during submission
              >
                {isSubmitting ? 'Renewing...' : 'Renew Contract'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceRenewalForm;