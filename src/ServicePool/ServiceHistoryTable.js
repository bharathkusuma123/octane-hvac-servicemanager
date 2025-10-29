import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import baseURL from '../ApiUrl/Apiurl';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";
import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';

const ServiceRequestItemsTable = ({ toggleForm, onEditItem, onViewItem }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);

  const fetchServiceRequestItems = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userId || !selectedCompany) {
        setError('Missing user ID or company ID');
        return;
      }
      
      const response = await axios.get(
        `${baseURL}/service-req-items-history/?user_id=${userId}&company_id=${selectedCompany}`
      );
      
      if (response.data.status === "success") {
        const sortedItems = response.data.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setItems(sortedItems);
      } else {
        setError('Failed to load service request items');
      }
    } catch (error) {
      console.error('Error fetching service request items:', error);
      setError('Failed to load service request items');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchServiceRequestItems();
  }, [selectedCompany, userId]);

  useEffect(() => {
    let results = items;
    
    if (selectedCompany) {
      results = results.filter(item => 
        item.company === selectedCompany
      );
    }
    
    if (searchTerm) {
      results = results.filter(item =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(results);
    setCurrentPage(1);
  }, [selectedCompany, searchTerm, items]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleDeleteItem = (srItemId) => {
    if (window.confirm('Are you sure you want to delete this service request item? This action cannot be undone.')) {
      axios
        .delete(`${baseURL}/service-req-items-history/${srItemId}/?user_id=${userId}&company_id=${selectedCompany}`)
        .then(response => {
          console.log("Service request item deleted successfully", response);
          alert('Service request item deleted successfully');
          fetchServiceRequestItems();
        })
        .catch(error => {
          console.error("Error deleting service request item:", error);
          alert("Failed to delete service request item. Please try again.");
        });
    }
  };

  if (loading) return <div className="text-center my-4">Loading service request items...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap">
        <div>
          <h2 className="customer-title mb-0">Service Request Items History</h2>
          <p className="customer-subtitle mb-0 text-muted">
            {selectedCompany ? `Showing service request items for ${selectedCompany}` : 'Showing all service request items'}
          </p>
        </div>
        {/* <button onClick={toggleForm} className="btn btn-primary">
          Add New Item
        </button> */}
      </div>
      
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
          placeholder="Search service request items..."
          className="form-control w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive mb-4">
        <table className="table">
          <thead className="new-customer-table-header">
            <tr>
              <th>S.No</th>
              <th>SR Item ID</th>
              <th>Service Request</th>
              <th>Component Type</th>
              <th>Component</th>
              <th>Task Type</th>
              <th>Old Serial No</th>
              <th>New Serial No</th>
              <th>Warranty Start</th>
              <th>Warranty End</th>
              <th>Action Taken</th>
              <th>Serviced By</th>
              {/* <th>Serviced At</th> */}
              <th>Created At</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {currentEntries.length > 0 ? (
              currentEntries.map((item, index) => (
                <tr key={index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{item.sr_item_id}</td>
                  <td>{item.service_request}</td>
                  <td>{item.component_type}</td>
                  <td>{item.component}</td>
                  <td>{item.task_type}</td>
                  <td>{item.old_comp_serial_no || '-'}</td>
                  <td>{item.new_comp_serial_no || '-'}</td>
                  <td>{formatDate(item.warranty_start_date)}</td>
                  <td>{formatDate(item.warranty_end_date)}</td>
                  <td>{item.action_taken || '-'}</td>
                  <td>{item.serviced_by}</td>
                  {/* <td>{formatDateTime(item.serviced_at)}</td> */}
                  <td>{formatDateTime(item.created_at)}</td>
                  {/* <td>
                    <div className="d-flex gap-2">
                      <FaEye 
                        style={{ 
                          color: "#0d6efd", 
                          cursor: "pointer",
                          fontSize: "18px"
                        }}
                        onClick={() => onViewItem(item)}
                        title="View Item"
                      />
                      <FaEdit 
                        style={{ 
                          color: "#ffc107", 
                          cursor: "pointer",
                          fontSize: "18px"
                        }}
                        onClick={() => onEditItem(item)}
                        title="Edit Item"
                      />
                      <FaTrashAlt 
                        style={{ 
                          color: "#dc3545", 
                          cursor: "pointer",
                          fontSize: "18px"
                        }}
                        onClick={() => handleDeleteItem(item.sr_item_id)}
                        title="Delete Item"
                      />
                    </div>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="text-center">
                  {selectedCompany 
                    ? `No service request items found for ${selectedCompany}${searchTerm ? ' matching your search' : ''}`
                    : 'No service request items found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
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
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default ServiceRequestItemsTable;