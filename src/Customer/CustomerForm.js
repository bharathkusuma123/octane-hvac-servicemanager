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

















// import React, { useState } from 'react';
// import axios from 'axios';
// import './NewCustomer.css'
// import baseURL from '../ApiUrl/Apiurl';

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
//                 address: '',
//         };
//         const [formData1, setFormData1] = useState(initialForm1Data);

//         const handleSubmit = async (e) => {
//                 e.preventDefault();
//                  const selectedCompany = localStorage.getItem("selectedCompany");

//                 const payload = {
//                         customer_id: formData.customer_id,
//                         username: formData.username,
//                         full_name: formData.full_name,
//                         email: formData.email,
//                         mobile: formData.mobile,
//                         telephone: formData.telephone || "Not provided",
//                         city: formData.city || "Not provided",
//                         country_code: formData.country_code || "KSA",
//                         customer_type: formData.customer_type || "Individual",
//                         status: formData.status || "Active",
//                         remarks: formData.remarks || "No remarks",
//                         role: "Customer",
//                         address: formData.address || "Not provided",
//                         last_password: "default_password",
//                         availability: "Available",
//                         rating: "0",
//                         created_by: "Service Manager",
//                         updated_by: "Service Manager",
//                         company: selectedCompany
//                 };

//                 try {
//                       const response = await axios.post(`${baseURL}/customers/`, payload, {
//                                 headers: {
//                                         'Content-Type': 'application/json',
//                                 },
//                         });
//                         console.log('Customer saved:', response.data);
//                         alert('Customer saved successfully!');
//                         setFormData1(initialForm1Data);
//                         toggleForm();
//                 } catch (error) {
//                         console.error('Full error details:', {
//                                 error: error.message,
//                                 response: error.response?.data,
//                                 status: error.response?.status,
//                                 config: error.config,
//                         });

//                         const errorMsg = error.response?.data?.errors
//                                 ? Object.values(error.response.data.errors).flat().join(', ')
//                                 : error.response?.data?.message || error.message;

//                         alert(`Failed to save customer: ${errorMsg}`);
//                 }
//         };

//         return (
//                 <div className="container mt-4 service-request-form">
//                         <div className="card">
//                                 <div className="card-header">
//                                         <h2 style={{color:'white'}} >New Customer</h2>
//                                         <p className="customer-subtitle">Fill in the customer details below</p>
//                                 </div>
//                                 <div className="card-body">
//                                         <form onSubmit={handleSubmit}>
//                                                 {/* Basic Information */}
//                                                 <div className="section-title">Basic Information</div>
//                                                 <div className="row mb-3">
//                                                         <div className="col-md-6">
//                                                                 <label className="form-label">Customer ID</label>
//                                                                 <input
//                                                                         type="text"
//                                                                         className="form-control"
//                                                                         placeholder="e.g. C04049"
//                                                                         name="customer_id"
//                                                                         value={formData.user_id}
//                                                                         onChange={handleChange}
//                                                                         required
//                                                                 />
//                                                         </div>
//                                                         <div className="col-md-6">
//                                                                 <label className="form-label">Full Name</label>
//                                                                 <input
//                                                                         type="text"
//                                                                         className="form-control"
//                                                                         placeholder="Enter full name"
//                                                                         name="full_name"
//                                                                         value={formData.full_name}
//                                                                         onChange={handleChange}
//                                                                         required
//                                                                 />
//                                                         </div>
//                                                 </div>

//                                                 <div className="row mb-3">
//                                                         <div className="col-md-6">
//                                                                 <label className="form-label">Username</label>
//                                                                 <input
//                                                                         type="text"
//                                                                         className="form-control"
//                                                                         placeholder="Enter username"
//                                                                         name="username"
//                                                                         value={formData.username}
//                                                                         onChange={handleChange}
//                                                                         required
//                                                                 />
//                                                         </div>
//                                                         <div className="col-md-6">
//                                                                 <label className="form-label">Remarks</label>
//                                                                 <input
//                                                                         type="text"
//                                                                         className="form-control"
//                                                                         placeholder="Enter remarks"
//                                                                         name="remarks"
//                                                                         value={formData.remarks}
//                                                                         onChange={handleChange}
//                                                                 />
//                                                         </div>
//                                                 </div>

//                                                 {/* Contact Information */}
//                                                 <div className="section-title">Contact Information</div>
//                                                 <div className="row mb-3">
//                                                         <div className="col-md-4">
//                                                                 <label className="form-label">Telephone</label>
//                                                                 <input
//                                                                         type="text"
//                                                                         className="form-control"
//                                                                         placeholder="Landline number"
//                                                                         name="telephone"
//                                                                         value={formData.telephone}
//                                                                         onChange={handleChange}
//                                                                 />
//                                                         </div>
//                                                         <div className="col-md-4">
//                                                                 <label className="form-label">Mobile</label>
//                                                                 <input
//                                                                         type="text"
//                                                                         className="form-control"
//                                                                         placeholder="Mobile number"
//                                                                         name="mobile"
//                                                                         value={formData.mobile}
//                                                                         onChange={handleChange}
//                                                                         required
//                                                                 />
//                                                         </div>
//                                                         <div className="col-md-4">
//                                                                 <label className="form-label">Email</label>
//                                                                 <input
//                                                                         type="email"
//                                                                         className="form-control"
//                                                                         placeholder="Email address"
//                                                                         name="email"
//                                                                         value={formData.email}
//                                                                         onChange={handleChange}
//                                                                         required
//                                                                 />
//                                                         </div>
//                                                 </div>

//                                                 {/* Location Information */}
//                                                 <div className="section-title">Location Information</div>
//                                                 <div className="row mb-3">
//                                                         <div className="col-md-4">
//                                                                 <label className="form-label">City</label>
//                                                                 <input
//                                                                         type="text"
//                                                                         className="form-control"
//                                                                         placeholder="City name"
//                                                                         name="city"
//                                                                         value={formData.city}
//                                                                         onChange={handleChange}
//                                                                 />
//                                                         </div>
//                                                         <div className="col-md-4">
//                                                                 <label className="form-label">Country Code</label>
//                                                                 <input
//                                                                         type="text"
//                                                                         className="form-control"
//                                                                         placeholder="e.g. KSA"
//                                                                         name="country_code"
//                                                                         value={formData.country_code}
//                                                                         onChange={handleChange}
//                                                                 />
//                                                         </div>
//                                                         <div className="col-md-4">
//                                                                 <label className="form-label">Address</label>
//                                                                 <textarea
//                                                                         className="form-control"
//                                                                         placeholder="Full address"
//                                                                         rows="1"
//                                                                         name="address"
//                                                                         value={formData.address}
//                                                                         onChange={handleChange}
//                                                                 />
//                                                         </div>
//                                                 </div>

//                                                 {/* Type & Status */}
//                                                 <div className="section-title">Type & Status</div>
//                                                 <div className="row mb-3 align-items-end">
//                                                         <div className="col-md-6">
//                                                                 <label className="form-label">Customer Type</label>
//                                                                 <select
//                                                                         className="form-select"
//                                                                         name="customer_type"
//                                                                         value={formData.customer_type}
//                                                                         onChange={handleChange}
//                                                                 >
//                                                                         <option value="">Select Type</option>
//                                                                         <option value="Individual">Individual</option>
//                                                                         <option value="Business">Business</option>
//                                                                         <option value="Contractor">Contractor</option>
//                                                                 </select>
//                                                         </div>
//                                                         <div className="col-md-6 d-flex align-items-center gap-3">
//                                                                 <label className="form-label me-2 mb-0">Status</label>
//                                                                 <div>
//                                                                         <input
//                                                                                 type="radio"
//                                                                                 name="status"
//                                                                                 className="form-check-input me-1"
//                                                                                 value="Active"
//                                                                                 checked={formData.status === 'Active'}
//                                                                                 onChange={handleChange}
//                                                                         /> Active
//                                                                 </div>
//                                                                 <div>
//                                                                         <input
//                                                                                 type="radio"
//                                                                                 name="status"
//                                                                                 className="form-check-input me-1"
//                                                                                 value="Inactive"
//                                                                                 checked={formData.status === 'Inactive'}
//                                                                                 onChange={handleChange}
//                                                                         /> Inactive
//                                                                 </div>
//                                                                 <div>
//                                                                         <input
//                                                                                 type="radio"
//                                                                                 name="status"
//                                                                                 className="form-check-input me-1"
//                                                                                 value="Blocked"
//                                                                                 checked={formData.status === 'Blocked'}
//                                                                                 onChange={handleChange}
//                                                                         /> Blocked
//                                                                 </div>
//                                                         </div>
//                                                 </div>

//                                                 <div className="d-flex justify-content-center gap-2">
//                                                                                                                 <button type="submit" className="btn btn-primary">Save Customer</button>

//                                                         <button
//                                                                 type="button"
//                                                                 className="btn btn-secondary"
//                                                                 onClick={toggleForm}
//                                                         >
//                                                                 Cancel
//                                                         </button>
//                                                 </div>
//                                         </form>
//                                 </div>
//                         </div>

//                 </div>
//         );
// };

// export default CustomerForm;






// import React, { useState, useContext } from 'react';
// import axios from 'axios';
// import './NewCustomer.css'
// import baseURL from '../ApiUrl/Apiurl';
// import Swal from 'sweetalert2';
// import { AuthContext } from '../AuthContext/AuthContext';

// const SECURITY_QUESTION_CHOICES = [
//     "What is your mother's maiden name?",
//     "What was the name of your first pet?",
//     "What was your first car?",
//     "What is the name of the town where you were born?",
//     "What was your childhood nickname?",
// ];

// const CustomerForm = ({ formData, handleChange, toggleForm }) => {
//     const initialForm1Data = {
//         user_id: '',
//         username: '',
//         full_name: '',
//         email: '',
//         mobile: '',
//         telephone: '',
//         city: '',
//         country_code: 'KSA',
//         customer_type: 'Individual',
//         status: 'Active',
//         remarks: '',
//         address: '',
//     };
//     const [formData1, setFormData1] = useState(initialForm1Data);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//      const { userId } = useContext(AuthContext);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         const selectedCompany = localStorage.getItem("selectedCompany");

//         const payload = {
//             customer_id: formData.customer_id,
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
//             updated_by: "Service Manager",
//             company: selectedCompany,
//             user_id: userId,
//             company_id: selectedCompany
//         };

//         try {
//             const response = await axios.post(`${baseURL}/customers/`, payload, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
            
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Success!',
//                 text: 'Customer saved successfully!',
//                 confirmButtonColor: '#3085d6',
//             }).then(() => {
//                 setFormData1(initialForm1Data);
//                 toggleForm();
//             });
            
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

//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: `Failed to save customer: ${errorMsg}`,
//                 confirmButtonColor: '#d33',
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="container mt-4 service-request-form">
//             <div className="card">
//                 <div className="card-header">
//                     <h2 style={{color:'white'}}>New Customer</h2>
//                     <p className="customer-subtitle">Fill in the customer details below</p>
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         {/* Basic Information */}
//                         <div className="section-title">Basic Information</div>
//                         <div className="row mb-3">
//                             <div className="col-md-6">
//                                 <label className="form-label">Customer ID</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="e.g. C04049"
//                                     name="customer_id"
//                                     value={formData.user_id}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6">
//                                 <label className="form-label">Full Name</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Enter full name"
//                                     name="full_name"
//                                     value={formData.full_name}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         <div className="row mb-3">
//                             <div className="col-md-6">
//                                 <label className="form-label">Username</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Enter username"
//                                     name="username"
//                                     value={formData.username}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6">
//                                 <label className="form-label">Remarks</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Enter remarks"
//                                     name="remarks"
//                                     value={formData.remarks}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                         </div>

//                         {/* Contact Information */}
//                         <div className="section-title">Contact Information</div>
//                         <div className="row mb-3">
//                             <div className="col-md-4">
//                                 <label className="form-label">Telephone</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Landline number"
//                                     name="telephone"
//                                     value={formData.telephone}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-4">
//                                 <label className="form-label">Mobile</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="Mobile number"
//                                     name="mobile"
//                                     value={formData.mobile}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-4">
//                                 <label className="form-label">Email</label>
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     placeholder="Email address"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         {/* Location Information */}
//                         <div className="section-title">Location Information</div>
//                         <div className="row mb-3">
//                             <div className="col-md-4">
//                                 <label className="form-label">City</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="City name"
//                                     name="city"
//                                     value={formData.city}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-4">
//                                 <label className="form-label">Country Code</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     placeholder="e.g. KSA"
//                                     name="country_code"
//                                     value={formData.country_code}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-4">
//                                 <label className="form-label">Address</label>
//                                 <textarea
//                                     className="form-control"
//                                     placeholder="Full address"
//                                     rows="1"
//                                     name="address"
//                                     value={formData.address}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                         </div>

//                         {/* Type & Status */}
//                         <div className="section-title">Type & Status</div>
//                         <div className="row mb-3 align-items-end">
//                             <div className="col-md-6">
//                                 <label className="form-label">Customer Type</label>
//                                 <select
//                                     className="form-select"
//                                     name="customer_type"
//                                     value={formData.customer_type}
//                                     onChange={handleChange}
//                                 >
//                                     <option value="">Select Type</option>
//                                     <option value="Individual">Individual</option>
//                                     <option value="Business">Business</option>
//                                     <option value="Contractor">Contractor</option>
//                                 </select>
//                             </div>
//                             <div className="col-md-6 d-flex align-items-center gap-3">
//                                 <label className="form-label me-2 mb-0">Status</label>
//                                 <div>
//                                     <input
//                                         type="radio"
//                                         name="status"
//                                         className="form-check-input me-1"
//                                         value="Active"
//                                         checked={formData.status === 'Active'}
//                                         onChange={handleChange}
//                                     /> Active
//                                 </div>
//                                 <div>
//                                     <input
//                                         type="radio"
//                                         name="status"
//                                         className="form-check-input me-1"
//                                         value="Inactive"
//                                         checked={formData.status === 'Inactive'}
//                                         onChange={handleChange}
//                                     /> Inactive
//                                 </div>
//                                 <div>
//                                     <input
//                                         type="radio"
//                                         name="status"
//                                         className="form-check-input me-1"
//                                         value="Blocked"
//                                         checked={formData.status === 'Blocked'}
//                                         onChange={handleChange}
//                                     /> Blocked
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="d-flex justify-content-center gap-2">
//                             <button 
//                                 type="submit" 
//                                 className="btn btn-primary"
//                                 disabled={isSubmitting}
//                             >
//                                 {isSubmitting ? 'Saving...' : 'Save Customer'}
//                             </button>
//                             <button
//                                 type="button"
//                                 className="btn btn-secondary"
//                                 onClick={toggleForm}
//                                 disabled={isSubmitting}
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CustomerForm;


import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import './NewCustomer.css'
import baseURL from '../ApiUrl/Apiurl';
import Swal from 'sweetalert2';
import { AuthContext } from '../AuthContext/AuthContext';

const SECURITY_QUESTION_CHOICES = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was your first car?",
    "What is the name of the town where you were born?",
    "What was your childhood nickname?",
];

const CustomerForm = ({ formData, handleChange, toggleForm, isEditing, handleSubmit }) => {
    const initialFormData = {
        customer_id: '',
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
        security_question1: '',
        security_question2: '',
        answer1: '',
        answer2: ''
    };
    
    const [localFormData, setLocalFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { userId } = useContext(AuthContext);

    // Update local form data when formData prop changes (for editing)
    useEffect(() => {
        if (isEditing && formData) {
            setLocalFormData(formData);
        } else {
            setLocalFormData(initialFormData);
        }
    }, [formData, isEditing]);

    const handleLocalChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
        // Also call parent's handleChange if provided
        if (handleChange) {
            handleChange(e);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const selectedCompany = localStorage.getItem("selectedCompany");

        const payload = {
            customer_id: localFormData.customer_id,
            username: localFormData.username,
            full_name: localFormData.full_name,
            email: localFormData.email,
            mobile: localFormData.mobile,
            telephone: localFormData.telephone || "Not provided",
            city: localFormData.city || "Not provided",
            country_code: localFormData.country_code || "KSA",
            customer_type: localFormData.customer_type || "Individual",
            status: localFormData.status || "Active",
            remarks: localFormData.remarks || "No remarks",
            role: "Customer",
            address: localFormData.address || "Not provided",
            last_password: "default_password",
            availability: "Available",
            rating: "0",
            created_by: "Service Manager",
            updated_by: "Service Manager",
            company: selectedCompany,
            user_id: userId,
            company_id: selectedCompany
        };

        // Add security questions if provided
        if (localFormData.security_question1) {
            payload.security_question1 = localFormData.security_question1;
            payload.answer1 = localFormData.answer1;
        }
        if (localFormData.security_question2) {
            payload.security_question2 = localFormData.security_question2;
            payload.answer2 = localFormData.answer2;
        }

        try {
            let response;
            
            if (isEditing) {
                // Update existing customer
                response = await axios.put(
                    `${baseURL}/customers/${localFormData.customer_id}/?user_id=${userId}&company_id=${selectedCompany}`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            } else {
                // Create new customer
                response = await axios.post(`${baseURL}/customers/`, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Customer ${isEditing ? 'updated' : 'saved'} successfully!`,
                confirmButtonColor: '#3085d6',
            }).then(() => {
                setLocalFormData(initialFormData);
                if (handleSubmit) {
                    handleSubmit(e, localFormData);
                }
                toggleForm();
            });
            
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

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to ${isEditing ? 'update' : 'save'} customer: ${errorMsg}`,
                confirmButtonColor: '#d33',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (isSubmitting) return;
        
        if (isEditing) {
            Swal.fire({
                title: 'Cancel Editing?',
                text: 'Are you sure you want to cancel? All changes will be lost.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, cancel!',
                cancelButtonText: 'Continue editing'
            }).then((result) => {
                if (result.isConfirmed) {
                    setLocalFormData(initialFormData);
                    toggleForm();
                }
            });
        } else {
            setLocalFormData(initialFormData);
            toggleForm();
        }
    };

    return (
        <div className="container mt-4 service-request-form">
            <div className="card">
                <div className="card-header">
                    <h2 style={{color:'white'}}>{isEditing ? 'Edit Customer' : 'New Customer'}</h2>
                    <p className="customer-subtitle">
                        {isEditing ? 'Update the customer details below' : 'Fill in the customer details below'}
                    </p>
                </div>
                <div className="card-body">
                    <form onSubmit={handleFormSubmit}>
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
                                    value={localFormData.customer_id}
                                    onChange={handleLocalChange}
                                    required
                                    disabled={isEditing}
                                />
                                {isEditing && (
                                    <small className="form-text text-muted">
                                        Customer ID cannot be changed
                                    </small>
                                )}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter full name"
                                    name="full_name"
                                    value={localFormData.full_name}
                                    onChange={handleLocalChange}
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
                                    value={localFormData.username}
                                    onChange={handleLocalChange}
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
                                    value={localFormData.remarks}
                                    onChange={handleLocalChange}
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
                                    value={localFormData.telephone}
                                    onChange={handleLocalChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Mobile</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Mobile number"
                                    name="mobile"
                                    value={localFormData.mobile}
                                    onChange={handleLocalChange}
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
                                    value={localFormData.email}
                                    onChange={handleLocalChange}
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
                                    value={localFormData.city}
                                    onChange={handleLocalChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Country Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. KSA"
                                    name="country_code"
                                    value={localFormData.country_code}
                                    onChange={handleLocalChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Address</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Full address"
                                    rows="1"
                                    name="address"
                                    value={localFormData.address}
                                    onChange={handleLocalChange}
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
                                    value={localFormData.customer_type}
                                    onChange={handleLocalChange}
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
                                        checked={localFormData.status === 'Active'}
                                        onChange={handleLocalChange}
                                    /> Active
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        name="status"
                                        className="form-check-input me-1"
                                        value="Inactive"
                                        checked={localFormData.status === 'Inactive'}
                                        onChange={handleLocalChange}
                                    /> Inactive
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        name="status"
                                        className="form-check-input me-1"
                                        value="Blocked"
                                        checked={localFormData.status === 'Blocked'}
                                        onChange={handleLocalChange}
                                    /> Blocked
                                </div>
                            </div>
                        </div>

                        {/* Security Questions (Optional) */}
                        <div className="section-title">Security Questions (Optional)</div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Security Question 1</label>
                                <select
                                    className="form-select"
                                    name="security_question1"
                                    value={localFormData.security_question1}
                                    onChange={handleLocalChange}
                                >
                                    <option value="">Select a security question</option>
                                    {SECURITY_QUESTION_CHOICES.map((question, index) => (
                                        <option key={index} value={question}>
                                            {question}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Answer 1</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter answer"
                                    name="answer1"
                                    value={localFormData.answer1}
                                    onChange={handleLocalChange}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Security Question 2</label>
                                <select
                                    className="form-select"
                                    name="security_question2"
                                    value={localFormData.security_question2}
                                    onChange={handleLocalChange}
                                >
                                    <option value="">Select a security question</option>
                                    {SECURITY_QUESTION_CHOICES.map((question, index) => (
                                        <option key={index} value={question}>
                                            {question}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Answer 2</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter answer"
                                    name="answer2"
                                    value={localFormData.answer2}
                                    onChange={handleLocalChange}
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-center gap-2">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting 
                                    ? (isEditing ? 'Updating...' : 'Saving...') 
                                    : (isEditing ? 'Update Customer' : 'Save Customer')
                                }
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerForm;
