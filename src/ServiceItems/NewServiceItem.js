import React, { useState, useEffect, useContext } from 'react';
import ServiceItemTable from './ServiceItemTable';
import ServiceItemForm from './ServiceItemForm';
import './NewServiceItem.css';
import axios from 'axios';
import baseURL from '../ApiUrl/Apiurl';
import Swal from 'sweetalert2';
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';

const ServiceItem = () => { 
  const [showForm, setShowForm] = useState(false);
  const [serviceItems, setServiceItems] = useState([]);
   const { selectedCompany } = useCompany();
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
  const [isEditMode, setIsEditMode] = useState(false);

  const { userId } = useContext(AuthContext);
  console.log("User ID from context:", userId);
  console.log("Selected Company from context:", selectedCompany);

  // Fetch service items on load
  useEffect(() => {
    fetchServiceItems();
  }, [selectedCompany]);

  const fetchServiceItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/service-items/?user_id=${userId}&company_id=${selectedCompany}`);
      console.log("url", `${baseURL}/service-items/?user_id=${userId}&company_id=${selectedCompany}`);
      if (response.data.status === "success") {
        setServiceItems(response.data.data);
      } else {
        console.error("Failed to fetch service items.");
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (newServiceItem) => {
    if (isEditMode) {
      setServiceItems(serviceItems.map(item => 
        item.service_item_id === newServiceItem.service_item_id ? newServiceItem : item
      ));
    } else {
      setServiceItems([newServiceItem, ...serviceItems]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setFormData({
      service_item_id: item.service_item_id,
      serial_number: item.serial_number,
      product: item.product,
      customer: item.customer,
      location: item.location,
      location_latitude: item.location_latitude,
      location_longitude: item.location_longitude,
      installation_date: item.installation_date,
      warranty_start_date: item.warranty_start_date,
      warranty_end_date: item.warranty_end_date,
      contract_end_date: item.contract_end_date,
      status: item.status,
      iot_status: item.iot_status,
      last_service: item.last_service,
      product_description: item.product_description,
      pm_group: item.pm_group,
      bc_number: item.bc_number || "",
      ship_to_code: item.ship_to_code || "",
      created_at: item.created_at,
      created_by: item.created_by
    });
    setIsEditMode(true);
    setShowForm(true);
  };

 const handleDelete = async (serviceItemId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("authToken");
        await axios.delete(`${baseURL}/service-items/${serviceItemId}/`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          }
        });
        setServiceItems(serviceItems.filter(item => item.service_item_id !== serviceItemId));

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Service item has been deleted.',
        });
      } catch (error) {
        console.error('Error deleting service item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete service item.',
        });
      }
    }
  });
};

  const resetForm = () => {
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
    setIsEditMode(false);
  };

  const toggleForm = () => {
    resetForm();
    setShowForm((prev) => !prev);
  };

  return (
    <div>
      {!showForm ? (
        <ServiceItemTable 
          serviceItems={serviceItems} 
          onAddNew={toggleForm}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedCompany={selectedCompany} // Pass it as prop
        />
      ) : (
        <ServiceItemForm 
          formData={formData} 
          onChange={handleChange} 
          onSubmit={handleSubmit} 
          onCancel={toggleForm}
          isEditMode={isEditMode}
          userId={userId}
        />
      )}
    </div>
  );
};

export default ServiceItem;