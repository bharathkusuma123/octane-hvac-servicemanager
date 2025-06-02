import React, { useState } from "react";

const CustomerComplaintsTable = () => {
  const dummyComplaints = [
    {
      complaint_id: "CMP001",
      complaint_type: "Service Delay",
      complaint_details: "Technician arrived late.",
      escalation_level: "Level 1",
      service_manager_email: "manager1@example.com",
      gm_email: "gm1@example.com",
      resolution_details: "Technician retrained and reassigned.",
      resolved_at: "2025-06-01T10:15:00.000Z",
      created_by: "admin",
      updated_by: "admin",
      company: "FastDelivery Ltd",
      customer: "John Doe",
      service_order: "ORD1001",
      created_at: "2025-05-30T09:00:00.000Z",
      status: "Resolved",
    },
    {
      complaint_id: "CMP002",
      complaint_type: "Billing Issue",
      complaint_details: "Charged twice for the same service.",
      escalation_level: "Level 2",
      service_manager_email: "manager2@example.com",
      gm_email: "gm2@example.com",
      resolution_details: "",
      resolved_at: "",
      created_by: "user2",
      updated_by: "user2",
      company: "RetailHub",
      customer: "Alice Smith",
      service_order: "ORD1002",
      created_at: "2025-06-01T08:30:00.000Z",
      status: "Open",
    }
    // Add more if needed
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredComplaints = dummyComplaints.filter((complaint) =>
    complaint.complaint_details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredComplaints.length / entriesPerPage);

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
          placeholder="Search complaints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Complaint ID</th>
              <th>Type</th>
              <th>Details</th>
              <th>Escalation</th>
              <th>Service Manager</th>
              <th>GM Email</th>
              <th>Resolution</th>
              <th>Resolved At</th>
              <th>Created By</th>
              <th>Updated By</th>
              <th>Company</th>
              <th>Customer</th>
              <th>Order #</th>
              <th>Created</th>
                <th>Status</th>

            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((complaint, index) => (
                <tr key={complaint.complaint_id || index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{complaint.complaint_id}</td>
                  <td>{complaint.complaint_type}</td>
                  <td className="text-truncate" style={{ maxWidth: "200px" }} title={complaint.complaint_details}>
                    {complaint.complaint_details}
                  </td>
                  <td>{complaint.escalation_level}</td>
                 
                  <td>{complaint.service_manager_email}</td>
                  <td>{complaint.gm_email}</td>
                  <td>{complaint.resolution_details || "—"}</td>
                  <td>{complaint.resolved_at ? new Date(complaint.resolved_at).toLocaleString() : "—"}</td>
                  <td>{complaint.created_by}</td>
                  <td>{complaint.updated_by}</td>
                  <td>{complaint.company}</td>
                  <td>{complaint.customer}</td>
                  <td>{complaint.service_order}</td>
                  <td>{new Date(complaint.created_at).toLocaleString()}</td>
                   <td>
                    <span className={`badge ${
                      complaint.status === 'Open' ? 'bg-warning' :
                      complaint.status === 'In Progress' ? 'bg-info' :
                      complaint.status === 'Resolved' ? 'bg-success' : 'bg-secondary'
                    }`}>
                      {complaint.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16" className="text-center">No complaints found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredComplaints.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-primary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span className="align-self-center mx-2">Page {currentPage} of {totalPages}</span>
          <button
            className="btn btn-outline-primary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default CustomerComplaintsTable;
