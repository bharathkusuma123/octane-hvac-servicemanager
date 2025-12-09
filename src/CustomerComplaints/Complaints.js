// // import React, { useState, useEffect } from "react";
// // import CustomerComplaintsForm from "./CustomerComplaintsForm";
// // import CustomerComplaintsTable from "./CustomerComplaintsTable";
// // import { v4 as uuidv4 } from "uuid";

// // const CustomerComplaints = () => {
// //   const [complaints, setComplaints] = useState([]);
// //   const [formData, setFormData] = useState({});
// //   const [showForm, setShowForm] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [entriesPerPage, setEntriesPerPage] = useState(5);
// //   const [currentPage, setCurrentPage] = useState(1);

// //   const companies = ["Company A", "Company B", "Company C"];
// //   const customers = ["Customer X", "Customer Y", "Customer Z"];

// //   const toggleForm = () => {
// //     setShowForm((prev) => !prev);
// //     setFormData({});
// //   };

// //   const handleChange = (e) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [e.target.name]: e.target.value,
// //     }));
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     if (formData.complaint_id) {
// //       // Update existing complaint
// //       setComplaints((prev) =>
// //         prev.map((item) =>
// //           item.complaint_id === formData.complaint_id ? { ...formData } : item
// //         )
// //       );
// //     } else {
// //       // Create new complaint
// //       const newComplaint = {
// //         ...formData,
// //         complaint_id: uuidv4(),
// //         created_at: new Date().toISOString(),
// //       };
// //       setComplaints((prev) => [newComplaint, ...prev]);
// //     }

// //     toggleForm();
// //   };

// //   const filteredComplaints = complaints.filter((item) =>
// //     Object.values(item).some((val) =>
// //       String(val).toLowerCase().includes(searchTerm.toLowerCase())
// //     )
// //   );

// //   const indexOfLastEntry = currentPage * entriesPerPage;
// //   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
// //   const currentItems = filteredComplaints.slice(indexOfFirstEntry, indexOfLastEntry);
// //   const totalPages = Math.ceil(filteredComplaints.length / entriesPerPage);

// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [searchTerm, entriesPerPage]);

// //   return (
// //     <div className="pm-container mt-4">
// //       <h2 className=" pm-title mb-4">Customer Complaints</h2>

// //       {showForm ? (
// //         <CustomerComplaintsForm
// //           formData={formData}
// //           handleChange={handleChange}
// //           handleSubmit={handleSubmit}
// //           toggleForm={toggleForm}
// //           companies={companies}
// //           customers={customers}
// //         />
// //       ) : (
// //         <>
// //           <div className="d-flex justify-content-end mb-3">
// //             {/* <button className="btn btn-primary" onClick={toggleForm}>
// //               Add New Complaint
// //             </button> */}
// //           </div>
// //           <CustomerComplaintsTable
// //             currentItems={currentItems}
// //             indexOfFirstEntry={indexOfFirstEntry}
// //             searchTerm={searchTerm}
// //             setSearchTerm={setSearchTerm}
// //             entriesPerPage={entriesPerPage}
// //             setEntriesPerPage={setEntriesPerPage}
// //             currentPage={currentPage}
// //             setCurrentPage={setCurrentPage}
// //             totalPages={totalPages}
// //             filteredComplaints={filteredComplaints}
// //           />
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default CustomerComplaints;





// import React, { useState, useEffect, useContext } from "react";
// import baseURL from "../ApiUrl/Apiurl";
// import { AuthContext } from '../AuthContext/AuthContext';
// import { useCompany } from '../AuthContext/CompanyContext';

// const CustomerComplaints = () => {
//     const { userId } = useContext(AuthContext);
//       const { selectedCompany } = useCompany();
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Fetch data from API
//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         setLoading(true);
        
//         // Get userId and company_id from localStorage
//         // const userId = localStorage.getItem("userId");
//         // const companyId = localStorage.getItem("company_id") || "COMP1"; // Fallback to COMP1 if not found
        
//         if (!userId) {
//           throw new Error("User ID not found in localStorage");
//         }
        
//         const response = await fetch(
//           `${baseURL}/customer-complaints/?user_id=${userId}&company_id=${selectedCompany}`
//         );
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         if (data.status === "success") {
//           setComplaints(data.data || []);
//         } else {
//           throw new Error(data.message || "Failed to fetch complaints");
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching complaints:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComplaints();
//   }, [selectedCompany]);

//   // Filter complaints based on search term
//   const filteredComplaints = complaints.filter((complaint) =>
//     Object.values(complaint).some((val) =>
//       String(val).toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   // Pagination logic
//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentItems = filteredComplaints.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredComplaints.length / entriesPerPage);

//   // Reset to first page when search term or entries per page changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, entriesPerPage]);

//   // Date formatting function
//   const formatDate = (dateString) => {
//     if (!dateString) return "—";
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid date";
      
//       const day = date.getDate().toString().padStart(2, "0");
//       const month = (date.getMonth() + 1).toString().padStart(2, "0");
//       const year = date.getFullYear();
      
//       return `${day}/${month}/${year}`;
//     } catch (e) {
//       return "Invalid date";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="pm-container mt-4">
//         <h2 className="pm-title mb-4">Customer Complaints</h2>
//         <div className="text-center">
//           <div className="spinner-border" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading complaints...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="pm-container mt-4">
//         <h2 className="pm-title mb-4">Customer Complaints</h2>
//         <div className="alert alert-danger" role="alert">
//           Error: {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="pm-container mt-4">
//       <h2 className="pm-title mb-4">Customer Complaints</h2>

//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
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
//             <option value={50}>50</option>
//           </select>
//           entries
//         </div>
//         <input
//           type="text"
//           className="form-control w-auto"
//           placeholder="Search complaints..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="table-responsive mb-4">
//         <table className="table">
//           <thead className="service-item-table-header">
//             <tr>
//               <th>S.No</th>
//               <th>Complaint ID</th>
//               <th>Type</th>
//               <th>Details</th>
//               <th>Complaint Date</th>
//               <th>Escalation Level</th>
//               <th>Service Manager Email</th>
//               <th>GM Email</th>
//               <th>Resolution Details</th>
//               <th>Resolved At</th>
//               <th>Created By</th>
//               <th>Updated By</th>
//               <th>Company</th>
//               <th>Customer</th>
//               <th>Service Request</th>
//               <th>Created At</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.length > 0 ? (
//               currentItems.map((complaint, index) => (
//                 <tr key={complaint.complaint_id || index}>
//                   <td>{indexOfFirstEntry + index + 1}</td>
//                   <td>{complaint.complaint_id}</td>
//                   <td>{complaint.complaint_type}</td>
//                   <td className="text-truncate" style={{ maxWidth: "200px" }} title={complaint.complaint_details}>
//                     {complaint.complaint_details}
//                   </td>
//                   <td>{formatDate(complaint.complaint_date)}</td>
//                   <td>{complaint.escalation_level}</td>
//                   <td>{complaint.service_manager_email}</td>
//                   <td>{complaint.gm_email}</td>
//                   <td className="text-truncate" style={{ maxWidth: "200px" }} title={complaint.resolution_details}>
//                     {complaint.resolution_details || "—"}
//                   </td>
//                   <td>{formatDate(complaint.resolved_at)}</td>
//                   <td>{complaint.created_by}</td>
//                   <td>{complaint.updated_by}</td>
//                   <td>{complaint.company}</td>
//                   <td>{complaint.customer}</td>
//                   <td>{complaint.service_request}</td>
//                   <td>{formatDate(complaint.created_at)}</td>
//                   <td>
//                     <span
//                       className={`badge ${
//                         complaint.status === "Open"
//                           ? "bg-warning"
//                           : complaint.status === "In Progress"
//                           ? "bg-info"
//                           : complaint.status === "Resolved"
//                           ? "bg-success"
//                           : "bg-secondary"
//                       }`}
//                     >
//                       {complaint.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="17" className="text-center">
//                   {searchTerm ? "No matching complaints found." : "No complaints found."}
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
//                 <button
//                   className="page-link"
//                   onClick={() => setCurrentPage(page)}
//                 >
//                   {page}
//                 </button>
//               </li>
//             ))}

//             <li
//               className={`page-item ${
//                 currentPage === totalPages ? "disabled" : ""
//               }`}
//             >
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
//     </div>
//   );
// };

// export default CustomerComplaints;


// import React, { useState, useEffect, useContext } from "react";
// import baseURL from "../ApiUrl/Apiurl";
// import { AuthContext } from '../AuthContext/AuthContext';
// import { useCompany } from '../AuthContext/CompanyContext';

// const CustomerComplaints = () => {
//     const { userId } = useContext(AuthContext);
//     const { selectedCompany } = useCompany();
//     const [complaints, setComplaints] = useState([]);
//     const [customersData, setCustomersData] = useState([]);
//     const [companiesData, setCompaniesData] = useState([]); // New state for companies
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [entriesPerPage, setEntriesPerPage] = useState(5);
//     const [currentPage, setCurrentPage] = useState(1);

//     // Fetch companies data
//     const fetchCompanies = async () => {
//         try {
//             const response = await fetch(`${baseURL}/companies/`);
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             const data = await response.json();
            
//             if (data.status === "success") {
//                 setCompaniesData(data.data || []);
//             } else {
//                 throw new Error(data.message || "Failed to fetch companies");
//             }
//         } catch (err) {
//             console.error("Error fetching companies:", err);
//             setCompaniesData([]); // Set empty array on error
//         }
//     };

//     // Fetch customers data
//     const fetchCustomers = async () => {
//         try {
//             const response = await fetch(
//                 `${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`
//             );
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             const data = await response.json();
            
//             if (data.status === "success") {
//                 setCustomersData(data.data || []);
//             } else {
//                 throw new Error(data.message || "Failed to fetch customers");
//             }
//         } catch (err) {
//             console.error("Error fetching customers:", err);
//             setCustomersData([]);
//         }
//     };

//     // Fetch complaints data
//     const fetchComplaints = async () => {
//         try {
//             setLoading(true);
            
//             if (!userId) {
//                 throw new Error("User ID not found");
//             }
            
//             const response = await fetch(
//                 `${baseURL}/customer-complaints/?user_id=${userId}&company_id=${selectedCompany}`
//             );
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             const data = await response.json();
            
//             if (data.status === "success") {
//                 setComplaints(data.data || []);
//             } else {
//                 throw new Error(data.message || "Failed to fetch complaints");
//             }
//         } catch (err) {
//             setError(err.message);
//             console.error("Error fetching complaints:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch all data
//     useEffect(() => {
//         const fetchAllData = async () => {
//             setLoading(true);
//             try {
//                 await fetchCompanies(); // Fetch companies first
//                 await fetchCustomers(); // Then fetch customers
//                 await fetchComplaints(); // Then fetch complaints
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAllData();
//     }, [selectedCompany, userId]);

//     // Function to get company name by company ID
//     const getCompanyName = (companyId) => {
//         if (!companiesData || companiesData.length === 0) return companyId;
        
//         const company = companiesData.find(comp => comp.company_id === companyId);
//         return company ? company.company_name : companyId;
//     };

//     // Function to get customer username by customer ID
//     const getCustomerUsername = (customerId) => {
//         if (!customersData || customersData.length === 0) return customerId;
        
//         const customer = customersData.find(cust => cust.customer_id === customerId);
//         return customer ? customer.username : customerId;
//     };

//     // Function to get created_by/updated_by username
//     const getCreatedUpdatedBy = (userId) => {
//         if (!customersData || customersData.length === 0) return userId;
        
//         const customer = customersData.find(cust => cust.customer_id === userId);
//         return customer ? customer.username : userId;
//     };

//     // Filter complaints based on search term
//     const filteredComplaints = complaints.filter((complaint) =>
//         Object.values(complaint).some((val) =>
//             String(val).toLowerCase().includes(searchTerm.toLowerCase())
//         )
//     );

//     // Pagination logic
//     const indexOfLastEntry = currentPage * entriesPerPage;
//     const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//     const currentItems = filteredComplaints.slice(indexOfFirstEntry, indexOfLastEntry);
//     const totalPages = Math.ceil(filteredComplaints.length / entriesPerPage);

//     // Reset to first page when search term or entries per page changes
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchTerm, entriesPerPage]);

//     // Date formatting function
//     const formatDate = (dateString) => {
//         if (!dateString) return "—";
//         try {
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return "Invalid date";
            
//             const day = date.getDate().toString().padStart(2, "0");
//             const month = (date.getMonth() + 1).toString().padStart(2, "0");
//             const year = date.getFullYear();
            
//             return `${day}/${month}/${year}`;
//         } catch (e) {
//             return "Invalid date";
//         }
//     };

//     if (loading) {
//         return (
//             <div className="pm-container mt-4">
//                 <h2 className="pm-title mb-4">Customer Complaints</h2>
//                 <div className="text-center">
//                     <div className="spinner-border" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-2">Loading complaints...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="pm-container mt-4">
//                 <h2 className="pm-title mb-4">Customer Complaints</h2>
//                 <div className="alert alert-danger" role="alert">
//                     Error: {error}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="pm-container mt-4">
//             <h2 className="pm-title mb-4">Customer Complaints</h2>

//             <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//                 <div className="d-flex align-items-center gap-2">
//                     Show
//                     <select
//                         value={entriesPerPage}
//                         onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//                         className="form-select form-select-sm w-auto"
//                     >
//                         <option value={5}>5</option>
//                         <option value={10}>10</option>
//                         <option value={25}>25</option>
//                         <option value={50}>50</option>
//                     </select>
//                     entries
//                 </div>
//                 <input
//                     type="text"
//                     className="form-control w-auto"
//                     placeholder="Search complaints..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//             </div>

//             <div className="table-responsive mb-4">
//                 <table className="table">
//                     <thead className="service-item-table-header">
//                         <tr>
//                             <th>S.No</th>
//                             <th>Complaint ID</th>
//                             <th>Type</th>
//                             <th>Details</th>
//                             <th>Complaint Date</th>
//                             <th>Escalation Level</th>
//                             <th>Service Manager Email</th>
//                             <th>GM Email</th>
//                             <th>Resolution Details</th>
//                             <th>Resolved At</th>
//                             <th>Created By</th>
//                             <th>Updated By</th>
//                             <th>Company</th>
//                             <th>Customer</th>
//                             <th>Service Request</th>
//                             <th>Created At</th>
//                             <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentItems.length > 0 ? (
//                             currentItems.map((complaint, index) => (
//                                 <tr key={complaint.complaint_id || index}>
//                                     <td>{indexOfFirstEntry + index + 1}</td>
//                                     <td>{complaint.complaint_id}</td>
//                                     <td>{complaint.complaint_type}</td>
//                                     <td className="text-truncate" style={{ maxWidth: "200px" }} title={complaint.complaint_details}>
//                                         {complaint.complaint_details}
//                                     </td>
//                                     <td>{formatDate(complaint.complaint_date)}</td>
//                                     <td>{complaint.escalation_level}</td>
//                                     <td>{complaint.service_manager_email}</td>
//                                     <td>{complaint.gm_email}</td>
//                                     <td className="text-truncate" style={{ maxWidth: "200px" }} title={complaint.resolution_details}>
//                                         {complaint.resolution_details || "—"}
//                                     </td>
//                                     <td>{formatDate(complaint.resolved_at)}</td>
//                                     <td title={`ID: ${complaint.created_by}`}>
//                                         {getCreatedUpdatedBy(complaint.created_by)}
//                                     </td>
//                                     <td title={`ID: ${complaint.updated_by}`}>
//                                         {getCreatedUpdatedBy(complaint.updated_by)}
//                                     </td>
//                                     <td title={`ID: ${complaint.company}`}>
//                                         {getCompanyName(complaint.company)}
//                                     </td>
//                                     <td title={`ID: ${complaint.customer}`}>
//                                         {getCustomerUsername(complaint.customer)}
//                                     </td>
//                                     <td>{complaint.service_request}</td>
//                                     <td>{formatDate(complaint.created_at)}</td>
//                                     <td>
//                                         <span
//                                             className={`badge ${
//                                                 complaint.status === "Open"
//                                                     ? "bg-warning"
//                                                     : complaint.status === "In Progress"
//                                                     ? "bg-info"
//                                                     : complaint.status === "Resolved"
//                                                     ? "bg-success"
//                                                     : "bg-secondary"
//                                             }`}
//                                         >
//                                             {complaint.status}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="17" className="text-center">
//                                     {searchTerm ? "No matching complaints found." : "No complaints found."}
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {totalPages > 1 && (
//                 <nav aria-label="Page navigation">
//                     <ul className="pagination justify-content-center">
//                         <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                             <button
//                                 className="page-link"
//                                 onClick={() => setCurrentPage(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                             >
//                                 Previous
//                             </button>
//                         </li>

//                         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                             <li
//                                 key={page}
//                                 className={`page-item ${currentPage === page ? "active" : ""}`}
//                             >
//                                 <button
//                                     className="page-link"
//                                     onClick={() => setCurrentPage(page)}
//                                 >
//                                     {page}
//                                 </button>
//                             </li>
//                         ))}

//                         <li
//                             className={`page-item ${
//                                 currentPage === totalPages ? "disabled" : ""
//                             }`}
//                         >
//                             <button
//                                 className="page-link"
//                                 onClick={() => setCurrentPage(currentPage + 1)}
//                                 disabled={currentPage === totalPages}
//                             >
//                                 Next
//                             </button>
//                         </li>
//                     </ul>
//                 </nav>
//             )}
//         </div>
//     );
// };

// export default CustomerComplaints;


//===============================================================
// After fixing filter -Global search issue 

import React, { useState, useEffect, useContext } from "react";
import baseURL from "../ApiUrl/Apiurl";
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';

const CustomerComplaints = () => {
    const { userId } = useContext(AuthContext);
    const { selectedCompany } = useCompany();
    const [complaints, setComplaints] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const [companiesData, setCompaniesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]); // To store user data for search

    // Fetch users data for username search
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${baseURL}/users/`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                }
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    // Fetch companies data
    const fetchCompanies = async () => {
        try {
            const response = await fetch(`${baseURL}/companies/`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === "success") {
                setCompaniesData(data.data || []);
            } else {
                throw new Error(data.message || "Failed to fetch companies");
            }
        } catch (err) {
            console.error("Error fetching companies:", err);
            setCompaniesData([]);
        }
    };

    // Fetch customers data
    const fetchCustomers = async () => {
        try {
            const response = await fetch(
                `${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === "success") {
                setCustomersData(data.data || []);
            } else {
                throw new Error(data.message || "Failed to fetch customers");
            }
        } catch (err) {
            console.error("Error fetching customers:", err);
            setCustomersData([]);
        }
    };

    // Fetch complaints data
    const fetchComplaints = async () => {
        try {
            setLoading(true);
            
            if (!userId) {
                throw new Error("User ID not found");
            }
            
            const response = await fetch(
                `${baseURL}/customer-complaints/?user_id=${userId}&company_id=${selectedCompany}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === "success") {
                setComplaints(data.data || []);
            } else {
                throw new Error(data.message || "Failed to fetch complaints");
            }
        } catch (err) {
            setError(err.message);
            console.error("Error fetching complaints:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all data
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                await fetchUsers(); // Fetch users first
                await fetchCompanies(); // Then fetch companies
                await fetchCustomers(); // Then fetch customers
                await fetchComplaints(); // Then fetch complaints
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [selectedCompany, userId]);

    // Function to get username from user ID
    const getUsernameById = (userId) => {
        if (!userId || users.length === 0) return userId;
        
        const user = users.find(user => user.user_id === userId);
        return user ? user.username : userId;
    };

    // Function to get user search data (both ID and username)
    const getUserSearchData = (userId) => {
        if (!userId) return '';
        const user = users.find(user => user.user_id === userId);
        return user ? `${userId} ${user.username}` : userId;
    };

    // Function to get company name by company ID
    const getCompanyName = (companyId) => {
        if (!companiesData || companiesData.length === 0) return companyId;
        
        const company = companiesData.find(comp => comp.company_id === companyId);
        return company ? company.company_name : companyId;
    };

    // Function to get company search data (both ID and name)
    const getCompanySearchData = (companyId) => {
        if (!companyId) return '';
        const company = companiesData.find(comp => comp.company_id === companyId);
        return company ? `${companyId} ${company.company_name}` : companyId;
    };

    // Function to get customer username by customer ID
    const getCustomerUsername = (customerId) => {
        if (!customersData || customersData.length === 0) return customerId;
        
        const customer = customersData.find(cust => cust.customer_id === customerId);
        return customer ? customer.username : customerId;
    };

    // Function to get customer search data (both ID and username)
    const getCustomerSearchData = (customerId) => {
        if (!customerId) return '';
        const customer = customersData.find(cust => cust.customer_id === customerId);
        return customer ? `${customerId} ${customer.username} ${customer.full_name} ${customer.email}` : customerId;
    };

    // Function to format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";
            
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            
            return `${day}/${month}/${year}`;
        } catch (e) {
            return "Invalid date";
        }
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
    const filteredComplaints = React.useMemo(() => {
        if (!searchTerm.trim()) {
            return complaints;
        }

        const searchLower = searchTerm.toLowerCase().trim();
        
        return complaints.filter((complaint) => {
            // Get user data for search
            const createdBySearch = getUserSearchData(complaint.created_by);
            const updatedBySearch = getUserSearchData(complaint.updated_by);
            
            // Get company data for search
            const companySearchData = getCompanySearchData(complaint.company);
            
            // Get customer data for search
            const customerSearchData = getCustomerSearchData(complaint.customer);
            
            // Get dates in multiple formats for search
            const complaintDateFormats = formatDateForSearch(complaint.complaint_date);
            const resolvedDateFormats = formatDateForSearch(complaint.resolved_at);
            const createdDateFormats = formatDateForSearch(complaint.created_at);
            const updatedDateFormats = formatDateForSearch(complaint.updated_at);
            
            // Create a comprehensive search string
            const searchableText = [
                // Raw complaint data
                complaint.complaint_id || '',
                complaint.complaint_type || '',
                complaint.complaint_details || '',
                complaint.complaint_date || '',
                complaint.escalation_level || '',
                complaint.service_manager_email || '',
                complaint.gm_email || '',
                complaint.resolution_details || '',
                complaint.resolved_at || '',
                complaint.created_by || '',
                complaint.updated_by || '',
                complaint.company || '',
                complaint.customer || '',
                complaint.service_request || '',
                complaint.created_at || '',
                complaint.updated_at || '',
                complaint.status || '',
                complaint.priority || '',
                complaint.severity || '',
                complaint.category || '',
                complaint.sub_category || '',
                complaint.attachment_url || '',
                complaint.follow_up_date || '',
                complaint.assigned_to || '',
                complaint.estimated_resolution_date || '',
                complaint.actual_resolution_date || '',
                
                // Formatted user data for search
                createdBySearch,
                updatedBySearch,
                
                // Formatted company data for search
                companySearchData,
                
                // Formatted customer data for search
                customerSearchData,
                
                // Dates in multiple formats
                complaintDateFormats,
                resolvedDateFormats,
                createdDateFormats,
                updatedDateFormats,
                
                // Display values (exactly as shown in table)
                formatDate(complaint.complaint_date),
                formatDate(complaint.resolved_at),
                formatDate(complaint.created_at),
                getUsernameById(complaint.created_by),
                getUsernameById(complaint.updated_by),
                getCompanyName(complaint.company),
                getCustomerUsername(complaint.customer),
                
                // Complaint type variations for better search
                complaint.complaint_type === 'Service Delay' ? 'Service Delay late delay tardy' : '',
                complaint.complaint_type === 'Billing Issue' ? 'Billing Issue bill payment charge' : '',
                complaint.complaint_type === 'Quality Issue' ? 'Quality Issue quality defective poor' : '',
                complaint.complaint_type === 'Technical Issue' ? 'Technical Issue technical problem error' : '',
                complaint.complaint_type === 'Customer Service' ? 'Customer Service service support rude' : '',
                complaint.complaint_type === 'Product Issue' ? 'Product Issue product defective broken' : '',
                
                // Escalation level variations
                complaint.escalation_level === 'Level 1' ? 'Level 1 L1 first low' : '',
                complaint.escalation_level === 'Level 2' ? 'Level 2 L2 second medium' : '',
                complaint.escalation_level === 'Level 3' ? 'Level 3 L3 third high' : '',
                complaint.escalation_level === 'Level 4' ? 'Level 4 L4 fourth critical' : '',
                
                // Status variations with badge text multiple times
                complaint.status === 'Open' ? 'Open open pending new' : '',
                complaint.status === 'In Progress' ? 'In Progress progress working ongoing' : '',
                complaint.status === 'Resolved' ? 'Resolved resolved closed completed' : '',
                complaint.status === 'Closed' ? 'Closed closed finished done' : '',
                complaint.status === 'Escalated' ? 'Escalated escalated transferred' : '',
                complaint.status === 'Reopened' ? 'Reopened reopened again' : '',
                
                // Priority variations
                complaint.priority === 'High' ? 'High high urgent critical' : '',
                complaint.priority === 'Medium' ? 'Medium medium normal moderate' : '',
                complaint.priority === 'Low' ? 'Low low minor trivial' : '',
                
                // Severity variations
                complaint.severity === 'Critical' ? 'Critical critical severe emergency' : '',
                complaint.severity === 'Major' ? 'Major major significant serious' : '',
                complaint.severity === 'Minor' ? 'Minor minor small trivial' : '',
                
                // Email username variations (without domain)
                complaint.service_manager_email ? complaint.service_manager_email.split('@')[0] : '',
                complaint.gm_email ? complaint.gm_email.split('@')[0] : '',
                
                // Resolution details variations
                complaint.resolution_details ? `resolution ${complaint.resolution_details}` : '',
                
                // Service request variations
                complaint.service_request ? `service request ${complaint.service_request}` : '',
                
                // Add any other properties that might exist
                ...Object.values(complaint).filter(val => 
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
    }, [searchTerm, complaints, users, companiesData, customersData]);

    // Reset to first page when search term or entries per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, entriesPerPage]);

    // Pagination logic
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentItems = filteredComplaints.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredComplaints.length / entriesPerPage);

    if (loading) {
        return (
            <div className="pm-container mt-4">
                <h2 className="pm-title mb-4">Customer Complaints</h2>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading complaints...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pm-container mt-4">
                <h2 className="pm-title mb-4">Customer Complaints</h2>
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="pm-container mt-4">
            <h2 className="pm-title mb-4">Customer Complaints</h2>

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
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
                        <option value={50}>50</option>
                    </select>
                    entries
                </div>
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search in all columns..."
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
                    <strong>Search Results:</strong> Found {filteredComplaints.length} complaint(s) matching "{searchTerm}"
                </div>
            )}

            <div className="table-responsive mb-4">
                <table className="table">
                    <thead className="service-item-table-header">
                        <tr>
                            <th>S.No</th>
                            <th>Complaint ID</th>
                            <th>Type</th>
                            <th>Details</th>
                            <th>Complaint Date</th>
                            <th>Escalation Level</th>
                            <th>Service Manager Email</th>
                            <th>GM Email</th>
                            <th>Resolution Details</th>
                            <th>Resolved At</th>
                            <th>Created By</th>
                            <th>Updated By</th>
                            <th>Company</th>
                            <th>Customer</th>
                            <th>Service Request</th>
                            <th>Created At</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((complaint, index) => (
                                <tr key={complaint.complaint_id || index}>
                                    <td>{indexOfFirstEntry + index + 1}</td>
                                    <td>{complaint.complaint_id}</td>
                                    <td>{complaint.complaint_type}</td>
                                    <td className="text-truncate" style={{ maxWidth: "200px" }} title={complaint.complaint_details}>
                                        {complaint.complaint_details}
                                    </td>
                                    <td>{formatDate(complaint.complaint_date)}</td>
                                    <td>{complaint.escalation_level}</td>
                                    <td>{complaint.service_manager_email}</td>
                                    <td>{complaint.gm_email}</td>
                                    <td className="text-truncate" style={{ maxWidth: "200px" }} title={complaint.resolution_details}>
                                        {complaint.resolution_details || "—"}
                                    </td>
                                    <td>{formatDate(complaint.resolved_at)}</td>
                                    <td title={`ID: ${complaint.created_by}`}>
                                        {getUsernameById(complaint.created_by)}
                                    </td>
                                    <td title={`ID: ${complaint.updated_by}`}>
                                        {getUsernameById(complaint.updated_by)}
                                    </td>
                                    <td title={`ID: ${complaint.company}`}>
                                        {getCompanyName(complaint.company)}
                                    </td>
                                    <td title={`ID: ${complaint.customer}`}>
                                        {getCustomerUsername(complaint.customer)}
                                    </td>
                                    <td>{complaint.service_request}</td>
                                    <td>{formatDate(complaint.created_at)}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                complaint.status === "Open"
                                                    ? "bg-warning"
                                                    : complaint.status === "In Progress"
                                                    ? "bg-info"
                                                    : complaint.status === "Resolved"
                                                    ? "bg-success"
                                                    : "bg-secondary"
                                            }`}
                                        >
                                            {complaint.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="17" className="text-center">
                                    {searchTerm 
                                        ? `No complaints found matching "${searchTerm}"`
                                        : "No complaints found."}
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
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ));
                        })()}

                        <li
                            className={`page-item ${
                                currentPage === totalPages ? "disabled" : ""
                            }`}
                        >
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
        </div>
    );
};

export default CustomerComplaints;