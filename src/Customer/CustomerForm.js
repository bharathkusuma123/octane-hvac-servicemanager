// import React, { useState } from 'react';
// import axios from 'axios';

// const SECURITY_QUESTION_CHOICES = [
//         "What is your mother’s maiden name?",
//         "What was the name of your first pet?",
//         "What was your first car?",
//         "What is the name of the town where you were born?",
//         "What was your childhood nickname?",
// ];

// const CustomerForm = ({ formData, handleChange, toggleForm }) => {

//         const initialForm1Data = {
//                 user_id: '',
//                 username: '',
//                 full_name: '',
//                 email: '',
//                 mobile: '',
//                 telephone: '',
//                 city: '',
//                 country_code: 'KSA',
//                 customer_type: 'Individual',
//                 status: 'Active',
//                 remarks: '',
//                 // hourly_rate: '',
//                 address: '',
//                 // security_question1: '',
//                 // answer1: '',
//                 // security_question2: '',
//                 // answer2: '',
//         };
//         const [formData1, setFormData1] = useState(initialForm1Data);



//           const handleSubmit = async (e) => {
//         e.preventDefault();

//         const payload = {
//              customer_id: formData.customer_id,
//             username: formData.username,
//             full_name: formData.full_name,
//             email: formData.email,
//             mobile: formData.mobile,
//             telephone: formData.telephone || "Not provided",
//             city: formData.city || "Not provided",
//             country_code: formData.country_code || "KSA",
//             customer_type: formData.customer_type || "Individual",
//             status: formData.status || "Active",
//             remarks: formData.remarks || "No remarks",
//             role: "Customer",
//             address: formData.address || "Not provided",
//             last_password: "default_password",
//             availability: "Available",
//             rating: "0",
//             created_by: "Service Manager",
//             updated_by: "Service Manager"
//         };

//         try {
//             const response = await axios.post('http://175.29.21.7:8006/customers/', payload, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             console.log('Customer saved:', response.data);
//             alert('Customer saved successfully!');
//             setFormData1(initialForm1Data);
//             toggleForm();
//         } catch (error) {
//             console.error('Full error details:', {
//                 error: error.message,
//                 response: error.response?.data,
//                 status: error.response?.status,
//                 config: error.config,
//             });

//             const errorMsg = error.response?.data?.errors
//                 ? Object.values(error.response.data.errors).flat().join(', ')
//                 : error.response?.data?.message || error.message;

//             alert(`Failed to save customer: ${errorMsg}`);
//         }
//     };

//         return (
//                 <>
//                         <h2 className="customer-title">New Customer</h2>
//                         <p className="customer-subtitle">Fill in the customer details below</p>

//                         <form className="customer-form" onSubmit={handleSubmit}>
//                                 {/* Basic Information */}
//                                 <div className="section-title">Basic Information</div>
//                                 <div className="row mb-3">
//                                         <div className="col-md-6">
//                                                 <label className="form-label">Customer ID</label>
//                                                 <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="e.g. C04049"
//                                                         name="customer_id" 
//                                                         value={formData.user_id}
//                                                         onChange={handleChange}
//                                                         required
//                                                 />
//                                         </div>
//                                         <div className="col-md-6">
//                                                 <label className="form-label">Full Name</label>
//                                                 <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="Enter full name"
//                                                         name="full_name"
//                                                         value={formData.full_name}
//                                                         onChange={handleChange}
//                                                         required
//                                                 />
//                                         </div>
//                                 </div>

//                                 <div className="row mb-3">
//                                         <div className="col-md-6">
//                                                 <label className="form-label">Username</label>
//                                                 <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="Enter username"
//                                                         name="username"
//                                                         value={formData.username}
//                                                         onChange={handleChange}
//                                                         required
//                                                 />
//                                         </div>
//                                         <div className="col-md-6">
//                                                 <label className="form-label">Remarks</label>
//                                                 <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="Enter remarks"
//                                                         name="remarks"
//                                                         value={formData.remarks}
//                                                         onChange={handleChange}
//                                                 />
//                                         </div>
//                                 </div>

//                                 {/* Contact Information */}
//                                 <div className="section-title">Contact Information</div>
//                                 <div className="row mb-3">
//                                         <div className="col-md-4">
//                                                 <label className="form-label">Telephone</label>
//                                                 <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="Landline number"
//                                                         name="telephone"
//                                                         value={formData.telephone}
//                                                         onChange={handleChange}
//                                                 />
//                                         </div>
//                                         <div className="col-md-4">
//                                                 <label className="form-label">Mobile</label>
//                                                 <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="Mobile number"
//                                                         name="mobile"
//                                                         value={formData.mobile}
//                                                         onChange={handleChange}
//                                                         required
//                                                 />
//                                         </div>
//                                         <div className="col-md-4">
//                                                 <label className="form-label">Email</label>
//                                                 <input
//                                                         type="email"
//                                                         className="form-control"
//                                                         placeholder="Email address"
//                                                         name="email"
//                                                         value={formData.email}
//                                                         onChange={handleChange}
//                                                         required
//                                                 />
//                                         </div>
//                                 </div>

//                                 {/* Location Information */}
//                                 <div className="section-title">Location Information</div>
//                                 <div className="row mb-3">
//                                         <div className="col-md-4">
//                                                 <label className="form-label">City</label>
//                                                 <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="City name"
//                                                         name="city"
//                                                         value={formData.city}
//                                                         onChange={handleChange}
//                                                 />
//                                         </div>
//                                         <div className="col-md-4">
//                                                 <label className="form-label">Country Code</label>
//                                                 <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="e.g. KSA"
//                                                         name="country_code"
//                                                         value={formData.country_code}
//                                                         onChange={handleChange}
//                                                 />
//                                         </div>
//                                         <div className="col-md-4">
//                                                 <label className="form-label">Address</label>
//                                                 <textarea
//                                                         className="form-control"
//                                                         placeholder="Full address"
//                                                         rows="1"
//                                                         name="address"
//                                                         value={formData.address}
//                                                         onChange={handleChange}
//                                                 />
//                                         </div>
//                                 </div>

//                                 {/* Type & Status */}
//                                 <div className="section-title">Type & Status</div>
//                                 <div className="row mb-3 align-items-end">
//                                         <div className="col-md-6">
//                                                 <label className="form-label">Customer Type</label>
//                                                 <select
//                                                         className="form-select"
//                                                         name="customer_type"
//                                                         value={formData.customer_type}
//                                                         onChange={handleChange}
//                                                 >
//                                                         <option value="">Select Type</option>
//                                                         <option value="Individual">Individual</option>
//                                                         <option value="Business">Business</option>
//                                                         <option value="Contractor">Contractor</option>
//                                                 </select>
//                                         </div>
//                                         <div className="col-md-6 d-flex align-items-center gap-3">
//                                                 <label className="form-label me-2 mb-0">Status</label>
//                                                 <div>
//                                                         <input
//                                                                 type="radio"
//                                                                 name="status"
//                                                                 className="form-check-input me-1"
//                                                                 value="Active"
//                                                                 checked={formData.status === 'Active'}
//                                                                 onChange={handleChange}
//                                                         /> Active
//                                                 </div>
//                                                 <div>
//                                                         <input
//                                                                 type="radio"
//                                                                 name="status"
//                                                                 className="form-check-input me-1"
//                                                                 value="Inactive"
//                                                                 checked={formData.status === 'Inactive'}
//                                                                 onChange={handleChange}
//                                                         /> Inactive
//                                                 </div>
//                                                 <div>
//                                                         <input
//                                                                 type="radio"
//                                                                 name="status"
//                                                                 className="form-check-input me-1"
//                                                                 value="Blocked"
//                                                                 checked={formData.status === 'Blocked'}
//                                                                 onChange={handleChange}
//                                                         /> Blocked
//                                                 </div>
//                                         </div>
//                                 </div>

//                                 {/* Security Information */}
//                                 {/* <div className="section-title">Security Information</div>
//                                 <div className="row mb-4">
//                                         <div className="col-md-3">
//                                                 <label className="form-label">Security Question 1</label>
//                                                 <select
//                                                         className="form-select"
//                                                         name="security_question1"
//                                                         value={formData.security_question1}
//                                                         onChange={handleChange}
//                                                         required
//                                                 >
//                                                         <option value="">Select Question 1</option>
//                                                         {SECURITY_QUESTION_CHOICES.map((question, index) => (
//                                                                 <option key={index} value={question}>{question}</option>
//                                                         ))}
//                                                 </select>
//                                         </div>
//                                         <div className="col-md-3">
//                                                 <label className="form-label">Answer 1</label>
//                                                 <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="Answer 1"
//                                                         name="answer1"
//                                                         value={formData.answer1}
//                                                         onChange={handleChange}
//                                                 />
//                                         </div>
//                                         <div className="col-md-3">
//                                                 <label className="form-label">Security Question 2</label>
//                                                 <select
//                                                         className="form-select"
//                                                         name="security_question2"
//                                                         value={formData.security_question2}
//                                                         onChange={handleChange}
//                                                         required
//                                                 >
//                                                         <option value="">Select Question 2</option>
//                                                         {SECURITY_QUESTION_CHOICES.map((question, index) => (
//                                                                 <option key={index} value={question}>{question}</option>
//                                                         ))}
//                                                 </select>
//                                         </div>
//                                         <div className="col-md-3">
//                                                 <label className="form-label">Answer 2</label>
//                                                 <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         placeholder="Answer 2"
//                                                         name="answer2"
//                                                         value={formData.answer2}
//                                                         onChange={handleChange}
//                                                 />
//                                         </div>
//                                 </div> */}

//                                 {/* Buttons */}
//                                 <div className="d-flex justify-content-end gap-2">
//                                         <button
//                                                 type="button"
//                                                 className="btn btn-outline-secondary"
//                                                 onClick={toggleForm}
//                                         >
//                                                 Cancel
//                                         </button>
//                                         <button type="submit" className="btn btn-primary">Save Customer</button>
//                                 </div>
//                         </form>
//                 </>
//         );
// };

// export default CustomerForm;

















import React, { useState } from 'react';
import axios from 'axios';
import './NewCustomer.css'
import baseURL from '../ApiUrl/Apiurl';

const SECURITY_QUESTION_CHOICES = [
        "What is your mother’s maiden name?",
        "What was the name of your first pet?",
        "What was your first car?",
        "What is the name of the town where you were born?",
        "What was your childhood nickname?",
];

const CustomerForm = ({ formData, handleChange, toggleForm }) => {

        const initialForm1Data = {
                user_id: '',
                username: '',
                full_name: '',
                email: '',
                mobile: '',
                telephone: '',
                city: '',
                country_code: 'KSA',
                customer_type: 'Individual',
                status: 'Active',
                remarks: '',
                address: '',
        };
        const [formData1, setFormData1] = useState(initialForm1Data);

        const handleSubmit = async (e) => {
                e.preventDefault();
                 const selectedCompany = localStorage.getItem("selectedCompany");

                const payload = {
                        customer_id: formData.customer_id,
                        username: formData.username,
                        full_name: formData.full_name,
                        email: formData.email,
                        mobile: formData.mobile,
                        telephone: formData.telephone || "Not provided",
                        city: formData.city || "Not provided",
                        country_code: formData.country_code || "KSA",
                        customer_type: formData.customer_type || "Individual",
                        status: formData.status || "Active",
                        remarks: formData.remarks || "No remarks",
                        role: "Customer",
                        address: formData.address || "Not provided",
                        last_password: "default_password",
                        availability: "Available",
                        rating: "0",
                        created_by: "Service Manager",
                        updated_by: "Service Manager",
                        company: selectedCompany
                };

                try {
                      const response = await axios.post(`${baseURL}/customers/`, payload, {
                                headers: {
                                        'Content-Type': 'application/json',
                                },
                        });
                        console.log('Customer saved:', response.data);
                        alert('Customer saved successfully!');
                        setFormData1(initialForm1Data);
                        toggleForm();
                } catch (error) {
                        console.error('Full error details:', {
                                error: error.message,
                                response: error.response?.data,
                                status: error.response?.status,
                                config: error.config,
                        });

                        const errorMsg = error.response?.data?.errors
                                ? Object.values(error.response.data.errors).flat().join(', ')
                                : error.response?.data?.message || error.message;

                        alert(`Failed to save customer: ${errorMsg}`);
                }
        };

        return (
                <div className="container mt-4 service-request-form">
                        <div className="card">
                                <div className="card-header">
                                        <h2 style={{color:'white'}} >New Customer</h2>
                                        <p className="customer-subtitle">Fill in the customer details below</p>
                                </div>
                                <div className="card-body">
                                        <form onSubmit={handleSubmit}>
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
                                                                        value={formData.user_id}
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
                                                                        <option value="Individual">Individual</option>
                                                                        <option value="Business">Business</option>
                                                                        <option value="Contractor">Contractor</option>
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
                                </div>
                        </div>

                </div>
        );
};

export default CustomerForm;