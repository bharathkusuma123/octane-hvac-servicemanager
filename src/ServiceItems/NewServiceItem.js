// import React from 'react';
// import './NewServiceItem.css';

// const ServiceItem = () => {
//   return (
//     <div className="service-item-container">
//       <h2 className="service-item-title">New Service Item Card</h2>
//       <p className="service-item-subtitle">Fill in the service item details below</p>
// <hr/>
//       {/* Basic Information */}
//      <div className="service-item-section">
//   <h3 className="service-item-section-title">Basic Information</h3>

//   {/* First row: Serial Number, Product, PM Group ID */}
//   <div className="service-item-row">
//     <div className="service-item-group">
//       <label className="service-item-label">Serial Number</label>
//       <input type="text" className="service-item-input" placeholder="Enter serial number" />
//     </div>
//     <div className="service-item-group">
//       <label className="service-item-label">Product</label>
//       <select className="service-item-input">
//         <option>Select Product</option>
//       </select>
//     </div>
//     <div className="service-item-group">
//       <label className="service-item-label">PM Group ID</label>
//       <input type="text" className="service-item-input" placeholder="Enter PM Group ID" />
//     </div>
//   </div>

//   {/* Second row: Product Description */}
//   <div className="service-item-row">
//     <div className="service-item-group service-item-full">
//       <label className="service-item-label">Product Description</label>
//       <textarea className="service-item-textarea" placeholder="Add any notes or description..."></textarea>
//     </div>
//   </div>
// </div>


//       {/* Customer & Location */}
//       <div className="service-item-section">
//         <h3 className="service-item-section-title">Customer & Location</h3>
//         <div className="service-item-row">
//           <div className="service-item-group">
//             <label className="service-item-label">Customer</label>
//             <select className="service-item-input">
//               <option>Select Customer</option>
//             </select>
//           </div>
//           <div className="service-item-group">
//             <label className="service-item-label">Installation Location</label>
//             <input type="text" className="service-item-input" placeholder="Address" />
//           </div>
//           <div className="service-item-group">
//             <label className="service-item-label">Latitude</label>
//             <input type="text" className="service-item-input" placeholder="e.g. 12.971599" />
//           </div>
//           <div className="service-item-group">
//             <label className="service-item-label">Longitude</label>
//             <input type="text" className="service-item-input" placeholder="e.g. 77.594566" />
//           </div>
//         </div>
//       </div>

//       {/* Dates & Status */}
//       <div className="service-item-section">
//         <h3 className="service-item-section-title">Important Dates & Status</h3>
//         <div className="service-item-row">
//           <div className="service-item-group">
//             <label className="service-item-label">Installation Date</label>
//             <input type="date" className="service-item-input" />
//           </div>
//           <div className="service-item-group">
//             <label className="service-item-label">Warranty Start Date</label>
//             <input type="date" className="service-item-input" />
//           </div>
//           <div className="service-item-group">
//             <label className="service-item-label">Warranty End Date</label>
//             <input type="date" className="service-item-input" />
//           </div>
//           <div className="service-item-group">
//             <label className="service-item-label">Contract End Date</label>
//             <input type="date" className="service-item-input" />
//           </div>
//           <div className="service-item-group">
//             <label className="service-item-label">Last Service</label>
//             <input type="date" className="service-item-input" />
//           </div>
        
//           <div className="service-item-group">
//             <label className="service-item-label">Operational Status</label>
//             <select className="service-item-input">
//               <option>Select Status</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="service-item-buttons">
//         <button className="  btn btn-outline-secondary service-item-btn service-item-cancel">Cancel</button>
//         <button className=" btn btn-primary service-item-btn service-item-save">Save Item</button>
//       </div>
//     </div>
//   );
// };

// export default ServiceItem;













import React, { useState } from 'react';
import './NewServiceItem.css';

const ServiceItem = () => {
  const [showForm, setShowForm] = useState(false);
  const [serviceItems, setServiceItems] = useState([
    // Sample data - replace with your actual data
    {
      service_item_id: 1,
      serial_number: "SN123456",
      product_id: 101,
      user_id: 501,
      location: "123 Main St, New York",
      location_latitude: 40.7128,
      location_longitude: -74.0060,
      installation_date: "2022-01-15",
      warranty_start_date: "2022-01-15",
      warranty_end_date: "2025-01-15",
      contract_end_date: "2024-12-31",
      status: "Active",
      last_checked: "2023-05-10 14:30:00",
      iot_status: "Online",
      product_description: "HVAC Unit Model X2000",
      last_service: "2023-04-20 10:00:00",
      pm_group_id: "PMG001",
      created_at: "2022-01-15 09:00:00",
      updated_at: "2023-05-10 14:30:00",
      created_by: "admin",
      updated_by: "tech1"
    },
    {
      service_item_id: 2,
      serial_number: "SN789012",
      product_id: 102,
      user_id: 502,
      location: "456 Oak Ave, Boston",
      location_latitude: 42.3601,
      location_longitude: -71.0589,
      installation_date: "2021-11-20",
      warranty_start_date: "2021-11-20",
      warranty_end_date: "2024-11-20",
      contract_end_date: null,
      status: "Service Due",
      last_checked: "2023-05-08 11:15:00",
      iot_status: "Offline",
      product_description: "HVAC Unit Model Y3000",
      last_service: "2023-03-15 09:30:00",
      pm_group_id: "PMG002",
      created_at: "2021-11-20 10:30:00",
      updated_at: "2023-05-08 11:15:00",
      created_by: "admin",
      updated_by: "tech2"
    }
  ]);

  const [formData, setFormData] = useState({
    serial_number: "",
    product_id: "",
    user_id: "",
    location: "",
    location_latitude: "",
    location_longitude: "",
    installation_date: "",
    warranty_start_date: "",
    warranty_end_date: "",
    contract_end_date: "",
    status: "",
    iot_status: "",
    product_description: "",
    pm_group_id: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    // Submit logic here
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      // Reset form when hiding it
      setFormData({
        serial_number: "",
        product_id: "",
        user_id: "",
        location: "",
        location_latitude: "",
        location_longitude: "",
        installation_date: "",
        warranty_start_date: "",
        warranty_end_date: "",
        contract_end_date: "",
        status: "",
        iot_status: "",
        product_description: "",
        pm_group_id: ""
      });
    }
  };

  return (
    <div className="service-item-container">
      <h2 className="service-item-title">
        {showForm ? "New Service Item Card" : "Service Items"}
      </h2>
      <p className="service-item-subtitle">
        {showForm ? "Fill in the service item details below" : "Manage service items"}
      </p>
      <hr/>

      {!showForm ? (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button 
              onClick={toggleForm}
              className="btn btn-primary service-item-btn service-item-save"
            >
              Add New Service Item
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Serial Number</th>
                  <th>Location</th>
                  <th>Installation Date</th>
                  <th>Warranty End</th>
                  <th>Status</th>
                  <th>IoT Status</th>
                  <th>Last Service</th>
                  <th>PM Group</th>
                </tr>
              </thead>
              <tbody>
                {serviceItems.map(item => (
                  <tr key={item.service_item_id}>
                    <td>{item.service_item_id}</td>
                    <td>{item.serial_number}</td>
                    <td>{item.location}</td>
                    <td>{item.installation_date}</td>
                    <td>{item.warranty_end_date}</td>
                    <td>
                      <span className={`badge ${
                        item.status === 'Active' ? 'bg-success' :
                        item.status === 'Service Due' ? 'bg-warning text-dark' :
                        'bg-secondary'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        item.iot_status === 'Online' ? 'bg-success' : 'bg-danger'
                      }`}>
                        {item.iot_status}
                      </span>
                    </td>
                    <td>{item.last_service ? new Date(item.last_service).toLocaleDateString() : 'Never'}</td>
                    <td>{item.pm_group_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
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
                  value={formData.serial_number}
                  onChange={handleChange}
                  placeholder="Enter serial number" 
                  required
                />
              </div>
              <div className="service-item-group">
                <label className="service-item-label">Product</label>
                <select 
                  className="service-item-input"
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Product</option>
                  <option value="101">HVAC Model X2000</option>
                  <option value="102">HVAC Model Y3000</option>
                </select>
              </div>
              <div className="service-item-group">
                <label className="service-item-label">PM Group ID</label>
                <input 
                  type="text" 
                  className="service-item-input" 
                  name="pm_group_id"
                  value={formData.pm_group_id}
                  onChange={handleChange}
                  placeholder="Enter PM Group ID" 
                />
              </div>
            </div>

            <div className="service-item-row">
              <div className="service-item-group service-item-full">
                <label className="service-item-label">Product Description</label>
                <textarea 
                  className="service-item-textarea" 
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleChange}
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
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Customer</option>
                  <option value="501">John Doe</option>
                  <option value="502">Jane Smith</option>
                </select>
              </div>
              <div className="service-item-group">
                <label className="service-item-label">Installation Location</label>
                <input 
                  type="text" 
                  className="service-item-input" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
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
                  value={formData.location_latitude}
                  onChange={handleChange}
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
                  value={formData.location_longitude}
                  onChange={handleChange}
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
                  value={formData.installation_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="service-item-group">
                <label className="service-item-label">Warranty Start Date</label>
                <input 
                  type="date" 
                  className="service-item-input" 
                  name="warranty_start_date"
                  value={formData.warranty_start_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="service-item-group">
                <label className="service-item-label">Warranty End Date</label>
                <input 
                  type="date" 
                  className="service-item-input" 
                  name="warranty_end_date"
                  value={formData.warranty_end_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="service-item-group">
                <label className="service-item-label">Contract End Date</label>
                <input 
                  type="date" 
                  className="service-item-input" 
                  name="contract_end_date"
                  value={formData.contract_end_date}
                  onChange={handleChange}
                />
              </div>
              <div className="service-item-group">
                <label className="service-item-label">Last Service</label>
                <input 
                  type="date" 
                  className="service-item-input" 
                  name="last_service"
                  value={formData.last_service}
                  onChange={handleChange}
                />
              </div>
              <div className="service-item-group">
                <label className="service-item-label">Operational Status</label>
                <select 
                  className="service-item-input"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
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
                  value={formData.iot_status}
                  onChange={handleChange}
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
              onClick={toggleForm}
              className="btn btn-outline-secondary service-item-btn service-item-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary service-item-btn service-item-save">
              Save Item
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ServiceItem;