import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import baseURL from '../ApiUrl/Apiurl';
import Swal from 'sweetalert2';
import "./ServiceItemComponents.css";
import { AuthContext } from '../AuthContext/AuthContext';
import { useCompany } from '../AuthContext/CompanyContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ServiceItemComponentsTable = () => { 
  const [components, setComponents] = useState([]);
  const [serviceItemsOptions, setServiceItemsOptions] = useState([]);
  const [componentOptions, setComponentOptions] = useState([]);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get service item from navigation state
  const serviceItemFromState = location.state?.service_item;

  // Initial fetches
  useEffect(() => {
    fetchComponents();
    fetchServiceItems();
    fetchComponentOptions();
  }, [userId, selectedCompany]);

  const fetchComponents = () => {
    fetch(`${baseURL}/service-item-components/?user_id=${userId}&company_id=${selectedCompany}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          let filteredData = data.data;
          
          // Filter by service item if provided in state
          if (serviceItemFromState) {
            filteredData = data.data.filter(comp => 
              comp.service_item === serviceItemFromState
            );
          }
          
          setComponents(filteredData);
        }
      })
      .catch(console.error);
  };

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

  const startEdit = (comp) => {
    navigate('/servicemanager/service-item-components/edit', {
      state: {
        service_component_id: comp.service_component_id,
        service_item_id: comp.service_item,
        component_id: comp.component,
        component_serial_number: comp.component_serial_number,
        warranty_start_date: comp.warranty_start_date,
        warranty_end_date: comp.warranty_end_date,
        vendor_id: comp.vendor_id || "",
      }
    });
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

  const handleAddNew = () => {
    navigate('/servicemanager/service-item-components/add', {
      state: {
        service_item: serviceItemFromState // Pass service item if available
      }
    });
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

  // Function to get service item display name
  const getServiceItemDisplay = (serviceItemId) => {
    const serviceItem = serviceItemsOptions.find(item => item.service_item_id === serviceItemId);
    return serviceItem ? `${serviceItem.service_item_id}` : serviceItemId;
  };

  // Function to get component display name
  const getComponentDisplay = (componentId) => {
    const component = componentOptions.find(comp => comp.component_id === componentId);
    return component ? `${component.component_id}` : componentId;
  };

  return (
    <div className="svc-form-wrapper shadow-sm">
      <div className="svc-header mb-4 d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div>
          <h2 className="svc-title">Service Item Components</h2>
          <p className="svc-subtitle">
            {serviceItemFromState 
              ? `Components for Service Item: ${serviceItemFromState}`
              : 'Manage service item components'
            }
          </p>
        </div>
        <button onClick={handleAddNew} className="btn btn-primary svc-btn-save">
          Add Component
        </button>
      </div>

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
                  <td>{getServiceItemDisplay(comp.service_item)}</td>
                  <td>{getComponentDisplay(comp.component)}</td>
                  <td>{comp.component_serial_number}</td>
                  <td>{formatDate(comp.warranty_start_date)}</td>
                  <td>{formatDate(comp.warranty_end_date)}</td>
                  <td>{comp.vendor_id || "-"}</td>
                  <td>{comp.created_by}</td>
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
                  {serviceItemFromState 
                    ? `No components found for service item: ${serviceItemFromState}`
                    : 'No components found.'
                  }
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
    </div>
  );
};

export default ServiceItemComponentsTable;