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




import React, { useState, useEffect, useContext } from "react";
import baseURL from "../ApiUrl/Apiurl";
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';

const CustomerFeedbacks = () => { 
    const { userId } = useContext(AuthContext);
    const { selectedCompany } = useCompany();
    const [feedbacks, setFeedbacks] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const [companiesData, setCompaniesData] = useState([]);
    const [users, setUsers] = useState([]); // To store user data for search
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsData, setQuestionsData] = useState([]); // To store survey questions

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

    // Fetch survey questions data
    const fetchQuestions = async () => {
        try {
            const response = await fetch(`${baseURL}/survey-questions/`);
            if (response.ok) {
                const data = await response.json();
                if (data.status === "success") {
                    setQuestionsData(data.data || []);
                }
            }
        } catch (err) {
            console.error("Error fetching survey questions:", err);
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

    // Fetch feedbacks data
    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            
            if (!userId) {
                throw new Error("User ID not found");
            }
            
            const response = await fetch(
                `${baseURL}/customer-surveys/?user_id=${userId}&company_id=${selectedCompany}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === "success") {
                setFeedbacks(data.data || []);
            } else {
                throw new Error(data.message || "Failed to fetch feedbacks");
            }
        } catch (err) {
            setError(err.message);
            console.error("Error fetching feedbacks:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all data
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                await fetchUsers();
                await fetchQuestions();
                await fetchCompanies();
                await fetchCustomers();
                await fetchFeedbacks();
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

    // Function to get customer search data (both ID, username, and full name)
    const getCustomerSearchData = (customerId) => {
        if (!customerId) return '';
        const customer = customersData.find(cust => cust.customer_id === customerId);
        return customer ? `${customerId} ${customer.username} ${customer.full_name} ${customer.email}` : customerId;
    };

    // Function to get service engineer name
    const getServiceEngineerName = (engineerId) => {
        if (!engineerId) return "—";
        return getUsernameById(engineerId);
    };

    // Function to get service engineer search data
    const getServiceEngineerSearchData = (engineerId) => {
        if (!engineerId) return '';
        return getUserSearchData(engineerId);
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

    // Function to extract all text from responses array
    const extractResponsesText = (responses) => {
        if (!responses || !Array.isArray(responses)) return '';
        
        return responses.map(response => {
            const questionText = getQuestionText(response.question);
            return `${questionText} ${response.rating_response} ${response.reason || ''}`;
        }).join(' ');
    };

    // Enhanced global search functionality
    const filteredFeedbacks = React.useMemo(() => {
        if (!searchTerm.trim()) {
            return feedbacks;
        }

        const searchLower = searchTerm.toLowerCase().trim();
        
        return feedbacks.filter((feedback) => {
            // Get user data for search
            const createdBySearch = getUserSearchData(feedback.created_by);
            const updatedBySearch = getUserSearchData(feedback.updated_by);
            const customerSearch = getCustomerSearchData(feedback.customer);
            const serviceEngineerSearch = getServiceEngineerSearchData(feedback.service_engineer);
            
            // Get company data for search
            const companySearchData = getCompanySearchData(feedback.company);
            
            // Get dates in multiple formats for search
            const submittedDateFormats = formatDateForSearch(feedback.submitted_at);
            const createdDateFormats = formatDateForSearch(feedback.created_at);
            const updatedDateFormats = formatDateForSearch(feedback.updated_at);
            
            // Extract responses text for search
            const responsesText = extractResponsesText(feedback.responses);
            
            // Extract questions text for search
            const questionsText = feedback.questions && Array.isArray(feedback.questions) 
                ? feedback.questions.map(qId => getQuestionText(qId)).join(' ')
                : '';
            
            // Create a comprehensive search string
            const searchableText = [
                // Raw feedback data
                feedback.survey_id || '',
                feedback.suggestions || '',
                feedback.service_request || '',
                feedback.customer || '',
                feedback.service_engineer || '',
                feedback.company || '',
                feedback.created_by || '',
                feedback.updated_by || '',
                feedback.submitted_at || '',
                feedback.created_at || '',
                feedback.updated_at || '',
                feedback.survey_type || '',
                feedback.overall_rating !== undefined ? String(feedback.overall_rating) : '',
                feedback.status || '',
                feedback.is_anonymous !== undefined ? String(feedback.is_anonymous) : '',
                feedback.completion_time || '',
                feedback.feedback_category || '',
                feedback.feedback_source || '',
                feedback.device_type || '',
                feedback.browser_info || '',
                feedback.ip_address || '',
                feedback.location || '',
                feedback.session_id || '',
                
                // Formatted user data for search
                createdBySearch,
                updatedBySearch,
                customerSearch,
                serviceEngineerSearch,
                
                // Formatted company data for search
                companySearchData,
                
                // Responses text
                responsesText,
                
                // Questions text
                questionsText,
                
                // Dates in multiple formats
                submittedDateFormats,
                createdDateFormats,
                updatedDateFormats,
                
                // Display values (exactly as shown in table)
                formatDateTime(feedback.submitted_at),
                formatDateTime(feedback.created_at),
                formatDateTime(feedback.updated_at),
                getUsernameById(feedback.created_by),
                getUsernameById(feedback.updated_by),
                getCustomerUsername(feedback.customer),
                getServiceEngineerName(feedback.service_engineer),
                getCompanyName(feedback.company),
                formatQuestions(feedback.questions),
                
                // Rating variations for search
                feedback.overall_rating === 5 ? '5 five excellent outstanding perfect' : '',
                feedback.overall_rating === 4 ? '4 four good great satisfied' : '',
                feedback.overall_rating === 3 ? '3 three average okay neutral' : '',
                feedback.overall_rating === 2 ? '2 two poor bad dissatisfied' : '',
                feedback.overall_rating === 1 ? '1 one terrible awful horrible' : '',
                
                // Status variations
                feedback.status === 'Submitted' ? 'Submitted submitted completed done' : '',
                feedback.status === 'Draft' ? 'Draft draft incomplete pending' : '',
                feedback.status === 'Deleted' ? 'Deleted deleted removed' : '',
                feedback.status === 'Archived' ? 'Archived archived stored' : '',
                
                // Survey type variations
                feedback.survey_type === 'Post-Service' ? 'Post-Service after service completed' : '',
                feedback.survey_type === 'General Feedback' ? 'General Feedback general overall' : '',
                feedback.survey_type === 'Product Feedback' ? 'Product Feedback product item' : '',
                feedback.survey_type === 'Service Feedback' ? 'Service Feedback service support' : '',
                
                // Feedback category variations
                feedback.feedback_category === 'Positive' ? 'Positive positive good excellent happy' : '',
                feedback.feedback_category === 'Negative' ? 'Negative negative bad poor unhappy' : '',
                feedback.feedback_category === 'Neutral' ? 'Neutral neutral average okay' : '',
                feedback.feedback_category === 'Suggestive' ? 'Suggestive suggestion suggestion improve' : '',
                
                // Anonymous variations
                feedback.is_anonymous === true ? 'anonymous anonymous hidden nameless' : '',
                feedback.is_anonymous === false ? 'named identified known' : '',
                
                // Suggestions variations
                feedback.suggestions ? `suggestions ${feedback.suggestions}` : '',
                
                // Service request variations
                feedback.service_request ? `service request ${feedback.service_request}` : '',
                
                // Add any other properties that might exist
                ...Object.values(feedback).filter(val => 
                    val !== null && val !== undefined
                ).map(val => {
                    if (typeof val === 'string' || typeof val === 'number') {
                        return String(val);
                    }
                    if (typeof val === 'boolean') {
                        return val ? 'true yes active' : 'false no inactive';
                    }
                    if (Array.isArray(val)) {
                        if (typeof val[0] === 'object') {
                            // Handle responses array of objects
                            return JSON.stringify(val);
                        }
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
    }, [searchTerm, feedbacks, users, companiesData, customersData, questionsData]);

    // Pagination logic
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentItems = filteredFeedbacks.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredFeedbacks.length / entriesPerPage);

    // Reset to first page when search term or entries per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, entriesPerPage]);

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

    return (
        <div className="pm-container mt-4">
            <h2 className="pm-title mb-4">Customer Feedbacks</h2>

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
                    <strong>Search Results:</strong> Found {filteredFeedbacks.length} feedback(s) matching "{searchTerm}"
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
                        {currentItems.length > 0 ? (
                            currentItems.map((feedback, index) => (
                                <tr key={feedback.survey_id || index}>
                                    <td>{indexOfFirstEntry + index + 1}</td>
                                    <td>{feedback.survey_id}</td>
                                    <td>
                                        {feedback.responses && feedback.responses.length > 0 ? (
                                            <ul className="list-unstyled mb-0">
                                                {feedback.responses.map((res, i) => (
                                                    <li key={res.response_id}>
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
                                    <td title={`ID: ${feedback.customer}`}>
                                        {getCustomerUsername(feedback.customer)}
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center">
                                    {searchTerm 
                                        ? `No feedbacks found matching "${searchTerm}"`
                                        : "No feedbacks found."}
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

export default CustomerFeedbacks;