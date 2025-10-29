import React, { useState, useEffect, useContext } from "react";
import baseURL from '../ApiUrl/Apiurl';
import Swal from 'sweetalert2';
import "./ServiceItemComponents.css";
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ServiceItemComponentsForm = () => { 
  const [serviceItemsOptions, setServiceItemsOptions] = useState([]);
  const [componentOptions, setComponentOptions] = useState([]);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    service_item_id: "",
    component_id: "",
    component_serial_number: "",
    warranty_start_date: "",
    warranty_end_date: "",
    vendor_id: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if we're in edit mode
  const isEditMode = location.state?.service_component_id;
  
  // Get service item from navigation state (for pre-filling when coming from ServiceItem table)
  const serviceItemFromState = location.state?.service_item;

  // Initial fetches
  useEffect(() => {
    fetchServiceItems();
    fetchComponentOptions();
    
    // Pre-fill form if in edit mode or if service item is provided
    if (isEditMode) {
      // Edit mode - fill form with existing data
      setFormData({
        service_item_id: location.state.service_item_id || "",
        component_id: location.state.component_id || "",
        component_serial_number: location.state.component_serial_number || "",
        warranty_start_date: location.state.warranty_start_date || "",
        warranty_end_date: location.state.warranty_end_date || "",
        vendor_id: location.state.vendor_id || "",
      });
    } else if (serviceItemFromState) {
      // Add mode with pre-filled service item
      setFormData(prev => ({
        ...prev,
        service_item_id: serviceItemFromState
      }));
    }
  }, [userId, selectedCompany, isEditMode, location.state, serviceItemFromState]);

  const fetchServiceItems = () => {
    fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${selectedCompany}`)
      .then((res) => res.json())
      .then((data) => data.data && setServiceItemsOptions(data.data))
      .catch(console.error);
  };

  const fetchComponentOptions = () => {
    fetch(`${baseURL}/components/`)
      .then((res) => res.json())
      .then((data) => data.data && setComponentOptions(data.data))
      .catch(console.error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  const now = new Date().toISOString();

  if (isEditMode) {
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
      user_id: userId,
      company_id: selectedCompany,
    };

    try {
      const res = await fetch(
        `${baseURL}/service-item-components/${location.state.service_component_id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.text();
        console.error("❌ Update failed:", errorData);
        throw new Error(`HTTP ${res.status}: ${errorData}`);
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Component updated successfully!",
        confirmButtonColor: "#3085d6",
      }).then(() => navigate("/servicemanager/new-service-item"));
    } catch (err) {
      console.error("🚨 Update Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update component. Check console for details.",
        confirmButtonColor: "#d33",
      });
    }
  } else {
    // ➕ Add (POST)
    const postpayload = {
      service_component_id: `SC-${Date.now()}`,
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

  if (!res.ok) {
    // Try to read error response safely ONCE
    let errorDetails;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      errorDetails = await res.json();
    } else {
      errorDetails = await res.text();
    }

    console.error("❌ API Error Response:", errorDetails);
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(errorDetails)}`);
  }

  Swal.fire({
    icon: "success",
    title: "Success!",
    text: "Component added successfully!",
    confirmButtonColor: "#3085d6",
  }).then(() => navigate("/servicemanager/new-service-item"));
} catch (err) {
  console.error("🚨 POST Error:", err);
  Swal.fire({
    icon: "error",
    title: "Error",
    text: err.message || "Failed to add component. Check console for details.",
    confirmButtonColor: "#d33",
  });
}

  }

  setIsSubmitting(false);
};


  const handleCancel = () => {
    navigate('/servicemanager/new-service-item');
  };

  return (
    <div className="container mt-4 service-request-form">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-1">{isEditMode ? "Edit Item Component" : "Add Item Component"}</h5>
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
                  disabled={!!serviceItemFromState} // Disable if pre-filled from ServiceItem table
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
                {serviceItemFromState && (
                  <small className="text-muted">Service item pre-selected from parent</small>
                )}
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
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Component' : 'Save Component')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceItemComponentsForm;