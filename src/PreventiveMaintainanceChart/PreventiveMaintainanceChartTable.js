import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ChartTable = ({
  currentItems,
  indexOfFirstEntry,
  searchTerm,
  setSearchTerm,
  entriesPerPage,
  setEntriesPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredCharts,
  onDelete,
  onEdit,
  users,
  getUsernameById
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
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
          <strong>Search Results:</strong> Found {filteredCharts.length} chart(s) matching "{searchTerm}"
        </div>
      )}

      <div className="table-responsive mb-4">
        <table className="table ">
          <thead className="pm-chart-table-header">
            <tr>
              <th>S.No</th>
              <th>PM Group</th>
              <th>PM ID</th>
              <th>Description</th>
              <th>Task Type</th>
              <th>Frequency</th>
              <th>Alert</th>
              <th>Responsible</th>
              <th>Remarks</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Created By</th>
              <th>Updated By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((chart, index) => (
                <tr key={chart.chart_id || index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{chart.pm_group}</td>
                  <td>{chart.pm_id}</td>
                  <td>{chart.description}</td>
                  <td>{chart.task_type}</td>
                  <td>{chart.frequency_days}</td>
                  <td>{chart.alert_days}</td>
                  <td>{chart.responsible}</td>
                  <td>{chart.remarks}</td>
                  <td>{formatDate(chart.created_at)}</td>
                  <td>{formatDate(chart.updated_at)}</td>
                  <td>{getUsernameById ? getUsernameById(chart.created_by) : chart.created_by}</td>
                  <td>{getUsernameById ? getUsernameById(chart.updated_by) : chart.updated_by}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <FaEdit
                        className="text-primary"
                        role="button"
                        onClick={() => onEdit(chart)}
                        title="Edit Chart"
                      />
                      <FaTrash 
                        className="text-danger" 
                        role="button" 
                        onClick={() => onDelete(chart.chart_id)}
                        title="Delete Chart"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="text-center">
                  {searchTerm ? `No charts found matching "${searchTerm}"` : 'No charts found.'}
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

export default ChartTable;