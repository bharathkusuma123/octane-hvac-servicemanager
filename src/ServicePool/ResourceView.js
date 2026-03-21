import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import baseURL from '../ApiUrl/Apiurl';
// import "./NewCustomer.css"; 
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";

const ResourceView = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [resource, setResource] = useState(null);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [assignedServices, setAssignedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);

  // Check if we have state from navigation
  const fromServicePool = location.state?.fromServicePool || false;

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/`);
      const usersArray = Array.isArray(response.data) ? response.data : [];
      setUsers(usersArray);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch companies data
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${baseURL}/companies/`);
      if (response.data.status === "success") {
        setCompanies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  // Fetch assigned service requests for this resource
  const fetchAssignedServices = async () => {
    try {
      // You might need to adjust this endpoint based on your API structure
      // This assumes there's an endpoint to get service requests assigned to this resource
      const response = await axios.get(`${baseURL}/service-requests/`, {
        params: {
          assigned_engineer: resourceId,
          user_id: userId,
          company_id: selectedCompany
        }
      });
      
      if (response.data && response.data.data) {
        setAssignedServices(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching assigned services:", error);
    }
  };

  // Fetch resource details
  const fetchResource = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${baseURL}/resources/${resourceId}/?user_id=${userId}&company_id=${selectedCompany}`
      );
      
      if (response.data.status === "success") {
        setResource(response.data.data);
        // Fetch assigned services for this resource
        fetchAssignedServices();
      } else {
        setError("Resource not found");
      }
    } catch (error) {
      console.error("Error fetching resource:", error);
      
      if (error.response && error.response.status === 403) {
        setError(error.response.data?.message || "You do not have permission to view this resource");
      } else if (error.response && error.response.status === 404) {
        setError("Resource not found");
      } else {
        setError("Failed to load resource data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
      await fetchCompanies();
      if (resourceId && userId && selectedCompany) {
        fetchResource();
      } else {
        setLoading(false);
        setError("Missing required parameters");
      }
    };

    loadData();
  }, [resourceId, selectedCompany, userId]);

  // Function to get username from user_id
  const getUsername = (userId) => {
    if (!userId || users.length === 0) return userId || '-';
    
    const user = users.find(user => user.user_id === userId);
    return user ? user.username : userId;
  };

  // Function to get company name
  const getCompanyName = (companyId) => {
    if (!companyId || companies.length === 0) return companyId;
    
    const company = companies.find(comp => comp.company_id === companyId);
    return company ? company.company_name : companyId;
  };

  // Function to format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return '-';
    }
  };

  // Function to format date only
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
      return '-';
    }
  };

  const handleEdit = () => {
    navigate(`/servicemanager/resource-edit/${resourceId}`);
  };

  const handleBack = () => {
    if (fromServicePool) {
      navigate(-1);
    } else {
      navigate('/servicemanager/resources');
    }
  };

  // Function to navigate to service request details
  const handleViewServiceRequest = (requestId) => {
    navigate(`/servicemanager/service-requests/${requestId}`);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">Loading resource data...</div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-header bg-danger text-white">
            <h5 className="mb-0">Access Denied</h5>
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
                onClick={() => navigate('/servicemanager/resources')}
              >
                Return to Resources List
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
            <h5 className="mb-1" style={{color:'white'}}>View Resource</h5>
            <h6 className="text-white mb-0">Detailed resource information</h6>
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
          <div className="table-responsive">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Resource ID</th>
                  <td>{resource.resource_id}</td>
                </tr>
                <tr>
                  <th>Full Name</th>
                  <td>{resource.full_name}</td>
                </tr>
                <tr>
                  <th>User ID</th>
                  <td>{getUsername(resource.user)}</td>

                  {/* <td>
                    {resource.user ? (
                      <button 
                        className="btn btn-link p-0  "
                        style={{
                       
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: 'inherit'
                        }}
                        title={`View User Details: ${resource.user}`}
                      >
                        {getUsername(resource.user)}
                      </button>
                    ) : '-'}
                  </td> */}
                </tr>
                <tr>
                  <th>Company</th>
                  <td>{getCompanyName(resource.company)}</td>
                </tr>
                <tr>
                  <th>Mobile Number</th>
                  <td>{resource.mobile_no || '-'}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{resource.email || '-'}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <span
                      className={`badge ${
                        resource.status === "Active"
                          ? "bg-success"
                          : resource.status === "Inactive"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {resource.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Hourly Rate</th>
                  <td>﷼ {resource.hourly_rate || '-'}</td>
                </tr>
                <tr>
                  <th>Average Rating</th>
                  <td>
                    {resource.average_rating ? (
                      <span>
                        {resource.average_rating} / 5
                        <span className="text-warning ms-1">★</span>
                      </span>
                    ) : '-'}
                  </td>
                </tr>
                <tr>
                  <th>Skills</th>
                  <td>{resource.skills || '-'}</td>
                </tr>
                <tr>
                  <th>Experience (Years)</th>
                  <td>{resource.experience || '-'}</td>
                </tr>
                <tr>
                  <th>Specialization</th>
                  <td>{resource.specialization || '-'}</td>
                </tr>
                <tr>
                  <th>Created At</th>
                  <td>{formatDateTime(resource.created_at)}</td>
                </tr>
                <tr>
                  <th>Created By</th>
                  <td>{getUsername(resource.created_by)}</td>
                </tr>
                <tr>
                  <th>Updated At</th>
                  <td>{resource.updated_at ? formatDateTime(resource.updated_at) : '-'}</td>
                </tr>
                <tr>
                  <th>Updated By</th>
                  <td>{resource.updated_by ? getUsername(resource.updated_by) : '-'}</td>
                </tr>
                <tr>
                  <th>Remarks</th>
                  <td>{resource.remarks || '-'}</td>
                </tr>
                
                {/* Assigned Service Requests */}
                <tr>
                  <th>Assigned Service Requests</th>
                  <td>
                    {assignedServices.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {assignedServices.map((service, index) => (
                          <button 
                            key={service.request_id}
                            className="btn btn-link p-0 text-primary text-decoration-underline me-2"
                            onClick={() => handleViewServiceRequest(service.request_id)}
                            style={{
                              color: '#0d6efd',
                              textDecoration: 'underline',
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              fontSize: 'inherit'
                            }}
                            title={`View Service Request: ${service.request_id}`}
                          >
                            {service.request_id}
                            {index < assignedServices.length - 1 && ', '}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">No assigned service requests</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceView;