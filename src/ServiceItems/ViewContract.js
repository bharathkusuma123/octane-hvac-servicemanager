import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../AuthContext/AuthContext';
import baseURL from '../ApiUrl/Apiurl';
import './ViewContract.css'; // Create this CSS file for styling

const ViewContract = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contract_id, service_item_id, service_item_name, serial_number, customer, company, contract_data } = location.state || {};
  
  const [contract, setContract] = useState(contract_data || null);
  const [loading, setLoading] = useState(!contract_data);
  const [serviceItem, setServiceItem] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  
  useEffect(() => {
    // Fetch contract details if not passed in state
    if (contract_id && !contract_data) {
      fetchContractDetails();
    }
    
    // Fetch service item details if not passed in state
    if (service_item_id && !service_item_name) {
      fetchServiceItemDetails();
    }
    
    // Fetch customer details
    if (customer) {
      fetchCustomerDetails();
    }
    
    // Fetch company details
    if (company) {
      fetchCompanyDetails();
    }
  }, [contract_id, service_item_id, customer, company]);
  
  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      // Try different API endpoints based on your backend structure
      let response;
      try {
        response = await axios.get(`${baseURL}/service-contracts/${contract_id}/`);
      } catch (error) {
        // Try alternative endpoint
        response = await axios.get(`${baseURL}/service-contracts/${contract_id}`);
      }
      
      if (response.data.status === "success") {
        setContract(response.data.data);
      } else if (response.data) {
        // If data is directly in response
        setContract(response.data);
      }
    } catch (error) {
      console.error("Error fetching contract details:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load contract details',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchServiceItemDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/service-items/${service_item_id}/`);
      if (response.data.status === "success") {
        setServiceItem(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching service item:", error);
    }
  };
  
  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/customers/${customer}/`);
      if (response.data.status === "success") {
        setCustomerData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };
  
  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/companies/${company}/`);
      if (response.data.status === "success") {
        setCompanyData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };
  
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const downloadAttachment = () => {
    if (!contract?.contract_attachment) {
      Swal.fire({
        icon: 'info',
        title: 'No Attachment',
        text: 'This contract does not have an attachment.',
      });
      return;
    }
    
    // Assuming contract_attachment is a URL
    window.open(contract.contract_attachment, '_blank');
  };
  
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading contract details...</p>
        </div>
      </div>
    );
  }
  
  if (!contract) {
    return (
      <div className="container mt-4">
        <div className="card">
          <div className="card-body text-center py-5">
            <h4>Contract Not Found</h4>
            <p className="text-muted">The contract you're trying to view does not exist or has been deleted.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mt-4">
      <div className="card">
        <div style={{backgroundColor:'#0096d6'}}className="card-header  text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0 text-white">Contract Details</h2>
              <p className="mb-0  text-white">
                Contract ID: {contract.contract_id || contract.service_contract_id || contract.id}
              </p>
            </div>
            <button 
              className="btn btn-light"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>
        </div>
        
        <div className="card-body">
          <div className="row">
            {/* Contract Information */}
            <div className="col-lg-8">
              <div className="row">
                {/* Basic Contract Info */}
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Basic Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <small className="text-muted">Contract Create Date</small>
                        <p className="mb-0 fw-bold">{formatDate(contract.contract_create_date)}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Start Date</small>
                        <p className="mb-0 fw-bold">{formatDate(contract.start_date)}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">End Date</small>
                        <p className="mb-0 fw-bold">{formatDate(contract.end_date)}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Contract Value</small>
                        <p className="mb-0 fw-bold">{formatCurrency(contract.contract_value)}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Payment Term</small>
                        <p className="mb-0 fw-bold">{contract.payment_term || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contract Status & Coverage */}
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Status & Coverage</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <small className="text-muted">Service Case Covered</small>
                        <p className="mb-0 fw-bold">{contract.service_case_covered || 'N/A'}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Max Visits</small>
                        <p className="mb-0 fw-bold">{contract.max_visits || 'Unlimited'}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Spare Parts Limit</small>
                        <p className="mb-0 fw-bold">{contract.spare_parts_limit || 'N/A'}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Man Hour Limit</small>
                        <p className="mb-0 fw-bold">{contract.man_hour_limit || 'N/A'}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Contract Status</small>
                        <div>
                          <span className={`badge ${
                            contract.contract_status === 'Active' ? 'bg-success' :
                            contract.contract_status === 'Pending' ? 'bg-warning' :
                            contract.contract_status === 'Expired' ? 'bg-danger' :
                            'bg-secondary'
                          }`}>
                            {contract.contract_status || 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Alert Information */}
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Alert Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <small className="text-muted">Alert Days</small>
                        <p className="mb-0 fw-bold">{contract.alert_days || 'N/A'} days</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Alert Date</small>
                        <p className="mb-0 fw-bold">{formatDate(contract.alert_date)}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Overdue Alert Days</small>
                        <p className="mb-0 fw-bold">{contract.overdue_alert_days || 'N/A'} days</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Overdue Alert Date</small>
                        <p className="mb-0 fw-bold">{formatDate(contract.overdue_alert_date)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Additional Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <small className="text-muted">Created By</small>
                        <p className="mb-0 fw-bold">{contract.created_by || 'N/A'}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Updated By</small>
                        <p className="mb-0 fw-bold">{contract.updated_by || 'N/A'}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Created At</small>
                        <p className="mb-0 fw-bold">{formatDate(contract.created_at)}</p>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Updated At</small>
                        <p className="mb-0 fw-bold">{formatDate(contract.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Remarks Section */}
                <div className="col-12 mb-3">
                  <div className="card">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Remarks</h6>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">{contract.remarks || 'No remarks provided.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar - Related Information */}
            <div className="col-lg-4">
              {/* Service Item Card */}
              <div className="card mb-3">
                <div className="card-header bg-info text-white">
                  <h6 className="mb-0">Service Item</h6>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <small className="text-muted">Service Item ID</small>
                    <p className="mb-0 fw-bold">{service_item_id}</p>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Service Item Name</small>
                    <p className="mb-0 fw-bold">{service_item_name || (serviceItem?.service_item_name) || 'N/A'}</p>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Serial Number</small>
                    <p className="mb-0 fw-bold">{serial_number || (serviceItem?.serial_number) || 'N/A'}</p>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Location</small>
                    <p className="mb-0 fw-bold">{serviceItem?.location || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Customer Card */}
              <div className="card mb-3">
                <div className="card-header bg-success text-white">
                  <h6 className="mb-0">Customer</h6>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <small className="text-muted">Customer ID</small>
                    <p className="mb-0 fw-bold">{customer}</p>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Name</small>
                    <p className="mb-0 fw-bold">{customerData?.full_name || customerData?.username || 'N/A'}</p>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Email</small>
                    <p className="mb-0 fw-bold">{customerData?.email || 'N/A'}</p>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Phone</small>
                    <p className="mb-0 fw-bold">{customerData?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Company Card */}
              <div className="card mb-3">
                <div className="card-header bg-warning text-dark">
                  <h6 className="mb-0">Company</h6>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <small className="text-muted">Company ID</small>
                    <p className="mb-0 fw-bold">{company}</p>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Company Name</small>
                    <p className="mb-0 fw-bold">{companyData?.company_name || 'N/A'}</p>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">Address</small>
                    <p className="mb-0 fw-bold">{companyData?.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Actions Card */}
              {/* <div className="card">
                <div className="card-header bg-secondary text-white">
                  <h6 className="mb-0">Actions</h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/servicemanager/service-contract', {
                        state: {
                          contract_to_edit: contract,
                          service_item_id: service_item_id,
                          customer: customer,
                          company: company
                        }
                      })}
                    >
                      Edit Contract
                    </button>
                    
                    <button
                      className="btn btn-success"
                      onClick={downloadAttachment}
                    >
                      {contract.contract_attachment ? 'View Attachment' : 'No Attachment'}
                    </button>
                    
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => window.print()}
                    >
                      Print Contract
                    </button>
                    
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => navigate(-1)}
                    >
                      Back to Service Items
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContract;