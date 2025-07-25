import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';


const ServiceContractForm = () => {
    const { userId } = useContext(AuthContext);
    const { selectedCompany } = useCompany();
     console.log("User ID from context:", userId);
  console.log("Selected Company from context:", selectedCompany);
  const location = useLocation();
  const navigate = useNavigate();
  const { service_item_id, customer, company } = location.state || {};
  
  const [contractData, setContractData] = useState({
    contract_create_date: new Date().toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    contract_value: '',
    payment_term: 'Monthly',
    service_case_covered: 'PM',
    max_visits: '',
    spare_parts_limit: '',
    man_hour_limit: '',
    alert_days: '',
    alert_date: '',
    contract_attachment: null, // Initialize as null (or undefined)
    overdue_alert_days: '',
    overdue_alert_date: '',
    // is_alert_sent: false,
    remarks: '',
    created_by: 'Service Manager',
    updated_by: 'Service Manager',
    service_item: service_item_id || '',
    customer: customer || '',
    company: company || '',
    user_id: userId || '',
    company_id: selectedCompany || ''
  });

  useEffect(() => {
    if (!service_item_id || !customer || !company) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Required data is missing. Please go back and try again.',
      }).then(() => {
        navigate(-1);
      });
    }
  }, [service_item_id, customer, company, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContractData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    // Append all fields except file (if not selected)
    for (let key in contractData) {
      if (key === "contract_attachment") {
        if (contractData[key]) {
          formData.append(key, contractData[key]); // Append file only if it exists
        }
      } else {
        formData.append(key, contractData[key]);
      }
    }

    const response = await axios.post(
      'http://175.29.21.7:8006/service-contracts/',
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
      text: 'Service contract created successfully',
    }).then(() => {
      navigate('/servicemanager/new-service-item');
    });
  } catch (error) {
    console.error('Error creating service contract:', error.response?.data || error.message);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Failed to create service contract',
    });
  }
};


  if (!service_item_id || !customer || !company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">Create Service Contract</h2>
          <p className="text-muted mb-0">
            For Service Item: {service_item_id} | Customer: {customer} | Company: {company}
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
                  value={contractData.contract_create_date}
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
                  value={contractData.start_date}
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
                  value={contractData.end_date}
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
                  value={contractData.contract_value}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Payment Term</label>
                <select
                  className="form-select"
                  name="payment_term"
                  value={contractData.payment_term}
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
                  value={contractData.service_case_covered}
                  onChange={handleInputChange}
                  required
                >
                  <option value="PM">PM</option>
                  <option value="Breakdown">Breakdown</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              {/* <div className="col-md-6">
                <div className="form-check pt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_alert_sent"
                    checked={contractData.is_alert_sent}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">
                    Is Alert Sent?
                  </label>
                </div>
              </div> */}
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Max Visits</label>
                <input
                  type="text"
                  className="form-control"
                  name="max_visits"
                  value={contractData.max_visits}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Spare Parts Limit</label>
                <input
                  type="text"
                  className="form-control"
                  name="spare_parts_limit"
                  value={contractData.spare_parts_limit}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Man Hour Limit</label>
                <input
                  type="text"
                  className="form-control"
                  name="man_hour_limit"
                  value={contractData.man_hour_limit}
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
                  value={contractData.alert_days}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Alert Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="alert_date"
                  value={contractData.alert_date}
                  onChange={handleInputChange}
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
                  value={contractData.overdue_alert_days}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Overdue Alert Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="overdue_alert_date"
                  value={contractData.overdue_alert_date}
                  onChange={handleInputChange}
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
    setContractData({
      ...contractData,
      contract_attachment: e.target.files[0], // Store the File object
    });
  }}
/>
</div>


            <div className="mb-3">
              <label className="form-label">Remarks</label>
              <textarea
                className="form-control"
                name="remarks"
                value={contractData.remarks}
                onChange={handleInputChange}
                rows="3"
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Contract
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceContractForm;