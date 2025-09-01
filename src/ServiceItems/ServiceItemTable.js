import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewServiceItem.css';
import { FaEdit, FaTrash, FaFileContract } from 'react-icons/fa';
import axios from 'axios';

const ServiceItemTable = ({ serviceItems, onAddNew, onEdit, onDelete, selectedCompany, userId, refreshContracts }) => { 
  const [filteredItems, setFilteredItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [contractData, setContractData] = useState([]);

  const fetchContracts = async () => {
    try {
      const response = await axios.get(
        `http://175.29.21.7:8006/service-contracts/`,
        {
          params: {
            user_id: userId,
            company_id: selectedCompany,
          },
        }
      );

      console.log("Contract response:", response.data);

      const contracts = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setContractData(contracts);
    } catch (error) {
      console.error("Failed to fetch contracts", error);
      setContractData([]); // fallback to empty array
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [userId, selectedCompany, refreshContracts]);

  const isContractButtonDisabled = (serviceItemId) => {
    if (!Array.isArray(contractData)) return false;

    const matchedContract = contractData.find(
      (contract) => contract.service_item === serviceItemId
    );

    // If contract exists, disable the Contract button
    return !!matchedContract;
  };

  const hasExistingRenewal = (serviceItemId) => {
    if (!Array.isArray(contractData)) return false;
    
    return contractData.some(contract => 
      contract.service_item === serviceItemId && 
      contract.remarks && 
      contract.remarks.includes("Renewal of contract")
    );
  };

  const shouldShowRenewalButton = (serviceItemId) => {
    if (!Array.isArray(contractData)) return false;

    // Find all contracts for this service item
    const serviceItemContracts = contractData.filter(
      (contract) => contract.service_item === serviceItemId
    );

    // If no contracts exist, don't show renewal button
    if (serviceItemContracts.length === 0) return false;

    // Sort contracts by creation date to find the latest one
    const sortedContracts = serviceItemContracts.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    
    const latestContract = sortedContracts[0];
    
    // Check if current date is greater than end_date OR is_alert_sent is true
    const currentDate = new Date();
    const endDate = new Date(latestContract.end_date);
    
    // Don't show renewal button if it's already been renewed
    if (hasExistingRenewal(serviceItemId)) return false;
    
    return  latestContract.is_alert_sent === true;
  };

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
    if (serviceItems) {
      let filteredByCompany = serviceItems;
      if (selectedCompany) {
        filteredByCompany = serviceItems.filter(item => 
          item.company === selectedCompany
        );
      }
      
      const sortedData = [...filteredByCompany].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFilteredItems(sortedData);
      setLoading(false);
    }
  }, [serviceItems, selectedCompany]);

  useEffect(() => {
    let results = serviceItems;
    
    if (searchTerm) {
      results = results.filter(item =>
        Object.values(item)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(results);
    setCurrentPage(1);
  }, [searchTerm, serviceItems]); 

  const handleContractClick = (item) => {
    navigate('/servicemanager/service-contract', {
      state: {
        service_item_id: item.service_item_id,
        customer: item.customer,
        company: item.company
      }
    });
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

  const handleRenewalClick = (item) => {
    // Find the existing contract for this service item
    const existingContract = contractData.find(
      contract => contract.service_item === item.service_item_id
    );
    
    navigate('/servicemanager/service-renewal', {
      state: {
        service_item_id: item.service_item_id,
        customer: item.customer,
        company: item.company,
        existing_contract: existingContract // Pass only serializable data
      }
    });
  };

  return (
    <div className="service-item-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap">
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
                <th>PM Group</th>
                <th>Product</th>
                <th>Location</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Installation Date</th>
                <th>Warranty End</th>
                <th>Status</th>
                <th>IoT Status</th>
                <th>Last Service</th>
                <th>Description</th>
                <th>Actions</th>
                <th>Contract</th>
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
                    <td>{item.product_description || 'N/A'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <FaEdit
                          style={{ cursor: 'pointer', color: 'blue' }}
                          onClick={() => onEdit(item)}
                        />
                        <FaTrash
                          style={{ cursor: 'pointer', color: 'red' }}
                          onClick={() => onDelete(item.service_item_id)}
                        />
                      </div>
                    </td>
                    <td>
                      {shouldShowRenewalButton(item.service_item_id) ? (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleRenewalClick(item)}
                        >
                          Renewal
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={isContractButtonDisabled(item.service_item_id)}
                          onClick={() => handleContractClick(item)}
                        >
                          Contract
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="17" className="text-center">No service items found.</td>
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