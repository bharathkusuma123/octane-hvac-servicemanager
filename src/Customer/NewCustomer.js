import React, { useState } from 'react';
import './NewCustomer.css';
import CustomerTable from './CustomerTable';
import CustomerForm from './CustomerForm';

const NewCustomer = () => {
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([
    // Sample data - replace with your actual data
    {
      customer_id: 'C04049',
      username: 'john_doe',
      full_name: 'John Doe',
      telephone: '0123456789',
      mobile: '9876543210',
      email: 'john@example.com',
      city: 'New York',
      country_code: 'US',
      address: '123 Main St',
      customer_type: 'Regular',
      status: 'Active',
      remarks: 'VIP customer',
      created_at: '2023-01-15',
      updated_at: '2023-05-20'
    },
    {
      customer_id: 'C04050',
      username: 'jane_smith',
      full_name: 'Jane Smith',
      telephone: '0987654321',
      mobile: '1234567890',
      email: 'jane@example.com',
      city: 'Los Angeles',
      country_code: 'US',
      address: '456 Oak Ave',
      customer_type: 'Premium',
      status: 'Active',
      remarks: 'Monthly subscriber',
      created_at: '2023-02-10',
      updated_at: '2023-06-05'
    }
  ]);

  const [formData, setFormData] = useState({
    customer_id: '',
    username: '',
    full_name: '',
    telephone: '',
    mobile: '',
    email: '',
    city: '',
    country_code: '',
    address: '',
    customer_type: '',
    status: 'Active',
    remarks: '',
    security_question1: '',
    security_question2: '',
    answer1: '',
    answer2: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new customer to the list
    setCustomers([...customers, formData]);
    // Reset form and hide it
    setFormData({
      customer_id: '',
      username: '',
      full_name: '',
      telephone: '',
      mobile: '',
      email: '',
      city: '',
      country_code: '',
      address: '',
      customer_type: '',
      status: 'Active',
      remarks: '',
      security_question1: '',
      security_question2: '',
      answer1: '',
      answer2: ''
    });
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="customer-form-container">
      {!showForm ? (
        <CustomerTable customers={customers} toggleForm={toggleForm} />
      ) : (
        <CustomerForm 
          formData={formData} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
          toggleForm={toggleForm} 
        />
      )}
    </div>
  );
};

export default NewCustomer;