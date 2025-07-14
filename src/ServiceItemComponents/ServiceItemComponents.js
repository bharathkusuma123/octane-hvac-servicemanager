
import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import baseURL from '../ApiUrl/Apiurl';
import Swal from 'sweetalert2';
import "./ServiceItemComponents.css";
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';

const ServiceItemComponents = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [components, setComponents] = useState([]);
  const [serviceItemsOptions, setServiceItemsOptions] = useState([]);
  const [componentOptions, setComponentOptions] = useState([]);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);
  console.log("User ID from context:", userId);
  console.log("Selected Company from context:", selectedCompany);
  const [formData, setFormData] = useState({
    service_item_id: "",
    component_id: "",
    component_serial_number: "",
    warranty_start_date: "",
    warranty_end_date: "",
    vendor_id: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  

  // Initial fetches
  useEffect(() => {
   fetch(`${baseURL}/service-item-components/?user_id=${userId}&company_id=${selectedCompany}`)
      .then((res) => res.json())
      .then((data) => data.data && setComponents(data.data))
      .catch(console.error);

  fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${selectedCompany}`)
        .then((res) => res.json())
      .then((data) => data.data && setServiceItemsOptions(data.data))
      .catch(console.error);

       fetch(`${baseURL}/components/`)
      .then((res) => res.json())
      .then((data) => data.data && setComponentOptions(data.data))
      .catch(console.error);
  }, []);

  // Filtering effect
  useEffect(() => {
    const filtered = components.filter((comp) =>
      Object.values(comp).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredComponents(filtered);
    setCurrentPage(1);
  }, [searchTerm, components]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentComponents = filteredComponents.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredComponents.length / entriesPerPage);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setEditingId(null);
      setFormData({
        service_item_id: "",
        component_id: "",
        component_serial_number: "",
        warranty_start_date: "",
        warranty_end_date: "",
        vendor_id: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (comp) => {
    setEditingId(comp.service_component_id);
    setFormData({
      service_item_id: comp.service_item,
      component_id: comp.component,
      component_serial_number: comp.component_serial_number,
      warranty_start_date: comp.warranty_start_date,
      warranty_end_date: comp.warranty_end_date,
      vendor_id: comp.vendor_id || "",
    });
    setShowForm(true);
  };

  const deleteComponent = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${baseURL}/service-item-components/${id}/`, { 
            method: "DELETE" 
          });
          
          if (!res.ok) throw new Error(await res.text());
          
          setComponents((prev) => prev.filter((c) => c.service_component_id !== id));
          
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The component has been deleted.',
            confirmButtonColor: '#3085d6',
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Delete failed',
            confirmButtonColor: '#d33',
          });
        }
      }
    });
  };
   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const now = new Date().toISOString();

    if (editingId) {
      // ✏️ Update
      const payload = {
        component_serial_number: formData.component_serial_number,
        warranty_start_date: formData.warranty_start_date,
        warranty_end_date: formData.warranty_end_date,
        vendor_id: formData.vendor_id || "N/A",
        updated_at: now,
        updated_by: "service manager",
        service_item: formData.service_item_id,
        component: formData.component_id,
      };
      
      try {
        const res = await fetch(`${baseURL}/service-item-components/${editingId}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!res.ok) throw new Error(await res.text());
        
        setComponents((prev) =>
          prev.map((c) => (c.service_component_id === editingId ? { ...c, ...payload } : c))
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Component updated successfully!',
          confirmButtonColor: '#3085d6',
        }).then(toggleForm);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Update failed',
          confirmButtonColor: '#d33',
        });
      }
    } else {
      // ➕ Add
      const postpayload = {
        service_component_id: `SC-${Date.now()}`,
        // component_type: "Component",
        component_serial_number: formData.component_serial_number,
        warranty_start_date: formData.warranty_start_date,
        warranty_end_date: formData.warranty_end_date,
        vendor_id: formData.vendor_id || "N/A",
        created_at: now,
        updated_at: now,
        created_by: "service manager",
        updated_by: "service manager",
        service_item: formData.service_item_id,
        component: formData.component_id,
        company: selectedCompany,
        user_id: userId,
        company_id: selectedCompany,
      };
      
      try {
        const res = await fetch(`${baseURL}/service-item-components/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postpayload),
        });
        
        if (!res.ok) throw new Error(await res.json().then((d) => JSON.stringify(d)));
        
        setComponents((prev) => [postpayload, ...prev]);
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Component added successfully!',
          confirmButtonColor: '#3085d6',
        }).then(toggleForm);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.message,
          confirmButtonColor: '#d33',
        });
      }
    }
    setIsSubmitting(false);
  };


   // Add this date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="svc-form-wrapper  shadow-sm">
      {!showForm && (
        <div className="svc-header mb-4 d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div>
            <h2 className="svc-title">Service Item Components</h2>
            <p className="svc-subtitle">Manage service item components</p>
          </div>
          <button onClick={toggleForm} className="btn btn-primary svc-btn-save">
            {editingId ? "Cancel Edit" : "Add Component"}
          </button>
        </div>
      )}

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
            </div>
          </div>

          <div className="table-responsive mb-4">
            <table className="table">
              <thead className="service-component-table-header">
                <tr>
                  <th>S.No</th>
                  <th>ID</th>
                  <th>Service Item</th>
                  <th>Component ID</th>
                  <th>Serial Number</th>
                  <th>Warranty Start</th>
                  <th>Warranty End</th>
                  <th>Vendor</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentComponents.length > 0 ? (
                  currentComponents.map((comp, idx) => (
                    <tr key={comp.service_component_id}>
                      <td>{indexOfFirstEntry + idx + 1}</td>
                      <td>{comp.service_component_id}</td>
                      <td>{comp.service_item}</td>
                      <td>{comp.component}</td>
                      <td>{comp.component_serial_number}</td>
                 <td>{formatDate(comp.warranty_start_date)}</td>
                  <td>{formatDate(comp.warranty_end_date)}</td>
                      <td>{comp.vendor_id || "-"}</td>
                      <td>{comp.created_by}</td>
                      {/* <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => startEdit(comp)}
                          title="Edit"
                        >

                          
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteComponent(comp.service_component_id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td> */}
                       <td>
                                            <FaEdit
                      
                                            
                                              style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
                                                onClick={() => startEdit(comp)}
                                            />
                                            <FaTrash
                                              style={{ cursor: 'pointer', color: 'red' }}
                                              onClick={() => deleteComponent(comp.service_component_id)}
                                            />
                                          </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No components found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                  <button className="page-link" onClick={() => setCurrentPage((p) => p - 1)}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${currentPage === page && "active"}`}>
                    <button className="page-link" onClick={() => setCurrentPage(page)}>
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                  <button className="page-link" onClick={() => setCurrentPage((p) => p + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        <div className="container mt-4 service-request-form">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-1">{editingId ? "Edit Item Component" : "Add Item Component"}</h5>
              <h6 className="text" style={{ color: "white" }}>
                Fill in component details below
              </h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                 
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="service_item_id" className="form-label">
                  Service Item
                </label>
                <select
                  id="service_item_id"
                  name="service_item_id"
                  className="form-select"
                  value={formData.service_item_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Service Item</option>
                  {serviceItemsOptions.map((item) => (
                    <option
                      key={item.service_item_id}
                      value={item.service_item_id}
                    >
                      {item.service_item_id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label htmlFor="component_id" className="form-label">
                  Component
                </label>
                <select
                  id="component_id"
                  name="component_id"
                  className="form-select"
                  value={formData.component_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Component</option>
                  {componentOptions.map((comp) => (
                    <option
                      key={comp.component_id}
                      value={comp.component_id}
                    >
                      {comp.component_id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label htmlFor="component_serial_number" className="form-label">
                  Component Serial Number
                </label>
                <input
                  type="text"
                  id="component_serial_number"
                  name="component_serial_number"
                  className="form-control"
                  value={formData.component_serial_number}
                  onChange={handleChange}
                  placeholder="Enter serial number"
                  required
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="vendor_id" className="form-label">
                  Vendor (optional)
                </label>
                <select
                  id="vendor_id"
                  name="vendor_id"
                  className="form-select"
                  value={formData.vendor_id}
                  onChange={handleChange}
                >
                  <option value="">Select Vendor</option>
                  <option value="vendor1">Vendor 1</option>
                  <option value="vendor2">Vendor 2</option>
                </select>
              </div>

              <div className="col-md-4">
                <label htmlFor="warranty_start_date" className="form-label">
                  Warranty Start Date
                </label>
                <input
                  type="date"
                  id="warranty_start_date"
                  name="warranty_start_date"
                  className="form-control"
                  value={formData.warranty_start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="warranty_end_date" className="form-label">
                  Warranty End Date
                </label>
                <input
                  type="date"
                  id="warranty_end_date"
                  name="warranty_end_date"
                  className="form-control"
                  value={formData.warranty_end_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-center mt-3 gap-3">
                  <button
        type="submit"
        className="submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Item Component'}
      </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleForm}
                >
                  Cancel
                </button>
              </div>
             </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceItemComponents;