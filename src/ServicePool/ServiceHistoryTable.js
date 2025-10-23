// Create a new file: src/ServiceTableHistory/ServiceTableHistory.js
import React, { useState, useEffect, useContext } from "react";
import "./ServiceHistoryTable.css";
import axios from "axios";
import baseURL from "../ApiUrl/Apiurl";
import { useNavigate } from 'react-router-dom';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";

const ServiceTableHistory = () => {
  const { userId } = useContext(AuthContext);
  const { selectedCompany } = useCompany();
  const navigate = useNavigate();
  
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  const [engineers, setEngineers] = useState([]);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${baseURL}/customers/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany
        }
      });
      
      if (response.data.status === "success" && Array.isArray(response.data.data)) {
        setCustomers(response.data.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    }
  };

  // Fetch service items
  const fetchServiceItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/service-items/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany
        }
      });

      if (response.data && response.data.data) {
        setServiceItems(response.data.data);
      } else {
        setServiceItems([]);
      }
    } catch (error) {
      console.error("Error fetching service items:", error);
      setServiceItems([]);
    }
  };

  // Fetch engineers
  const fetchEngineers = async () => {
    try {
      const usersResponse = await axios.get(`${baseURL}/users/`);
      const serviceEngineers = usersResponse.data.filter(
        user => user.role === "Service Engineer"
      );
      setEngineers(serviceEngineers);
    } catch (error) {
      console.error("Error fetching engineers:", error);
      setEngineers([]);
    }
  };

  // Fetch service history data
  const fetchServiceHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/service-pools/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany,
          include_history: true // You might need to modify your API to support this
        }
      });
      
      let dataArray = response.data.data || response.data;
      dataArray = Array.isArray(dataArray) ? dataArray : [dataArray];
      
      // Filter completed/closed services and sort by date
      const completedServices = dataArray.filter(service => 
        ['Completed', 'Closed', 'Reopened'].includes(service.status)
      ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setServiceHistory(completedServices);
      setFilteredData(completedServices);
    } catch (err) {
      setError(err.message);
      setServiceHistory([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && selectedCompany) {
      fetchServiceHistory();
      fetchCustomers();
      fetchServiceItems();
      fetchEngineers();
    }
  }, [userId, selectedCompany]);

  // Apply search filter
  useEffect(() => {
    let results = serviceHistory;
    
    if (searchTerm) {
      results = results.filter(item =>
        Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.request_id && item.request_id.toString().includes(searchTerm))
      );
    }
    
    setFilteredData(results);
    setCurrentPage(1);
  }, [searchTerm, serviceHistory]);

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    if (!customerId) return "N/A";
    const customer = customers.find(cust => cust.customer_id === customerId);
    return customer ? customer.full_name || customer.username || "N/A" : customerId;
  };

  // Get service item name by ID
  const getServiceItemName = (serviceItemId) => {
    if (!serviceItemId) return "N/A";
    const serviceItem = serviceItems.find(item => item.service_item_id === serviceItemId);
    return serviceItem ? serviceItem.item_name || "N/A" : serviceItemId;
  };

  // Get engineer name by ID
  const getEngineerName = (engineerId) => {
    if (!engineerId) return "Not Assigned";
    const engineer = engineers.find(eng => eng.user_id === engineerId);
    return engineer ? engineer.full_name || engineer.username || "N/A" : engineerId;
  };

  // Handle navigation to service request detail
  const handleRequestClick = (requestId) => {
    navigate(`/servicemanager/service-requests/${requestId}`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  if (loading) return <div className="service-history-container">Loading service history...</div>;
  if (error) return <div className="service-history-container">Error: {error}</div>;

  return (
    <div className="service-history-container pm-container">
      <div className="service-history-header">
        <h2>Service Table History</h2>
        <p>View previous service records, descriptions, and assigned engineers</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search service history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="entries-selector">
          <label>Show </label>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="form-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <label> entries</label>
        </div>
      </div>

      {/* Service History Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="">
            <tr>
              <th>Request ID</th>
              <th>Customer</th>
              <th>Service Item</th>
              <th>Description</th>
              <th>Reported Problems</th>
              <th>Assigned Engineer</th>
              <th>Status</th>
              <th>Completed Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((service) => (
                <tr key={service.request_id} className="service-history-row">
                  <td>
                    <button
                      className="request-id-btn"
                      onClick={() => handleRequestClick(service.request_id)}
                      title="View Service Details"
                    >
                      {service.request_id}
                    </button>
                  </td>
                  <td>{getCustomerName(service.customer)}</td>
                  <td>{getServiceItemName(service.service_item)}</td>
                  <td className="description-cell">
                    {service.request_details || "No description provided"}
                  </td>
                  <td className="problems-cell">
                    {service.alert_details || "No problems reported"}
                  </td>
                  <td>{getEngineerName(service.assigned_engineer)}</td>
                  <td>
                    <span className={`status-badge status-${service.status?.toLowerCase()}`}>
                      {service.status}
                    </span>
                  </td>
                  <td>
                    {service.updated_at ? new Date(service.updated_at).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No service history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-section">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
          </div>
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ServiceTableHistory;