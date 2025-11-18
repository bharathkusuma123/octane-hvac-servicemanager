import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from '../ApiUrl/Apiurl';
import "./NewCustomer.css"; 
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";

const CustomerView = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        
        const response = await axios.get(
          `${baseURL}/customers/${customerId}/?user_id=${userId}&company_id=${selectedCompany}`
        );
        
        if (response.data.status === "success") {
          setCustomer(response.data.data);
        } else {
          setError("Customer not found");
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        
        // Handle 403 permission error specifically
        if (error.response && error.response.status === 403) {
          setError(error.response.data?.message || "You do not have permission to view this customer");
        } else if (error.response && error.response.status === 404) {
          setError("Customer not found");
        } else {
          setError("Failed to load customer data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (customerId && userId && selectedCompany) {
      fetchCustomer();
    } else {
      setLoading(false);
      setError("Missing required parameters");
    }
  }, [customerId, selectedCompany, userId]);

  const handleEdit = () => {
    navigate(`/customers/edit/${customerId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">Loading customer data...</div>
      </div>
    );
  }

  // Display permission error or other errors
  if (error || !customer) {
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
                onClick={() => navigate('/servicemanager/new-customer')}
              >
                Return to Customers List
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
            <h5 className="mb-1" style={{color:'white'}}>View Customer</h5>
            <h6 className="text-white mb-0">Detailed customer information</h6>
          </div>
          <div>
            {/* <button 
              className="btn btn-warning me-2 btn-sm" 
              onClick={handleEdit}
            >
              Edit
            </button> */}
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
                  <th>Customer ID</th>
                  <td>{customer.customer_id}</td>
                </tr>
                <tr>
                  <th>Username</th>
                  <td>{customer.username}</td>
                </tr>
                <tr>
                  <th>Full Name</th>
                  <td>{customer.full_name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{customer.email}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>{customer.mobile}</td>
                </tr>
                <tr>
                  <th>Telephone</th>
                  <td>{customer.telephone}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{customer.address}</td>
                </tr>
                <tr>
                  <th>City</th>
                  <td>{customer.city}</td>
                </tr>
                <tr>
                  <th>Country Code</th>
                  <td>{customer.country_code}</td>
                </tr>
                <tr>
                  <th>Customer Type</th>
                  <td>{customer.customer_type}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <span
                      className={`badge ${
                        customer.status === "Active"
                          ? "bg-success"
                          : customer.status === "Inactive"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Company</th>
                  <td>{customer.company}</td>
                </tr>
                <tr>
                  <th>Remarks</th>
                  <td>{customer.remarks || '-'}</td>
                </tr>
                <tr>
                  <th>Security Question 1</th>
                  <td>{customer.security_question1 || '-'}</td>
                </tr>
                <tr>
                  <th>Answer 1</th>
                  <td>{customer.answer1 || '-'}</td>
                </tr>
                <tr>
                  <th>Security Question 2</th>
                  <td>{customer.security_question2 || '-'}</td>
                </tr>
                <tr>
                  <th>Answer 2</th>
                  <td>{customer.answer2 || '-'}</td>
                </tr>
                <tr>
                  <th>Created By</th>
                  <td>{customer.created_by || '-'}</td>
                </tr>
                <tr>
                  <th>Updated By</th>
                  <td>{customer.updated_by || '-'}</td>
                </tr>
                <tr>
                  <th>Availability</th>
                  <td>{customer.availability || '-'}</td>
                </tr>
                <tr>
                  <th>Rating</th>
                  <td>{customer.rating || '-'}</td>
                </tr>
                <tr>
                  <th>Created At</th>
                  <td>{formatDate(customer.created_at)}</td>
                </tr>
                <tr>
                  <th>Updated At</th>
                  <td>{formatDate(customer.updated_at)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format dates
const formatDate = (dateString) => {
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

export default CustomerView;