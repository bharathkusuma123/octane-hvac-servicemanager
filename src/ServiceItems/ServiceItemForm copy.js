// import React, { useEffect, useState } from 'react';
// import './NewServiceItem.css';

// const ServiceItemForm = ({ formData, onChange, onSubmit, onCancel }) => {
//   const [customers, setCustomers] = useState([]);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await fetch('http://175.29.21.7:8006/users/');
//         const data = await response.json();
//         const filtered = data.filter(user => user.role === 'Customer');
//         setCustomers(filtered);
//       } catch (error) {
//         console.error('Error fetching customers:', error);
//       }
//     };

//     fetchCustomers();
//   }, []);
//    return (
//     <div className="service-item-container">
//       <h2 className="service-item-title">New Service Item Card</h2>
//       <p className="service-item-subtitle">Fill in the service item details below</p>
//       <hr/>

//       <form onSubmit={onSubmit}>
//         {/* Basic Information */}
//         <div className="service-item-section">
//           <h3 className="service-item-section-title">Basic Information</h3>

//           <div className="service-item-row">
//             <div className="service-item-group">
//               <label className="service-item-label">Serial Number</label>
//               <input 
//                 type="text" 
//                 className="service-item-input" 
//                 name="serial_number"
//                 value={formData.serial_number}
//                 onChange={onChange}
//                 placeholder="Enter serial number" 
//                 required
//               />
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">Product</label>
//               <select 
//                 className="service-item-input"
//                 name="product_id"
//                 value={formData.product_id}
//                 onChange={onChange}
//                 required
//               >
//                 <option value="">Select Product</option>
//                 <option value="101">HVAC Model X2000</option>
//                 <option value="102">HVAC Model Y3000</option>
//               </select>
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">PM Group ID</label>
//               <input 
//                 type="text" 
//                 className="service-item-input" 
//                 name="pm_group_id"
//                 value={formData.pm_group_id}
//                 onChange={onChange}
//                 placeholder="Enter PM Group ID" 
//               />
//             </div>
//           </div>

//           <div className="service-item-row">
//             <div className="service-item-group service-item-full">
//               <label className="service-item-label">Product Description</label>
//               <textarea 
//                 className="service-item-textarea" 
//                 name="product_description"
//                 value={formData.product_description}
//                 onChange={onChange}
//                 placeholder="Add any notes or description..."
//               ></textarea>
//             </div>
//           </div>
//         </div>

//         {/* Customer & Location */}
//         <div className="service-item-section">
//           <h3 className="service-item-section-title">Customer & Location</h3>
//           <div className="service-item-row">
//               <div className="service-item-group">
//               <label className="service-item-label">Customer</label>
//               <select
//                 className="service-item-input"
//                 name="user_id"
//                 value={formData.user_id}
//                 onChange={onChange}
//                 required
//               >
//                 <option value="">Select Customer</option>
//                 {customers.map(customer => (
//                   <option key={customer.user_id} value={customer.user_id}>
//                     {customer.full_name} ({customer.user_id})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">Installation Location</label>
//               <input 
//                 type="text" 
//                 className="service-item-input" 
//                 name="location"
//                 value={formData.location}
//                 onChange={onChange}
//                 placeholder="Address" 
//                 required
//               />
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">Latitude</label>
//               <input 
//                 type="number" 
//                 step="0.000001"
//                 className="service-item-input" 
//                 name="location_latitude"
//                 value={formData.location_latitude}
//                 onChange={onChange}
//                 placeholder="e.g. 12.971599" 
//               />
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">Longitude</label>
//               <input 
//                 type="number" 
//                 step="0.000001"
//                 className="service-item-input" 
//                 name="location_longitude"
//                 value={formData.location_longitude}
//                 onChange={onChange}
//                 placeholder="e.g. 77.594566" 
//               />
//             </div>
//           </div>
//         </div>

//         {/* Dates & Status */}
//         <div className="service-item-section">
//           <h3 className="service-item-section-title">Important Dates & Status</h3>
//           <div className="service-item-row">
//             <div className="service-item-group">
//               <label className="service-item-label">Installation Date</label>
//               <input 
//                 type="date" 
//                 className="service-item-input" 
//                 name="installation_date"
//                 value={formData.installation_date}
//                 onChange={onChange}
//                 required
//               />
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">Warranty Start Date</label>
//               <input 
//                 type="date" 
//                 className="service-item-input" 
//                 name="warranty_start_date"
//                 value={formData.warranty_start_date}
//                 onChange={onChange}
//                 required
//               />
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">Warranty End Date</label>
//               <input 
//                 type="date" 
//                 className="service-item-input" 
//                 name="warranty_end_date"
//                 value={formData.warranty_end_date}
//                 onChange={onChange}
//                 required
//               />
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">Contract End Date</label>
//               <input 
//                 type="date" 
//                 className="service-item-input" 
//                 name="contract_end_date"
//                 value={formData.contract_end_date}
//                 onChange={onChange}
//               />
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">Last Service</label>
//               <input 
//                 type="date" 
//                 className="service-item-input" 
//                 name="last_service"
//                 value={formData.last_service}
//                 onChange={onChange}
//               />
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">Operational Status</label>
//               <select 
//                 className="service-item-input"
//                 name="status"
//                 value={formData.status}
//                 onChange={onChange}
//                 required
//               >
//                 <option value="">Select Status</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//                 <option value="Service Due">Service Due</option>
//               </select>
//             </div>
//             <div className="service-item-group">
//               <label className="service-item-label">IoT Status</label>
//               <select 
//                 className="service-item-input"
//                 name="iot_status"
//                 value={formData.iot_status}
//                 onChange={onChange}
//                 required
//               >
//                 <option value="">Select Status</option>
//                 <option value="Online">Online</option>
//                 <option value="Offline">Offline</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="service-item-buttons">
//           <button 
//             type="button"
//             onClick={onCancel}
//             className="btn btn-outline-secondary service-item-btn service-item-cancel"
//           >
//             Cancel
//           </button>
//           <button type="submit" className="btn btn-primary service-item-btn service-item-save">
//             Save Item
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ServiceItemForm;



import React, { useEffect, useState } from 'react';
import './NewServiceItem.css';
import baseURL from '../ApiUrl/Apiurl';

const ServiceItemForm = ({ formData, onChange, onSubmit, onCancel }) => {
  const [customers, setCustomers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${baseURL}/users/`);
        const data = await response.json();
        const filtered = data.filter(user => user.role === 'Customer');
        setCustomers(filtered);
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
      setProducts(result.data);  // <-- this line is the fix
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  fetchProducts();
}, []);


 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    // Prepare the payload according to the expected structure
    const payload = {
      serial_number: formData.serial_number,
      location: formData.location,
      location_latitude: formData.location_latitude ? parseFloat(formData.location_latitude) : null,
      location_longitude: formData.location_longitude ? parseFloat(formData.location_longitude) : null,
      installation_date: formData.installation_date,
      warranty_start_date: formData.warranty_start_date,
      warranty_end_date: formData.warranty_end_date,
      contract_end_date: formData.contract_end_date || null,
      status: formData.status,
      iot_status: formData.iot_status,
      product_description: formData.product_description || '',
      last_service: formData.last_service || null,
      product: formData.product_id,  // Make sure this matches the product_id from the products list
      user: formData.user_id ,
      created_by: "Sharvani",
      updated_by: "Mani",
      service_item_id: "03",       // Make sure this matches the user_id from the customers list
    };

    console.log("Final payload:", payload); // Debugging log

    const response = await fetch(`${baseURL}/service-items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData); // Log detailed error
      throw new Error(errorData.message || 'Service Item creation failed');
    }

    const data = await response.json();
    onSubmit(data);
  } catch (err) {
    console.error('Error submitting form:', err);
    setError(err.message || 'Failed to create service item. Please check all fields and try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="service-item-container">
      <h2 className="service-item-title">New Service Item Card</h2>
      <p className="service-item-subtitle">Fill in the service item details below</p>
      <hr/>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="service-item-section">
          <h3 className="service-item-section-title">Basic Information</h3>

          <div className="service-item-row">
            <div className="service-item-group">
              <label className="service-item-label">Serial Number</label>
              <input 
                type="text" 
                className="service-item-input" 
                name="serial_number"
                value={formData.serial_number || ''}
                onChange={onChange}
                placeholder="Enter serial number" 
                required
              />
            </div>
            <div className="service-item-group">
              <label className="service-item-label">Product</label>
            <select
  className="service-item-input"
  name="product_id"
  value={formData.product_id || ''}
  onChange={onChange}
  required
>
  <option value="">Select Product</option>
  {products.map((product) => (
    <option key={product.product_id} value={product.product_id}>
      {product.product_name}
    </option>
  ))}
</select>

            </div>
            {/* <div className="service-item-group">
              <label className="service-item-label">PM Group ID</label>
              <input 
                type="text" 
                className="service-item-input" 
                name="pm_group_id"
                value={formData.pm_group_id || ''}
                onChange={onChange}
                placeholder="Enter PM Group ID" 
              />
            </div> */}
          </div>

          <div className="service-item-row">
            <div className="service-item-group service-item-full">
              <label className="service-item-label">Product Description</label>
              <textarea 
                className="service-item-textarea" 
                name="product_description"
                value={formData.product_description || ''}
                onChange={onChange}
                placeholder="Add any notes or description..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Customer & Location */}
        <div className="service-item-section">
          <h3 className="service-item-section-title">Customer & Location</h3>
          <div className="service-item-row">
              <div className="service-item-group">
              <label className="service-item-label">Customer</label>
              <select
                className="service-item-input"
                name="user_id"
                value={formData.user_id || ''}
                onChange={onChange}
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.user_id} value={customer.user_id}>
                    {customer.full_name} ({customer.user_id})
                  </option>
                ))}
              </select>
            </div>
            <div className="service-item-group">
              <label className="service-item-label">Installation Location</label>
              <input 
                type="text" 
                className="service-item-input" 
                name="location"
                value={formData.location || ''}
                onChange={onChange}
                placeholder="Address" 
                required
              />
            </div>
            <div className="service-item-group">
              <label className="service-item-label">Latitude</label>
              <input 
                type="number" 
                step="0.000001"
                className="service-item-input" 
                name="location_latitude"
                value={formData.location_latitude || ''}
                onChange={onChange}
                placeholder="e.g. 12.971599" 
              />
            </div>
            <div className="service-item-group">
              <label className="service-item-label">Longitude</label>
              <input 
                type="number" 
                step="0.000001"
                className="service-item-input" 
                name="location_longitude"
                value={formData.location_longitude || ''}
                onChange={onChange}
                placeholder="e.g. 77.594566" 
              />
            </div>
          </div>
        </div>

        {/* Dates & Status */}
        <div className="service-item-section">
          <h3 className="service-item-section-title">Important Dates & Status</h3>
          <div className="service-item-row">
            <div className="service-item-group">
              <label className="service-item-label">Installation Date</label>
              <input 
                type="date" 
                className="service-item-input" 
                name="installation_date"
                value={formData.installation_date || ''}
                onChange={onChange}
                required
              />
            </div>
            <div className="service-item-group">
              <label className="service-item-label">Warranty Start Date</label>
              <input 
                type="date" 
                className="service-item-input" 
                name="warranty_start_date"
                value={formData.warranty_start_date || ''}
                onChange={onChange}
                required
              />
            </div>
            <div className="service-item-group">
              <label className="service-item-label">Warranty End Date</label>
              <input 
                type="date" 
                className="service-item-input" 
                name="warranty_end_date"
                value={formData.warranty_end_date || ''}
                onChange={onChange}
                required
              />
            </div>
            <div className="service-item-group">
              <label className="service-item-label">Contract End Date</label>
              <input 
                type="date" 
                className="service-item-input" 
                name="contract_end_date"
                value={formData.contract_end_date || ''}
                onChange={onChange}
              />
            </div>
            <div className="service-item-group">
              <label className="service-item-label">Last Service</label>
              <input 
                type="date" 
                className="service-item-input" 
                name="last_service"
                value={formData.last_service || ''}
                onChange={onChange}
              />
            </div>
            <div className="service-item-group">
              <label className="service-item-label">Operational Status</label>
              <select 
                className="service-item-input"
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
            <div className="service-item-group">
              <label className="service-item-label">IoT Status</label>
              <select 
                className="service-item-input"
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="service-item-buttons">
          <button 
            type="button"
            onClick={onCancel}
            className="btn btn-outline-secondary service-item-btn service-item-cancel"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary service-item-btn service-item-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceItemForm;