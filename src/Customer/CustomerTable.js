// // // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';

// // // const CustomerTable = ({ toggleForm }) => {
// // //   const [customers, setCustomers] = useState([]);

// // //   useEffect(() => {
// // //     const fetchCustomers = async () => {
// // //       try {
// // //         const response = await axios.get('http://175.29.21.7:8006/users/');
        
// // //         // Filter and sort customers by created_at descending
// // //         const filteredAndSorted = response.data
// // //           .filter(user => user.role === 'Customer')
// // //           .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
// // //         setCustomers(filteredAndSorted);
// // //       } catch (error) {
// // //         console.error('Error fetching customer data:', error);
// // //       }
// // //     };

// // //     fetchCustomers();
// // //   }, []);

// // //   return (
// // //     <>
// // //       <h2 className="customer-title">Customers</h2>
// // //       <p className="customer-subtitle">Manage customer records</p>
// // //       <div className="d-flex justify-content-end mb-3">
// // //         <button onClick={toggleForm} className="btn btn-primary">
// // //           Add New Customer
// // //         </button>
// // //       </div>

// // //       <div className="table-responsive">
// // //         <table className="table table-striped table-hover">
// // //           <thead className="table-dark">
// // //             <tr>
// // //               <th>Customer ID</th>
// // //               <th>Full Name</th>
// // //               <th>Username</th>
// // //               <th>Email</th>
// // //               <th>Mobile</th>
// // //               <th>City</th>
// // //               <th>Type</th>
// // //               <th>Status</th>
// // //               <th>Created At</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {customers.map((customer, index) => (
// // //               <tr key={index}>
// // //                 <td>{customer.user_id}</td>
// // //                 <td>{customer.full_name}</td>
// // //                 <td>{customer.username}</td>
// // //                 <td>{customer.email}</td>
// // //                 <td>{customer.mobile_no}</td>
// // //                 <td>{customer.city}</td>
// // //                 <td>{customer.customer_type}</td>
// // //                 <td>
// // //                   <span className={`badge ${
// // //                     customer.status === 'Active' ? 'bg-success' :
// // //                     customer.status === 'Inactive' ? 'bg-warning text-dark' :
// // //                     'bg-danger'
// // //                   }`}>
// // //                     {customer.status}
// // //                   </span>
// // //                 </td>
// // //                 <td>{new Date(customer.created_at).toLocaleString()}</td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default CustomerTable;

// // import React, { useEffect, useState, useContext } from 'react';
// // import axios from 'axios';
// // import baseURL from '../ApiUrl/Apiurl';
// // import { useCompany } from "../AuthContext/CompanyContext";
// // import { AuthContext } from "../AuthContext/AuthContext";
// // import { useNavigate } from "react-router-dom";
// // import { FaTrashAlt } from 'react-icons/fa';

// // const CustomerTable = ({ toggleForm }) => {
// //   const [customers, setCustomers] = useState([]);
// //   const [filteredCustomers, setFilteredCustomers] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [entriesPerPage, setEntriesPerPage] = useState(5);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const { selectedCompany } = useCompany();
// //   console.log('Selected company object:', selectedCompany);
// //    const { userId } = useContext(AuthContext);
// //    const navigate = useNavigate();


// //   const fetchCustomers = async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       console.log('Selected company:', selectedCompany);
// //       console.log('User ID:', userId);

// //       if (!userId || !selectedCompany) {
// //         setError('Missing user ID or company ID');
// //         return;
// //       }
      
// //       const response = await axios.get(
// //         `${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`
// //       );
// //       const filteredAndSorted = response.data.data
// //         .filter(user => user.status === 'Active')
// //         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
// //       setCustomers(filteredAndSorted);
// //     } catch (error) {
// //       console.error('Error fetching customer data:', error);
// //       setError('Failed to load customers');
// //     } finally {
// //       setLoading(false); 
// //     }
// //   };

// // useEffect(() => {
// //   fetchCustomers();
// // }, [selectedCompany, userId]); // Add dependencies here

// //   // Filter customers based on selected company and search term
// //   useEffect(() => {
// //     let results = customers;
    
// //     // First filter by selected company if one is selected
// //     if (selectedCompany) {
// //       results = results.filter(customer => 
// //         customer.company === selectedCompany
// //       );
// //     }
    
// //     // Then apply search term filter
// //     if (searchTerm) {
// //       results = results.filter(customer =>
// //         Object.values(customer)
// //           .join(" ")
// //           .toLowerCase()
// //           .includes(searchTerm.toLowerCase())
// //       );
// //     }
    
// //     setFilteredCustomers(results);
// //     setCurrentPage(1); // Reset to first page when filters change
// //   }, [selectedCompany, searchTerm, customers]);

// //   const indexOfLastEntry = currentPage * entriesPerPage;
// //   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
// //   const currentEntries = filteredCustomers.slice(indexOfFirstEntry, indexOfLastEntry);
// //   const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage);

// //   const formatDate = (dateString) => {
// //     if (!dateString) return '-';
// //     const date = new Date(dateString);
// //     const day = date.getDate().toString().padStart(2, '0');
// //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
// //     const year = date.getFullYear();
// //     return `${day}/${month}/${year}`;
// //   };

// //   const handleDeleteCustomer = (customerId) => {
// //   if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
// //     axios
// //       .delete(`${baseURL}/customers/${customerId}/?user_id=${userId}&company_id=${selectedCompany}`)
// //       .then(response => {
// //         console.log("Customer deleted successfully", response);
// //         // Refresh the customer list or remove the deleted customer from state
// //         alert('Customer deleted successfully');
// //         // You might want to refetch the data or filter out the deleted customer
// //         fetchCustomers(); // Assuming you have a function to fetch customers
// //       })
// //       .catch(error => {
// //         console.error("Error deleting customer:", error);
// //         alert("Failed to delete customer. Please try again.");
// //       });
// //   }
// // };

// //   if (loading) return <div className="text-center my-4">Loading customers...</div>;
// //   if (error) return <div className="alert alert-danger my-4">{error}</div>;

// //   return (
// //     <>
// //       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
// //         <div>
// //           <h2 className="customer-title mb-0">Customers</h2>
// //           <p className="customer-subtitle mb-0 text-muted">
// //             {selectedCompany ? `Showing customers for ${selectedCompany}` : 'Showing all customers'}
// //           </p>
// //         </div>
// //         <button onClick={toggleForm} className="btn btn-primary">
// //           Add New Customer
// //         </button>
// //          {/* <button className="btn btn-primary" onClick={() => navigate('/contact-api')}>
// //       Add Contact
// //     </button> */}
// //       </div>
      
// //       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
// //         <div className="d-flex align-items-center gap-2">
// //           Show
// //           <select
// //             value={entriesPerPage}
// //             onChange={(e) => setEntriesPerPage(Number(e.target.value))}
// //             className="form-select form-select-sm w-auto"
// //           >
// //             <option value={5}>5</option>
// //             <option value={10}>10</option>
// //             <option value={25}>25</option>
// //           </select>
// //           entries
// //         </div>

// //         <input
// //           type="text"
// //           placeholder="Search customers..."
// //           className="form-control w-auto"
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //         />
// //       </div>

// //       <div className="table-responsive mb-4">
// //        <table className="table">
// //   <thead className="new-customer-table-header">
// //     <tr>
// //       <th>S.No</th>
// //       <th>Customer ID</th>
// //       <th>Company</th>
// //       <th>Full Name</th>
// //       <th>Username</th>
// //       <th>Email</th>
// //       <th>Mobile</th>
// //       <th>City</th>
// //       <th>Type</th>
// //       <th>Status</th>
// //       <th>Created At</th>
// //       <th>Actions</th>
// //     </tr>
// //   </thead>
// //   <tbody>
// //     {currentEntries.length > 0 ? (
// //       currentEntries.map((customer, index) => (
// //         <tr key={index}>
// //           <td>{indexOfFirstEntry + index + 1}</td>
// //           <td>{customer.customer_id}</td>
// //           <td>{customer.company}</td>
// //           <td>{customer.full_name}</td>
// //           <td>{customer.username}</td>
// //           <td>{customer.email}</td>
// //           <td>{customer.mobile}</td>
// //           <td>{customer.city}</td>
// //           <td>{customer.customer_type}</td>
// //           <td>
// //             <span className={`badge ${
// //               customer.status === 'Active' ? 'bg-success' :
// //               customer.status === 'Inactive' ? 'bg-warning text-dark' :
// //               'bg-danger'
// //             }`}>
// //               {customer.status}
// //             </span>
// //           </td>
// //           <td>{formatDate(customer.created_at)}</td>
// //           <td>
// //             <FaTrashAlt 
// //               style={{ 
// //                 color: "#dc3545", 
// //                 cursor: "pointer",
// //                 fontSize: "18px"
// //               }}
// //               onClick={() => handleDeleteCustomer(customer.customer_id)}
// //               title="Delete Customer"
// //             />
// //           </td>
// //         </tr>
// //       ))
// //     ) : (
// //       <tr>
// //         <td colSpan="12" className="text-center">
// //           {selectedCompany 
// //             ? `No customers found for ${selectedCompany}${searchTerm ? ' matching your search' : ''}`
// //             : 'No customers found'}
// //         </td>
// //       </tr>
// //     )}
// //   </tbody>
// // </table>
// //       </div>

// //       {totalPages > 1 && (
// //         <nav aria-label="Page navigation">
// //           <ul className="pagination justify-content-center">
// //             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
// //               <button
// //                 className="page-link"
// //                 onClick={() => setCurrentPage(currentPage - 1)}
// //                 disabled={currentPage === 1}
// //               >
// //                 Previous
// //               </button>
// //             </li>

// //             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //               <li
// //                 key={page}
// //                 className={`page-item ${currentPage === page ? "active" : ""}`}
// //               >
// //                 <button className="page-link" onClick={() => setCurrentPage(page)}>
// //                   {page}
// //                 </button>
// //               </li>
// //             ))}

// //             <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
// //               <button
// //                 className="page-link"
// //                 onClick={() => setCurrentPage(currentPage + 1)}
// //                 disabled={currentPage === totalPages}
// //               >
// //                 Next
// //               </button>
// //             </li>
// //           </ul>
// //         </nav>
// //       )}
// //     </>
// //   );
// // };

// // export default CustomerTable;





// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import baseURL from '../ApiUrl/Apiurl';
// import { useCompany } from "../AuthContext/CompanyContext";
// import { AuthContext } from "../AuthContext/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';

// const CustomerTable = ({ toggleForm, onEditCustomer, onViewCustomer }) => {
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { selectedCompany } = useCompany();
//   const { userId } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const fetchCustomers = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       if (!userId || !selectedCompany) {
//         setError('Missing user ID or company ID');
//         return;
//       }
      
//       const response = await axios.get(
//         `${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`
//       );
//       const filteredAndSorted = response.data.data
//         .filter(user => user.status === 'Active')
//         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       setCustomers(filteredAndSorted);
//     } catch (error) {
//       console.error('Error fetching customer data:', error);
//       setError('Failed to load customers');
//     } finally {
//       setLoading(false); 
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, [selectedCompany, userId]);

//   useEffect(() => {
//     let results = customers;
    
//     if (selectedCompany) {
//       results = results.filter(customer => 
//         customer.company === selectedCompany
//       );
//     }
    
//     if (searchTerm) {
//       results = results.filter(customer =>
//         Object.values(customer)
//           .join(" ")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     }
    
//     setFilteredCustomers(results);
//     setCurrentPage(1);
//   }, [selectedCompany, searchTerm, customers]);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = filteredCustomers.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage);

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const handleDeleteCustomer = (customerId) => {
//     if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
//       axios
//         .delete(`${baseURL}/customers/${customerId}/?user_id=${userId}&company_id=${selectedCompany}`)
//         .then(response => {
//           console.log("Customer deleted successfully", response);
//           alert('Customer deleted successfully');
//           fetchCustomers();
//         })
//         .catch(error => {
//           console.error("Error deleting customer:", error);
//           alert("Failed to delete customer. Please try again.");
//         });
//     }
//   };

//   if (loading) return <div className="text-center my-4">Loading customers...</div>;
//   if (error) return <div className="alert alert-danger my-4">{error}</div>;

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <div>
//           <h2 className="customer-title mb-0">Customers</h2>
//           <p className="customer-subtitle mb-0 text-muted">
//             {selectedCompany ? `Showing customers for ${selectedCompany}` : 'Showing all customers'}
//           </p>
//         </div>
//         <button onClick={toggleForm} className="btn btn-primary">
//           Add New Customer
//         </button>
//       </div>
      
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
//         <div className="d-flex align-items-center gap-2">
//           Show
//           <select
//             value={entriesPerPage}
//             onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//             className="form-select form-select-sm w-auto"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//           </select>
//           entries
//         </div>

//         <input
//           type="text"
//           placeholder="Search customers..."
//           className="form-control w-auto"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="table-responsive mb-4">
//         <table className="table">
//           <thead className="new-customer-table-header">
//             <tr>
//               <th>S.No</th>
//               <th>Customer ID</th>
//               <th>Company</th>
//               <th>Full Name</th>
//               <th>Username</th>
//               <th>Email</th>
//               <th>Mobile</th>
//               <th>City</th>
//               <th>Type</th>
//               <th>Status</th>
//               <th>Created At</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentEntries.length > 0 ? (
//               currentEntries.map((customer, index) => (
//                 <tr key={index}>
//                   <td>{indexOfFirstEntry + index + 1}</td>
//                   <td>{customer.customer_id}</td>
//                   <td>{customer.company}</td>
//                   <td>{customer.full_name}</td>
//                   <td>{customer.username}</td>
//                   <td>{customer.email}</td>
//                   <td>{customer.mobile}</td>
//                   <td>{customer.city}</td>
//                   <td>{customer.customer_type}</td>
//                   <td>
//                     <span className={`badge ${
//                       customer.status === 'Active' ? 'bg-success' :
//                       customer.status === 'Inactive' ? 'bg-warning text-dark' :
//                       'bg-danger'
//                     }`}>
//                       {customer.status}
//                     </span>
//                   </td>
//                   <td>{formatDate(customer.created_at)}</td>
//                   <td>
//                     <div className="d-flex gap-2">
//                       <FaEye 
//                         style={{ 
//                           color: "#0d6efd", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => onViewCustomer(customer)}
//                         title="View Customer"
//                       />
//                       <FaEdit 
//                         style={{ 
//                           color: "#ffc107", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => onEditCustomer(customer)}
//                         title="Edit Customer"
//                       />
//                       <FaTrashAlt 
//                         style={{ 
//                           color: "#dc3545", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => handleDeleteCustomer(customer.customer_id)}
//                         title="Delete Customer"
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="12" className="text-center">
//                   {selectedCompany 
//                     ? `No customers found for ${selectedCompany}${searchTerm ? ' matching your search' : ''}`
//                     : 'No customers found'}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <nav aria-label="Page navigation">
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//             </li>

//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <li
//                 key={page}
//                 className={`page-item ${currentPage === page ? "active" : ""}`}
//               >
//                 <button className="page-link" onClick={() => setCurrentPage(page)}>
//                   {page}
//                 </button>
//               </li>
//             ))}

//             <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       )}
//     </>
//   );
// };

// export default CustomerTable;




// import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import baseURL from '../ApiUrl/Apiurl';
// import { useCompany } from "../AuthContext/CompanyContext";
// import { AuthContext } from "../AuthContext/AuthContext";
// import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';

// const CustomerTable = ({ toggleForm, onEditCustomer, onViewCustomer }) => {
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [companiesData, setCompaniesData] = useState([]);
//   const { selectedCompany } = useCompany();
//   const { userId } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Fetch companies data
//   const fetchCompanies = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/companies/`);
//       if (response.data.status === "success") {
//         setCompaniesData(response.data.data);
//       }
//     } catch (error) {
//       console.error("Failed to load companies data", error);
//     }
//   };

//   const getCompanyDisplayName = (companyId) => {
//     if (!companiesData || companiesData.length === 0) return companyId;
    
//     const company = companiesData.find(comp => comp.company_id === companyId);
//     if (company) {
//       return `${company.company_name} (${company.company_id})`;
//     }
//     return companyId;
//   };

//   const fetchCustomers = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       if (!userId || !selectedCompany) {
//         setError('Missing user ID or company ID');
//         return;
//       }
      
//       const response = await axios.get(
//         `${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`
//       );
//       const filteredAndSorted = response.data.data
//         .filter(user => user.status === 'Active')
//         .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       setCustomers(filteredAndSorted);
//     } catch (error) {
//       console.error('Error fetching customer data:', error);
//       setError('Failed to load customers');
//     } finally {
//       setLoading(false); 
//     }
//   };

//   useEffect(() => {
//     fetchCompanies().then(() => {
//       fetchCustomers();
//     });
//   }, [selectedCompany, userId]);

//   useEffect(() => {
//     let results = customers;
    
//     if (selectedCompany) {
//       results = results.filter(customer => 
//         customer.company === selectedCompany
//       );
//     }
    
//     if (searchTerm) {
//       results = results.filter(customer =>
//         Object.values(customer)
//           .join(" ")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     }
    
//     setFilteredCustomers(results);
//     setCurrentPage(1);
//   }, [selectedCompany, searchTerm, customers]);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = filteredCustomers.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage);

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const handleDeleteCustomer = (customerId) => {
//     if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
//       axios
//         .delete(`${baseURL}/customers/${customerId}/?user_id=${userId}&company_id=${selectedCompany}`)
//         .then(response => {
//           console.log("Customer deleted successfully", response);
//           alert('Customer deleted successfully');
//           fetchCustomers();
//         })
//         .catch(error => {
//           console.error("Error deleting customer:", error);
//           alert("Failed to delete customer. Please try again.");
//         });
//     }
//   };

//   const handleViewCustomer = (customer) => {
//   navigate(`/servicemanager/customers/${customer.customer_id}`, { 
//     state: { 
//       selectedCompany: selectedCompany, 
//       userId: userId 
//     } 
//   });
// };

//   if (loading) return <div className="text-center my-4">Loading customers...</div>;
//   if (error) return <div className="alert alert-danger my-4">{error}</div>;

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <div>
//           <h2 className="customer-title mb-0">Customers</h2>
//           <p className="customer-subtitle mb-0 text-muted">
//             {selectedCompany ? `Showing customers for ${getCompanyDisplayName(selectedCompany)}` : 'Showing all customers'}
//           </p>
//         </div>
//         <button onClick={toggleForm} className="btn btn-primary">
//           Add New Customer
//         </button>
//       </div>
      
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
//         <div className="d-flex align-items-center gap-2">
//           Show
//           <select
//             value={entriesPerPage}
//             onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//             className="form-select form-select-sm w-auto"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//           </select>
//           entries
//         </div>

//         <input
//           type="text"
//           placeholder="Search customers..."
//           className="form-control w-auto"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="table-responsive mb-4">
//         <table className="table">
//           <thead className="new-customer-table-header">
//             <tr>
//               <th>S.No</th>
//               <th>Customer ID</th>
//               <th>Company</th>
//               <th>Full Name</th>
//               <th>Username</th>
//               <th>Email</th>
//               <th>Mobile</th>
//               <th>City</th>
//               <th>Type</th>
//               <th>Status</th>
//               <th>Created At</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentEntries.length > 0 ? (
//               currentEntries.map((customer, index) => (
//                 <tr key={index}>
//                   <td>{indexOfFirstEntry + index + 1}</td>
//                   <td>{customer.customer_id}</td>
//                   <td title={getCompanyDisplayName(customer.company)}>
//                     {getCompanyDisplayName(customer.company)}
//                   </td>
//                   <td>{customer.full_name}</td>
//                   <td>{customer.username}</td>
//                   <td>{customer.email}</td>
//                   <td>{customer.mobile}</td>
//                   <td>{customer.city}</td>
//                   <td>{customer.customer_type}</td>
//                   <td>
//                     <span className={`badge ${
//                       customer.status === 'Active' ? 'bg-success' :
//                       customer.status === 'Inactive' ? 'bg-warning text-dark' :
//                       'bg-danger'
//                     }`}>
//                       {customer.status}
//                     </span>
//                   </td>
//                   <td>{formatDate(customer.created_at)}</td>
//                   <td>
//                     <div className="d-flex gap-2">
//                       <FaEye 
//                         style={{ 
//                           color: "#0d6efd", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => handleViewCustomer(customer)}
//                         title="View Customer"
//                       />
//                       <FaEdit 
//                         style={{ 
//                           color: "#ffc107", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => onEditCustomer(customer)}
//                         title="Edit Customer"
//                       />
//                       <FaTrashAlt 
//                         style={{ 
//                           color: "#dc3545", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => handleDeleteCustomer(customer.customer_id)}
//                         title="Delete Customer"
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="12" className="text-center">
//                   {selectedCompany 
//                     ? `No customers found for ${getCompanyDisplayName(selectedCompany)}${searchTerm ? ' matching your search' : ''}`
//                     : 'No customers found'}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <nav aria-label="Page navigation">
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//             </li>

//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <li
//                 key={page}
//                 className={`page-item ${currentPage === page ? "active" : ""}`}
//               >
//                 <button className="page-link" onClick={() => setCurrentPage(page)}>
//                   {page}
//                 </button>
//               </li>
//             ))}

//             <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       )}
//     </>
//   );
// };

// export default CustomerTable;



//===============================================================
// After fixing filter -Global search issue 


import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../ApiUrl/Apiurl';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";
import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';

const CustomerTable = ({ toggleForm, onEditCustomer, onViewCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companiesData, setCompaniesData] = useState([]);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch companies data
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${baseURL}/companies/`);
      if (response.data.status === "success") {
        setCompaniesData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to load companies data", error);
    }
  };

  const getCompanyDisplayName = (companyId) => {
    if (!companiesData || companiesData.length === 0) return companyId;
    
    const company = companiesData.find(comp => comp.company_id === companyId);
    if (company) {
      return `${company.company_name} (${company.company_id})`;
    }
    return companyId;
  };

  const getCompanySearchData = (companyId) => {
    if (!companyId) return '';
    if (!companiesData || companiesData.length === 0) return companyId;
    
    const company = companiesData.find(comp => comp.company_id === companyId);
    return company ? `${company.company_id} ${company.company_name} ${company.company_name} (${company.company_id})` : companyId;
  };

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userId || !selectedCompany) {
        setError('Missing user ID or company ID');
        return;
      }
      
      const response = await axios.get(
        `${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`
      );
      const filteredAndSorted = response.data.data
        .filter(user => user.status === 'Active')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setCustomers(filteredAndSorted);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setError('Failed to load customers');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchCompanies().then(() => {
      fetchCustomers();
    });
  }, [selectedCompany, userId]);

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to format date in multiple formats for search
  const formatDateForSearch = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const monthName = date.toLocaleString('en-IN', { month: 'long' });
    const monthShort = date.toLocaleString('en-IN', { month: 'short' });
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    
    // Return multiple formats for better searchability
    return [
      `${day}/${month}/${year}`,                    // DD/MM/YYYY
      `${day}/${month}/${year} ${hour}:${minute}:${second}`, // DD/MM/YYYY HH:MM:SS
      `${month}/${day}/${year}`,                    // MM/DD/YYYY
      `${year}-${month}-${day}`,                    // YYYY-MM-DD
      `${year}${month}${day}`,                      // YYYYMMDD
      `${day}-${month}-${year}`,                    // DD-MM-YYYY
      date.toISOString(),                           // ISO string
      monthName,                                    // January, February
      monthShort,                                   // Jan, Feb
      `${year}`,                                    // 2024
      `${month}/${year}`,                           // MM/YYYY
      `${day} ${monthName} ${year}`,               // 15 January 2024
      `${day} ${monthShort} ${year}`,              // 15 Jan 2024
      `${hour}:${minute}`,                          // HH:MM
      `${hour}:${minute}:${second}`,               // HH:MM:SS
    ].join(' ');
  };

  // Enhanced global search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      let results = customers;
      if (selectedCompany) {
        results = results.filter(customer => customer.company === selectedCompany);
      }
      setFilteredCustomers(results);
      setCurrentPage(1);
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    const filtered = customers.filter((customer) => {
      // Filter by company first
      if (selectedCompany && customer.company !== selectedCompany) {
        return false;
      }

      // Get company data for search
      const companySearchData = getCompanySearchData(customer.company);
      
      // Get dates in multiple formats for search
      const createdDateFormats = formatDateForSearch(customer.created_at);
      const updatedDateFormats = formatDateForSearch(customer.updated_at);
      
      // Create a comprehensive search string
      const searchableText = [
        // Raw customer data
        customer.customer_id || '',
        customer.company || '',
        customer.full_name || '',
        customer.username || '',
        customer.email || '',
        customer.mobile || '',
        customer.city || '',
        customer.customer_type || '',
        customer.status || '',
        customer.created_at || '',
        customer.updated_at || '',
        customer.created_by || '',
        customer.updated_by || '',
        customer.telephone || '',
        customer.address || '',
        customer.country_code || '',
        customer.remarks || '',
        customer.security_question1 || '',
        customer.security_question2 || '',
        customer.answer1 || '',
        customer.answer2 || '',
        
        // Formatted company data for search
        companySearchData,
        
        // Dates in multiple formats
        createdDateFormats,
        updatedDateFormats,
        
        // Display values (exactly as shown in table)
        formatDate(customer.created_at),
        getCompanyDisplayName(customer.company),
        
        // Status with badge text multiple times for better search
        customer.status === 'Active' ? 'Active Active Active' : '',
        customer.status === 'Inactive' ? 'Inactive Inactive Inactive' : '',
        customer.status === 'Pending' ? 'Pending Pending Pending' : '',
        customer.status === 'Suspended' ? 'Suspended Suspended Suspended' : '',
        
        // Customer type variations
        customer.customer_type === 'Individual' ? 'Individual person personal' : '',
        customer.customer_type === 'Corporate' ? 'Corporate business company organization' : '',
        customer.customer_type === 'Government' ? 'Government govt public sector' : '',
        
        // Country variations
        customer.country_code === 'KSA' ? 'KSA Saudi Arabia Kingdom' : '',
        customer.country_code === 'UAE' ? 'UAE United Arab Emirates Emirates' : '',
        customer.country_code === 'IND' ? 'IND India Indian' : '',
        
        // City variations
        customer.city ? `city ${customer.city}` : '',
        
        // Email username variations (without domain)
        customer.email ? customer.email.split('@')[0] : '',
        
        // Mobile number variations (without country code if present)
        customer.mobile ? customer.mobile.replace(/[+\s-]/g, '') : '',
        customer.mobile ? customer.mobile.replace(/\D/g, '') : '',
        
        // Name variations (for partial matching)
        customer.full_name ? customer.full_name.toLowerCase().split(' ').join(' ') : '',
        customer.full_name ? customer.full_name.toLowerCase().replace(/\s+/g, '') : '',
        customer.username ? customer.username.toLowerCase().replace(/\s+/g, '') : '',
        
        // Company name variations
        getCompanyDisplayName(customer.company).toLowerCase(),
        
        // Add any other properties that might exist
        ...Object.values(customer).filter(val => 
          val !== null && val !== undefined
        ).map(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return String(val);
          }
          if (typeof val === 'boolean') {
            return val ? 'true yes active' : 'false no inactive';
          }
          if (Array.isArray(val)) {
            return val.join(' ');
          }
          if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val);
          }
          return '';
        })
      ]
      .join(' ')                    // Combine into one string
      .toLowerCase()                // Make case-insensitive
      .replace(/\s+/g, ' ')         // Normalize spaces
      .trim();
      
      return searchableText.includes(searchLower);
    });
    
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  }, [searchTerm, customers, companiesData, selectedCompany]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCustomers.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage);

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      axios
        .delete(`${baseURL}/customers/${customerId}/?user_id=${userId}&company_id=${selectedCompany}`)
        .then(response => {
          console.log("Customer deleted successfully", response);
          alert('Customer deleted successfully');
          fetchCustomers();
        })
        .catch(error => {
          console.error("Error deleting customer:", error);
          alert("Failed to delete customer. Please try again.");
        });
    }
  };

  const handleViewCustomer = (customer) => {
    navigate(`/servicemanager/customers/${customer.customer_id}`, { 
      state: { 
        selectedCompany: selectedCompany, 
        userId: userId 
      } 
    });
  };

  const handleCustomerIdClick = (customerId) => {
    navigate(`/servicemanager/customers/${customerId}`, { 
      state: { 
        selectedCompany: selectedCompany, 
        userId: userId 
      } 
    });
  };

  if (loading) return <div className="text-center my-4">Loading customers...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div>
          <h2 className="customer-title mb-0">Customers</h2>
          <p className="customer-subtitle mb-0 text-muted">
            {selectedCompany ? `Showing customers for ${getCompanyDisplayName(selectedCompany)}` : 'Showing all customers'}
          </p>
        </div>
        <button onClick={toggleForm} className="btn btn-primary">
          Add New Customer
        </button>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          Show
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="form-select form-select-sm w-auto"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          entries
        </div>

        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            placeholder="Search in all columns..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: '250px' }}
          />
          {searchTerm && (
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="alert alert-info mb-3">
          <strong>Search Results:</strong> Found {filteredCustomers.length} customer(s) matching "{searchTerm}"
        </div>
      )}

      <div className="table-responsive mb-4">
        <table className="table">
          <thead className="new-customer-table-header">
            <tr>
              <th>S.No</th>
              <th>Customer ID</th>
              <th>Company</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>City</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.length > 0 ? (
              currentEntries.map((customer, index) => (
                <tr key={index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>
                    <button 
                      className="btn btn-link p-0 text-primary text-decoration-underline"
                      onClick={() => handleCustomerIdClick(customer.customer_id)}
                      style={{
                        color: '#0d6efd',
                        textDecoration: 'underline',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: 'inherit'
                      }}
                      title="View Customer Details"
                    >
                      {customer.customer_id}
                    </button>
                  </td>
                  <td title={getCompanyDisplayName(customer.company)}>
                    {getCompanyDisplayName(customer.company)}
                  </td>
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
                  <td>{formatDate(customer.created_at)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <FaEye 
                        style={{ 
                          color: "#0d6efd", 
                          cursor: "pointer",
                          fontSize: "18px"
                        }}
                        onClick={() => handleViewCustomer(customer)}
                        title="View Customer"
                      />
                      <FaEdit 
                        style={{ 
                          color: "#ffc107", 
                          cursor: "pointer",
                          fontSize: "18px"
                        }}
                        onClick={() => onEditCustomer(customer)}
                        title="Edit Customer"
                      />
                      <FaTrashAlt 
                        style={{ 
                          color: "#dc3545", 
                          cursor: "pointer",
                          fontSize: "18px"
                        }}
                        onClick={() => handleDeleteCustomer(customer.customer_id)}
                        title="Delete Customer"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center">
                  {searchTerm 
                    ? `No customers found matching "${searchTerm}"`
                    : selectedCompany 
                      ? `No customers found for ${getCompanyDisplayName(selectedCompany)}`
                      : 'No customers found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {(() => {
              const maxVisiblePages = 5;
              let pageNumbers = [];
              
              if (totalPages <= maxVisiblePages) {
                for (let i = 1; i <= totalPages; i++) {
                  pageNumbers.push(i);
                }
              } else {
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(i);
                }
              }
              
              return pageNumbers.map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                </li>
              ));
            })()}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default CustomerTable;