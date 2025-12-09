import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEye, FaTrashAlt, FaEdit } from "react-icons/fa";
import baseURL from "../ApiUrl/Apiurl";
import { AuthContext } from "../AuthContext/AuthContext";
import { useCompany } from "../AuthContext/CompanyContext";

const RequestItemHistory = () => {
  const { request_id } = useParams();
  console.log("Request ID from URL:", request_id);
  const { userId } = useContext(AuthContext);
  const { selectedCompany } = useCompany();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Format Functions
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-IN") : "-";

  const formatDateTime = (dateTime) =>
    dateTime
      ? new Date(dateTime).toLocaleString("en-IN", {
          hour12: true,
        })
      : "-";

  // Fetch Data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${baseURL}/service-req-items-history/?user_id=${userId}&company_id=${selectedCompany}`
        );

        const json = await res.json();
        console.log("Fetch Response:", json);

        if (json.status === "success") {
          // match service_request === request_id
          const matched = json.data.filter(
            (item) => item.service_request === request_id
          );

          setItems(matched);
          setFilteredItems(matched);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchHistory();
  }, [request_id, selectedCompany, userId]);

  // Search filter
  useEffect(() => {
    const result = items.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredItems(result);
  }, [searchTerm, items]);

  // Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = filteredItems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

  return (
    <>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap">
        <div>
          <h2 className="customer-title mb-0">Service Request Items History</h2>
          <p className="customer-subtitle mb-0 text-muted">
            Showing history for: <strong>{request_id}</strong>
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          Show
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
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
          placeholder="Search service request items..."
          className="form-control w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="table-responsive mb-4">
        <table className="table">
          <thead className="new-customer-table-header">
            <tr>
              <th>S.No</th>
              <th>SR Item ID</th>
              <th>Service Request</th>
              <th>Component Type</th>
              <th>Component</th>
              <th>Task Type</th>
              <th>Old Serial No</th>
              <th>New Serial No</th>
              <th>Warranty Start</th>
              <th>Warranty End</th>
              <th>Action Taken</th>
              <th>Serviced By</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {currentEntries.length > 0 ? (
              currentEntries.map((item, index) => (
                <tr key={index}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{item.sr_item_id}</td>
                  <td>{item.service_request}</td>
                  <td>{item.component_type}</td>
                  <td>{item.component}</td>
                  <td>{item.task_type}</td>
                  <td>{item.old_comp_serial_no || "-"}</td>
                  <td>{item.new_comp_serial_no || "-"}</td>
                  <td>{formatDate(item.warranty_start_date)}</td>
                  <td>{formatDate(item.warranty_end_date)}</td>
                  <td>{item.action_taken || "-"}</td>
                  <td>{item.serviced_by}</td>
                  <td>{formatDateTime(item.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="text-center">
                  No history found for this service request.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              )
            )}

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
    </>
  );
};

export default RequestItemHistory;
