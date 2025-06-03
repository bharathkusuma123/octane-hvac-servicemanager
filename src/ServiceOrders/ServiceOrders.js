import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ServiceOrders = () => {
  const [serviceOrders, setServiceOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceOrders = async () => {
      try {
        const response = await axios.get('http://175.29.21.7:8006/service-orders/');
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        setServiceOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching service orders:', err);
      }
    };

    fetchServiceOrders();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredOrders(serviceOrders);
    } else {
      const filtered = serviceOrders.filter(order =>
        Object.values(order).some(
          val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setFilteredOrders(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, serviceOrders]);

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredOrders.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredOrders.length / entriesPerPage);

  if (loading) return <div className="text-center mt-4">Loading service orders...</div>;
  if (error) return <div className="text-center mt-4 text-danger">Error: {error}</div>;

  return (
    <div className="service-container pm-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div>
          <h2 className="pm-title">Service Orders</h2>
          <p className="pm-subtitle">Manage all service order records</p>
        </div>
      </div>

      {/* Search and Entries Per Page */}
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
            <option value={50}>50</option>
          </select>
          entries
        </div>
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Search service orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Order No</th>
              <th>Request ID</th>
              <th>Source</th>
              <th>Service Item</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Resource</th>
              <th>Created At</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {currentEntries.length > 0 ? (
              currentEntries.map((order, index) => (
                <tr key={order.dynamics_service_order_no || index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{order.dynamics_service_order_no}</td>
                  <td>{order.service_request_id}</td>
                  <td>{order.source}</td>
                  <td>{order.service_item}</td>
                  <td>{order.customer}</td>
                  <td>
                    <span className={`badge ${
                      order.status === 'Assigned' ? 'bg-primary' :
                      order.status === 'Service Completed' ? 'bg-success' :
                      order.status === 'Declined' ? 'bg-danger' :
                      'bg-secondary'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.resource}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  {/* <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary">
                        <FaEye />
                      </button>
                      <button className="btn btn-sm btn-outline-secondary">
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <FaTrash />
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">No service orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="pagination-controls d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-primary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className="align-self-center mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceOrders;