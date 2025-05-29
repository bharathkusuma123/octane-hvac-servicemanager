

import React, { useState, useEffect } from "react";
import "./ServiceItemComponents.css";

const ServiceItemComponents = () => {
  const [showForm, setShowForm] = useState(false);
  const [components, setComponents] = useState([
    // Sample data - replace with your actual data
    {
      component_entry_id: 1,
      service_item_id: 101,
      component_id: "COMP-001",
      component_serial_number: "SN123456",
      warranty_start_date: "2023-01-01",
      warranty_end_date: "2025-01-01",
      vendor_id: "VEND-001",
      created_at: "2023-01-15 10:00:00",
      updated_at: "2023-01-15 10:00:00",
      created_by: "admin",
      updated_by: "admin"
    },
    {
      component_entry_id: 2,
      service_item_id: 102,
      component_id: "COMP-002",
      component_serial_number: "SN789012",
      warranty_start_date: "2023-02-01",
      warranty_end_date: "2025-02-01",
      vendor_id: "VEND-002",
      created_at: "2023-02-15 11:30:00",
      updated_at: "2023-02-15 11:30:00",
      created_by: "admin",
      updated_by: "admin"
    }
  ]);

  const [formData, setFormData] = useState({
    service_item_id: "",
    component_id: "",
    component_serial_number: "",
    warranty_start_date: "",
    warranty_end_date: "",
    vendor_id: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFilteredComponents(components);
  }, [components]);

  useEffect(() => {
    const filtered = components.filter(comp =>
      Object.values(comp).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredComponents(filtered);
    setCurrentPage(1);
  }, [searchTerm, components]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    // Here you would typically call an API to save the data
    // For now, we'll just add it to our local state
    const newComponent = {
      component_entry_id: components.length + 1,
      service_item_id: formData.service_item_id,
      component_id: formData.component_id,
      component_serial_number: formData.component_serial_number,
      warranty_start_date: formData.warranty_start_date,
      warranty_end_date: formData.warranty_end_date,
      vendor_id: formData.vendor_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "current_user", // Replace with actual user
      updated_by: "current_user" // Replace with actual user
    };
    setComponents([...components, newComponent]);
    setShowForm(false);
    setFormData({
      service_item_id: "",
      component_id: "",
      component_serial_number: "",
      warranty_start_date: "",
      warranty_end_date: "",
      vendor_id: ""
    });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      // Reset form when hiding it
      setFormData({
        service_item_id: "",
        component_id: "",
        component_serial_number: "",
        warranty_start_date: "",
        warranty_end_date: "",
        vendor_id: ""
      });
    }
  };

  
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentComponents = filteredComponents.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredComponents.length / entriesPerPage);

  return (
   <div className="svc-form-wrapper container shadow-sm">
      <div className="svc-header mb-4">
        <h2 className="svc-title">Service Item Components</h2>
        <p className="svc-subtitle">
          {showForm ? "Fill in the service item details below" : "Manage service item components"}
        </p>
      </div>

      {!showForm ? (
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

            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={toggleForm}
                className="btn btn-primary svc-btn-save"
              >
                Add Component
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Entry ID</th>
                  <th>Service Item</th>
                  <th>Component ID</th>
                  <th>Serial Number</th>
                  <th>Warranty Start</th>
                  <th>Warranty End</th>
                  <th>Vendor</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {currentComponents.length > 0 ? (
                  currentComponents.map((component, index) => (
                    <tr key={component.component_entry_id}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{component.component_entry_id}</td>
                      <td>{component.service_item_id}</td>
                      <td>{component.component_id}</td>
                      <td>{component.component_serial_number}</td>
                      <td>{component.warranty_start_date}</td>
                      <td>{component.warranty_end_date}</td>
                      <td>{component.vendor_id || "-"}</td>
                      <td>{component.created_by}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No components found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        </>
      ) : (
        <form onSubmit={handleSubmit} className="svc-form">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="svc-label" htmlFor="serviceItem">
                Service Item
              </label>
              <select 
                id="serviceItem" 
                className="form-select svc-input"
                name="service_item_id"
                value={formData.service_item_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Service Item</option>
                <option value="101">Service Item 101</option>
                <option value="102">Service Item 102</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="svc-label" htmlFor="component">
                Component
              </label>
              <select 
                id="component" 
                className="form-select svc-input"
                name="component_id"
                value={formData.component_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Component</option>
                <option value="COMP-001">Component 001</option>
                <option value="COMP-002">Component 002</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="svc-label" htmlFor="serialNumber">
                Component Serial Number
              </label>
              <input
                type="text"
                id="serialNumber"
                className="form-control svc-input"
                name="component_serial_number"
                value={formData.component_serial_number}
                onChange={handleChange}
                placeholder="Enter serial number"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="svc-label" htmlFor="vendor">
                Vendor (optional)
              </label>
              <select 
                id="vendor" 
                className="form-select svc-input"
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleChange}
              >
                <option value="">Select Vendor</option>
                <option value="VEND-001">Vendor 001</option>
                <option value="VEND-002">Vendor 002</option>
              </select>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="svc-label" htmlFor="warrantyStart">
                Warranty Start Date
              </label>
              <input
                type="date"
                id="warrantyStart"
                className="form-control svc-input"
                name="warranty_start_date"
                value={formData.warranty_start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="svc-label" htmlFor="warrantyEnd">
                Warranty End Date
              </label>
              <input
                type="date"
                id="warrantyEnd"
                className="form-control svc-input"
                name="warranty_end_date"
                value={formData.warranty_end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 svc-button-group">
            <button 
              type="button" 
              onClick={toggleForm}
              className="btn btn-outline-secondary svc-btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary svc-btn-save">
              Save Item Component
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ServiceItemComponents;