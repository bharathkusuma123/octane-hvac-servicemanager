import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../AuthContext/AuthContext";
import { useCompany } from "../AuthContext/CompanyContext";
import baseURL from '../ApiUrl/Apiurl';

const CustomerSatisfactionSurvey = () => {
  const { userId } = useContext(AuthContext);
  const { selectedCompany } = useCompany();
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseURL}/customer-surveys/?user_id=${userId}&company_id=${selectedCompany}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSurveyData(data.data);
        console.log("data",data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && selectedCompany) {
      fetchSurveyData();
    }
  }, [userId, selectedCompany]);

  const filteredData = surveyData.filter(item =>
    Object.values(item).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center py-5">Loading survey data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div className="container-fluid my-4">
      <div className="p-4 shadow-sm rounded customer-survey-container">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div>
            <h2 className="mb-0">Customer Satisfaction Surveys</h2>
            <p className="text-muted mb-0">View customer feedback and ratings</p>
          </div>
        </div>

        {/* Controls */}
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
            placeholder="Search surveys..."
            className="form-control w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-responsive mb-4">
          <table className="table">
            <thead className="product-table-header">
              <tr>
                <th>S.No</th>
                <th>Survey ID</th>
                <th>Customer</th>
                <th>Company</th>
                <th>Service Request</th>
                <th>Engineer</th>
                 <th>Question Ratings & Reasons</th> {/* Updated column name */}
                <th>Suggestions</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((survey, idx) => {
                  // Calculate average rating
                //   const avgRating = survey.responses && survey.responses.length > 0 
                //     ? (survey.responses.reduce((sum, response) => sum + parseInt(response.rating_response), 0) / survey.responses.length).toFixed(1)
                //     : 'N/A';

                 return (
  <tr key={survey.survey_id}>
    <td>{indexOfFirstEntry + idx + 1}</td>
    <td>{survey.survey_id}</td>
    <td>{survey.customer}</td>
    <td>{survey.company}</td>
    <td>{survey.service_request}</td>
    <td>{survey.service_engineer}</td>

    <td>
      {survey.responses && survey.responses.length > 0 ? (
        <ul className="list-unstyled mb-0">
          {survey.responses.map((res, i) => (
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

    <td>{survey.suggestions || '-'}</td>
    <td>{formatDate(survey.submitted_at)}</td>
  </tr>
);

                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No surveys found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="pagination-controls d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-primary me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>
            <span className="align-self-center mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary ms-2"
              disabled={currentPage === totalPages || filteredData.length === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSatisfactionSurvey;