import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PMGroupTable = ({
  filteredGroups,
  searchTerm,
  setSearchTerm,
  entriesPerPage,
  setEntriesPerPage,
  currentPage,
  setCurrentPage,
  onDelete,
    onEdit // added
}) => {
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredGroups.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredGroups.length / entriesPerPage);

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
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search PM groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive mb-4">
        <table className="table">
          <thead className="pm-table-header">
            <tr>
              <th>S.No</th>
              <th>PM Group ID</th>
              <th>PM Group Name</th>
              <th>Series</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Created By</th>
              <th>Updated By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((group, index) => (
                <tr key={group.pm_group_id || index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{group.pm_group_id}</td>
                  <td>{group.pm_group_name}</td>
                  <td>{group.series}</td>
                  <td>{formatDate(group.created_at)}</td>
                  <td>{formatDate(group.updated_at)}</td>
                  <td>{group.created_by}</td>
                  <td>{group.updated_by}</td>
                  <td>
                       <FaEdit 
                        className="text-primary me-2" 
                        role="button" 
                        onClick={() => onEdit(group)} // trigger edit
                      />
                    <FaTrash 
                      className="text-danger" 
                      role="button" 
                      onClick={() => onDelete(group.pm_group_id)} 
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No PM groups found.</td>
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
};

export default PMGroupTable;