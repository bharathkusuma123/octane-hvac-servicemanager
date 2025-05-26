import React from 'react';

const CustomerTable = ({ customers, toggleForm }) => {
  return (
    <>
      <h2 className="customer-title">Customers</h2>
      <p className="customer-subtitle">Manage customer records</p>
      <div className="d-flex justify-content-end mb-3">
        <button 
          onClick={toggleForm}
          className="btn btn-primary"
        >
          Add New Customer
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Customer ID</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>City</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.customer_id}</td>
                <td>{customer.full_name}</td>
                <td>{customer.username}</td>
                <td>{customer.email}</td>
                <td>{customer.mobile}</td>
                <td>{customer.city}</td>
                <td>{customer.customer_type}</td>
                <td>
                  <span className={`badge ${
                    customer.status === 'Active' ? 'bg-success' :
                    customer.status === 'Inactive' ? 'bg-warning text-dark' :
                    'bg-danger'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td>{customer.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CustomerTable;