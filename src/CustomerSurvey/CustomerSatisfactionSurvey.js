// import React, { useState, useEffect, useContext } from "react";
// import baseURL from "../ApiUrl/Apiurl";
// import { AuthContext } from '../AuthContext/AuthContext';
// import { useCompany } from '../AuthContext/CompanyContext';

// const CustomerFeedbacks = () => { 
//     const { userId } = useContext(AuthContext);
//     const { selectedCompany } = useCompany();
//     const [feedbacks, setFeedbacks] = useState([]);
//     const [customersData, setCustomersData] = useState([]);
//     const [companiesData, setCompaniesData] = useState([]);
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
//             setCompaniesData([]);
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

//     // Fetch feedbacks data
//     const fetchFeedbacks = async () => {
//         try {
//             setLoading(true);
            
//             if (!userId) {
//                 throw new Error("User ID not found");
//             }
            
//             const response = await fetch(
//                 `${baseURL}/customer-surveys/?user_id=${userId}&company_id=${selectedCompany}`
//             );
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             const data = await response.json();
            
//             if (data.status === "success") {
//                 setFeedbacks(data.data || []);
//             } else {
//                 throw new Error(data.message || "Failed to fetch feedbacks");
//             }
//         } catch (err) {
//             setError(err.message);
//             console.error("Error fetching feedbacks:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch all data
//     useEffect(() => {
//         const fetchAllData = async () => {
//             setLoading(true);
//             try {
//                 await fetchCompanies();
//                 await fetchCustomers();
//                 await fetchFeedbacks();
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

//     // Function to get service engineer name
//     const getServiceEngineerName = (engineerId) => {
//         if (!engineerId) return "—";
//         if (!customersData || customersData.length === 0) return engineerId;
        
//         const engineer = customersData.find(cust => cust.customer_id === engineerId);
//         return engineer ? engineer.username : engineerId;
//     };

//     // Function to format questions array
//     const formatQuestions = (questions) => {
//         if (!questions || questions.length === 0) return "—";
//         return questions.join(', ');
//     };

//     // Filter feedbacks based on search term
//     const filteredFeedbacks = feedbacks.filter((feedback) =>
//         Object.values(feedback).some((val) =>
//             String(val).toLowerCase().includes(searchTerm.toLowerCase())
//         )
//     );

//     // Pagination logic
//     const indexOfLastEntry = currentPage * entriesPerPage;
//     const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//     const currentItems = filteredFeedbacks.slice(indexOfFirstEntry, indexOfLastEntry);
//     const totalPages = Math.ceil(filteredFeedbacks.length / entriesPerPage);

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

//     // DateTime formatting function for detailed timestamps
//     const formatDateTime = (dateString) => {
//         if (!dateString) return "—";
//         try {
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return "Invalid date";
            
//             const day = date.getDate().toString().padStart(2, "0");
//             const month = (date.getMonth() + 1).toString().padStart(2, "0");
//             const year = date.getFullYear();
//             const hours = date.getHours().toString().padStart(2, "0");
//             const minutes = date.getMinutes().toString().padStart(2, "0");
            
//             return `${day}/${month}/${year} ${hours}:${minutes}`;
//         } catch (e) {
//             return "Invalid date";
//         }
//     };

//     if (loading) {
//         return (
//             <div className="pm-container mt-4">
//                 <h2 className="pm-title mb-4">Customer Feedbacks</h2>
//                 <div className="text-center">
//                     <div className="spinner-border" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-2">Loading feedbacks...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="pm-container mt-4">
//                 <h2 className="pm-title mb-4">Customer Feedbacks</h2>
//                 <div className="alert alert-danger" role="alert">
//                     Error: {error}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="pm-container mt-4">
//             <h2 className="pm-title mb-4">Customer Feedbacks</h2>

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
//                     placeholder="Search feedbacks..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//             </div>

//             <div className="table-responsive mb-4">
//                 <table className="table">
//                     <thead className="service-item-table-header">
//                         <tr>
//                             <th>S.No</th>
//                             <th>Survey ID</th>
//                             <th>Responses</th>
//                             <th>Suggestions</th>
//                             <th>Submitted At</th>
//                             <th>Created By</th>
//                             {/* <th>Updated By</th> */}
//                             {/* <th>Company</th> */}
//                             <th>Service Request</th>
//                             <th>Customer</th>
//                             <th>Service Engineer</th>
//                             <th>Questions</th>
//                             <th>Created At</th>
//                             {/* <th>Updated At</th> */}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentItems.length > 0 ? (
//                             currentItems.map((feedback, index) => (
//                                 <tr key={feedback.survey_id || index}>
//                                     <td>{indexOfFirstEntry + index + 1}</td>
//                                     <td>{feedback.survey_id}</td>
//                                     <td>
//                                         {feedback.responses && feedback.responses.length > 0 ? (
//                                             <ul className="list-unstyled mb-0">
//                                                 {feedback.responses.map((res, i) => (
//                                                     <li key={res.response_id}>
//                                                         <strong>Q{i + 1}:</strong> {res.question}<br />
//                                                         <span className="badge bg-success me-2">Rating: {res.rating_response}</span>
//                                                         <em className="text-muted">Reason: {res.reason || '-'}</em>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         ) : (
//                                             'No responses'
//                                         )}
//                                     </td>
//                                     <td className="text-truncate" style={{ maxWidth: "200px" }} title={feedback.suggestions}>
//                                         {feedback.suggestions || "—"}
//                                     </td>
//                                     <td>{formatDateTime(feedback.submitted_at)}</td>
//                                     <td title={`ID: ${feedback.created_by}`}>
//                                         {getCreatedUpdatedBy(feedback.created_by)}
//                                     </td>
//                                     {/* <td title={`ID: ${feedback.updated_by}`}>
//                                         {getCreatedUpdatedBy(feedback.updated_by)}
//                                     </td> */}
//                                     {/* <td title={`ID: ${feedback.company}`}>
//                                         {getCompanyName(feedback.company)}
//                                     </td> */}
//                                     <td>{feedback.service_request}</td>
//                                     <td title={`ID: ${feedback.customer}`}>
//                                         {getCustomerUsername(feedback.customer)}
//                                     </td>
//                                     <td title={`ID: ${feedback.service_engineer}`}>
//                                         {getServiceEngineerName(feedback.service_engineer)}
//                                     </td>
//                                     <td 
//                                         className="text-truncate" 
//                                         style={{ maxWidth: "200px" }} 
//                                         title={formatQuestions(feedback.questions)}
//                                     >
//                                         {formatQuestions(feedback.questions)}
//                                     </td>
//                                     <td>{formatDateTime(feedback.created_at)}</td>
//                                     {/* <td>{formatDateTime(feedback.updated_at)}</td> */}
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="14" className="text-center">
//                                     {searchTerm ? "No matching feedbacks found." : "No feedbacks found."}
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

// export default CustomerFeedbacks;




// import React, { useState, useEffect, useContext } from "react";
// import baseURL from "../ApiUrl/Apiurl";
// import { AuthContext } from '../AuthContext/AuthContext';
// import { useCompany } from '../AuthContext/CompanyContext';

// const CustomerFeedbacks = () => { 
//     const { userId } = useContext(AuthContext);
//     const { selectedCompany } = useCompany();
//     const [feedbacks, setFeedbacks] = useState([]);
//     const [customersData, setCustomersData] = useState([]);
//     const [companiesData, setCompaniesData] = useState([]);
//     const [users, setUsers] = useState([]); // To store user data for search
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [entriesPerPage, setEntriesPerPage] = useState(5);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [questionsData, setQuestionsData] = useState([]); // To store survey questions

//     // Fetch users data for username search
//     const fetchUsers = async () => {
//         try {
//             const response = await fetch(`${baseURL}/users/`);
//             if (response.ok) {
//                 const data = await response.json();
//                 if (Array.isArray(data)) {
//                     setUsers(data);
//                 }
//             }
//         } catch (err) {
//             console.error("Error fetching users:", err);
//         }
//     };

//     // Fetch survey questions data
//     const fetchQuestions = async () => {
//         try {
//             const response = await fetch(`${baseURL}/survey-questions/`);
//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.status === "success") {
//                     setQuestionsData(data.data || []);
//                 }
//             }
//         } catch (err) {
//             console.error("Error fetching survey questions:", err);
//         }
//     };

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
//             setCompaniesData([]);
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

//     // Fetch feedbacks data
//     const fetchFeedbacks = async () => {
//         try {
//             setLoading(true);
            
//             if (!userId) {
//                 throw new Error("User ID not found");
//             }
            
//             const response = await fetch(
//                 `${baseURL}/customer-surveys/?user_id=${userId}&company_id=${selectedCompany}`
//             );
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             const data = await response.json();
            
//             if (data.status === "success") {
//                 setFeedbacks(data.data || []);
//             } else {
//                 throw new Error(data.message || "Failed to fetch feedbacks");
//             }
//         } catch (err) {
//             setError(err.message);
//             console.error("Error fetching feedbacks:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch all data
//     useEffect(() => {
//         const fetchAllData = async () => {
//             setLoading(true);
//             try {
//                 await fetchUsers();
//                 await fetchQuestions();
//                 await fetchCompanies();
//                 await fetchCustomers();
//                 await fetchFeedbacks();
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAllData();
//     }, [selectedCompany, userId]);

//     // Function to get username from user ID
//     const getUsernameById = (userId) => {
//         if (!userId || users.length === 0) return userId;
        
//         const user = users.find(user => user.user_id === userId);
//         return user ? user.username : userId;
//     };

//     // Function to get user search data (both ID and username)
//     const getUserSearchData = (userId) => {
//         if (!userId) return '';
//         const user = users.find(user => user.user_id === userId);
//         return user ? `${userId} ${user.username}` : userId;
//     };

//     // Function to get company name by company ID
//     const getCompanyName = (companyId) => {
//         if (!companiesData || companiesData.length === 0) return companyId;
        
//         const company = companiesData.find(comp => comp.company_id === companyId);
//         return company ? company.company_name : companyId;
//     };

//     // Function to get company search data (both ID and name)
//     const getCompanySearchData = (companyId) => {
//         if (!companyId) return '';
//         const company = companiesData.find(comp => comp.company_id === companyId);
//         return company ? `${companyId} ${company.company_name}` : companyId;
//     };

//     // Function to get customer username by customer ID
//     const getCustomerUsername = (customerId) => {
//         if (!customersData || customersData.length === 0) return customerId;
        
//         const customer = customersData.find(cust => cust.customer_id === customerId);
//         return customer ? customer.username : customerId;
//     };

//     // Function to get customer search data (both ID, username, and full name)
//     const getCustomerSearchData = (customerId) => {
//         if (!customerId) return '';
//         const customer = customersData.find(cust => cust.customer_id === customerId);
//         return customer ? `${customerId} ${customer.username} ${customer.full_name} ${customer.email}` : customerId;
//     };

//     // Function to get service engineer name
//     const getServiceEngineerName = (engineerId) => {
//         if (!engineerId) return "—";
//         return getUsernameById(engineerId);
//     };

//     // Function to get service engineer search data
//     const getServiceEngineerSearchData = (engineerId) => {
//         if (!engineerId) return '';
//         return getUserSearchData(engineerId);
//     };

//     // Function to get question text by question ID
//     const getQuestionText = (questionId) => {
//         if (!questionId || questionsData.length === 0) return questionId;
        
//         const question = questionsData.find(q => q.question_id === questionId);
//         return question ? question.question_text : questionId;
//     };

//     // Function to format questions array
//     const formatQuestions = (questions) => {
//         if (!questions || questions.length === 0) return "—";
//         return questions.join(', ');
//     };

//     // Function to format date for display
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

//     // Function to format date-time for detailed timestamps
//     const formatDateTime = (dateString) => {
//         if (!dateString) return "—";
//         try {
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return "Invalid date";
            
//             const day = date.getDate().toString().padStart(2, "0");
//             const month = (date.getMonth() + 1).toString().padStart(2, "0");
//             const year = date.getFullYear();
//             const hours = date.getHours().toString().padStart(2, "0");
//             const minutes = date.getMinutes().toString().padStart(2, "0");
            
//             return `${day}/${month}/${year} ${hours}:${minutes}`;
//         } catch (e) {
//             return "Invalid date";
//         }
//     };

//     // Function to format date in multiple formats for search
//     const formatDateForSearch = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
        
//         if (isNaN(date.getTime())) return '';
        
//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear();
//         const monthName = date.toLocaleString('en-IN', { month: 'long' });
//         const monthShort = date.toLocaleString('en-IN', { month: 'short' });
//         const hour = date.getHours().toString().padStart(2, '0');
//         const minute = date.getMinutes().toString().padStart(2, '0');
//         const second = date.getSeconds().toString().padStart(2, '0');
        
//         // Return multiple formats for better searchability
//         return [
//             `${day}/${month}/${year}`,                    // DD/MM/YYYY
//             `${day}/${month}/${year} ${hour}:${minute}:${second}`, // DD/MM/YYYY HH:MM:SS
//             `${month}/${day}/${year}`,                    // MM/DD/YYYY
//             `${year}-${month}-${day}`,                    // YYYY-MM-DD
//             `${year}${month}${day}`,                      // YYYYMMDD
//             `${day}-${month}-${year}`,                    // DD-MM-YYYY
//             date.toISOString(),                           // ISO string
//             monthName,                                    // January, February
//             monthShort,                                   // Jan, Feb
//             `${year}`,                                    // 2024
//             `${month}/${year}`,                           // MM/YYYY
//             `${day} ${monthName} ${year}`,               // 15 January 2024
//             `${day} ${monthShort} ${year}`,              // 15 Jan 2024
//             `${hour}:${minute}`,                          // HH:MM
//             `${hour}:${minute}:${second}`,               // HH:MM:SS
//         ].join(' ');
//     };

//     // Function to extract all text from responses array
//     const extractResponsesText = (responses) => {
//         if (!responses || !Array.isArray(responses)) return '';
        
//         return responses.map(response => {
//             const questionText = getQuestionText(response.question);
//             return `${questionText} ${response.rating_response} ${response.reason || ''}`;
//         }).join(' ');
//     };

//     // Enhanced global search functionality
//     const filteredFeedbacks = React.useMemo(() => {
//         if (!searchTerm.trim()) {
//             return feedbacks;
//         }

//         const searchLower = searchTerm.toLowerCase().trim();
        
//         return feedbacks.filter((feedback) => {
//             // Get user data for search
//             const createdBySearch = getUserSearchData(feedback.created_by);
//             const updatedBySearch = getUserSearchData(feedback.updated_by);
//             const customerSearch = getCustomerSearchData(feedback.customer);
//             const serviceEngineerSearch = getServiceEngineerSearchData(feedback.service_engineer);
            
//             // Get company data for search
//             const companySearchData = getCompanySearchData(feedback.company);
            
//             // Get dates in multiple formats for search
//             const submittedDateFormats = formatDateForSearch(feedback.submitted_at);
//             const createdDateFormats = formatDateForSearch(feedback.created_at);
//             const updatedDateFormats = formatDateForSearch(feedback.updated_at);
            
//             // Extract responses text for search
//             const responsesText = extractResponsesText(feedback.responses);
            
//             // Extract questions text for search
//             const questionsText = feedback.questions && Array.isArray(feedback.questions) 
//                 ? feedback.questions.map(qId => getQuestionText(qId)).join(' ')
//                 : '';
            
//             // Create a comprehensive search string
//             const searchableText = [
//                 // Raw feedback data
//                 feedback.survey_id || '',
//                 feedback.suggestions || '',
//                 feedback.service_request || '',
//                 feedback.customer || '',
//                 feedback.service_engineer || '',
//                 feedback.company || '',
//                 feedback.created_by || '',
//                 feedback.updated_by || '',
//                 feedback.submitted_at || '',
//                 feedback.created_at || '',
//                 feedback.updated_at || '',
//                 feedback.survey_type || '',
//                 feedback.overall_rating !== undefined ? String(feedback.overall_rating) : '',
//                 feedback.status || '',
//                 feedback.is_anonymous !== undefined ? String(feedback.is_anonymous) : '',
//                 feedback.completion_time || '',
//                 feedback.feedback_category || '',
//                 feedback.feedback_source || '',
//                 feedback.device_type || '',
//                 feedback.browser_info || '',
//                 feedback.ip_address || '',
//                 feedback.location || '',
//                 feedback.session_id || '',
                
//                 // Formatted user data for search
//                 createdBySearch,
//                 updatedBySearch,
//                 customerSearch,
//                 serviceEngineerSearch,
                
//                 // Formatted company data for search
//                 companySearchData,
                
//                 // Responses text
//                 responsesText,
                
//                 // Questions text
//                 questionsText,
                
//                 // Dates in multiple formats
//                 submittedDateFormats,
//                 createdDateFormats,
//                 updatedDateFormats,
                
//                 // Display values (exactly as shown in table)
//                 formatDateTime(feedback.submitted_at),
//                 formatDateTime(feedback.created_at),
//                 formatDateTime(feedback.updated_at),
//                 getUsernameById(feedback.created_by),
//                 getUsernameById(feedback.updated_by),
//                 getCustomerUsername(feedback.customer),
//                 getServiceEngineerName(feedback.service_engineer),
//                 getCompanyName(feedback.company),
//                 formatQuestions(feedback.questions),
                
//                 // Rating variations for search
//                 feedback.overall_rating === 5 ? '5 five excellent outstanding perfect' : '',
//                 feedback.overall_rating === 4 ? '4 four good great satisfied' : '',
//                 feedback.overall_rating === 3 ? '3 three average okay neutral' : '',
//                 feedback.overall_rating === 2 ? '2 two poor bad dissatisfied' : '',
//                 feedback.overall_rating === 1 ? '1 one terrible awful horrible' : '',
                
//                 // Status variations
//                 feedback.status === 'Submitted' ? 'Submitted submitted completed done' : '',
//                 feedback.status === 'Draft' ? 'Draft draft incomplete pending' : '',
//                 feedback.status === 'Deleted' ? 'Deleted deleted removed' : '',
//                 feedback.status === 'Archived' ? 'Archived archived stored' : '',
                
//                 // Survey type variations
//                 feedback.survey_type === 'Post-Service' ? 'Post-Service after service completed' : '',
//                 feedback.survey_type === 'General Feedback' ? 'General Feedback general overall' : '',
//                 feedback.survey_type === 'Product Feedback' ? 'Product Feedback product item' : '',
//                 feedback.survey_type === 'Service Feedback' ? 'Service Feedback service support' : '',
                
//                 // Feedback category variations
//                 feedback.feedback_category === 'Positive' ? 'Positive positive good excellent happy' : '',
//                 feedback.feedback_category === 'Negative' ? 'Negative negative bad poor unhappy' : '',
//                 feedback.feedback_category === 'Neutral' ? 'Neutral neutral average okay' : '',
//                 feedback.feedback_category === 'Suggestive' ? 'Suggestive suggestion suggestion improve' : '',
                
//                 // Anonymous variations
//                 feedback.is_anonymous === true ? 'anonymous anonymous hidden nameless' : '',
//                 feedback.is_anonymous === false ? 'named identified known' : '',
                
//                 // Suggestions variations
//                 feedback.suggestions ? `suggestions ${feedback.suggestions}` : '',
                
//                 // Service request variations
//                 feedback.service_request ? `service request ${feedback.service_request}` : '',
                
//                 // Add any other properties that might exist
//                 ...Object.values(feedback).filter(val => 
//                     val !== null && val !== undefined
//                 ).map(val => {
//                     if (typeof val === 'string' || typeof val === 'number') {
//                         return String(val);
//                     }
//                     if (typeof val === 'boolean') {
//                         return val ? 'true yes active' : 'false no inactive';
//                     }
//                     if (Array.isArray(val)) {
//                         if (typeof val[0] === 'object') {
//                             // Handle responses array of objects
//                             return JSON.stringify(val);
//                         }
//                         return val.join(' ');
//                     }
//                     if (typeof val === 'object' && val !== null) {
//                         return JSON.stringify(val);
//                     }
//                     return '';
//                 })
//             ]
//             .join(' ')                    // Combine into one string
//             .toLowerCase()                // Make case-insensitive
//             .replace(/\s+/g, ' ')         // Normalize spaces
//             .trim();
            
//             return searchableText.includes(searchLower);
//         });
//     }, [searchTerm, feedbacks, users, companiesData, customersData, questionsData]);

//     // Pagination logic
//     const indexOfLastEntry = currentPage * entriesPerPage;
//     const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//     const currentItems = filteredFeedbacks.slice(indexOfFirstEntry, indexOfLastEntry);
//     const totalPages = Math.ceil(filteredFeedbacks.length / entriesPerPage);

//     // Reset to first page when search term or entries per page changes
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchTerm, entriesPerPage]);

//     if (loading) {
//         return (
//             <div className="pm-container mt-4">
//                 <h2 className="pm-title mb-4">Customer Feedbacks</h2>
//                 <div className="text-center">
//                     <div className="spinner-border" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-2">Loading feedbacks...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="pm-container mt-4">
//                 <h2 className="pm-title mb-4">Customer Feedbacks</h2>
//                 <div className="alert alert-danger" role="alert">
//                     Error: {error}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="pm-container mt-4">
//             <h2 className="pm-title mb-4">Customer Feedbacks</h2>

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
//                 <div className="d-flex align-items-center gap-2">
//                     <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Search in all columns..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         style={{ minWidth: '250px' }}
//                     />
//                     {searchTerm && (
//                         <button 
//                             className="btn btn-sm btn-outline-secondary"
//                             onClick={() => setSearchTerm('')}
//                         >
//                             Clear
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* Search Results Info */}
//             {searchTerm && (
//                 <div className="alert alert-info mb-3">
//                     <strong>Search Results:</strong> Found {filteredFeedbacks.length} feedback(s) matching "{searchTerm}"
//                 </div>
//             )}

//             <div className="table-responsive mb-4">
//                 <table className="table">
//                     <thead className="service-item-table-header">
//                         <tr>
//                             <th>S.No</th>
//                             <th>Survey ID</th>
//                             <th>Responses</th>
//                             <th>Suggestions</th>
//                             <th>Submitted At</th>
//                             <th>Created By</th>
//                             <th>Service Request</th>
//                             <th>Customer</th>
//                             <th>Service Engineer</th>
//                             <th>Questions</th>
//                             <th>Created At</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentItems.length > 0 ? (
//                             currentItems.map((feedback, index) => (
//                                 <tr key={feedback.survey_id || index}>
//                                     <td>{indexOfFirstEntry + index + 1}</td>
//                                     <td>{feedback.survey_id}</td>
//                                     <td>
//                                         {feedback.responses && feedback.responses.length > 0 ? (
//                                             <ul className="list-unstyled mb-0">
//                                                 {feedback.responses.map((res, i) => (
//                                                     <li key={res.response_id}>
//                                                         <strong>Q{i + 1}:</strong> {getQuestionText(res.question)}<br />
//                                                         <span className="badge bg-success me-2">Rating: {res.rating_response}</span>
//                                                         <em className="text-muted">Reason: {res.reason || '-'}</em>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         ) : (
//                                             'No responses'
//                                         )}
//                                     </td>
//                                     <td className="text-truncate" style={{ maxWidth: "200px" }} title={feedback.suggestions}>
//                                         {feedback.suggestions || "—"}
//                                     </td>
//                                     <td>{formatDateTime(feedback.submitted_at)}</td>
//                                     <td title={`ID: ${feedback.created_by}`}>
//                                         {getUsernameById(feedback.created_by)}
//                                     </td>
//                                     <td>{feedback.service_request}</td>
//                                     <td title={`ID: ${feedback.customer}`}>
//                                         {getCustomerUsername(feedback.customer)}
//                                     </td>
//                                     <td title={`ID: ${feedback.service_engineer}`}>
//                                         {getServiceEngineerName(feedback.service_engineer)}
//                                     </td>
//                                     <td 
//                                         className="text-truncate" 
//                                         style={{ maxWidth: "200px" }} 
//                                         title={formatQuestions(feedback.questions)}
//                                     >
//                                         {formatQuestions(feedback.questions)}
//                                     </td>
//                                     <td>{formatDateTime(feedback.created_at)}</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="11" className="text-center">
//                                     {searchTerm 
//                                         ? `No feedbacks found matching "${searchTerm}"`
//                                         : "No feedbacks found."}
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

//                         {(() => {
//                             const maxVisiblePages = 5;
//                             let pageNumbers = [];
                            
//                             if (totalPages <= maxVisiblePages) {
//                                 for (let i = 1; i <= totalPages; i++) {
//                                     pageNumbers.push(i);
//                                 }
//                             } else {
//                                 let startPage = Math.max(1, currentPage - 2);
//                                 let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                                
//                                 if (endPage - startPage + 1 < maxVisiblePages) {
//                                     startPage = Math.max(1, endPage - maxVisiblePages + 1);
//                                 }
                                
//                                 for (let i = startPage; i <= endPage; i++) {
//                                     pageNumbers.push(i);
//                                 }
//                             }
                            
//                             return pageNumbers.map((page) => (
//                                 <li
//                                     key={page}
//                                     className={`page-item ${currentPage === page ? "active" : ""}`}
//                                 >
//                                     <button
//                                         className="page-link"
//                                         onClick={() => setCurrentPage(page)}
//                                     >
//                                         {page}
//                                     </button>
//                                 </li>
//                             ));
//                         })()}

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

// export default CustomerFeedbacks;





// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import baseURL from "../ApiUrl/Apiurl";
// import { AuthContext } from '../AuthContext/AuthContext';
// import { useCompany } from '../AuthContext/CompanyContext';

// const CustomerFeedbacks = () => { 
//     const { userId } = useContext(AuthContext);
//     const { selectedCompany } = useCompany();
//     const navigate = useNavigate();
//     const [feedbacks, setFeedbacks] = useState([]);
//     const [customersData, setCustomersData] = useState([]);
//     const [companiesData, setCompaniesData] = useState([]);
//     const [users, setUsers] = useState([]); // To store user data for search
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//    const [searchTerm, setSearchTerm] = useState(() => {
//   return sessionStorage.getItem('feedbacks_searchTerm') || '';
// });

// const [entriesPerPage, setEntriesPerPage] = useState(() => {
//   return Number(sessionStorage.getItem('feedbacks_entriesPerPage')) || 5;
// });

// const [currentPage, setCurrentPage] = useState(() => {
//   return Number(sessionStorage.getItem('feedbacks_currentPage')) || 1;
// });

// useEffect(() => {
//   sessionStorage.setItem('feedbacks_searchTerm', searchTerm);
// }, [searchTerm]);

// useEffect(() => {
//   sessionStorage.setItem('feedbacks_entriesPerPage', entriesPerPage);
// }, [entriesPerPage]);

// useEffect(() => {
//   sessionStorage.setItem('feedbacks_currentPage', currentPage);
// }, [currentPage]);


// const handleSearchChange = (value) => {
//   setSearchTerm(value);
//   setCurrentPage(1);
//   sessionStorage.setItem('feedbacks_currentPage', 1);
// };

// const handleEntriesPerPageChange = (value) => {
//   setEntriesPerPage(value);
//   setCurrentPage(1);
//   sessionStorage.setItem('feedbacks_currentPage', 1);
// };

//     const [questionsData, setQuestionsData] = useState([]); // To store survey questions
//     // Function to handle customer click navigation
//     const handleCustomerClick = (customerId) => {
//         if (customerId) {
//             navigate(`/servicemanager/customers/${customerId}`, { 
//                 state: { 
//                     selectedCompany: selectedCompany, 
//                     userId: userId 
//                 } 
//             });
//         }
//     };

//     // Fetch users data for username search
//     const fetchUsers = async () => {
//         try {
//             const response = await fetch(`${baseURL}/users/`);
//             if (response.ok) {
//                 const data = await response.json();
//                 if (Array.isArray(data)) {
//                     setUsers(data);
//                 }
//             }
//         } catch (err) {
//             console.error("Error fetching users:", err);
//         }
//     };

//     // Fetch survey questions data
//     const fetchQuestions = async () => {
//         try {
//             const response = await fetch(`${baseURL}/survey-questions/`);
//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.status === "success") {
//                     setQuestionsData(data.data || []);
//                 }
//             }
//         } catch (err) {
//             console.error("Error fetching survey questions:", err);
//         }
//     };

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
//             setCompaniesData([]);
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

//     // Fetch feedbacks data
//     const fetchFeedbacks = async () => {
//         try {
//             setLoading(true);
            
//             if (!userId) {
//                 throw new Error("User ID not found");
//             }
            
//             const response = await fetch(
//                 `${baseURL}/customer-surveys/?user_id=${userId}&company_id=${selectedCompany}`
//             );
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             const data = await response.json();
            
//             if (data.status === "success") {
//                 setFeedbacks(data.data || []);
//             } else {
//                 throw new Error(data.message || "Failed to fetch feedbacks");
//             }
//         } catch (err) {
//             setError(err.message);
//             console.error("Error fetching feedbacks:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch all data
//     useEffect(() => {
//         const fetchAllData = async () => {
//             setLoading(true);
//             try {
//                 await fetchUsers();
//                 await fetchQuestions();
//                 await fetchCompanies();
//                 await fetchCustomers();
//                 await fetchFeedbacks();
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAllData();
//     }, [selectedCompany, userId]);

//     // Function to get username from user ID
//     const getUsernameById = (userId) => {
//         if (!userId || users.length === 0) return userId;
        
//         const user = users.find(user => user.user_id === userId);
//         return user ? user.username : userId;
//     };

//     // Function to get user search data (both ID and username)
//     const getUserSearchData = (userId) => {
//         if (!userId) return '';
//         const user = users.find(user => user.user_id === userId);
//         return user ? `${userId} ${user.username}` : userId;
//     };

//     // Function to get company name by company ID
//     const getCompanyName = (companyId) => {
//         if (!companiesData || companiesData.length === 0) return companyId;
        
//         const company = companiesData.find(comp => comp.company_id === companyId);
//         return company ? company.company_name : companyId;
//     };

//     // Function to get company search data (both ID and name)
//     const getCompanySearchData = (companyId) => {
//         if (!companyId) return '';
//         const company = companiesData.find(comp => comp.company_id === companyId);
//         return company ? `${companyId} ${company.company_name}` : companyId;
//     };

//     // Function to get customer username by customer ID
//     const getCustomerUsername = (customerId) => {
//         if (!customersData || customersData.length === 0) return customerId;
        
//         const customer = customersData.find(cust => cust.customer_id === customerId);
//         return customer ? customer.username : customerId;
//     };

//     // Function to get customer display (both ID and username with link)
//     const getCustomerDisplay = (customerId) => {
//         if (!customerId) return { displayText: "—", customerId: null };
        
//         const customer = customersData.find(cust => cust.customer_id === customerId);
//         if (customer) {
//             return {
//                 displayText: `${customer.customer_id} - ${customer.username}`,
//                 customerId: customer.customer_id
//             };
//         }
//         return {
//             displayText: customerId,
//             customerId: customerId
//         };
//     };

//     // Function to get customer search data (both ID, username, and full name)
//     const getCustomerSearchData = (customerId) => {
//         if (!customerId) return '';
//         const customer = customersData.find(cust => cust.customer_id === customerId);
//         return customer ? `${customerId} ${customer.username} ${customer.full_name} ${customer.email}` : customerId;
//     };

//     // Function to get service engineer name
//     const getServiceEngineerName = (engineerId) => {
//         if (!engineerId) return "—";
//         return getUsernameById(engineerId);
//     };

//     // Function to get service engineer search data
//     const getServiceEngineerSearchData = (engineerId) => {
//         if (!engineerId) return '';
//         return getUserSearchData(engineerId);
//     };

//     // Function to get question text by question ID
//     const getQuestionText = (questionId) => {
//         if (!questionId || questionsData.length === 0) return questionId;
        
//         const question = questionsData.find(q => q.question_id === questionId);
//         return question ? question.question_text : questionId;
//     };

//     // Function to format questions array
//     const formatQuestions = (questions) => {
//         if (!questions || questions.length === 0) return "—";
//         return questions.join(', ');
//     };

//     // Function to format date for display
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

//     // Function to format date-time for detailed timestamps
//     const formatDateTime = (dateString) => {
//         if (!dateString) return "—";
//         try {
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return "Invalid date";
            
//             const day = date.getDate().toString().padStart(2, "0");
//             const month = (date.getMonth() + 1).toString().padStart(2, "0");
//             const year = date.getFullYear();
//             const hours = date.getHours().toString().padStart(2, "0");
//             const minutes = date.getMinutes().toString().padStart(2, "0");
            
//             return `${day}/${month}/${year} ${hours}:${minutes}`;
//         } catch (e) {
//             return "Invalid date";
//         }
//     };

//     // Function to format date in multiple formats for search
//     const formatDateForSearch = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
        
//         if (isNaN(date.getTime())) return '';
        
//         const day = date.getDate().toString().padStart(2, '0');
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const year = date.getFullYear();
//         const monthName = date.toLocaleString('en-IN', { month: 'long' });
//         const monthShort = date.toLocaleString('en-IN', { month: 'short' });
//         const hour = date.getHours().toString().padStart(2, '0');
//         const minute = date.getMinutes().toString().padStart(2, '0');
//         const second = date.getSeconds().toString().padStart(2, '0');
        
//         // Return multiple formats for better searchability
//         return [
//             `${day}/${month}/${year}`,                    // DD/MM/YYYY
//             `${day}/${month}/${year} ${hour}:${minute}:${second}`, // DD/MM/YYYY HH:MM:SS
//             `${month}/${day}/${year}`,                    // MM/DD/YYYY
//             `${year}-${month}-${day}`,                    // YYYY-MM-DD
//             `${year}${month}${day}`,                      // YYYYMMDD
//             `${day}-${month}-${year}`,                    // DD-MM-YYYY
//             date.toISOString(),                           // ISO string
//             monthName,                                    // January, February
//             monthShort,                                   // Jan, Feb
//             `${year}`,                                    // 2024
//             `${month}/${year}`,                           // MM/YYYY
//             `${day} ${monthName} ${year}`,               // 15 January 2024
//             `${day} ${monthShort} ${year}`,              // 15 Jan 2024
//             `${hour}:${minute}`,                          // HH:MM
//             `${hour}:${minute}:${second}`,               // HH:MM:SS
//         ].join(' ');
//     };

//     // Function to extract all text from responses array
//     const extractResponsesText = (responses) => {
//         if (!responses || !Array.isArray(responses)) return '';
        
//         return responses.map(response => {
//             const questionText = getQuestionText(response.question);
//             return `${questionText} ${response.rating_response} ${response.reason || ''}`;
//         }).join(' ');
//     };

//     // Enhanced global search functionality
//     const filteredFeedbacks = React.useMemo(() => {
//         if (!searchTerm.trim()) {
//             return feedbacks;
//         }

//         const searchLower = searchTerm.toLowerCase().trim();
        
//         return feedbacks.filter((feedback) => {
//             // Get user data for search
//             const createdBySearch = getUserSearchData(feedback.created_by);
//             const updatedBySearch = getUserSearchData(feedback.updated_by);
//             const customerSearch = getCustomerSearchData(feedback.customer);
//             const serviceEngineerSearch = getServiceEngineerSearchData(feedback.service_engineer);
            
//             // Get company data for search
//             const companySearchData = getCompanySearchData(feedback.company);
            
//             // Get dates in multiple formats for search
//             const submittedDateFormats = formatDateForSearch(feedback.submitted_at);
//             const createdDateFormats = formatDateForSearch(feedback.created_at);
//             const updatedDateFormats = formatDateForSearch(feedback.updated_at);
            
//             // Extract responses text for search
//             const responsesText = extractResponsesText(feedback.responses);
            
//             // Extract questions text for search
//             const questionsText = feedback.questions && Array.isArray(feedback.questions) 
//                 ? feedback.questions.map(qId => getQuestionText(qId)).join(' ')
//                 : '';
            
//             // Create a comprehensive search string
//             const searchableText = [
//                 // Raw feedback data
//                 feedback.survey_id || '',
//                 feedback.suggestions || '',
//                 feedback.service_request || '',
//                 feedback.customer || '',
//                 feedback.service_engineer || '',
//                 feedback.company || '',
//                 feedback.created_by || '',
//                 feedback.updated_by || '',
//                 feedback.submitted_at || '',
//                 feedback.created_at || '',
//                 feedback.updated_at || '',
//                 feedback.survey_type || '',
//                 feedback.overall_rating !== undefined ? String(feedback.overall_rating) : '',
//                 feedback.status || '',
//                 feedback.is_anonymous !== undefined ? String(feedback.is_anonymous) : '',
//                 feedback.completion_time || '',
//                 feedback.feedback_category || '',
//                 feedback.feedback_source || '',
//                 feedback.device_type || '',
//                 feedback.browser_info || '',
//                 feedback.ip_address || '',
//                 feedback.location || '',
//                 feedback.session_id || '',
                
//                 // Formatted user data for search
//                 createdBySearch,
//                 updatedBySearch,
//                 customerSearch,
//                 serviceEngineerSearch,
                
//                 // Formatted company data for search
//                 companySearchData,
                
//                 // Responses text
//                 responsesText,
                
//                 // Questions text
//                 questionsText,
                
//                 // Dates in multiple formats
//                 submittedDateFormats,
//                 createdDateFormats,
//                 updatedDateFormats,
                
//                 // Display values (exactly as shown in table)
//                 formatDateTime(feedback.submitted_at),
//                 formatDateTime(feedback.created_at),
//                 formatDateTime(feedback.updated_at),
//                 getUsernameById(feedback.created_by),
//                 getUsernameById(feedback.updated_by),
//                 getCustomerUsername(feedback.customer),
//                 getServiceEngineerName(feedback.service_engineer),
//                 getCompanyName(feedback.company),
//                 formatQuestions(feedback.questions),
                
//                 // Rating variations for search
//                 feedback.overall_rating === 5 ? '5 five excellent outstanding perfect' : '',
//                 feedback.overall_rating === 4 ? '4 four good great satisfied' : '',
//                 feedback.overall_rating === 3 ? '3 three average okay neutral' : '',
//                 feedback.overall_rating === 2 ? '2 two poor bad dissatisfied' : '',
//                 feedback.overall_rating === 1 ? '1 one terrible awful horrible' : '',
                
//                 // Status variations
//                 feedback.status === 'Submitted' ? 'Submitted submitted completed done' : '',
//                 feedback.status === 'Draft' ? 'Draft draft incomplete pending' : '',
//                 feedback.status === 'Deleted' ? 'Deleted deleted removed' : '',
//                 feedback.status === 'Archived' ? 'Archived archived stored' : '',
                
//                 // Survey type variations
//                 feedback.survey_type === 'Post-Service' ? 'Post-Service after service completed' : '',
//                 feedback.survey_type === 'General Feedback' ? 'General Feedback general overall' : '',
//                 feedback.survey_type === 'Product Feedback' ? 'Product Feedback product item' : '',
//                 feedback.survey_type === 'Service Feedback' ? 'Service Feedback service support' : '',
                
//                 // Feedback category variations
//                 feedback.feedback_category === 'Positive' ? 'Positive positive good excellent happy' : '',
//                 feedback.feedback_category === 'Negative' ? 'Negative negative bad poor unhappy' : '',
//                 feedback.feedback_category === 'Neutral' ? 'Neutral neutral average okay' : '',
//                 feedback.feedback_category === 'Suggestive' ? 'Suggestive suggestion suggestion improve' : '',
                
//                 // Anonymous variations
//                 feedback.is_anonymous === true ? 'anonymous anonymous hidden nameless' : '',
//                 feedback.is_anonymous === false ? 'named identified known' : '',
                
//                 // Suggestions variations
//                 feedback.suggestions ? `suggestions ${feedback.suggestions}` : '',
                
//                 // Service request variations
//                 feedback.service_request ? `service request ${feedback.service_request}` : '',
                
//                 // Add any other properties that might exist
//                 ...Object.values(feedback).filter(val => 
//                     val !== null && val !== undefined
//                 ).map(val => {
//                     if (typeof val === 'string' || typeof val === 'number') {
//                         return String(val);
//                     }
//                     if (typeof val === 'boolean') {
//                         return val ? 'true yes active' : 'false no inactive';
//                     }
//                     if (Array.isArray(val)) {
//                         if (typeof val[0] === 'object') {
//                             // Handle responses array of objects
//                             return JSON.stringify(val);
//                         }
//                         return val.join(' ');
//                     }
//                     if (typeof val === 'object' && val !== null) {
//                         return JSON.stringify(val);
//                     }
//                     return '';
//                 })
//             ]
//             .join(' ')                    // Combine into one string
//             .toLowerCase()                // Make case-insensitive
//             .replace(/\s+/g, ' ')         // Normalize spaces
//             .trim();
            
//             return searchableText.includes(searchLower);
//         });
//     }, [searchTerm, feedbacks, users, companiesData, customersData, questionsData]);

//     // Pagination logic
//     const indexOfLastEntry = currentPage * entriesPerPage;
//     const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//     const currentItems = filteredFeedbacks.slice(indexOfFirstEntry, indexOfLastEntry);
//     const totalPages = Math.ceil(filteredFeedbacks.length / entriesPerPage);
// useEffect(() => {
//   const savedPage = Number(sessionStorage.getItem('feedbacks_currentPage')) || 1;

//   if (savedPage > totalPages && totalPages > 0) {
//     setCurrentPage(totalPages);
//   }
// }, [filteredFeedbacks, entriesPerPage]);
   

//     if (loading) {
//         return (
//             <div className="pm-container mt-4">
//                 <h2 className="pm-title mb-4">Customer Feedbacks</h2>
//                 <div className="text-center">
//                     <div className="spinner-border" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-2">Loading feedbacks...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="pm-container mt-4">
//                 <h2 className="pm-title mb-4">Customer Feedbacks</h2>
//                 <div className="alert alert-danger" role="alert">
//                     Error: {error}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="pm-container mt-4">
//             <h2 className="pm-title mb-4">Customer Feedbacks</h2>

//             <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//                 <div className="d-flex align-items-center gap-2">
//                     Show
//                     <select
//                         value={entriesPerPage}
//                         onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
//                         className="form-select form-select-sm w-auto"
//                     >
//                         <option value={5}>5</option>
//                         <option value={10}>10</option>
//                         <option value={25}>25</option>
//                         <option value={50}>50</option>
//                     </select>
//                     entries
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                     <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Search in all columns..."
//                         value={searchTerm}
//                        onChange={(e) => handleSearchChange(e.target.value)}
//                         style={{ minWidth: '250px' }}
//                     />
//                     {searchTerm && (
//                         <button 
//                             className="btn btn-sm btn-outline-secondary"
//                             onClick={() => handleSearchChange('')}
//                         >
//                             Clear
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* Search Results Info */}
//             {searchTerm && (
//                 <div className="alert alert-info mb-3">
//                     <strong>Search Results:</strong> Found {filteredFeedbacks.length} feedback(s) matching "{searchTerm}"
//                 </div>
//             )}

//             <div className="table-responsive mb-4">
//                 <table className="table">
//                     <thead className="service-item-table-header">
//                         <tr>
//                             <th>S.No</th>
//                             <th>Survey ID</th>
//                             <th>Responses</th>
//                             <th>Suggestions</th>
//                             <th>Submitted At</th>
//                             <th>Created By</th>
//                             <th>Service Request</th>
//                             <th>Customer</th>
//                             <th>Service Engineer</th>
//                             <th>Questions</th>
//                             <th>Created At</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentItems.length > 0 ? (
//                             currentItems.map((feedback, index) => {
//                                 const customerDisplay = getCustomerDisplay(feedback.customer);
//                                 return (
//                                     <tr key={feedback.survey_id || index}>
//                                         <td>{indexOfFirstEntry + index + 1}</td>
//                                         <td>{feedback.survey_id}</td>
//                                         <td>
//                                             {feedback.responses && feedback.responses.length > 0 ? (
//                                                 <ul className="list-unstyled mb-0">
//                                                     {feedback.responses.map((res, i) => (
//                                                         <li key={res.response_id}>
//                                                             <strong>Q{i + 1}:</strong> {getQuestionText(res.question)}<br />
//                                                             <span className="badge bg-success me-2">Rating: {res.rating_response}</span>
//                                                             <em className="text-muted">Reason: {res.reason || '-'}</em>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             ) : (
//                                                 'No responses'
//                                             )}
//                                         </td>
//                                         <td className="text-truncate" style={{ maxWidth: "200px" }} title={feedback.suggestions}>
//                                             {feedback.suggestions || "—"}
//                                         </td>
//                                         <td>{formatDateTime(feedback.submitted_at)}</td>
//                                         <td title={`ID: ${feedback.created_by}`}>
//                                             {getUsernameById(feedback.created_by)}
//                                         </td>
//                                         <td>{feedback.service_request}</td>
//                                         <td>
//                                             {customerDisplay.displayText !== "—" ? (
//                                                 <button 
//                                                     className="btn btn-link p-0 text-primary text-decoration-underline"
//                                                     onClick={() => handleCustomerClick(customerDisplay.customerId)}
//                                                     style={{
//                                                         color: '#0d6efd',
//                                                         textDecoration: 'underline',
//                                                         border: 'none',
//                                                         background: 'none',
//                                                         cursor: 'pointer',
//                                                         fontSize: 'inherit',
//                                                         padding: '0',
//                                                         margin: '0',
                                                       
//                                                     }}
//                                                     title="View Customer Details"
//                                                 >
//                                                     {customerDisplay.displayText}
//                                                 </button>
//                                             ) : (
//                                                 "—"
//                                             )}
//                                         </td>
//                                         <td title={`ID: ${feedback.service_engineer}`}>
//                                             {getServiceEngineerName(feedback.service_engineer)}
//                                         </td>
//                                         <td 
//                                             className="text-truncate" 
//                                             style={{ maxWidth: "200px" }} 
//                                             title={formatQuestions(feedback.questions)}
//                                         >
//                                             {formatQuestions(feedback.questions)}
//                                         </td>
//                                         <td>{formatDateTime(feedback.created_at)}</td>
//                                     </tr>
//                                 );
//                             })
//                         ) : (
//                             <tr>
//                                 <td colSpan="11" className="text-center">
//                                     {searchTerm 
//                                         ? `No feedbacks found matching "${searchTerm}"`
//                                         : "No feedbacks found."}
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

//                         {(() => {
//                             const maxVisiblePages = 5;
//                             let pageNumbers = [];
                            
//                             if (totalPages <= maxVisiblePages) {
//                                 for (let i = 1; i <= totalPages; i++) {
//                                     pageNumbers.push(i);
//                                 }
//                             } else {
//                                 let startPage = Math.max(1, currentPage - 2);
//                                 let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                                
//                                 if (endPage - startPage + 1 < maxVisiblePages) {
//                                     startPage = Math.max(1, endPage - maxVisiblePages + 1);
//                                 }
                                
//                                 for (let i = startPage; i <= endPage; i++) {
//                                     pageNumbers.push(i);
//                                 }
//                             }
                            
//                             return pageNumbers.map((page) => (
//                                 <li
//                                     key={page}
//                                     className={`page-item ${currentPage === page ? "active" : ""}`}
//                                 >
//                                     <button
//                                         className="page-link"
//                                         onClick={() => setCurrentPage(page)}
//                                     >
//                                         {page}
//                                     </button>
//                                 </li>
//                             ));
//                         })()}

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

// export default CustomerFeedbacks;

import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import baseURL from "../ApiUrl/Apiurl";
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';

const CustomerFeedbacks = () => { 
    const { userId } = useContext(AuthContext);
    const { selectedCompany } = useCompany();
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const [companiesData, setCompaniesData] = useState([]);
    const [users, setUsers] = useState([]);
    const [questionsData, setQuestionsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const initialLoadRef = useRef(true);
    const abortControllerRef = useRef(null);
    
    // Pagination states (server-side)
    const [searchTerm, setSearchTerm] = useState(() => {
        return sessionStorage.getItem('feedbacks_searchTerm') || '';
    });
    const [entriesPerPage, setEntriesPerPage] = useState(() => {
        return Number(sessionStorage.getItem('feedbacks_entriesPerPage')) || 10;
    });
    const [currentPage, setCurrentPage] = useState(() => {
        return Number(sessionStorage.getItem('feedbacks_currentPage')) || 1;
    });
    
    // Server-side pagination data
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    // Save pagination state to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('feedbacks_searchTerm', searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        sessionStorage.setItem('feedbacks_entriesPerPage', entriesPerPage);
    }, [entriesPerPage]);

    useEffect(() => {
        sessionStorage.setItem('feedbacks_currentPage', currentPage);
    }, [currentPage]);

    // Function to handle customer click navigation
    const handleCustomerClick = (customerId) => {
        if (customerId) {
            navigate(`/servicemanager/customers/${customerId}`, { 
                state: { 
                    selectedCompany: selectedCompany, 
                    userId: userId 
                } 
            });
        }
    };

    // Fetch users data - WITHOUT pagination parameters (like ErrorLogs)
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${baseURL}/users/`);
            if (response.data && Array.isArray(response.data)) {
                setUsers(response.data);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    // Fetch survey questions data - WITHOUT pagination parameters
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`${baseURL}/survey-questions/`);
            if (response.data.status === "success") {
                setQuestionsData(response.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching survey questions:", err);
        }
    };

    // Fetch companies data - WITHOUT pagination parameters
    const fetchCompanies = async () => {
        try {
            const response = await axios.get(`${baseURL}/companies/`);
            if (response.data.status === "success") {
                setCompaniesData(response.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching companies:", err);
            setCompaniesData([]);
        }
    };

    // Fetch customers data - WITHOUT pagination parameters (like ErrorLogs)
    const fetchCustomers = async () => {
        try {
            const response = await axios.get(
                `${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`
            );
            if (response.data.status === "success") {
                setCustomersData(response.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching customers:", err);
            setCustomersData([]);
        }
    };

    // Fetch feedbacks with DYNAMIC pagination
    const fetchFeedbacks = async (page = currentPage, size = entriesPerPage, search = searchTerm, isInitial = false) => {
        // Cancel previous request if any
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        if (isInitial) {
            setLoading(true);
        } else {
            setFetching(true);
        }
        
        setError(null);
        
        abortControllerRef.current = new AbortController();

        try {
            if (!userId || !selectedCompany) {
                setError('Missing user ID or company ID');
                if (isInitial) {
                    setLoading(false);
                } else {
                    setFetching(false);
                }
                return;
            }

            // Build URL with dynamic pagination parameters
            let url = `${baseURL}/customer-surveys/?user_id=${userId}&company_id=${selectedCompany}&page=${page}&page_size=${size}`;
            
            // Add search parameter if exists
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            const response = await axios.get(
                url,
                { signal: abortControllerRef.current.signal }
            );

            if (response.data.status === "success") {
                const data = response.data.data || [];
                const pagination = response.data.pagination || {};
                
                setFeedbacks(data);
                setTotalCount(pagination.total_count || 0);
                setTotalPages(pagination.total_pages || 1);
                setHasNextPage(pagination.has_next || false);
                setHasPreviousPage(pagination.has_previous || false);
                setCurrentPage(pagination.current_page || 1);
            } else {
                setError('Failed to load feedbacks');
                setFeedbacks([]);
            }
        } catch (err) {
            if (axios.isCancel(err)) {
                return;
            }
            setError(err.message || 'Failed to fetch feedbacks');
            console.error("Error fetching feedbacks:", err);
            setFeedbacks([]);
        } finally {
            if (isInitial) {
                setLoading(false);
            } else {
                setFetching(false);
            }
            abortControllerRef.current = null;
        }
    };

    // Fetch all data - Initial load
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchUsers(),
                    fetchQuestions(),
                    fetchCompanies(),
                    fetchCustomers(),
                    fetchFeedbacks(1, entriesPerPage, searchTerm, true)
                ]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId && selectedCompany) {
            fetchAllData();
        }

        // Cleanup function
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [selectedCompany, userId]);

    // Refetch when pagination or search changes
    useEffect(() => {
        // Skip the initial mount fetch which is handled by fetchAllData
        if (initialLoadRef.current) {
            initialLoadRef.current = false;
            return;
        }

        if (userId && selectedCompany && !loading) {
            const debounceTimer = setTimeout(() => {
                fetchFeedbacks(currentPage, entriesPerPage, searchTerm, false);
            }, 300);
            
            return () => {
                clearTimeout(debounceTimer);
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
            };
        }
    }, [currentPage, entriesPerPage, searchTerm]);

    // Function to get username from user ID
    const getUsernameById = (userId) => {
        if (!userId || users.length === 0) return userId;
        const user = users.find(user => user.user_id === userId);
        return user ? user.username : userId;
    };

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

    // Function to get customer display (both ID and username with link)
    const getCustomerDisplay = (customerId) => {
        if (!customerId) return { displayText: "—", customerId: null };
        
        const customer = customersData.find(cust => cust.customer_id === customerId);
        if (customer) {
            return {
                displayText: `${customer.customer_id} - ${customer.username}`,
                customerId: customer.customer_id
            };
        }
        return {
            displayText: customerId,
            customerId: customerId
        };
    };

    // Function to get service engineer name
    const getServiceEngineerName = (engineerId) => {
        if (!engineerId) return "—";
        return getUsernameById(engineerId);
    };

    // Function to get question text by question ID
    const getQuestionText = (questionId) => {
        if (!questionId || questionsData.length === 0) return questionId;
        const question = questionsData.find(q => q.question_id === questionId);
        return question ? question.question_text : questionId;
    };

    // Function to format questions array
    const formatQuestions = (questions) => {
        if (!questions || questions.length === 0) return "—";
        return questions.join(', ');
    };

    // Function to format date-time for detailed timestamps
    const formatDateTime = (dateString) => {
        if (!dateString) return "—";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";
            
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (e) {
            return "Invalid date";
        }
    };

    // Handle entries per page change
    const handleEntriesPerPageChange = (e) => {
        const newSize = Number(e.target.value);
        setEntriesPerPage(newSize);
        setCurrentPage(1);
        sessionStorage.setItem('feedbacks_entriesPerPage', newSize);
        sessionStorage.setItem('feedbacks_currentPage', 1);
    };

    // Handle search change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        sessionStorage.setItem('feedbacks_searchTerm', value);
        sessionStorage.setItem('feedbacks_currentPage', 1);
    };

    // Handle clear search
    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
        sessionStorage.setItem('feedbacks_searchTerm', '');
        sessionStorage.setItem('feedbacks_currentPage', 1);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Function to refresh feedbacks
    const handleRefresh = () => {
        fetchFeedbacks(currentPage, entriesPerPage, searchTerm, false);
    };

    if (loading) {
        return (
            <div className="pm-container mt-4">
                <h2 className="pm-title mb-4">Customer Feedbacks</h2>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading feedbacks...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pm-container mt-4">
                <h2 className="pm-title mb-4">Customer Feedbacks</h2>
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>
            </div>
        );
    }

    // Calculate index for display
    const indexOfFirstEntry = (currentPage - 1) * entriesPerPage;

    return (
        <div className="pm-container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div>
                    <h2 className="pm-title mb-0">Customer Feedbacks</h2>
                    <p className="customer-subtitle mb-0 text-muted">
                        {selectedCompany 
                            ? `Showing feedbacks for selected company`
                            : 'Showing all feedbacks'}
                    </p>
                    <p className="customer-subtitle text-muted mb-0">Manage customer feedbacks</p>
                </div>
                <button 
                    onClick={handleRefresh} 
                    className="btn btn-outline-primary"
                    disabled={fetching}
                >
                    {fetching ? 'Loading...' : 'Refresh Feedbacks'}
                </button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                    Show
                    <select
                        value={entriesPerPage}
                        onChange={handleEntriesPerPageChange}
                        className="form-select form-select-sm w-auto"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    entries
                    <span className="text-muted ms-2">
                        (Total: <strong>{totalCount}</strong> feedbacks)
                    </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search in all columns..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{ minWidth: '250px' }}
                    />
                    {searchTerm && (
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleClearSearch}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Search Results Info */}
            {searchTerm && (
                <div className="alert alert-info mb-3">
                    <strong>Search Results:</strong> Found {totalCount} feedback(s) matching "{searchTerm}"
                </div>
            )}

            <div className="table-responsive mb-4">
                <table className="table">
                    <thead className="service-item-table-header">
                        <tr>
                            <th>S.No</th>
                            <th>Survey ID</th>
                            <th>Responses</th>
                            <th>Suggestions</th>
                            <th>Submitted At</th>
                            <th>Created By</th>
                            <th>Service Request</th>
                            <th>Customer</th>
                            <th>Service Engineer</th>
                            <th>Questions</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fetching ? (
                            <tr>
                                <td colSpan="11" className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 mb-0 text-muted">Loading feedbacks...</p>
                                </td>
                            </tr>
                        ) : feedbacks.length > 0 ? (
                            feedbacks.map((feedback, index) => {
                                const customerDisplay = getCustomerDisplay(feedback.customer);
                                return (
                                    <tr key={feedback.survey_id || index}>
                                        <td>{indexOfFirstEntry + index + 1}</td>
                                        <td>{feedback.survey_id}</td>
                                        <td>
                                            {feedback.responses && feedback.responses.length > 0 ? (
                                                <ul className="list-unstyled mb-0">
                                                    {feedback.responses.map((res, i) => (
                                                        <li key={res.response_id || i}>
                                                            <strong>Q{i + 1}:</strong> {getQuestionText(res.question)}<br />
                                                            <span className="badge bg-success me-2">Rating: {res.rating_response}</span>
                                                            <em className="text-muted">Reason: {res.reason || '-'}</em>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                'No responses'
                                            )}
                                        </td>
                                        <td className="text-truncate" style={{ maxWidth: "200px" }} title={feedback.suggestions}>
                                            {feedback.suggestions || "—"}
                                        </td>
                                        <td>{formatDateTime(feedback.submitted_at)}</td>
                                        <td title={`ID: ${feedback.created_by}`}>
                                            {getUsernameById(feedback.created_by)}
                                        </td>
                                        <td>{feedback.service_request}</td>
                                        <td>
                                            {customerDisplay.displayText !== "—" ? (
                                                <button 
                                                    className="btn btn-link p-0 text-primary text-decoration-underline"
                                                    onClick={() => handleCustomerClick(customerDisplay.customerId)}
                                                    style={{
                                                        color: '#0d6efd',
                                                        textDecoration: 'underline',
                                                        border: 'none',
                                                        background: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: 'inherit',
                                                        padding: '0',
                                                        margin: '0'
                                                    }}
                                                    title="View Customer Details"
                                                >
                                                    {customerDisplay.displayText}
                                                </button>
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td title={`ID: ${feedback.service_engineer}`}>
                                            {getServiceEngineerName(feedback.service_engineer)}
                                        </td>
                                        <td 
                                            className="text-truncate" 
                                            style={{ maxWidth: "200px" }} 
                                            title={formatQuestions(feedback.questions)}
                                        >
                                            {formatQuestions(feedback.questions)}
                                        </td>
                                        <td>{formatDateTime(feedback.created_at)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center py-4">
                                    <div className="text-muted">
                                        <p className="mb-0">
                                            {searchTerm 
                                                ? `No feedbacks found matching "${searchTerm}"`
                                                : "No feedbacks found."}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Dynamic like ErrorLogs */}
            {(totalPages > 1 || hasNextPage || currentPage > 1) && (
                <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>

                        {totalPages > 1 ? (() => {
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
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ));
                        })() : null}

                        <li className={`page-item ${(totalPages ? currentPage === totalPages : !hasNextPage) ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={totalPages ? currentPage === totalPages : !hasNextPage}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
            
            {/* Total count display */}
            {totalCount > 0 && (
                <div className="text-center text-muted mt-2">
                    <small>Showing {feedbacks.length} of {totalCount} feedbacks</small>
                </div>
            )}
        </div>
    );
};

export default CustomerFeedbacks;