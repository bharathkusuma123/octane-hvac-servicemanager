import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import baseURL from '../ApiUrl/Apiurl';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const ErrorLogs = () => {
  const [errorData, setErrorData] = useState([]);
  const [filteredErrors, setFilteredErrors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);

  // Fetch error logs data
  const fetchErrorLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userId || !selectedCompany) {
        setError('Missing user ID or company ID');
        return;
      }
      
      const response = await axios.get(
        `${baseURL}/errors/all/?user_id=${userId}&company_id=${selectedCompany}`
      );
      
      if (response.data.status === "success") {
        setErrorData(response.data.data);
      } else {
        setError('Failed to load error logs');
      }
    } catch (error) {
      console.error('Error fetching error logs:', error);
      setError('Failed to load error logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorLogs();
  }, [selectedCompany, userId]);

  // Flatten the error data for easier display
  const flattenErrors = () => {
    const flattened = [];
    errorData.forEach(device => {
      device.errors.forEach(error => {
        flattened.push({
          ...error,
          pcb_serial_number: device.pcb_serial_number
        });
      });
    });
    return flattened;
  };

  useEffect(() => {
    let results = flattenErrors();
    
    if (searchTerm) {
      results = results.filter(error =>
        Object.values(error)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        error.pcb_serial_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by timestamp descending (newest first)
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredErrors(results);
    setCurrentPage(1);
  }, [searchTerm, errorData]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredErrors.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredErrors.length / entriesPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      HIGH: 'bg-danger',
      MEDIUM: 'bg-warning text-dark',
      LOW: 'bg-info',
      CRITICAL: 'bg-dark'
    };
    
    return (
      <span className={`badge ${priorityStyles[priority] || 'bg-secondary'}`}>
        {priority}
      </span>
    );
  };

  const getErrorCodeBadge = (errorCode) => {
    return (
      <span className="badge bg-primary">
        Error {errorCode}
      </span>
    );
  };

  if (loading) return <div className="text-center my-4">Loading error logs...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap mt-3">
        <div>
          <h2 className="error-logs-title mb-0">
            <FaExclamationTriangle className="me-2" />
            Error Logs
          </h2>
          <p className="error-logs-subtitle mb-0 text-muted">
            {selectedCompany ? `Showing error logs for selected company` : 'Showing all error logs'}
          </p>
        </div>
        <button onClick={fetchErrorLogs} className="btn btn-outline-primary">
          Refresh Logs
        </button>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body py-2">
              <div className="d-flex align-items-center">
                <FaInfoCircle className="text-primary me-2" />
                <small className="text-muted">
                  Total Errors: <strong>{filteredErrors.length}</strong> | 
                  Showing: {currentEntries.length} of {filteredErrors.length}
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className="form-select form-select-sm w-auto"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              entries
            </div>

            <input
              type="text"
              placeholder="Search error logs..."
              className="form-control w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-responsive mb-4">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>PCB Serial Number</th>
              <th>Error Code</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Original Timestamp</th>
              <th>Logged At</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.length > 0 ? (
              currentEntries.map((error, index) => (
                <tr key={error.id} className={error.priority === 'HIGH' || error.priority === 'CRITICAL' ? 'table-warning' : ''}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>
                    <strong>{error.pcb_serial_number}</strong>
                  </td>
                  <td>{getErrorCodeBadge(error.error_code)}</td>
                  <td>{error.description}</td>
                  <td>{getPriorityBadge(error.priority)}</td>
                  <td>{formatDate(error.original_timestamp)}</td>
                  <td>{formatDate(error.timestamp)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <div className="text-muted">
                    <FaExclamationTriangle className="mb-2" size={24} />
                    <p className="mb-0">
                      {searchTerm 
                        ? 'No error logs found matching your search'
                        : 'No error logs found'}
                    </p>
                  </div>
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

export default ErrorLogs;