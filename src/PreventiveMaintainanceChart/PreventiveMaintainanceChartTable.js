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
  filteredCharts
}) => (
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
      <input
        type="text"
        className="form-control w-auto"
        placeholder="Search charts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

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
              <tr key={index}>
                <td>{indexOfFirstEntry + index + 1}</td>
                <td>{chart.pm_group}</td>
                <td>{chart.pm_id}</td>
                <td>{chart.description}</td>
                <td>{chart.task_type}</td>
                <td>{chart.frequency_days}</td>
                <td>{chart.alert_days}</td>
                <td>{chart.responsible}</td>
                <td>{chart.remarks}</td>
                <td>{new Date(chart.created_at).toLocaleString()}</td>
                <td>{new Date(chart.updated_at).toLocaleString()}</td>
                <td>{chart.created_by}</td>
                <td>{chart.updated_by}</td>
                <td>
                  <FaEdit className="text-primary me-2" role="button" />
                  <FaTrash className="text-danger" role="button" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14" className="text-center">No charts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* {filteredCharts.length > 0 && (
      <div className="pagination-controls d-flex justify-content-center mt-3">
        <button
          className="btn btn-outline-primary me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="align-self-center mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary ms-2"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    )} */}
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
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
  </>
);

export default ChartTable;
