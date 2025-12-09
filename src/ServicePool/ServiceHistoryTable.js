// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import baseURL from '../ApiUrl/Apiurl';
// import { useCompany } from "../AuthContext/CompanyContext";
// import { AuthContext } from "../AuthContext/AuthContext";
// import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';

// const ServiceRequestItemsTable = ({ toggleForm, onEditItem, onViewItem }) => {
//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { selectedCompany } = useCompany();
//   const { userId } = useContext(AuthContext);

//   const fetchServiceRequestItems = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       if (!userId || !selectedCompany) {
//         setError('Missing user ID or company ID');
//         return;
//       }
      
//       const response = await axios.get(
//         `${baseURL}/service-req-items-history/?user_id=${userId}&company_id=${selectedCompany}`
//       );
      
//       if (response.data.status === "success") {
//         const sortedItems = response.data.data.sort((a, b) => 
//           new Date(b.created_at) - new Date(a.created_at)
//         );
//         setItems(sortedItems);
//       } else {
//         setError('Failed to load service request items');
//       }
//     } catch (error) {
//       console.error('Error fetching service request items:', error);
//       setError('Failed to load service request items');
//     } finally {
//       setLoading(false); 
//     }
//   };

//   useEffect(() => {
//     fetchServiceRequestItems();
//   }, [selectedCompany, userId]);

//   useEffect(() => {
//     let results = items;
    
//     if (selectedCompany) {
//       results = results.filter(item => 
//         item.company === selectedCompany
//       );
//     }
    
//     if (searchTerm) {
//       results = results.filter(item =>
//         Object.values(item)
//           .join(" ")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       );
//     }
    
//     setFilteredItems(results);
//     setCurrentPage(1);
//   }, [selectedCompany, searchTerm, items]);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '-';
//     const date = new Date(dateTimeString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     return `${day}/${month}/${year} ${hours}:${minutes}`;
//   };

//   const handleDeleteItem = (srItemId) => {
//     if (window.confirm('Are you sure you want to delete this service request item? This action cannot be undone.')) {
//       axios
//         .delete(`${baseURL}/service-req-items-history/${srItemId}/?user_id=${userId}&company_id=${selectedCompany}`)
//         .then(response => {
//           console.log("Service request item deleted successfully", response);
//           alert('Service request item deleted successfully');
//           fetchServiceRequestItems();
//         })
//         .catch(error => {
//           console.error("Error deleting service request item:", error);
//           alert("Failed to delete service request item. Please try again.");
//         });
//     }
//   };

//   if (loading) return <div className="text-center my-4">Loading service request items...</div>;
//   if (error) return <div className="alert alert-danger my-4">{error}</div>;

//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap">
//         <div>
//           <h2 className="customer-title mb-0">Service Request Items History</h2>
//           <p className="customer-subtitle mb-0 text-muted">
//             {selectedCompany ? `Showing service request items for ${selectedCompany}` : 'Showing all service request items'}
//           </p>
//         </div>
//         {/* <button onClick={toggleForm} className="btn btn-primary">
//           Add New Item
//         </button> */}
//       </div>
      
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
//         <div className="d-flex align-items-center gap-2">
//           Show
//           <select
//             value={entriesPerPage}
//             onChange={(e) => setEntriesPerPage(Number(e.target.value))}
//             className="form-select form-select-sm w-auto"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//           </select>
//           entries
//         </div>

//         <input
//           type="text"
//           placeholder="Search service request items..."
//           className="form-control w-auto"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="table-responsive mb-4">
//         <table className="table">
//           <thead className="new-customer-table-header">
//             <tr>
//               <th>S.No</th>
//               <th>SR Item ID</th>
//               <th>Service Request</th>
//               <th>Component Type</th>
//               <th>Component</th>
//               <th>Task Type</th>
//               <th>Old Serial No</th>
//               <th>New Serial No</th>
//               <th>Warranty Start</th>
//               <th>Warranty End</th>
//               <th>Action Taken</th>
//               <th>Serviced By</th>
//               {/* <th>Serviced At</th> */}
//               <th>Created At</th>
//               {/* <th>Actions</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {currentEntries.length > 0 ? (
//               currentEntries.map((item, index) => (
//                 <tr key={index}>
//                   <td>{indexOfFirstEntry + index + 1}</td>
//                   <td>{item.sr_item_id}</td>
//                   <td>{item.service_request}</td>
//                   <td>{item.component_type}</td>
//                   <td>{item.component}</td>
//                   <td>{item.task_type}</td>
//                   <td>{item.old_comp_serial_no || '-'}</td>
//                   <td>{item.new_comp_serial_no || '-'}</td>
//                   <td>{formatDate(item.warranty_start_date)}</td>
//                   <td>{formatDate(item.warranty_end_date)}</td>
//                   <td>{item.action_taken || '-'}</td>
//                   <td>{item.serviced_by}</td>
//                   {/* <td>{formatDateTime(item.serviced_at)}</td> */}
//                   <td>{formatDateTime(item.created_at)}</td>
//                   {/* <td>
//                     <div className="d-flex gap-2">
//                       <FaEye 
//                         style={{ 
//                           color: "#0d6efd", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => onViewItem(item)}
//                         title="View Item"
//                       />
//                       <FaEdit 
//                         style={{ 
//                           color: "#ffc107", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => onEditItem(item)}
//                         title="Edit Item"
//                       />
//                       <FaTrashAlt 
//                         style={{ 
//                           color: "#dc3545", 
//                           cursor: "pointer",
//                           fontSize: "18px"
//                         }}
//                         onClick={() => handleDeleteItem(item.sr_item_id)}
//                         title="Delete Item"
//                       />
//                     </div>
//                   </td> */}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="15" className="text-center">
//                   {selectedCompany 
//                     ? `No service request items found for ${selectedCompany}${searchTerm ? ' matching your search' : ''}`
//                     : 'No service request items found'}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <nav aria-label="Page navigation">
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//             </li>

//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <li
//                 key={page}
//                 className={`page-item ${currentPage === page ? "active" : ""}`}
//               >
//                 <button className="page-link" onClick={() => setCurrentPage(page)}>
//                   {page}
//                 </button>
//               </li>
//             ))}

//             <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       )}
//     </>
//   );
// };

// export default ServiceRequestItemsTable;




//===============================================================
// After fixing filter -Global search issue 


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
  const [users, setUsers] = useState([]); // To store user data for search
  const [components, setComponents] = useState([]); // To store component data for search

  // Fetch users data for username search
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/`);
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch components data for component name search
  const fetchComponents = async () => {
    try {
      const response = await axios.get(`${baseURL}/components/`);
      if (response.data.status === "success" && Array.isArray(response.data.data)) {
        setComponents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

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
    fetchUsers();
    fetchComponents();
    fetchServiceRequestItems();
  }, [selectedCompany, userId]);

  // Function to get username from user_id
  const getUsernameById = (userId) => {
    if (!userId || users.length === 0) return userId;
    
    const user = users.find(user => user.user_id === userId);
    return user ? user.username : userId;
  };

  // Function to get component name from component_id
  const getComponentName = (componentId) => {
    if (!componentId || components.length === 0) return componentId;
    
    const component = components.find(comp => comp.component_id === componentId);
    return component ? component.component_name : componentId;
  };

  // Function to get user search data (both ID and username)
  const getUserSearchData = (userId) => {
    if (!userId) return '';
    const user = users.find(user => user.user_id === userId);
    return user ? `${userId} ${user.username}` : userId;
  };

  // Function to get component search data (both ID and name)
  const getComponentSearchData = (componentId) => {
    if (!componentId) return '';
    const component = components.find(comp => comp.component_id === componentId);
    return component ? `${componentId} ${component.component_name}` : componentId;
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to format date-time for display
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

  // Function to format date in multiple formats for search
  const formatDateForSearch = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const monthName = date.toLocaleString('en-IN', { month: 'long' });
    const monthShort = date.toLocaleString('en-IN', { month: 'short' });
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    
    // Return multiple formats for better searchability
    return [
      `${day}/${month}/${year}`,                    // DD/MM/YYYY
      `${day}/${month}/${year} ${hour}:${minute}:${second}`, // DD/MM/YYYY HH:MM:SS
      `${month}/${day}/${year}`,                    // MM/DD/YYYY
      `${year}-${month}-${day}`,                    // YYYY-MM-DD
      `${year}${month}${day}`,                      // YYYYMMDD
      `${day}-${month}-${year}`,                    // DD-MM-YYYY
      date.toISOString(),                           // ISO string
      monthName,                                    // January, February
      monthShort,                                   // Jan, Feb
      `${year}`,                                    // 2024
      `${month}/${year}`,                           // MM/YYYY
      `${day} ${monthName} ${year}`,               // 15 January 2024
      `${day} ${monthShort} ${year}`,              // 15 Jan 2024
      `${hour}:${minute}`,                          // HH:MM
      `${hour}:${minute}:${second}`,               // HH:MM:SS
    ].join(' ');
  };

  // Enhanced global search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      let results = items;
      if (selectedCompany) {
        results = results.filter(item => item.company === selectedCompany);
      }
      setFilteredItems(results);
      setCurrentPage(1);
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    const filtered = items.filter((item) => {
      // Filter by company first
      if (selectedCompany && item.company !== selectedCompany) {
        return false;
      }

      // Get user data for search
      const createdBySearch = getUserSearchData(item.created_by);
      const updatedBySearch = getUserSearchData(item.updated_by);
      const servicedBySearch = getUserSearchData(item.serviced_by);
      
      // Get component data for search
      const componentSearch = getComponentSearchData(item.component);
      
      // Get dates in multiple formats for search
      const createdDateFormats = formatDateForSearch(item.created_at);
      const updatedDateFormats = formatDateForSearch(item.updated_at);
      const servicedDateFormats = formatDateForSearch(item.serviced_at);
      const warrantyStartFormats = formatDateForSearch(item.warranty_start_date);
      const warrantyEndFormats = formatDateForSearch(item.warranty_end_date);
      
      // Create a comprehensive search string
      const searchableText = [
        // Raw item data
        item.sr_item_id || '',
        item.service_request || '',
        item.component_type || '',
        item.component || '',
        item.task_type || '',
        item.old_comp_serial_no || '',
        item.new_comp_serial_no || '',
        item.warranty_start_date || '',
        item.warranty_end_date || '',
        item.action_taken || '',
        item.serviced_by || '',
        item.created_by || '',
        item.updated_by || '',
        item.created_at || '',
        item.updated_at || '',
        item.serviced_at || '',
        item.company || '',
        item.status || '',
        item.remarks || '',
        item.cost || '',
        item.priority || '',
        
        // Formatted user data for search
        createdBySearch,
        updatedBySearch,
        servicedBySearch,
        
        // Formatted component data for search
        componentSearch,
        
        // Dates in multiple formats
        createdDateFormats,
        updatedDateFormats,
        servicedDateFormats,
        warrantyStartFormats,
        warrantyEndFormats,
        
        // Display values (exactly as shown in table)
        formatDate(item.warranty_start_date),
        formatDate(item.warranty_end_date),
        formatDateTime(item.created_at),
        formatDateTime(item.serviced_at),
        getUsernameById(item.serviced_by),
        getComponentName(item.component),
        
        // Task type variations for better search
        item.task_type === 'Repair' ? 'Repair fix mend' : '',
        item.task_type === 'Replacement' ? 'Replacement replace change' : '',
        item.task_type === 'Maintenance' ? 'Maintenance service' : '',
        item.task_type === 'Inspection' ? 'Inspection check examine' : '',
        item.task_type === 'Installation' ? 'Installation install setup' : '',
        item.task_type === 'Calibration' ? 'Calibration calibrate adjust' : '',
        
        // Component type variations
        item.component_type === 'Hardware' ? 'Hardware physical equipment' : '',
        item.component_type === 'Software' ? 'Software program application' : '',
        item.component_type === 'Electrical' ? 'Electrical electric wiring' : '',
        item.component_type === 'Mechanical' ? 'Mechanical mechanical parts' : '',
        
        // Action taken variations
        item.action_taken === 'Fixed' ? 'Fixed repaired resolved' : '',
        item.action_taken === 'Replaced' ? 'Replaced changed swapped' : '',
        item.action_taken === 'Adjusted' ? 'Adjusted tuned calibrated' : '',
        item.action_taken === 'Cleaned' ? 'Cleaned cleaned maintenance' : '',
        
        // Status variations
        item.status === 'Completed' ? 'Completed done finished' : '',
        item.status === 'Pending' ? 'Pending waiting incomplete' : '',
        item.status === 'In Progress' ? 'In Progress ongoing working' : '',
        item.status === 'Cancelled' ? 'Cancelled canceled stopped' : '',
        
        // Priority variations
        item.priority === 'High' ? 'High urgent critical' : '',
        item.priority === 'Medium' ? 'Medium normal regular' : '',
        item.priority === 'Low' ? 'Low minor trivial' : '',
        
        // Serial number variations
        item.old_comp_serial_no ? `old serial ${item.old_comp_serial_no}` : '',
        item.new_comp_serial_no ? `new serial ${item.new_comp_serial_no}` : '',
        
        // Company search
        selectedCompany ? `company ${selectedCompany}` : '',
        
        // Add any other properties that might exist
        ...Object.values(item).filter(val => 
          val !== null && val !== undefined
        ).map(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return String(val);
          }
          if (typeof val === 'boolean') {
            return val ? 'true yes active' : 'false no inactive';
          }
          if (Array.isArray(val)) {
            return val.join(' ');
          }
          if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val);
          }
          return '';
        })
      ]
      .join(' ')                    // Combine into one string
      .toLowerCase()                // Make case-insensitive
      .replace(/\s+/g, ' ')         // Normalize spaces
      .trim();
      
      return searchableText.includes(searchLower);
    });
    
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchTerm, items, users, components, selectedCompany]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredItems.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

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

        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            placeholder="Search in all columns..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: '250px' }}
          />
          {searchTerm && (
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="alert alert-info mb-3">
          <strong>Search Results:</strong> Found {filteredItems.length} item(s) matching "{searchTerm}"
        </div>
      )}

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
              <th>Created At</th>
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
                  <td>{getComponentName(item.component)}</td>
                  <td>{item.task_type}</td>
                  <td>{item.old_comp_serial_no || '-'}</td>
                  <td>{item.new_comp_serial_no || '-'}</td>
                  <td>{formatDate(item.warranty_start_date)}</td>
                  <td>{formatDate(item.warranty_end_date)}</td>
                  <td>{item.action_taken || '-'}</td>
                  <td>{getUsernameById(item.serviced_by)}</td>
                  <td>{formatDateTime(item.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="text-center">
                  {searchTerm 
                    ? `No service request items found matching "${searchTerm}"`
                    : selectedCompany 
                      ? `No service request items found for ${selectedCompany}`
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

            {(() => {
              const maxVisiblePages = 5;
              let pageNumbers = [];
              
              if (totalPages <= maxVisiblePages) {
                for (let i = 1; i <= totalPages; i++) {
                  pageNumbers.push(i);
                }
              } else {
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(i);
                }
              }
              
              return pageNumbers.map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                </li>
              ));
            })()}

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