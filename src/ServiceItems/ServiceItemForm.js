// import React, { useEffect, useState } from 'react';
// import './NewServiceItem.css';
// import baseURL from '../ApiUrl/Apiurl';
// import { useCompany } from "../AuthContext/CompanyContext";
// import Swal from 'sweetalert2'; 
// const ServiceItemForm = ({ formData, onChange, onSubmit, onCancel, isEditMode, userId }) => {
//   const [customers, setCustomers] = useState([]);
//   const { selectedCompany } = useCompany();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [pmGroups, setPmGroups] = useState([]);
  
//   const generatePCBSerialNumber = () => {
//   const timestamp = Date.now(); // Unique millisecond time
//   const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3-digit random number
//   return `pcb-${timestamp}${random}`;
// };
 


//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {

//         const response = await fetch(`${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`); 
//         const result = await response.json();

//         if (result.status === 'success' && Array.isArray(result.data)) {
//           setCustomers(result.data);
//         } else {
//           console.error('Unexpected API response format:', result);
//         }
//       } catch (error) {
//         console.error('Error fetching customers:', error);
//       }
//     };

//     fetchCustomers();
//   }, [userId, selectedCompany]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {

//         const response = await fetch(`${baseURL}/products/`);
//         const result = await response.json();
//         setProducts(result.data);  
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const fetchPmGroups = async () => {
//       try {

//         const response = await fetch(`${baseURL}/pm-groups/`);
//         const result = await response.json();
//         if (result.status === 'success' && Array.isArray(result.data)) {
//           setPmGroups(result.data);
//         } else {
//           console.error('Unexpected API response format for PM groups:', result);
//         }
//       } catch (error) {
//         console.error('Error fetching PM groups:', error);
//       }
//     };

//     fetchPmGroups();
//   }, []);

//    const handleCustomerChange = (e) => {
//     const { name, value } = e.target;
    
//     // Find the selected customer
//     const selectedCustomer = customers.find(c => c.customer_id === value);
    
//     // Update the form data
//     onChange(e);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     const nowISOString = new Date().toISOString();

//     const serviceItemData = {
//       service_item_id: isEditMode ? formData.service_item_id : `TEMP${Date.now()}`,
//       serial_number: formData.serial_number || `TEMP${Date.now()}`,
//       location: formData.location,
//       location_latitude: parseFloat(formData.location_latitude).toFixed(6),
//       location_longitude: parseFloat(formData.location_longitude).toFixed(6),
//       installation_date: formData.installation_date,
//       warranty_start_date: formData.warranty_start_date,
//       warranty_end_date: formData.warranty_end_date,
//       contract_end_date: formData.contract_end_date,
//       status: formData.status,
//       iot_status: formData.iot_status,
//       last_checked: nowISOString,
//       last_service: formData.last_service
//         ? new Date(formData.last_service).toISOString()
//         : null,
//       product_description: formData.product_description || "",
//       bc_number: formData.bc_number || "",
//       ship_to_code: formData.ship_to_code || "",
//       created_at: isEditMode ? formData.created_at : nowISOString,
//       updated_at: nowISOString,
//       created_by: isEditMode ? formData.created_by : "Service Manager",
//       updated_by: "Service Manager",
//        company: selectedCompany, // Use the selected company here
//       product: formData.product,
//       customer: formData.customer,
//       pm_group: formData.pm_group,
//       user_id: userId, // Include user ID for tracking
//       company_id: selectedCompany, // Include company ID for tracking
//       // pcb_serial_number: generatePCBSerialNumber(),
//       pcb_serial_number: formData.pcb_serial_number || generatePCBSerialNumber(),
//       service_item_name: formData.service_item_name || 'somename'
//     };

//     console.log('Submitting:', serviceItemData);

// const token = localStorage.getItem("authToken");
// const url = isEditMode 
//   ? `${baseURL}/service-items/${formData.service_item_id}/`
//   : `${baseURL}/service-items/`;
// const method = isEditMode ? "PUT" : "POST";

//     try {
//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//           ...(token && { Authorization: `Bearer ${token}` }),
//         },
//         body: JSON.stringify(serviceItemData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Server error:", errorData);
//         throw new Error("Failed to submit service item");
//       }

//       const result = await response.json();
//       onSubmit(result.data);
//      // ✅ Success alert
//       Swal.fire({
//         icon: "success",
//         title: isEditMode ? "Updated!" : "Added!",
//         text: `Service Item ${isEditMode ? "updated" : "added"} successfully!`,
//       });
//     } catch (err) {
//       setError(err.message);
//       Swal.fire({
//         icon: "error",
//         title: "Submission Failed",
//         text: err.message || "Something went wrong while submitting.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container mt-4 service-request-form">
//       <div className="card">
//         <div className="card-header">
//           <h5 className="mb-1">{isEditMode ? 'Edit' : 'New'} Service Item Card</h5>
//           <h6 className="text" style={{ color: 'white' }}>Fill in the service item details below</h6>
//         </div>
//         <div className="card-body">
//           {error && <div className="alert alert-danger">{error}</div>}

//           <form onSubmit={handleSubmit}>
//             <div className="row g-3">
//               {/* Service S.No. */}
//               <div className="col-md-4">
//                 <label className="form-label">Service S.No.</label>
//                 <input 
//                   type="text" 
//                   className="form-control" 
//                   name="serial_number"
//                   value={formData.serial_number || ''}
//                   onChange={onChange}
//                   placeholder="Enter Service S.No." 
//                   required
//                 />
//               </div>

//                <div className="col-md-4">
//                 <label className="form-label">PCB Serial Number</label>
//                 <input 
//                   type="text" 
//                   className="form-control" 
//                   name="pcb_serial_number"
//                   value={formData.pcb_serial_number || ''}
//                   onChange={onChange}
//                   placeholder="Enter PCB Serial Number" 
//                   required
//                 />
//               </div>

//                <div className="col-md-4">
//                 <label className="form-label">Service Item Name</label>
//                 <input 
//                   type="text" 
//                   className="form-control" 
//                   name="service_item_name"
//                   value={formData.service_item_name || ''}
//                   onChange={onChange}
//                   placeholder="Enter Service Name" 
//                   required
//                 />
//               </div>

//               {/* Product */}
//               <div className="col-md-4">
//                 <label className="form-label">Product</label>
//                 <select
//                   className="form-control"
//                   name="product"
//                   value={formData.product || ''}
//                   onChange={onChange}
//                   required
//                 >
//                   <option value="">Select Product</option>
//                   {products.map((product) => (
//                     <option key={product.product_id} value={product.product_id}>
//                       {product.product_id}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* PM Group */}
//               <div className="col-md-4">
//                 <label className="form-label">PM Group ID</label>
//                 <select
//                   className="form-control"
//                   name="pm_group"
//                   value={formData.pm_group || ''}
//                   onChange={onChange}
//                 >
//                   <option value="">Select PM Group</option>
//                   {pmGroups.map((group) => (
//                     <option key={group.pm_group_id} value={group.pm_group_id}>
//                       {group.pm_group_id}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Product Description */}
//               <div className="col-12">
//                 <label className="form-label">Product Description</label>
//                 <textarea 
//                   className="form-control" 
//                   name="product_description"
//                   value={formData.product_description || ''}
//                   onChange={onChange}
//                   placeholder="Add any notes or description..."
//                   rows={3}
//                 ></textarea>
//               </div>

//               {/* Customer */}
//               <div className="col-md-4">
//                 <label className="form-label">Customer</label>
//                 <select
//                   className="form-control"
//                   name="customer"
//                   value={formData.customer || ''}
//                   onChange={handleCustomerChange}
//                   required
//                 >
//                   <option value="">Select Customer</option>
//                   {customers.map(customer => (
//                     <option key={customer.customer_id} value={customer.customer_id}>
//                       {customer.full_name} ({customer.customer_id})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Location */}
//               <div className="col-md-4">
//                 <label className="form-label">Installation Location</label>
//                 <input 
//                   type="text" 
//                   className="form-control" 
//                   name="location"
//                   value={formData.location || ''}
//                   onChange={onChange}
//                   placeholder="Address" 
//                   required
//                 />
//               </div>

//               {/* Latitude */}
//               <div className="col-md-2">
//                 <label className="form-label">Latitude</label>
//                 <input 
//                   type="number" 
//                   step="0.000001"
//                   className="form-control" 
//                   name="location_latitude"
//                   value={formData.location_latitude || ''}
//                   onChange={onChange}
//                   placeholder="e.g. 12.971599" 
//                 />
//               </div>

//               {/* Longitude */}
//               <div className="col-md-2">
//                 <label className="form-label">Longitude</label>
//                 <input 
//                   type="number" 
//                   step="0.000001"
//                   className="form-control" 
//                   name="location_longitude"
//                   value={formData.location_longitude || ''}
//                   onChange={onChange}
//                   placeholder="e.g. 77.594566" 
//                 />
//               </div>

//               {/* Dates */}
//               <div className="col-md-4">
//                 <label className="form-label">Installation Date</label>
//                 <input 
//                   type="date" 
//                   className="form-control" 
//                   name="installation_date"
//                   value={formData.installation_date || ''}
//                   onChange={onChange}
//                   required
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Warranty Start Date</label>
//                 <input 
//                   type="date" 
//                   className="form-control" 
//                   name="warranty_start_date"
//                   value={formData.warranty_start_date || ''}
//                   onChange={onChange}
//                   required
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Warranty End Date</label>
//                 <input 
//                   type="date" 
//                   className="form-control" 
//                   name="warranty_end_date"
//                   value={formData.warranty_end_date || ''}
//                   onChange={onChange}
//                   required
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Contract End Date</label>
//                 <input 
//                   type="date" 
//                   className="form-control" 
//                   name="contract_end_date"
//                   value={formData.contract_end_date || ''}
//                   onChange={onChange}
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">Last Service</label>
//                 <input 
//                   type="date" 
//                   className="form-control" 
//                   name="last_service"
//                   value={formData.last_service || ''}
//                   onChange={onChange}
//                 />
//               </div>

//               {/* Status */}
//               <div className="col-md-4">
//                 <label className="form-label">Operational Status</label>
//                 <select 
//                   className="form-control"
//                   name="status"
//                   value={formData.status || ''}
//                   onChange={onChange}
//                   required
//                 >
//                   <option value="">Select Status</option>
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                   <option value="Service Due">Service Due</option>
//                 </select>
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label">IoT Status</label>
//                 <select 
//                   className="form-control"
//                   name="iot_status"
//                   value={formData.iot_status || ''}
//                   onChange={onChange}
//                   required
//                 >
//                   <option value="">Select Status</option>
//                   <option value="Online">Online</option>
//                   <option value="Offline">Offline</option>
//                 </select>
//               </div>

//               {/* Submit and Cancel Buttons */}
//               <div className="d-flex justify-content-center mt-3 gap-3">
//                 <button type="submit" className="submit-btn" disabled={isSubmitting}>
//                   {isSubmitting ? "Submitting..." : isEditMode ? "Update" : "Submit"}
//                 </button>
//                 <button type="button" className="btn btn-secondary" onClick={onCancel}>
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServiceItemForm;


import React, { useEffect, useState } from 'react';
import './NewServiceItem.css';
import baseURL from '../ApiUrl/Apiurl';
import { useCompany } from "../AuthContext/CompanyContext";
import Swal from 'sweetalert2';
import Select from "react-select";

const ServiceItemForm = ({ formData, onChange, onSubmit, onCancel, isEditMode, userId }) => {
  const [customers, setCustomers] = useState([]);
  const { selectedCompany } = useCompany();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [pmGroups, setPmGroups] = useState([]);
  const [components, setComponents] = useState([]);
  const [availableComponents, setAvailableComponents] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [addComponents, setAddComponents] = useState(false);
  const [componentOption, setComponentOption] = useState('');
 
  const generatePCBSerialNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `pcb-${timestamp}${random}`;
  };
 
  const generateComponentId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CMP${timestamp}${random}`;
  };
 
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`);
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
  }, [userId, selectedCompany]);
 
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
 
  useEffect(() => {
    const fetchAvailableComponents = async () => {
      try {
        const response = await fetch(`${baseURL}/components/`);
        const result = await response.json();
        if (result.status === 'success' && Array.isArray(result.data)) {
          setAvailableComponents(result.data);
        } else {
          console.error('Unexpected API response format for components:', result);
        }
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    };
 
    if (addComponents) {
      fetchAvailableComponents();
      setComponents([]);
    } else {
      setComponents([]);
    }
  }, [addComponents]);
 
  useEffect(() => {
    setAddComponents(componentOption === 'yes');
  }, [componentOption]);
 
  const handleCustomerChange = (e) => {
    onChange(e);
  };
 
  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...components];
    updatedComponents[index] = { ...updatedComponents[index], [field]: value };
    setComponents(updatedComponents);
  };
 
  const addNewComponent = () => {
    setComponents([
      ...components,
      {
        service_component_id: generateComponentId(),
        component: "",
        component_serial_number: "",
        warranty_start_date: "",
        warranty_end_date: "",
        vendor_id: "",
        company: selectedCompany,
        created_by: "Service Manager",
        updated_by: "Service Manager"
      }
    ]);
  };
 
  const removeComponent = (index) => {
    setComponents(components.filter((_, i) => i !== index));
  };
 
  // ✅ FIX: Safe date formatter — keeps YYYY-MM-DD as-is without UTC shift
  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    // If already in YYYY-MM-DD format, return as-is (no UTC conversion)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    // If it's a full ISO string, extract just the date part
    try {
      return new Date(dateString).toISOString();
    } catch {
      return null;
    }
  };
 
  // ✅ FIX: Safe latitude/longitude parser — returns number or null (not string)
  const parseCoordinate = (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    // ✅ Confirmation for Edit Mode
    if (isEditMode) {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to update this Service Item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Update",
        cancelButtonText: "Cancel",
      });
      if (!confirmResult.isConfirmed) return;
    }
 
    setIsSubmitting(true);
    setError(null);
 
    const nowISOString = new Date().toISOString();
 
    // ✅ FIX: Coordinates are numbers (or null), NOT strings
    const latitude = parseCoordinate(formData.location_latitude);
    const longitude = parseCoordinate(formData.location_longitude);
 
    // ✅ FIX: Capture service_item_id at submit time so it can't be lost
    const serviceItemId = formData.service_item_id;
 
    const serviceItemData = {
      // ✅ FIX: Only include service_item_id in POST (create), not in PUT (update)
      // Many REST APIs reject ID in the PUT body — it's in the URL already
      ...(isEditMode ? {} : { service_item_id: serviceItemId }),
 
      serial_number: formData.serial_number || `TEMP${Date.now()}`,
      location: formData.location,
 
      // ✅ FIX: Send as number or null — not as a string from .toFixed()
      location_latitude: latitude,
      location_longitude: longitude,
 
      // ✅ FIX: Date fields stay as YYYY-MM-DD — no UTC ISO conversion that shifts the day
      installation_date: formData.installation_date || null,
      warranty_start_date: formData.warranty_start_date || null,
      warranty_end_date: formData.warranty_end_date || null,
      contract_end_date: formData.contract_end_date || null,
 
      status: formData.status,
      iot_status: formData.iot_status,
 
      last_checked: nowISOString,
 
      // ✅ FIX: last_service stays as YYYY-MM-DD too — no toISOString() shift
      last_service: formData.last_service || null,
 
      product_description: formData.product_description || "",
      bc_number: formData.bc_number || "",
      ship_to_code: formData.ship_to_code || "",
 
      created_at: isEditMode ? formData.created_at : nowISOString,
      updated_at: nowISOString,
 
      created_by: isEditMode ? formData.created_by : "Service Manager",
      updated_by: "Service Manager",
 
      company: selectedCompany,
      product: formData.product,
      customer: formData.customer,
      pm_group: formData.pm_group || null,
 
      user_id: userId,
      company_id: selectedCompany,
 
      pcb_serial_number: formData.pcb_serial_number || generatePCBSerialNumber(),
      service_item_name: formData.service_item_name || "somename",
    };
 
    // ✅ Add components only on create (POST), not on edit (PUT)
    if (!isEditMode && addComponents && components.length > 0) {
      serviceItemData.components = components.map((component) => ({
        ...component,
        service_item: serviceItemId,
        warranty_start_date: component.warranty_start_date || formData.warranty_start_date,
        warranty_end_date: component.warranty_end_date || formData.warranty_end_date,
      }));
    }
 
    console.log("Submitting payload:", JSON.stringify(serviceItemData, null, 2));
    console.log("Mode:", isEditMode ? "PUT (edit)" : "POST (create)");
    console.log("URL:", isEditMode
      ? `${baseURL}/service-items/${serviceItemId}/`
      : `${baseURL}/service-items/`
    );
 
    const token = localStorage.getItem("authToken");
 
    // ✅ FIX: Explicitly use the captured serviceItemId — not from formData which may drift
    const url = isEditMode
      ? `${baseURL}/service-items/${serviceItemId}/`
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
 
      const data = await response.json();
      console.log("API response:", data);
 
      if (!response.ok) {
        console.error("Server error response:", data);
 
        let errorHtml = "";
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            const msgs = Array.isArray(messages) ? messages : [messages];
            msgs.forEach((msg) => {
              errorHtml += `• <b>${field}</b>: ${msg}<br>`;
            });
          });
        }
 
        throw new Error(
          errorHtml || data.message || data.detail || `Failed to ${isEditMode ? "update" : "submit"} service item`
        );
      }
 
      // ✅ SUCCESS
      // ✅ FIX: Some APIs return the object directly, others wrap in data.data — handle both
      const updatedItem = data.data || data;
      onSubmit(updatedItem);
 
      Swal.fire({
        icon: "success",
        title: isEditMode ? "Updated!" : "Added!",
        text: `Service Item ${isEditMode ? "updated" : "added"} successfully!`,
      });
 
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
 
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        html: err.message || "Something went wrong while submitting.",
      });
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
          {error && <div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: error }} />}
 
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
 
              {/* Service Item ID - only shown in create mode */}
              {!isEditMode && (
                <div className="col-md-4">
                  <label className="form-label">Service Item ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="service_item_id"
                    value={formData.service_item_id || ''}
                    onChange={onChange}
                    placeholder="e.g. SER00001"
                    required
                  />
                </div>
              )}
 
              {/* ✅ FIX: Show service_item_id as read-only in edit mode so user can see which item they're editing */}
              {isEditMode && (
                <div className="col-md-4">
                  <label className="form-label">Service Item ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.service_item_id || ''}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                </div>
              )}
 
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
 
              <div className="col-md-4">
                <label className="form-label">PCB Serial Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="pcb_serial_number"
                  value={formData.pcb_serial_number || ''}
                  onChange={onChange}
                  placeholder="Enter PCB Serial Number"
                  required
                />
              </div>
 
<div className="col-md-4">
  <label className="form-label">Service Item Name</label>
  <input
    type="text"
    className="form-control"
    name="service_item_name"
    value={formData.service_item_name || ''}
    onChange={onChange}
    placeholder="Enter Service Name"
    required
    readOnly={isEditMode}
    style={
      isEditMode
        ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' }
        : {}
    }
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
                      {product.product_name} ({product.product_id})
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
 
             <div className="col-md-4">
  <label className="form-label">Customer</label>

  <Select
    name="customer"
    value={
      customers
        .map((customer) => ({
          value: customer.customer_id,
          label: `${customer.full_name} (${customer.customer_id})`,
        }))
        .find((option) => option.value === formData.customer)
    }
    onChange={(selectedOption) =>
      handleCustomerChange({
        target: {
          name: "customer",
          value: selectedOption ? selectedOption.value : "",
        },
      })
    }
    options={customers.map((customer) => ({
      value: customer.customer_id,
      label: `${customer.full_name} (${customer.customer_id})`,
    }))}
    placeholder="Search Customer..."
    isClearable
  />
</div>
 
              {/* Product Description */}
              <div className="col-8">
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
 
              {/* Add Components Section — only show on create mode */}
              {!isEditMode && (
                <div className="col-4">
                  <label className="form-label">Do you want to add service item components?</label>
                  <div className="d-flex gap-4 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="componentOption"
                        id="componentYes"
                        value="yes"
                        checked={componentOption === 'yes'}
                        onChange={(e) => setComponentOption(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="componentYes">Yes</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="componentOption"
                        id="componentNo"
                        value="no"
                        checked={componentOption === 'no'}
                        onChange={(e) => setComponentOption(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="componentNo">No</label>
                    </div>
                  </div>
                </div>
              )}
 
              {/* Components Section */}
              {addComponents && !isEditMode && (
                <div className="col-12">
                  <div className="card">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Service Item Components</h6>
                    </div>
                    <div className="card-body">
                      {components.map((component, index) => (
                        <div key={index} className="component-form mb-4 p-3 border rounded">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label">Component</label>
                              <select
                                className="form-control"
                                value={component.component || ''}
                                onChange={(e) => handleComponentChange(index, 'component', e.target.value)}
                                required
                              >
                                <option value="">Select Component</option>
                                {availableComponents.map((comp) => (
                                  <option key={comp.component_id} value={comp.component_id}>
                                    {comp.component_name || comp.component_id}
                                  </option>
                                ))}
                              </select>
                            </div>
 
                            <div className="col-md-6">
                              <label className="form-label">Component Serial Number</label>
                              <input
                                type="text"
                                className="form-control"
                                value={component.component_serial_number || ''}
                                onChange={(e) => handleComponentChange(index, 'component_serial_number', e.target.value)}
                                placeholder="Enter component serial number"
                                required
                              />
                            </div>
 
                            <div className="col-md-4">
                              <label className="form-label">Warranty Start Date</label>
                              <input
                                type="date"
                                className="form-control"
                                value={component.warranty_start_date || ''}
                                onChange={(e) => handleComponentChange(index, 'warranty_start_date', e.target.value)}
                                required
                              />
                            </div>
 
                            <div className="col-md-4">
                              <label className="form-label">Warranty End Date</label>
                              <input
                                type="date"
                                className="form-control"
                                value={component.warranty_end_date || ''}
                                onChange={(e) => handleComponentChange(index, 'warranty_end_date', e.target.value)}
                                required
                              />
                            </div>
 
                            <div className="col-md-4">
                              <label className="form-label">Vendor</label>
                              <input
                                type="text"
                                className="form-control"
                                value={component.vendor_id || ''}
                                onChange={(e) => handleComponentChange(index, 'vendor_id', e.target.value)}
                                placeholder="Enter vendor name or ID"
                              />
                            </div>
 
                            <div className="col-12">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => removeComponent(index)}
                              >
                                Remove Component
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
 
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={addNewComponent}
                      >
                        {components.length === 0 ? '+ Add Component' : '+ Add Another Component'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
 
              {/* Submit and Cancel Buttons */}
              <div className="d-flex justify-content-center mt-3 gap-3">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting
                    ? (isEditMode ? "Updating..." : "Submitting...")
                    : (isEditMode ? "Update" : "Submit")}
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