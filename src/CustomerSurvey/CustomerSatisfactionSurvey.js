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

    // Function to get service engineer name
    const getServiceEngineerName = (engineerId) => {
        if (!engineerId) return "—";
        if (!customersData || customersData.length === 0) return engineerId;
        
        const engineer = customersData.find(cust => cust.customer_id === engineerId);
        return engineer ? engineer.username : engineerId;
    };

    // Function to format questions array
    const formatQuestions = (questions) => {
        if (!questions || questions.length === 0) return "—";
        return questions.join(', ');
    };

    // Filter feedbacks based on search term
    const filteredFeedbacks = feedbacks.filter((feedback) =>
        Object.values(feedback).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination logic
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentItems = filteredFeedbacks.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredFeedbacks.length / entriesPerPage);

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

    // DateTime formatting function for detailed timestamps
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
                <input
                    type="text"
                    className="form-control w-auto"
                    placeholder="Search feedbacks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

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
                            {/* <th>Updated By</th> */}
                            {/* <th>Company</th> */}
                            <th>Service Request</th>
                            <th>Customer</th>
                            <th>Service Engineer</th>
                            <th>Questions</th>
                            <th>Created At</th>
                            {/* <th>Updated At</th> */}
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
                                                        <strong>Q{i + 1}:</strong> {res.question}<br />
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
                                        {getCreatedUpdatedBy(feedback.created_by)}
                                    </td>
                                    {/* <td title={`ID: ${feedback.updated_by}`}>
                                        {getCreatedUpdatedBy(feedback.updated_by)}
                                    </td> */}
                                    {/* <td title={`ID: ${feedback.company}`}>
                                        {getCompanyName(feedback.company)}
                                    </td> */}
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
                                    {/* <td>{formatDateTime(feedback.updated_at)}</td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" className="text-center">
                                    {searchTerm ? "No matching feedbacks found." : "No feedbacks found."}
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

export default CustomerFeedbacks;