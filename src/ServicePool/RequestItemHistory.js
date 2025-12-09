// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { FaEye, FaTrashAlt, FaEdit } from "react-icons/fa";
// import baseURL from "../ApiUrl/Apiurl";
// import { AuthContext } from "../AuthContext/AuthContext";
// import { useCompany } from "../AuthContext/CompanyContext";

// const RequestItemHistory = () => {
//   const { request_id } = useParams();
//   console.log("Request ID from URL:", request_id);
//   const { userId } = useContext(AuthContext);
//   const { selectedCompany } = useCompany();

//   const [items, setItems] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Format Functions
//   const formatDate = (dateStr) =>
//     dateStr ? new Date(dateStr).toLocaleDateString("en-IN") : "-";

//   const formatDateTime = (dateTime) =>
//     dateTime
//       ? new Date(dateTime).toLocaleString("en-IN", {
//           hour12: true,
//         })
//       : "-";

//   // Fetch Data
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch(
//           `${baseURL}/service-req-items-history/?user_id=${userId}&company_id=${selectedCompany}`
//         );

//         const json = await res.json();
//         console.log("Fetch Response:", json);

//         if (json.status === "success") {
//           // match service_request === request_id
//           const matched = json.data.filter(
//             (item) => item.service_request === request_id
//           );

//           setItems(matched);
//           setFilteredItems(matched);
//         }
//       } catch (err) {
//         console.error("Fetch Error:", err);
//       }
//     };

//     fetchHistory();
//   }, [request_id, selectedCompany, userId]);

//   // Search filter
//   useEffect(() => {
//     const result = items.filter((item) =>
//       Object.values(item)
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//     setFilteredItems(result);
//   }, [searchTerm, items]);

//   // Pagination
//   const indexOfLast = currentPage * entriesPerPage;
//   const indexOfFirst = indexOfLast - entriesPerPage;
//   const currentEntries = filteredItems.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

//   return (
//     <>
//       {/* HEADER */}
//       <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap">
//         <div>
//           <h2 className="customer-title mb-0">Service Request Items History</h2>
//           <p className="customer-subtitle mb-0 text-muted">
//             Showing history for: <strong>{request_id}</strong>
//           </p>
//         </div>
//       </div>

//       {/* FILTERS */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
//         <div className="d-flex align-items-center gap-2">
//           Show
//           <select
//             value={entriesPerPage}
//             onChange={(e) => {
//               setEntriesPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
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

//       {/* TABLE */}
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
//               <th>Created At</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentEntries.length > 0 ? (
//               currentEntries.map((item, index) => (
//                 <tr key={index}>
//                   <td>{indexOfFirst + index + 1}</td>
//                   <td>{item.sr_item_id}</td>
//                   <td>{item.service_request}</td>
//                   <td>{item.component_type}</td>
//                   <td>{item.component}</td>
//                   <td>{item.task_type}</td>
//                   <td>{item.old_comp_serial_no || "-"}</td>
//                   <td>{item.new_comp_serial_no || "-"}</td>
//                   <td>{formatDate(item.warranty_start_date)}</td>
//                   <td>{formatDate(item.warranty_end_date)}</td>
//                   <td>{item.action_taken || "-"}</td>
//                   <td>{item.serviced_by}</td>
//                   <td>{formatDateTime(item.created_at)}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="15" className="text-center">
//                   No history found for this service request.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* PAGINATION */}
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

//             {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//               (page) => (
//                 <li
//                   key={page}
//                   className={`page-item ${
//                     currentPage === page ? "active" : ""
//                   }`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </button>
//                 </li>
//               )
//             )}

//             <li
//               className={`page-item ${
//                 currentPage === totalPages ? "disabled" : ""
//               }`}
//             >
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

// export default RequestItemHistory;


//===============================================================
// After fixing filter -Global search issue 



import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FaEye, FaTrashAlt, FaEdit } from "react-icons/fa";
import baseURL from "../ApiUrl/Apiurl";
import { AuthContext } from "../AuthContext/AuthContext";
import { useCompany } from "../AuthContext/CompanyContext";

const RequestItemHistory = () => {
  const { request_id } = useParams();
  console.log("Request ID from URL:", request_id);
  const { userId } = useContext(AuthContext);
  const { selectedCompany } = useCompany();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Additional data for global search
  const [usersData, setUsersData] = useState([]);
  const [componentsData, setComponentsData] = useState([]);
  const [serviceRequestsData, setServiceRequestsData] = useState([]);
  const [vendorsData, setVendorsData] = useState([]);
  const [serviceEngineersData, setServiceEngineersData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch additional data for global search
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        // Fetch users data
        const usersRes = await fetch(`${baseURL}/users/`);
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (Array.isArray(usersData)) {
            setUsersData(usersData);
          }
        }

        // Fetch components data
        const componentsRes = await fetch(`${baseURL}/components/`);
        if (componentsRes.ok) {
          const componentsData = await componentsRes.json();
          if (componentsData.status === "success") {
            setComponentsData(componentsData.data || []);
          }
        }

        // Fetch service requests data
        const serviceRequestsRes = await fetch(`${baseURL}/service-pools/`);
        if (serviceRequestsRes.ok) {
          const serviceRequestsData = await serviceRequestsRes.json();
          if (serviceRequestsData.status === "success") {
            setServiceRequestsData(serviceRequestsData.data || []);
          }
        }

        // Fetch vendors data
        const vendorsRes = await fetch(`${baseURL}/vendors/`);
        if (vendorsRes.ok) {
          const vendorsData = await vendorsRes.json();
          if (vendorsData.status === "success") {
            setVendorsData(vendorsData.data || []);
          }
        }

        // Fetch service engineers data
        const engineersRes = await fetch(`${baseURL}/resources/`);
        if (engineersRes.ok) {
          const engineersData = await engineersRes.json();
          if (engineersData.status === "success") {
            setServiceEngineersData(engineersData.data || []);
          }
        }

      } catch (error) {
        console.error("Error fetching data for global search:", error);
      }
    };

    fetchAdditionalData();
  }, []);

  // Function to get username from user ID
  const getUsernameById = (userId) => {
    if (!userId || usersData.length === 0) return userId;
    
    const user = usersData.find(user => user.user_id === userId);
    return user ? user.username : userId;
  };

  // Function to get user search data (both ID and username)
  const getUserSearchData = (userId) => {
    if (!userId) return '';
    const user = usersData.find(user => user.user_id === userId);
    return user ? `${userId} ${user.username} ${user.email || ''}` : userId;
  };

  // Function to get component name by component ID
  const getComponentName = (componentId) => {
    if (!componentId || componentsData.length === 0) return componentId;
    
    const component = componentsData.find(comp => comp.component_id === componentId);
    return component ? component.component_name : componentId;
  };

  // Function to get component search data (both ID and name)
  const getComponentSearchData = (componentId) => {
    if (!componentId) return '';
    const component = componentsData.find(comp => comp.component_id === componentId);
    return component ? `${componentId} ${component.component_name} ${component.description || ''}` : componentId;
  };

  // Function to get service request details by ID
  const getServiceRequestDetails = (requestId) => {
    if (!requestId || serviceRequestsData.length === 0) return null;
    
    const request = serviceRequestsData.find(req => req.request_id === requestId);
    return request;
  };

  // Function to get vendor name by vendor ID
  const getVendorName = (vendorId) => {
    if (!vendorId || vendorsData.length === 0) return vendorId;
    
    const vendor = vendorsData.find(vendor => vendor.vendor_id === vendorId);
    return vendor ? vendor.vendor_name : vendorId;
  };

  // Function to get service engineer name by ID
  const getServiceEngineerName = (engineerId) => {
    if (!engineerId || serviceEngineersData.length === 0) return engineerId;
    
    const engineer = serviceEngineersData.find(eng => eng.resource_id === engineerId);
    return engineer ? `${engineer.first_name} ${engineer.last_name}` : engineerId;
  };

  // Function to get service engineer search data
  const getServiceEngineerSearchData = (engineerId) => {
    if (!engineerId) return '';
    const engineer = serviceEngineersData.find(eng => eng.resource_id === engineerId);
    return engineer ? `${engineerId} ${engineer.first_name} ${engineer.last_name} ${engineer.email}` : engineerId;
  };

  // Format Functions
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-IN") : "-";

  const formatDateTime = (dateTime) =>
    dateTime
      ? new Date(dateTime).toLocaleString("en-IN", {
          hour12: true,
        })
      : "-";

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
    
    return [
      `${day}/${month}/${year}`,                    // DD/MM/YYYY
      `${month}/${day}/${year}`,                    // MM/DD/YYYY
      `${year}-${month}-${day}`,                    // YYYY-MM-DD
      `${year}${month}${day}`,                      // YYYYMMDD
      `${day}-${month}-${year}`,                    // DD-MM-YYYY
      monthName,                                    // January, February
      monthShort,                                   // Jan, Feb
      `${year}`,                                    // 2024
      `${month}/${year}`,                           // MM/YYYY
      `${day} ${monthName} ${year}`,               // 15 January 2024
      `${day} ${monthShort} ${year}`,              // 15 Jan 2024
    ].join(' ');
  };

  // Fetch Data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${baseURL}/service-req-items-history/?user_id=${userId}&company_id=${selectedCompany}`
        );

        const json = await res.json();
        console.log("Fetch Response:", json);

        if (json.status === "success") {
          // match service_request === request_id
          const matched = json.data.filter(
            (item) => item.service_request === request_id
          );

          setItems(matched);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchHistory();
  }, [request_id, selectedCompany, userId]);

  // Enhanced global search functionality
  const enhancedFilteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return items.filter((item) => {
      // Get user data for search
      const createdBySearch = getUserSearchData(item.created_by);
      const updatedBySearch = getUserSearchData(item.updated_by);
      const servicedBySearch = getServiceEngineerSearchData(item.serviced_by);
      
      // Get other relational data for search
      const componentSearch = getComponentSearchData(item.component);
      const serviceEngineerSearch = getServiceEngineerSearchData(item.serviced_by);
      const vendorSearch = getVendorName(item.vendor);
      
      // Get service request details
      const serviceRequestDetails = getServiceRequestDetails(item.service_request);
      const requestDetailsText = serviceRequestDetails ? 
        `${serviceRequestDetails.request_details || ''} ${serviceRequestDetails.status || ''}` : '';
      
      // Get dates in multiple formats for search
      const warrantyStartFormats = formatDateForSearch(item.warranty_start_date);
      const warrantyEndFormats = formatDateForSearch(item.warranty_end_date);
      const createdDateFormats = formatDateForSearch(item.created_at);
      const updatedDateFormats = formatDateForSearch(item.updated_at);
      
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
        item.vendor || '',
        item.warranty_start_date || '',
        item.warranty_end_date || '',
        item.action_taken || '',
        item.notes || '',
        item.status || '',
        item.serviced_by || '',
        item.created_by || '',
        item.updated_by || '',
        item.created_at || '',
        item.updated_at || '',
        item.quantity || '',
        item.unit_price || '',
        item.total_price || '',
        item.currency || '',
        item.part_number || '',
        item.batch_number || '',
        item.manufacturing_date || '',
        item.expiry_date || '',
        item.installation_date || '',
        item.repair_date || '',
        item.replacement_date || '',
        
        // Formatted relational data
        createdBySearch,
        updatedBySearch,
        servicedBySearch,
        componentSearch,
        serviceEngineerSearch,
        vendorSearch,
        
        // Service request details
        requestDetailsText,
        
        // Dates in multiple formats
        warrantyStartFormats,
        warrantyEndFormats,
        createdDateFormats,
        updatedDateFormats,
        
        // Display values (exactly as shown in table)
        formatDate(item.warranty_start_date),
        formatDate(item.warranty_end_date),
        formatDateTime(item.created_at),
        getUsernameById(item.created_by),
        getUsernameById(item.updated_by),
        getComponentName(item.component),
        getServiceEngineerName(item.serviced_by),
        getVendorName(item.vendor),
        
        // Component type variations for search
        item.component_type === 'Spare Part' ? 'spare part component replacement' : '',
        item.component_type === 'Consumable' ? 'consumable disposable material' : '',
        item.component_type === 'Tool' ? 'tool equipment instrument' : '',
        item.component_type === 'Accessory' ? 'accessory add-on attachment' : '',
        
        // Task type variations
        item.task_type === 'Installation' ? 'installation install setup' : '',
        item.task_type === 'Repair' ? 'repair fix maintenance service' : '',
        item.task_type === 'Replacement' ? 'replacement change swap' : '',
        item.task_type === 'Inspection' ? 'inspection check examination' : '',
        item.task_type === 'Calibration' ? 'calibration adjustment tuning' : '',
        item.task_type === 'Cleaning' ? 'cleaning wash maintenance' : '',
        
        // Action taken variations
        item.action_taken === 'Installed' ? 'installed fitted mounted' : '',
        item.action_taken === 'Repaired' ? 'repaired fixed mended' : '',
        item.action_taken === 'Replaced' ? 'replaced changed swapped' : '',
        item.action_taken === 'Cleaned' ? 'cleaned washed maintained' : '',
        item.action_taken === 'Adjusted' ? 'adjusted tuned calibrated' : '',
        item.action_taken === 'Tested' ? 'tested checked verified' : '',
        
        // Status variations
        item.status === 'Completed' ? 'completed finished done' : '',
        item.status === 'Pending' ? 'pending waiting incomplete' : '',
        item.status === 'In Progress' ? 'in progress ongoing working' : '',
        item.status === 'Cancelled' ? 'cancelled stopped aborted' : '',
        item.status === 'On Hold' ? 'on hold paused waiting' : '',
        
        // Serial number variations
        item.old_comp_serial_no ? `old serial ${item.old_comp_serial_no}` : '',
        item.new_comp_serial_no ? `new serial ${item.new_comp_serial_no}` : '',
        
        // Notes variations
        item.notes ? `notes comments remarks ${item.notes}` : '',
        
        // Quantity and price variations
        item.quantity ? `quantity qty amount ${item.quantity}` : '',
        item.unit_price ? `unit price cost ${item.unit_price}` : '',
        item.total_price ? `total price amount ${item.total_price}` : '',
        item.currency ? `currency money ${item.currency}` : '',
        
        // Part and batch variations
        item.part_number ? `part number part code ${item.part_number}` : '',
        item.batch_number ? `batch lot batch number ${item.batch_number}` : '',
        
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
  }, [searchTerm, items, usersData, componentsData, serviceRequestsData, 
      vendorsData, serviceEngineersData]);

  // Update filteredItems when enhancedFilteredItems changes
  useEffect(() => {
    setFilteredItems(enhancedFilteredItems);
    setCurrentPage(1);
  }, [enhancedFilteredItems]);

  // Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentEntries = filteredItems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);

  return (
    <>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap">
        <div>
          <h2 className="customer-title mb-0">Service Request Items History</h2>
          <p className="customer-subtitle mb-0 text-muted">
            Showing history for: <strong>{request_id}</strong>
          </p>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="alert alert-info mb-3 py-2">
          <strong>Search Results:</strong> Found {filteredItems.length} history item(s) matching "{searchTerm}"
        </div>
      )}

      {/* FILTERS */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          Show
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
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
            placeholder="Search in all columns..."
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

      {/* TABLE */}
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
                <tr key={item.sr_item_id || index}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{item.sr_item_id}</td>
                  <td title={`Service Request ID: ${item.service_request}`}>
                    {item.service_request}
                  </td>
                  <td>{item.component_type}</td>
                  <td title={`Component ID: ${item.component}`}>
                    {getComponentName(item.component)}
                  </td>
                  <td>{item.task_type}</td>
                  <td>{item.old_comp_serial_no || "-"}</td>
                  <td>{item.new_comp_serial_no || "-"}</td>
                  <td>{formatDate(item.warranty_start_date)}</td>
                  <td>{formatDate(item.warranty_end_date)}</td>
                  <td>{item.action_taken || "-"}</td>
                  <td title={`Serviced By ID: ${item.serviced_by}`}>
                    {getServiceEngineerName(item.serviced_by)}
                  </td>
                  <td>{formatDateTime(item.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="text-center">
                  {searchTerm 
                    ? `No history items found matching "${searchTerm}"`
                    : 'No history found for this service request.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
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

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              )
            )}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
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

export default RequestItemHistory;
