import React from "react";
import "./NewCustomer.css"; 

const CustomerView = ({ customer, onClose, onEdit }) => {
  if (!customer) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">No customer data found.</div>
        <button className="btn btn-primary" onClick={onClose}>
          Go Back
        </button>
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
            <button 
              className="btn btn-warning me-2 btn-sm" 
              onClick={onEdit}
            >
              Edit
            </button>
            <button 
              className="btn btn-light btn-sm" 
              onClick={onClose}
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