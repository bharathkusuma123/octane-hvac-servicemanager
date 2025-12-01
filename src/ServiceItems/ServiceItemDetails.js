import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from '../ApiUrl/Apiurl';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";
import './Newstyles.css';
const ServiceItemDetails = () => {
  const { serviceItemId } = useParams();
  const navigate = useNavigate();
  const [serviceItem, setServiceItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchServiceItem = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${baseURL}/service-items/${serviceItemId}/?user_id=${userId}&company_id=${selectedCompany}`
        );
        
        // Assuming the API returns the service item object directly
        if (response.data.data) {
          setServiceItem(response.data.data);
        } else {
          setError("Service item not found");
        }
      } catch (error) {
        console.error("Error fetching service item:", error);
        
        if (error.response && error.response.status === 403) {
          setError(error.response.data?.message || "You do not have permission to view this service item");
        } else if (error.response && error.response.status === 404) {
          setError("Service item not found");
        } else {
          setError("Failed to load service item data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (serviceItemId && userId && selectedCompany) {
      fetchServiceItem();
    } else {
      setLoading(false);
      setError("Missing required parameters");
    }
  }, [serviceItemId, selectedCompany, userId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">Loading service item data...</div>
      </div>
    );
  }

  if (error || !serviceItem) {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-header bg-danger text-white">
            <h5 className="mb-0">Error</h5>
          </div>
          <div className="card-body">
            <div className="alert alert-danger">
              <strong>Error:</strong> {error}
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleBack}>
                Go Back
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/servicemanager/service-pool')}
              >
                Return to Service Pool
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 service-request-formview">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1" style={{color:'white'}}>Service Item Details</h5>
            <h6 className="text-white mb-0">Detailed service item information</h6>
          </div>
          <div>
            <button 
              className="btn btn-light btn-sm" 
              onClick={handleBack}
            >
              &larr; Back
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Main Service Item Details */}
          <div className="mb-4">
            <h6 className="border-bottom pb-2 mb-3">Basic Information</h6>
            <div className="table-responsive">
              <table className="table table-bordered ">
                <tbody>
                  <tr>
                    <th className="headerblack">Service Item ID</th>
                    <td>{serviceItem.service_item_id}</td>
                  </tr>
                  <tr>
                    <th>Service Item Name</th>
                    <td>{serviceItem.service_item_name}</td>
                  </tr>
                  <tr>
                    <th>Serial Number</th>
                    <td>{serviceItem.serial_number}</td>
                  </tr>
                  <tr>
                    <th>PCB Serial Number</th>
                    <td>{serviceItem.pcb_serial_number}</td>
                  </tr>
                  <tr>
                    <th>Location</th>
                    <td>{serviceItem.location}</td>
                  </tr>
                  <tr>
                    <th>Coordinates</th>
                    <td>
                      {serviceItem.location_latitude && serviceItem.location_longitude 
                        ? `${serviceItem.location_latitude}, ${serviceItem.location_longitude}`
                        : 'N/A'
                      }
                    </td>
                  </tr>
                  <tr>
                    <th>Installation Date</th>
                    <td>{formatDate(serviceItem.installation_date)}</td>
                  </tr>
                  <tr>
                    <th>Warranty Start Date</th>
                    <td>{formatDate(serviceItem.warranty_start_date)}</td>
                  </tr>
                  <tr>
                    <th>Warranty End Date</th>
                    <td>{formatDate(serviceItem.warranty_end_date)}</td>
                  </tr>
                  <tr>
                    <th>Contract End Date</th>
                    <td>{formatDate(serviceItem.contract_end_date)}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <span
                        className={`badge ${
                          serviceItem.status === "Active"
                            ? "bg-success"
                            : serviceItem.status === "Inactive"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {serviceItem.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>IOT Status</th>
                    <td>
                      <span
                        className={`badge ${
                          serviceItem.iot_status === "Online"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {serviceItem.iot_status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Last Checked</th>
                    <td>{formatDateTime(serviceItem.last_checked)}</td>
                  </tr>
                  <tr>
                    <th>Last Service</th>
                    <td>{formatDateTime(serviceItem.last_service)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-4">
            <h6 className="border-bottom pb-2 mb-3">Additional Information</h6>
            <div className="table-responsive">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Product Description</th>
                    <td>{serviceItem.product_description || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>BC Number</th>
                    <td>{serviceItem.bc_number || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Ship to Code</th>
                    <td>{serviceItem.ship_to_code || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Company</th>
                    <td>{serviceItem.company}</td>
                  </tr>
                  <tr>
                    <th>Product</th>
                    <td>{serviceItem.product}</td>
                  </tr>
                  <tr>
                    <th>Customer</th>
                    <td>{serviceItem.customer}</td>
                  </tr>
                  <tr>
                    <th>PM Group</th>
                    <td>{serviceItem.pm_group}</td>
                  </tr>
                  <tr>
                    <th>Created By</th>
                    <td>{serviceItem.created_by || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Updated By</th>
                    <td>{serviceItem.updated_by || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Created At</th>
                    <td>{formatDateTime(serviceItem.created_at)}</td>
                  </tr>
                  <tr>
                    <th>Updated At</th>
                    <td>{formatDateTime(serviceItem.updated_at)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Service Item Components */}
          {serviceItem.service_item_components && serviceItem.service_item_components.length > 0 && (
            <div className="mb-4">
              <h6 className="border-bottom pb-2 mb-3">Service Item Components</h6>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>Component ID</th>
                      <th>Type</th>
                        <th>Component</th>
                      <th>Serial Number</th>
                      <th>Warranty Start</th>
                      <th>Warranty End</th>
                      <th>Vendor</th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {serviceItem.service_item_components.map((component, index) => (
                      <tr key={component.service_component_id || index}>
                        <td>{component.service_component_id}</td>
                        <td>{component.component_type}</td>
                         <td>{component.component}</td>
                        <td>{component.component_serial_number}</td>
                        <td>{formatDate(component.warranty_start_date)}</td>
                        <td>{formatDate(component.warranty_end_date)}</td>
                        <td>{component.vendor_id}</td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to format dates (date only)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'N/A';
  }
};

// Helper function to format date with time
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return 'N/A';
  }
};

export default ServiceItemDetails;