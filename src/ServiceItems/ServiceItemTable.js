import React, { useEffect, useState } from 'react';
import './NewServiceItem.css';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ServiceItemTable = ({ serviceItems, onAddNew, onEdit, onDelete, selectedCompany  }) => { 
  const [filteredItems, setFilteredItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

    // Function to format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
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
 
  useEffect(() => {
  if (serviceItems) { // Changed from serviceItems && serviceItems.length > 0
    // First filter by selected company if one is selected
    let filteredByCompany = serviceItems;
    if (selectedCompany) {
      filteredByCompany = serviceItems.filter(item => 
        item.company === selectedCompany
      );
    }
    
    // Then sort by date
    const sortedData = [...filteredByCompany].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setFilteredItems(sortedData);
    setLoading(false);
  }
}, [serviceItems, selectedCompany]);

  useEffect(() => {
    let results = serviceItems;
    
    // First filter by selected company if one is selected
    // if (selectedCompany) {
    //   results = results.filter(item => 
    //     item.company === selectedCompany
    //   );
    // }
    
    // Then apply search term filter
    if (searchTerm) {
      results = results.filter(item =>
        Object.values(item)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, serviceItems]); 

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

  return (
    <div className="service-item-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center  flex-wrap">
        <div>
          <h2 className="service-item-title mb-0">Service Items</h2>
           <p className="service-item-subtitle mb-0 text-muted">
            {selectedCompany 
              ? `Showing service items for ${selectedCompany}`
              : 'Showing all service items'}
          </p>
          <p className="service-item-subtitle text-muted mb-0">Manage service items</p>
        </div>
        <button
          onClick={onAddNew}
          className="btn btn-primary service-item-btn service-item-save"
        >
          Add New Service Item
        </button>
      </div>

      {/* Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
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

        <input
          type="text"
          placeholder="Search service items..."
          className="form-control w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
    {loading ? (
  <p>Loading service items...</p>
) : filteredItems.length === 0 ? (
  <div className="alert alert-info">No service items found.</div>
) : (
        <div className="table-responsive mb-4">
          <table className="table">
            <thead className="service-item-table-header">
              <tr>
                <th>S.No</th>
                <th>Service Item ID</th>
                  <th>Company</th>
                <th>Customer</th>
                <th>Pm Group</th>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item.service_item_id}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td>{item.service_item_id}</td>
                       <td>{item.company}</td>
                    <td>{item.customer}</td>
                    <td>{item.pm_group}</td>
                    <td>{item.product}</td>
                    <td>{item.location}</td>
                    <td>{item.location_latitude}</td>
                    <td>{item.location_longitude}</td>
                                 <td>{formatDate(item.installation_date)}</td>
                    <td>{formatDate(item.warranty_end_date)}</td>
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
                     <td>{formatDate(item.last_service)}</td>
                    <td>{item.pm_group || 'N/A'}</td>
                    <td>{item.product_description || 'N/A'}</td>
                    <td>
                      <FaEdit

                      
                        style={{ cursor: 'pointer', marginRight: '10px', color: 'blue' }}
                        onClick={() => onEdit(item)}
                      />
                      <FaTrash
                        style={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => onDelete(item.service_item_id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="text-center">No service items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ServiceItemTable;