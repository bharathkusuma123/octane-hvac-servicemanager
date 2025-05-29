import React, { useEffect, useState } from 'react';
import './NewServiceItem.css';
import axios from 'axios';

const ServiceItemTable = ({ onAddNew }) => {
  const [serviceItems, setServiceItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        const response = await axios.get('http://175.29.21.7:8006/service-items/');
        setServiceItems(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch service items:', error);
        setLoading(false);
      }
    };

    fetchServiceItems();
  }, []);

  return (
    <div className="service-item-container">
      <h2 className="service-item-title">Service Items</h2>
      <p className="service-item-subtitle">Manage service items</p>
      <hr />

      <div className="d-flex justify-content-end mb-3">
        <button 
          onClick={onAddNew}
          className="btn btn-primary service-item-btn service-item-save"
        >
          Add New Service Item
        </button>
      </div>

      {loading ? (
        <p>Loading service items...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Serial Number</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Location</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Installation Date</th>
                <th>Warranty End</th>
                <th>Status</th>
                <th>IoT Status</th>
                <th>Last Service</th>
                <th>PM Group</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {serviceItems.map(item => (
                <tr key={item.service_item_id}>
                  <td>{item.service_item_id}</td>
                  <td>{item.serial_number}</td>
                   <td>{item.user}</td>
                  <td>{item.product}</td>
                  <td>{item.location}</td>
                  <td>{item.location_latitude}</td>
                  <td>{item.location_longitude}</td>
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
                  <td>{item.pm_group || 'N/A'}</td>
                   <td>{item.product_description || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServiceItemTable;
