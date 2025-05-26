import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerTable = ({ toggleForm }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://175.29.21.7:8006/users/');
        
        // Filter and sort customers by created_at descending
        const filteredAndSorted = response.data
          .filter(user => user.role === 'Customer')
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setCustomers(filteredAndSorted);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <>
      <h2 className="customer-title">Customers</h2>
      <p className="customer-subtitle">Manage customer records</p>
      <div className="d-flex justify-content-end mb-3">
        <button onClick={toggleForm} className="btn btn-primary">
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
                <td>{customer.user_id}</td>
                <td>{customer.full_name}</td>
                <td>{customer.username}</td>
                <td>{customer.email}</td>
                <td>{customer.mobile_no}</td>
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
                <td>{new Date(customer.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CustomerTable;
