// import React from 'react';
// import './NewCustomer.css';

// const NewCustomer = () => {
//   return (
//     <div className="customer-form-container">
//       <h2 className="customer-title">New Customer</h2>
//       <p className="customer-subtitle">Fill in the customer details below</p>

//       <form className="customer-form">
//         {/* Basic Information */}
//         <div className="section-title">Basic Information</div>
//         <div className="row mb-3">
//           <div className="col-md-6">
//             <label className="form-label">Customer ID</label>
//             <input type="text" className="form-control" placeholder="e.g. C04049" />
//           </div>
//           <div className="col-md-6">
//             <label className="form-label">Full Name</label>
//             <input type="text" className="form-control" placeholder="Enter full name" />
//           </div>
//         </div>

//         {/* Contact Information */}
//         <div className="section-title">Contact Information</div>
//         <div className="row mb-3">
//           <div className="col-md-4">
//             <label className="form-label">Telephone</label>
//             <input type="text" className="form-control" placeholder="Landline number" />
//           </div>
//           <div className="col-md-4">
//             <label className="form-label">Mobile</label>
//             <input type="text" className="form-control" placeholder="Mobile number" />
//           </div>
//           <div className="col-md-4">
//             <label className="form-label">Email</label>
//             <input type="email" className="form-control" placeholder="Email address" />
//           </div>
//         </div>

//         {/* Location Information */}
//         <div className="section-title">Location Information</div>
//         <div className="row mb-3">
//           <div className="col-md-4">
//             <label className="form-label">City</label>
//             <input type="text" className="form-control" placeholder="City name" />
//           </div>
//           <div className="col-md-4">
//             <label className="form-label">Country Code</label>
//             <input type="text" className="form-control" placeholder="e.g. KSA" />
//           </div>
//           <div className="col-md-4">
//             <label className="form-label">Address</label>
//             <textarea className="form-control" placeholder="Full address" rows="1" />
//           </div>
//         </div>

//         {/* Type & Status */}
//         <div className="section-title">Type & Status</div>
//         <div className="row mb-3 align-items-end">
//           <div className="col-md-6">
//             <label className="form-label">Customer Type</label>
//             <select className="form-select">
//               <option>Select Type</option>
//             </select>
//           </div>
//           <div className="col-md-6 d-flex align-items-center gap-3">
//             <label className="form-label me-2 mb-0">Status</label>
//             <div>
//               <input type="radio" name="status" className="form-check-input me-1" defaultChecked /> Active
//             </div>
//             <div>
//               <input type="radio" name="status" className="form-check-input me-1" /> Inactive
//             </div>
//             <div>
//               <input type="radio" name="status" className="form-check-input me-1" /> Blocked
//             </div>
//           </div>
//         </div>

//         {/* Security Information */}
//         <div className="section-title">Security Information</div>
//         <div className="row mb-4">
//           <div className="col-md-3">
//             <label className="form-label">Security Question 1</label>
//             <select className="form-select">
//               <option>Select Security Question 1</option>
//             </select>
//           </div>
//           <div className="col-md-3">
//             <label className="form-label">Answer 1</label>
//             <input type="text" className="form-control" placeholder="Answer 1" />
//           </div>
//           <div className="col-md-3">
//             <label className="form-label">Security Question 2</label>
//             <select className="form-select">
//               <option>Select Security Question 2</option>
//             </select>
//           </div>
//           <div className="col-md-3">
//             <label className="form-label">Answer 2</label>
//             <input type="text" className="form-control" placeholder="Answer 2" />
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="d-flex justify-content-end gap-2">
//           <button type="button" className="btn btn-outline-secondary">Cancel</button>
//           <button type="submit" className="btn btn-primary">Save Customer</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default NewCustomer;









import React, { useState } from 'react';
import './NewCustomer.css';

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
      ) : (
        <>
          <h2 className="customer-title">New Customer</h2>
          <p className="customer-subtitle">Fill in the customer details below</p>

          <form className="customer-form" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="section-title">Basic Information</div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Customer ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. C04049" 
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter full name" 
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Username</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter username" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Remarks</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter remarks" 
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="section-title">Contact Information</div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Telephone</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Landline number" 
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Mobile</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Mobile number" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Email address" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="section-title">Location Information</div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">City</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="City name" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Country Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. KSA" 
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Address</label>
                <textarea 
                  className="form-control" 
                  placeholder="Full address" 
                  rows="1" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Type & Status */}
            <div className="section-title">Type & Status</div>
            <div className="row mb-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label">Customer Type</label>
                <select 
                  className="form-select"
                  name="customer_type"
                  value={formData.customer_type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="Regular">Regular</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div className="col-md-6 d-flex align-items-center gap-3">
                <label className="form-label me-2 mb-0">Status</label>
                <div>
                  <input 
                    type="radio" 
                    name="status" 
                    className="form-check-input me-1" 
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={handleChange}
                  /> Active
                </div>
                <div>
                  <input 
                    type="radio" 
                    name="status" 
                    className="form-check-input me-1" 
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={handleChange}
                  /> Inactive
                </div>
                <div>
                  <input 
                    type="radio" 
                    name="status" 
                    className="form-check-input me-1" 
                    value="Blocked"
                    checked={formData.status === 'Blocked'}
                    onChange={handleChange}
                  /> Blocked
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="section-title">Security Information</div>
            <div className="row mb-4">
              <div className="col-md-3">
                <label className="form-label">Security Question 1</label>
                <select 
                  className="form-select"
                  name="security_question1"
                  value={formData.security_question1}
                  onChange={handleChange}
                >
                  <option value="">Select Question 1</option>
                  <option value="What was your first pet's name?">What was your first pet's name?</option>
                  <option value="What city were you born in?">What city were you born in?</option>
                  <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Answer 1</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Answer 1" 
                  name="answer1"
                  value={formData.answer1}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Security Question 2</label>
                <select 
                  className="form-select"
                  name="security_question2"
                  value={formData.security_question2}
                  onChange={handleChange}
                >
                  <option value="">Select Question 2</option>
                  <option value="What was your first school?">What was your first school?</option>
                  <option value="What is your favorite book?">What is your favorite book?</option>
                  <option value="What was your childhood nickname?">What was your childhood nickname?</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Answer 2</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Answer 2" 
                  name="answer2"
                  value={formData.answer2}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={toggleForm}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Save Customer</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default NewCustomer;