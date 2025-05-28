import React from 'react';
import './NewServiceItem.css';

const ServiceItemTable = ({ serviceItems, onAddNew }) => {
  return (
    <div className="service-item-container">
      <h2 className="service-item-title">Service Items</h2>
      <p className="service-item-subtitle">Manage service items</p>
      <hr/>

      <div className="d-flex justify-content-end mb-3">
        <button 
          onClick={onAddNew}
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
    </div>
  );
};

export default ServiceItemTable;