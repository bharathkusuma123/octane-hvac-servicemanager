import React, { useState, useEffect } from 'react';
import ServiceItemTable from './ServiceItemTable';
import ServiceItemForm from './ServiceItemForm';
import './NewServiceItem.css';

const ServiceItem = () => {
  const [showForm, setShowForm] = useState(false);
  const [serviceItems, setServiceItems] = useState([]);
  const [formData, setFormData] = useState({
    serial_number: "",
    product: "",
    customer: "",
    location: "",
    location_latitude: "",
    location_longitude: "",
    installation_date: "",
    warranty_start_date: "",
    warranty_end_date: "",
    contract_end_date: "",
    status: "Active",
    iot_status: "Online",
    product_description: "",
    pm_group: "",
    bc_number: "",
    ship_to_code: ""
  });

  // Fetch service items on load
  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        const response = await fetch("http://175.29.21.7:8006/service-items/");
        const result = await response.json();
        if (result.status === "success") {
          setServiceItems(result.data);
        } else {
          console.error("Failed to fetch service items.");
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchServiceItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (newServiceItem) => {
    setServiceItems([...serviceItems, newServiceItem]);
    setShowForm(false);
    setFormData({
      serial_number: "",
      product: "",
      customer: "",
      location: "",
      location_latitude: "",
      location_longitude: "",
      installation_date: "",
      warranty_start_date: "",
      warranty_end_date: "",
      contract_end_date: "",
      status: "Active",
      iot_status: "Online",
      product_description: "",
      pm_group: "",
      bc_number: "",
      ship_to_code: ""
    });
  };

  const toggleForm = () => setShowForm((prev) => !prev);

  return (
    <div>
      {!showForm ? (
        <ServiceItemTable 
          serviceItems={serviceItems} 
          onAddNew={toggleForm} 
        />
      ) : (
        <ServiceItemForm 
          formData={formData} 
          onChange={handleChange} 
          onSubmit={handleSubmit} 
          onCancel={toggleForm} 
        />
      )}
    </div>
  );
};

export default ServiceItem;