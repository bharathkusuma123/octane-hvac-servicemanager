import React, { useState, useEffect } from "react";
import CustomerComplaintsForm from "./CustomerComplaintsForm";
import CustomerComplaintsTable from "./CustomerComplaintsTable";
import { v4 as uuidv4 } from "uuid";

const CustomerComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const companies = ["Company A", "Company B", "Company C"];
  const customers = ["Customer X", "Customer Y", "Customer Z"];

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.complaint_id) {
      // Update existing complaint
      setComplaints((prev) =>
        prev.map((item) =>
          item.complaint_id === formData.complaint_id ? { ...formData } : item
        )
      );
    } else {
      // Create new complaint
      const newComplaint = {
        ...formData,
        complaint_id: uuidv4(),
        created_at: new Date().toISOString(),
      };
      setComplaints((prev) => [newComplaint, ...prev]);
    }

    toggleForm();
  };

  const filteredComplaints = complaints.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredComplaints.length / entriesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  return (
    <div className="pm-container mt-4">
      <h2 className=" pm-title mb-4">Customer Complaints</h2>

      {showForm ? (
        <CustomerComplaintsForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          toggleForm={toggleForm}
          companies={companies}
          customers={customers}
        />
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3">
            {/* <button className="btn btn-primary" onClick={toggleForm}>
              Add New Complaint
            </button> */}
          </div>
          <CustomerComplaintsTable
            currentItems={currentItems}
            indexOfFirstEntry={indexOfFirstEntry}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            filteredComplaints={filteredComplaints}
          />
        </>
      )}
    </div>
  );
};

export default CustomerComplaints;
