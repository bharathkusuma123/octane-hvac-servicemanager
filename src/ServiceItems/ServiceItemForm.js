import React, { useEffect, useState } from 'react';
import './NewServiceItem.css';
import baseURL from '../ApiUrl/Apiurl';

const ServiceItemForm = ({ formData, onChange, onSubmit, onCancel, isEditMode }) => {
  const [customers, setCustomers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [pmGroups, setPmGroups] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {

        const response = await fetch(`${baseURL}/customers/`);
        const result = await response.json();

        if (result.status === 'success' && Array.isArray(result.data)) {
          setCustomers(result.data);
        } else {
          console.error('Unexpected API response format:', result);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {

        const response = await fetch(`${baseURL}/products/`);
        const result = await response.json();
        setProducts(result.data);  
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchPmGroups = async () => {
      try {

        const response = await fetch(`${baseURL}/pm-groups/`);
        const result = await response.json();
        if (result.status === 'success' && Array.isArray(result.data)) {
          setPmGroups(result.data);
        } else {
          console.error('Unexpected API response format for PM groups:', result);
        }
      } catch (error) {
        console.error('Error fetching PM groups:', error);
      }
    };

    fetchPmGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const nowISOString = new Date().toISOString();

    const serviceItemData = {
      service_item_id: isEditMode ? formData.service_item_id : `TEMP${Date.now()}`,
      serial_number: formData.serial_number || `TEMP${Date.now()}`,
      location: formData.location,
      location_latitude: parseFloat(formData.location_latitude).toFixed(6),
      location_longitude: parseFloat(formData.location_longitude).toFixed(6),
      installation_date: formData.installation_date,
      warranty_start_date: formData.warranty_start_date,
      warranty_end_date: formData.warranty_end_date,
      contract_end_date: formData.contract_end_date,
      status: formData.status,
      iot_status: formData.iot_status,
      last_checked: nowISOString,
      last_service: formData.last_service
        ? new Date(formData.last_service).toISOString()
        : null,
      product_description: formData.product_description || "",
      bc_number: formData.bc_number || "",
      ship_to_code: formData.ship_to_code || "",
      created_at: isEditMode ? formData.created_at : nowISOString,
      updated_at: nowISOString,
      created_by: isEditMode ? formData.created_by : "Service Manager",
      updated_by: "Service Manager",
      company: null,
      product: formData.product,
      customer: formData.customer,
      pm_group: formData.pm_group,
    };

    console.log('Submitting:', serviceItemData);

const token = localStorage.getItem("authToken");
const url = isEditMode 
  ? `${baseURL}/service-items/${formData.service_item_id}/`
  : `${baseURL}/service-items/`;
const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(serviceItemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error("Failed to submit service item");
      }

      const result = await response.json();
      onSubmit(result.data);
      window.alert(`Service Item ${isEditMode ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4 service-request-form">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-1">{isEditMode ? 'Edit' : 'New'} Service Item Card</h5>
          <h6 className="text" style={{ color: 'white' }}>Fill in the service item details below</h6>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Service S.No. */}
              <div className="col-md-4">
                <label className="form-label">Service S.No.</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="serial_number"
                  value={formData.serial_number || ''}
                  onChange={onChange}
                  placeholder="Enter Service S.No." 
                  required
                />
              </div>

              {/* Product */}
              <div className="col-md-4">
                <label className="form-label">Product</label>
                <select
                  className="form-control"
                  name="product"
                  value={formData.product || ''}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.product_id}
                    </option>
                  ))}
                </select>
              </div>

              {/* PM Group */}
              <div className="col-md-4">
                <label className="form-label">PM Group ID</label>
                <select
                  className="form-control"
                  name="pm_group"
                  value={formData.pm_group || ''}
                  onChange={onChange}
                >
                  <option value="">Select PM Group</option>
                  {pmGroups.map((group) => (
                    <option key={group.pm_group_id} value={group.pm_group_id}>
                      {group.pm_group_id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Description */}
              <div className="col-12">
                <label className="form-label">Product Description</label>
                <textarea 
                  className="form-control" 
                  name="product_description"
                  value={formData.product_description || ''}
                  onChange={onChange}
                  placeholder="Add any notes or description..."
                  rows={3}
                ></textarea>
              </div>

              {/* Customer */}
              <div className="col-md-4">
                <label className="form-label">Customer</label>
                <select
                  className="form-control"
                  name="customer"
                  value={formData.customer || ''}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.customer_id} value={customer.customer_id}>
                      {customer.full_name} ({customer.customer_id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="col-md-4">
                <label className="form-label">Installation Location</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="location"
                  value={formData.location || ''}
                  onChange={onChange}
                  placeholder="Address" 
                  required
                />
              </div>

              {/* Latitude */}
              <div className="col-md-2">
                <label className="form-label">Latitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  className="form-control" 
                  name="location_latitude"
                  value={formData.location_latitude || ''}
                  onChange={onChange}
                  placeholder="e.g. 12.971599" 
                />
              </div>

              {/* Longitude */}
              <div className="col-md-2">
                <label className="form-label">Longitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  className="form-control" 
                  name="location_longitude"
                  value={formData.location_longitude || ''}
                  onChange={onChange}
                  placeholder="e.g. 77.594566" 
                />
              </div>

              {/* Dates */}
              <div className="col-md-4">
                <label className="form-label">Installation Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  name="installation_date"
                  value={formData.installation_date || ''}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Warranty Start Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  name="warranty_start_date"
                  value={formData.warranty_start_date || ''}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Warranty End Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  name="warranty_end_date"
                  value={formData.warranty_end_date || ''}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Contract End Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  name="contract_end_date"
                  value={formData.contract_end_date || ''}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Last Service</label>
                <input 
                  type="date" 
                  className="form-control" 
                  name="last_service"
                  value={formData.last_service || ''}
                  onChange={onChange}
                />
              </div>

              {/* Status */}
              <div className="col-md-4">
                <label className="form-label">Operational Status</label>
                <select 
                  className="form-control"
                  name="status"
                  value={formData.status || ''}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Service Due">Service Due</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">IoT Status</label>
                <select 
                  className="form-control"
                  name="iot_status"
                  value={formData.iot_status || ''}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="d-flex justify-content-center mt-3 gap-3">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : isEditMode ? "Update" : "Submit"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
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

export default ServiceItemForm;