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




import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import baseURL from '../ApiUrl/Apiurl';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
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

  // Function to get company display name in compact format: "COMP1 (TCS)"
const getCompanyDisplayName = (companyId) => {
  if (!companiesData || companiesData.length === 0) return companyId;
  
  const company = companiesData.find(comp => comp.company_id === companyId);
  if (company) {
    return `${company.company_name} (${company.company_id})`;
  }
  return companyId;
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
    // Fetch companies first, then customers
    fetchCompanies().then(() => {
      fetchCustomers();
    });
  }, [selectedCompany, userId]);

  useEffect(() => {
    let results = customers;
    
    if (selectedCompany) {
      results = results.filter(customer => 
        customer.company === selectedCompany
      );
    }
    
    if (searchTerm) {
      results = results.filter(customer =>
        Object.values(customer)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCustomers(results);
    setCurrentPage(1);
  }, [selectedCompany, searchTerm, customers]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCustomers.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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

        <input
          type="text"
          placeholder="Search customers..."
          className="form-control w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
                  <td>{customer.customer_id}</td>
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
                        onClick={() => onViewCustomer(customer)}
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
                  {selectedCompany 
                    ? `No customers found for ${getCompanyDisplayName(selectedCompany)}${searchTerm ? ' matching your search' : ''}`
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}

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