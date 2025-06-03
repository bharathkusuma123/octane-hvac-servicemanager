// import React, { useEffect, useState } from 'react';
// import './NewServiceItem.css';
// import axios from 'axios';

// const ServiceItemTable = ({ onAddNew }) => {
//   const [serviceItems, setServiceItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchServiceItems = async () => {
//       try {
//         const response = await axios.get('http://175.29.21.7:8006/service-items/');
//         setServiceItems(response.data.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch service items:', error);
//         setLoading(false);
//       }
//     };

//     fetchServiceItems();
//   }, []);

//   return (
//     <div className="service-item-container">
//       <h2 className="service-item-title">Service Items</h2>
//       <p className="service-item-subtitle">Manage service items</p>
//       <hr />

//       <div className="d-flex justify-content-end mb-3">
//         <button 
//           onClick={onAddNew}
//           className="btn btn-primary service-item-btn service-item-save"
//         >
//           Add New Service Item
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading service items...</p>
//       ) : (
//         <div className="table-responsive">
//           <table className="table table-striped table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th>ID</th>
//                 <th>Service S.No.</th>
//                 <th>Customer</th>
//                 <th>Product</th>
//                 <th>Location</th>
//                 <th>Latitude</th>
//                 <th>Longitude</th>
//                 <th>Installation Date</th>
//                 <th>Warranty End</th>
//                 <th>Status</th>
//                 <th>IoT Status</th>
//                 <th>Last Service</th>
//                 <th>PM Group</th>
//                 <th>Description</th>
//               </tr>
//             </thead>
//             <tbody>
//               {serviceItems.map(item => (
//                 <tr key={item.service_item_id}>
//                   <td>{item.service_item_id}</td>
//                   <td>{item.serial_number}</td>
//                    <td>{item.user}</td>
//                   <td>{item.product}</td>
//                   <td>{item.location}</td>
//                   <td>{item.location_latitude}</td>
//                   <td>{item.location_longitude}</td>
//                   <td>{item.installation_date}</td>
//                   <td>{item.warranty_end_date}</td>
//                   <td>
//                     <span className={`badge ${
//                       item.status === 'Active' ? 'bg-success' :
//                       item.status === 'Service Due' ? 'bg-warning text-dark' :
//                       'bg-secondary'
//                     }`}>
//                       {item.status}
//                     </span>
//                   </td>
//                   <td>
//                     <span className={`badge ${
//                       item.iot_status === 'Online' ? 'bg-success' : 'bg-danger'
//                     }`}>
//                       {item.iot_status}
//                     </span>
//                   </td>
//                   <td>{item.last_service ? new Date(item.last_service).toLocaleDateString() : 'Never'}</td>
//                   <td>{item.pm_group || 'N/A'}</td>
//                    <td>{item.product_description || 'N/A'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServiceItemTable;



import React, { useEffect, useState } from 'react';
import './NewServiceItem.css';
import axios from 'axios';

const ServiceItemTable = ({ onAddNew }) => {
  const [serviceItems, setServiceItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        const response = await axios.get('http://175.29.21.7:8006/service-items/');
        const sortedData = response.data.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setServiceItems(sortedData);
        setFilteredItems(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch service items:', error);
        setLoading(false);
      }
    };

    fetchServiceItems();
  }, []);

  useEffect(() => {
    const filtered = serviceItems.filter(item =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, serviceItems]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

  return (
    <div className="service-item-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div>
          <h2 className="service-item-title mb-0">Service Items</h2>
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
      ) : (
        <div className="table-responsive mb-4">
          <table className="table ">
            <thead className="service-item-table-header">
              <tr>
                <th>S.No</th>
                <th>Service Item ID</th>
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
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item.service_item_id}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td>{item.service_item_id}</td>
                    <td>{item.customer}</td>
                    <td>{item.pm_group}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center">No service items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {/* {!loading && filteredItems.length > 0 && (
        <div className="pagination-controls d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-primary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span className="align-self-center mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )} */}

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
