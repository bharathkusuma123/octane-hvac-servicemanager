import React from "react";

const ServiceTableContent = ({
  selectedCompany,
  searchTerm,
  setSearchTerm,
  entriesPerPage,
  setEntriesPerPage,
  currentPage,
  setCurrentPage,
  filteredData,
  historyResponse,
  navigate,
  handleAssignClick,
  handleReopenService
}) => {
  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Pagination calculations
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div>
          <h2 className="pm-title">Service Pool Details</h2>
          <p className="pm-subtitle">
            {selectedCompany 
              ? `Showing service requests for ${selectedCompany}`
              : 'Showing all service requests'}
          </p>
          <p className="pm-subtitle">Manage service requests and assignments</p>
        </div>
      </div>

      {/* Search and Entries Per Page */}
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
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-responsive mb-4">
        <table className="table">
          <thead className="new-customer-table-header">
            <tr>
              <th>S.No</th>
              <th>Request ID</th>
              <th>Company</th>
              <th>Request By</th>
            <th>Request Details</th>
              <th>Service Item</th>
              <th>Preferred Date/Time</th>
              <th>Status</th>
              <th>Engineer</th>
              <th>Engineer Status</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => {
                const historyData = historyResponse.data || [];
                const latestAssignment = Array.isArray(historyData) 
                  ? historyData.find(history => history.request === item.request_id)
                  : null;
                const engineerStatus = latestAssignment?.status || "N/A";

                return (
                  <tr key={item.request_id || index}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td>
                      <button 
                        className="btn btn-link p-0" 
                        onClick={() => navigate(`/servicemanager/service-requests/${item.request_id}`)}
                      >
                        {item.request_id}
                      </button>
                    </td>
                    <td>{item.company}</td>
                    <td>{item.requested_by || "N/A"}</td>
                    <td>{item.request_details || "N/A"}</td>
                    <td>{item.service_item}</td>
                    <td>
                      {formatDate(item.preferred_date)} {formatTime(item.preferred_time)}
                    </td>
                    <td>{item.status}</td>
                    <td>{item.assigned_engineer || "N/A"}</td>
                    <td>
                      {engineerStatus === "Pending" && (
                        <span className="badge bg-warning text-dark">Pending</span>
                      )}
                      {engineerStatus === "Accepted" && (
                        <span className="badge bg-success">Accepted</span>
                      )}
                      {engineerStatus === "Declined" && (
                        <span className="badge bg-danger">Rejected</span>
                      )}
                      {engineerStatus === "N/A" && "N/A"}
                    </td>
                    <td>
                      {item.status === "Open" ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleAssignClick(item)}
                        >
                          Assign
                        </button>
                      ) : item.status === "Closed" ? (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleReopenService(item)}
                        >
                          Re-open Service
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-secondary disabled">
                          {item.status === "Reopened" ? "Already Reopened" : "Assign"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center">No service requests found.</td>
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
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default ServiceTableContent;