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


import React, { useState, useEffect, useContext } from "react";
import baseURL from "../ApiUrl/Apiurl";
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';

const CustomerComplaints = () => {
    const { userId } = useContext(AuthContext);
    const { selectedCompany } = useCompany();
    const [complaints, setComplaints] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const [companiesData, setCompaniesData] = useState([]); // New state for companies
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

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
            setCompaniesData([]); // Set empty array on error
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
                await fetchCompanies(); // Fetch companies first
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

    // Function to get company name by company ID
    const getCompanyName = (companyId) => {
        if (!companiesData || companiesData.length === 0) return companyId;
        
        const company = companiesData.find(comp => comp.company_id === companyId);
        return company ? company.company_name : companyId;
    };

    // Function to get customer username by customer ID
    const getCustomerUsername = (customerId) => {
        if (!customersData || customersData.length === 0) return customerId;
        
        const customer = customersData.find(cust => cust.customer_id === customerId);
        return customer ? customer.username : customerId;
    };

    // Function to get created_by/updated_by username
    const getCreatedUpdatedBy = (userId) => {
        if (!customersData || customersData.length === 0) return userId;
        
        const customer = customersData.find(cust => cust.customer_id === userId);
        return customer ? customer.username : userId;
    };

    // Filter complaints based on search term
    const filteredComplaints = complaints.filter((complaint) =>
        Object.values(complaint).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination logic
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentItems = filteredComplaints.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredComplaints.length / entriesPerPage);

    // Reset to first page when search term or entries per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, entriesPerPage]);

    // Date formatting function
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
                <input
                    type="text"
                    className="form-control w-auto"
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

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
                                        {getCreatedUpdatedBy(complaint.created_by)}
                                    </td>
                                    <td title={`ID: ${complaint.updated_by}`}>
                                        {getCreatedUpdatedBy(complaint.updated_by)}
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
                                    {searchTerm ? "No matching complaints found." : "No complaints found."}
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
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}

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