import React from 'react';

const CustomerForm = ({ formData, handleChange, handleSubmit, toggleForm }) => {
  return (
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
  );
};

export default CustomerForm;