// import React, { useState, useEffect, useContext } from 'react';
// import './PreventiveMaintainance.css';
// import PMGroupForm from './PreventiveMaintainanceGroupForm';
// import PMGroupTable from './PreventiveMaintainanceGroupTable';
// import { AuthContext } from "../AuthContext/AuthContext";
// import baseURL from '../ApiUrl/Apiurl';

// const PreventiveMaintenance = () => { 
//   const [showForm, setShowForm] = useState(false);
//   const [pmGroups, setPmGroups] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filteredGroups, setFilteredGroups] = useState([]);

//   const { userRole, userId, logout } = useContext(AuthContext);



//   const fetchPmGroups = async () => {
//     try {
//                const response = await fetch(`${baseURL}/pm-groups/`);
//       const result = await response.json();
//       const sortedData = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       setPmGroups(sortedData);
//     } catch (error) {
//       console.error('Error fetching PM groups:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPmGroups();
//   }, []);

//   useEffect(() => {
//     const filtered = pmGroups.filter(group =>
//       Object.values(group).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredGroups(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, pmGroups]);

//   const toggleForm = () => {
//     setShowForm(!showForm);
//   };

//   return (
//     <>
    
//     <div className="pm-container">
//       {!showForm ? (
//         <>
//           <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//             <div>
//               <h2 className="pm-title">Preventive Maintenance Group</h2>
//               <p className="pm-subtitle">Manage preventive maintenance groups</p>
//             </div>
//             <button onClick={toggleForm} className="btn btn-primary">Add New PM Group</button>
//           </div>
//           <PMGroupTable
//             filteredGroups={filteredGroups}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             entriesPerPage={entriesPerPage}
//             setEntriesPerPage={setEntriesPerPage}
//             currentPage={currentPage}
//             setCurrentPage={setCurrentPage}
//           />
//         </>
//       ) : (
//         <>
//           {/* <h2 className="pm-title">Preventive Maintenance Group</h2>
//           <p className="pm-subtitle">Enter details for new preventive maintenance group</p> */}
//           <PMGroupForm
//             fetchPmGroups={fetchPmGroups}
//             toggleForm={toggleForm}
//           />
//         </>
//       )}
//     </div>
//     </>
//   );
// };

// export default PreventiveMaintenance;




// import React, { useState, useEffect, useContext } from 'react';
// import './PreventiveMaintainance.css';
// import PMGroupForm from './PreventiveMaintainanceGroupForm';
// import PMGroupTable from './PreventiveMaintainanceGroupTable';
// import { AuthContext } from "../AuthContext/AuthContext";
// import baseURL from '../ApiUrl/Apiurl';
// import Swal from 'sweetalert2';

// const PreventiveMaintenance = () => { 
//   const [showForm, setShowForm] = useState(false);
//   const [pmGroups, setPmGroups] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filteredGroups, setFilteredGroups] = useState([]);
//   const { userRole, userId, logout } = useContext(AuthContext);
//   const [selectedGroup, setSelectedGroup] = useState(null);

//   const fetchPmGroups = async () => {
//     try {
//       const response = await fetch(`${baseURL}/pm-groups/`);
//       const result = await response.json();
//       const sortedData = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       setPmGroups(sortedData);
//     } catch (error) {
//       console.error('Error fetching PM groups:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to fetch PM groups. Please try again later.',
//         confirmButtonColor: '#3085d6',
//       });
//     }
//   };

//   const handleDelete = async (pmGroupId) => {
//     try {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: 'Yes, delete it!'
//       });

//       if (result.isConfirmed) {
//         const response = await fetch(`${baseURL}/pm-groups/${pmGroupId}/`, {
//           method: 'DELETE'
//         });

//         if (response.ok) {
//           setPmGroups(prev => prev.filter(group => group.pm_group_id !== pmGroupId));
//           Swal.fire({
//             icon: 'success',
//             title: 'Deleted!',
//             text: 'PM Group has been deleted.',
//             confirmButtonColor: '#3085d6',
//           });
//         } else {
//           throw new Error('Failed to delete PM Group');
//         }
//       }
//     } catch (error) {
//       console.error('Error deleting PM Group:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: error.message || 'Failed to delete PM Group',
//         confirmButtonColor: '#3085d6',
//       });
//     }
//   };

//   useEffect(() => {
//     fetchPmGroups();
//   }, []);

//   useEffect(() => {
//     const filtered = pmGroups.filter(group =>
//       Object.values(group).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredGroups(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, pmGroups]);

//   const toggleForm = () => {
//     setShowForm(!showForm);
//   };

//     const handleEdit = (group) => {
//     setSelectedGroup(group);
//     setShowForm(true);
//   };

//   return (
//     <div className="pm-container">
//       {!showForm ? (
//         <>
//           <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//             <div>
//               <h2 className="pm-title">Preventive Maintenance Group</h2>
//               <p className="pm-subtitle">Manage preventive maintenance groups</p>
//             </div>
//             <button onClick={toggleForm} className="btn btn-primary">Add New PM Group</button>
//           </div>
//           <PMGroupTable
//             filteredGroups={filteredGroups}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             entriesPerPage={entriesPerPage}
//             setEntriesPerPage={setEntriesPerPage}
//             currentPage={currentPage}
//             setCurrentPage={setCurrentPage}
//             onDelete={handleDelete}
//             onEdit={handleEdit} // pass onEdit function

//           />
//         </>
//       ) : (
//         <PMGroupForm
//           fetchPmGroups={fetchPmGroups}
//           toggleForm={toggleForm}
//            initialData={selectedGroup || {}} // send selected group for edit
//         />
//       )}
//     </div>
//   );
// };

// export default PreventiveMaintenance;

//===============================================================
// After fixing filter -Global search issue 


// import React, { useState, useEffect, useContext } from 'react';
// import './PreventiveMaintainance.css';
// import PMGroupForm from './PreventiveMaintainanceGroupForm';
// import PMGroupTable from './PreventiveMaintainanceGroupTable';
// import { AuthContext } from "../AuthContext/AuthContext";
// import baseURL from '../ApiUrl/Apiurl';
// import Swal from 'sweetalert2';

// const PreventiveMaintenance = () => { 
//   const [showForm, setShowForm] = useState(false);
//   const [pmGroups, setPmGroups] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [entriesPerPage, setEntriesPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filteredGroups, setFilteredGroups] = useState([]);
//   const { userRole, userId, logout } = useContext(AuthContext);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [users, setUsers] = useState([]); // To store user data for search

//   // Fetch users data for username search
//   const fetchUsers = async () => {
//     try {
//       const response = await fetch(`${baseURL}/users/`);
//       const result = await response.json();
//       if (Array.isArray(result)) {
//         setUsers(result);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchPmGroups = async () => {
//     try {
//       const response = await fetch(`${baseURL}/pm-groups/`);
//       const result = await response.json();
//       const sortedData = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       setPmGroups(sortedData);
//     } catch (error) {
//       console.error('Error fetching PM groups:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to fetch PM groups. Please try again later.',
//         confirmButtonColor: '#3085d6',
//       });
//     }
//   };

//   // Function to get username from user_id
//   const getUsernameById = (userId) => {
//     if (!userId || users.length === 0) return userId;
    
//     const user = users.find(user => user.user_id === userId);
//     return user ? user.username : userId;
//   };

//   // Function to get user search data (both ID and username)
//   const getUserSearchData = (userId) => {
//     if (!userId) return '';
//     const user = users.find(user => user.user_id === userId);
//     return user ? `${userId} ${user.username}` : userId;
//   };

//   const handleDelete = async (pmGroupId) => {
//     try {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: 'Yes, delete it!'
//       });

//       if (result.isConfirmed) {
//         const response = await fetch(`${baseURL}/pm-groups/${pmGroupId}/`, {
//           method: 'DELETE'
//         });

//         if (response.ok) {
//           setPmGroups(prev => prev.filter(group => group.pm_group_id !== pmGroupId));
//           Swal.fire({
//             icon: 'success',
//             title: 'Deleted!',
//             text: 'PM Group has been deleted.',
//             confirmButtonColor: '#3085d6',
//           });
//         } else {
//           throw new Error('Failed to delete PM Group');
//         }
//       }
//     } catch (error) {
//       console.error('Error deleting PM Group:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: error.message || 'Failed to delete PM Group',
//         confirmButtonColor: '#3085d6',
//       });
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchPmGroups();
//   }, []);

//   // Function to format date in multiple formats for search
//   const formatDateForSearch = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
    
//     if (isNaN(date.getTime())) return '';
    
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     const monthName = date.toLocaleString('en-IN', { month: 'long' });
//     const monthShort = date.toLocaleString('en-IN', { month: 'short' });
//     const hour = date.getHours().toString().padStart(2, '0');
//     const minute = date.getMinutes().toString().padStart(2, '0');
//     const second = date.getSeconds().toString().padStart(2, '0');
    
//     // Return multiple formats for better searchability
//     return [
//       `${day}/${month}/${year}`,                    // DD/MM/YYYY
//       `${day}/${month}/${year} ${hour}:${minute}:${second}`, // DD/MM/YYYY HH:MM:SS
//       `${month}/${day}/${year}`,                    // MM/DD/YYYY
//       `${year}-${month}-${day}`,                    // YYYY-MM-DD
//       `${year}${month}${day}`,                      // YYYYMMDD
//       `${day}-${month}-${year}`,                    // DD-MM-YYYY
//       date.toISOString(),                           // ISO string
//       monthName,                                    // January, February
//       monthShort,                                   // Jan, Feb
//       `${year}`,                                    // 2024
//       `${month}/${year}`,                           // MM/YYYY
//       `${day} ${monthName} ${year}`,               // 15 January 2024
//       `${day} ${monthShort} ${year}`,              // 15 Jan 2024
//       `${hour}:${minute}`,                          // HH:MM
//       `${hour}:${minute}:${second}`,               // HH:MM:SS
//     ].join(' ');
//   };

//   // Enhanced global search functionality
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredGroups(pmGroups);
//       setCurrentPage(1);
//       return;
//     }

//     const searchLower = searchTerm.toLowerCase().trim();
    
//     const filtered = pmGroups.filter((group) => {
//       // Get user data for search
//       const createdBySearch = getUserSearchData(group.created_by);
//       const updatedBySearch = getUserSearchData(group.updated_by);
      
//       // Get dates in multiple formats for search
//       const createdDateFormats = formatDateForSearch(group.created_at);
//       const updatedDateFormats = formatDateForSearch(group.updated_at);
      
//       // Create a comprehensive search string
//       const searchableText = [
//         // Raw PM group data
//         group.pm_group_id || '',
//         group.pm_group_name || '',
//         group.series || '',
//         group.created_at || '',
//         group.updated_at || '',
//         group.created_by || '',
//         group.updated_by || '',
//         group.company_id || '',
//         group.status || '',
//         group.is_active !== undefined ? String(group.is_active) : '',
//         group.description || '',
//         group.frequency || '',
//         group.duration || '',
        
//         // Formatted user data for search
//         createdBySearch,
//         updatedBySearch,
        
//         // Dates in multiple formats
//         createdDateFormats,
//         updatedDateFormats,
        
//         // Display values (exactly as shown in table)
//         getUsernameById(group.created_by),
//         getUsernameById(group.updated_by),
        
//         // PM Group name variations for better search
//         group.pm_group_name ? `PM ${group.pm_group_name} preventive maintenance group` : '',
//         group.series ? `series ${group.series} model` : '',
        
//         // Status variations
//         group.status === 'Active' ? 'Active Active Active' : '',
//         group.status === 'Inactive' ? 'Inactive Inactive Inactive' : '',
//         group.status === 'Pending' ? 'Pending Pending Pending' : '',
        
//         // Active/Inactive variations
//         group.is_active === true ? 'active true yes enabled' : '',
//         group.is_active === false ? 'inactive false no disabled' : '',
        
//         // Add any other properties that might exist
//         ...Object.values(group).filter(val => 
//           val !== null && val !== undefined
//         ).map(val => {
//           if (typeof val === 'string' || typeof val === 'number') {
//             return String(val);
//           }
//           if (typeof val === 'boolean') {
//             return val ? 'true yes active' : 'false no inactive';
//           }
//           if (Array.isArray(val)) {
//             return val.join(' ');
//           }
//           if (typeof val === 'object' && val !== null) {
//             return JSON.stringify(val);
//           }
//           return '';
//         })
//       ]
//       .join(' ')                    // Combine into one string
//       .toLowerCase()                // Make case-insensitive
//       .replace(/\s+/g, ' ')         // Normalize spaces
//       .trim();
      
//       return searchableText.includes(searchLower);
//     });
    
//     setFilteredGroups(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, pmGroups, users]);

//   const toggleForm = () => {
//   setShowForm(false);
//   setSelectedGroup(null); // 👈 RESET WHEN GOING BACK
// };


//   const handleEdit = (group) => {
//     setSelectedGroup(group);
//     setShowForm(true);
//   };

//   return (
//     <div className="pm-container">
//       {!showForm ? (
//         <>
//           <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//             <div>
//               <h2 className="pm-title">Preventive Maintenance Group</h2>
//               <p className="pm-subtitle">Manage preventive maintenance groups</p>
//             </div>
//             <button
//   onClick={() => {
//     setSelectedGroup(null);   // 👈 RESET EDIT DATA
//     setShowForm(true);
//   }}
//   className="btn btn-primary"
// >
//   Add New PM Group
// </button>

//           </div>
//           <PMGroupTable
//             filteredGroups={filteredGroups}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             entriesPerPage={entriesPerPage}
//             setEntriesPerPage={setEntriesPerPage}
//             currentPage={currentPage}
//             setCurrentPage={setCurrentPage}
//             onDelete={handleDelete}
//             onEdit={handleEdit}
//             users={users}
//             getUsernameById={getUsernameById}
//           />
//         </>
//       ) : (
//         <PMGroupForm
//           fetchPmGroups={fetchPmGroups}
//           toggleForm={toggleForm}
//           initialData={selectedGroup || {}}
//           setSelectedGroup={setSelectedGroup}
//         />
//       )}
//     </div>
//   );
// };

// export default PreventiveMaintenance;



// import React, { useState, useEffect, useContext } from 'react';
// import './PreventiveMaintainance.css';
// import PMGroupForm from './PreventiveMaintainanceGroupForm';
// import PMGroupTable from './PreventiveMaintainanceGroupTable';
// import { AuthContext } from "../AuthContext/AuthContext";
// import baseURL from '../ApiUrl/Apiurl';
// import Swal from 'sweetalert2';

// const PreventiveMaintenance = () => { 
//   const [showForm, setShowForm] = useState(false);
//   const [pmGroups, setPmGroups] = useState([]);
//   const [filteredGroups, setFilteredGroups] = useState([]);
//   const { userRole, userId, logout } = useContext(AuthContext);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [users, setUsers] = useState([]);

//   // ✅ CHANGED: Persist searchTerm in sessionStorage so it survives navigation
//   const [searchTerm, setSearchTerm] = useState(() => {
//     return sessionStorage.getItem('pmGroup_searchTerm') || '';
//   });

//   // ✅ CHANGED: Persist entriesPerPage in sessionStorage so it survives navigation
//   const [entriesPerPage, setEntriesPerPage] = useState(() => {
//     return Number(sessionStorage.getItem('pmGroup_entriesPerPage')) || 5;
//   });

//   // ✅ CHANGED: Persist currentPage in sessionStorage so it survives navigation
//   const [currentPage, setCurrentPage] = useState(() => {
//     return Number(sessionStorage.getItem('pmGroup_currentPage')) || 1;
//   });

//   // ✅ NEW: Save searchTerm to sessionStorage whenever it changes
//   useEffect(() => {
//     sessionStorage.setItem('pmGroup_searchTerm', searchTerm);
//   }, [searchTerm]);

//   // ✅ NEW: Save entriesPerPage to sessionStorage whenever it changes
//   useEffect(() => {
//     sessionStorage.setItem('pmGroup_entriesPerPage', entriesPerPage);
//   }, [entriesPerPage]);

//   // ✅ NEW: Save currentPage to sessionStorage whenever it changes
//   useEffect(() => {
//     sessionStorage.setItem('pmGroup_currentPage', currentPage);
//   }, [currentPage]);

//   // Handle browser back button and swipe gesture when form is open
//   useEffect(() => {
//     if (showForm) {
//       window.history.pushState({ formOpen: true }, '', window.location.pathname);
      
//       const handlePopState = (event) => {
//         if (showForm) {
//           event.preventDefault();
//           setShowForm(false);
//           setSelectedGroup(null);
//           window.history.pushState({ formOpen: true }, '', window.location.pathname);
//         }
//       };
      
//       window.addEventListener('popstate', handlePopState);
      
//       return () => {
//         window.removeEventListener('popstate', handlePopState);
//       };
//     }
//   }, [showForm]);

//   // Fetch users data for username search
//   const fetchUsers = async () => {
//     try {
//       const response = await fetch(`${baseURL}/users/`);
//       const result = await response.json();
//       if (Array.isArray(result)) {
//         setUsers(result);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchPmGroups = async () => {
//     try {
//       const response = await fetch(`${baseURL}/pm-groups/`);
//       const result = await response.json();
//       const sortedData = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       setPmGroups(sortedData);
//     } catch (error) {
//       console.error('Error fetching PM groups:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to fetch PM groups. Please try again later.',
//         confirmButtonColor: '#3085d6',
//       });
//     }
//   };

//   // Function to get username from user_id
//   const getUsernameById = (userId) => {
//     if (!userId || users.length === 0) return userId;
//     const user = users.find(user => user.user_id === userId);
//     return user ? user.username : userId;
//   };

//   // Function to get user search data (both ID and username)
//   const getUserSearchData = (userId) => {
//     if (!userId) return '';
//     const user = users.find(user => user.user_id === userId);
//     return user ? `${userId} ${user.username}` : userId;
//   };

//   const handleDelete = async (pmGroupId) => {
//     try {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: "You won't be able to revert this!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: 'Yes, delete it!'
//       });

//       if (result.isConfirmed) {
//         const response = await fetch(`${baseURL}/pm-groups/${pmGroupId}/`, {
//           method: 'DELETE'
//         });

//         if (response.ok) {
//           setPmGroups(prev => prev.filter(group => group.pm_group_id !== pmGroupId));
//           Swal.fire({
//             icon: 'success',
//             title: 'Deleted!',
//             text: 'PM Group has been deleted.',
//             confirmButtonColor: '#3085d6',
//           });
//         } else {
//           throw new Error('Failed to delete PM Group');
//         }
//       }
//     } catch (error) {
//       console.error('Error deleting PM Group:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: error.message || 'Failed to delete PM Group',
//         confirmButtonColor: '#3085d6',
//       });
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchPmGroups();
//   }, []);

//   // Function to format date in multiple formats for search
//   const formatDateForSearch = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return '';
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     const monthName = date.toLocaleString('en-IN', { month: 'long' });
//     const monthShort = date.toLocaleString('en-IN', { month: 'short' });
//     const hour = date.getHours().toString().padStart(2, '0');
//     const minute = date.getMinutes().toString().padStart(2, '0');
//     const second = date.getSeconds().toString().padStart(2, '0');
//     return [
//       `${day}/${month}/${year}`,
//       `${day}/${month}/${year} ${hour}:${minute}:${second}`,
//       `${month}/${day}/${year}`,
//       `${year}-${month}-${day}`,
//       `${year}${month}${day}`,
//       `${day}-${month}-${year}`,
//       date.toISOString(),
//       monthName,
//       monthShort,
//       `${year}`,
//       `${month}/${year}`,
//       `${day} ${monthName} ${year}`,
//       `${day} ${monthShort} ${year}`,
//       `${hour}:${minute}`,
//       `${hour}:${minute}:${second}`,
//     ].join(' ');
//   };

//   // ✅ CHANGED: Removed setCurrentPage(1) from search effect so page is preserved on navigation back.
//   // Page only resets when user explicitly changes the search term (handled in PMGroupTable via handleSearchChange).
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setFilteredGroups(pmGroups);

//       // ✅ Only clamp page if saved page is now out of range
//       const totalPagesNow = Math.ceil(pmGroups.length / entriesPerPage);
//       const savedPage = Number(sessionStorage.getItem('pmGroup_currentPage')) || 1;
//       if (savedPage > totalPagesNow && totalPagesNow > 0) {
//         setCurrentPage(totalPagesNow);
//       }
//       return;
//     }

//     const searchLower = searchTerm.toLowerCase().trim();

//     const filtered = pmGroups.filter((group) => {
//       const createdBySearch = getUserSearchData(group.created_by);
//       const updatedBySearch = getUserSearchData(group.updated_by);
//       const createdDateFormats = formatDateForSearch(group.created_at);
//       const updatedDateFormats = formatDateForSearch(group.updated_at);

//       const searchableText = [
//         group.pm_group_id || '',
//         group.pm_group_name || '',
//         group.series || '',
//         group.created_at || '',
//         group.updated_at || '',
//         group.created_by || '',
//         group.updated_by || '',
//         group.company_id || '',
//         group.status || '',
//         group.is_active !== undefined ? String(group.is_active) : '',
//         group.description || '',
//         group.frequency || '',
//         group.duration || '',
//         createdBySearch,
//         updatedBySearch,
//         createdDateFormats,
//         updatedDateFormats,
//         getUsernameById(group.created_by),
//         getUsernameById(group.updated_by),
//         group.pm_group_name ? `PM ${group.pm_group_name} preventive maintenance group` : '',
//         group.series ? `series ${group.series} model` : '',
//         group.status === 'Active' ? 'Active Active Active' : '',
//         group.status === 'Inactive' ? 'Inactive Inactive Inactive' : '',
//         group.status === 'Pending' ? 'Pending Pending Pending' : '',
//         group.is_active === true ? 'active true yes enabled' : '',
//         group.is_active === false ? 'inactive false no disabled' : '',
//         ...Object.values(group).filter(val =>
//           val !== null && val !== undefined
//         ).map(val => {
//           if (typeof val === 'string' || typeof val === 'number') return String(val);
//           if (typeof val === 'boolean') return val ? 'true yes active' : 'false no inactive';
//           if (Array.isArray(val)) return val.join(' ');
//           if (typeof val === 'object' && val !== null) return JSON.stringify(val);
//           return '';
//         })
//       ]
//         .join(' ')
//         .toLowerCase()
//         .replace(/\s+/g, ' ')
//         .trim();

//       return searchableText.includes(searchLower);
//     });

//     setFilteredGroups(filtered);

//     // ✅ Only clamp page if saved page is now out of range after filtering
//     const totalPagesNow = Math.ceil(filtered.length / entriesPerPage);
//     const savedPage = Number(sessionStorage.getItem('pmGroup_currentPage')) || 1;
//     if (savedPage > totalPagesNow && totalPagesNow > 0) {
//       setCurrentPage(totalPagesNow);
//     }
//   }, [searchTerm, pmGroups, users]);

//   const toggleForm = () => {
//     setShowForm(false);
//     setSelectedGroup(null);
//   };

//   const handleEdit = (group) => {
//     setSelectedGroup(group);
//     setShowForm(true);
//   };

//   // ✅ NEW: Handler passed to table so page resets when user deliberately changes search
//   const handleSearchChange = (value) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//     sessionStorage.setItem('pmGroup_currentPage', 1);
//   };

//   // ✅ NEW: Handler passed to table so page resets when user deliberately changes entries per page
//   const handleEntriesPerPageChange = (value) => {
//     setEntriesPerPage(value);
//     setCurrentPage(1);
//     sessionStorage.setItem('pmGroup_currentPage', 1);
//   };

//   return (
//     <div className="pm-container">
//       {!showForm ? (
//         <>
//           <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//             <div>
//               <h2 className="pm-title">Preventive Maintenance Group</h2>
//               <p className="pm-subtitle">Manage preventive maintenance groups</p>
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedGroup(null);
//                 setShowForm(true);
//               }}
//               className="btn btn-primary"
//             >
//               Add New PM Group
//             </button>
//           </div>
//           <PMGroupTable
//             filteredGroups={filteredGroups}
//             searchTerm={searchTerm}
//             // ✅ CHANGED: Pass handler functions instead of raw setters
//             setSearchTerm={handleSearchChange}
//             entriesPerPage={entriesPerPage}
//             setEntriesPerPage={handleEntriesPerPageChange}
//             currentPage={currentPage}
//             setCurrentPage={setCurrentPage}
//             onDelete={handleDelete}
//             onEdit={handleEdit}
//             users={users}
//             getUsernameById={getUsernameById}
//           />
//         </>
//       ) : (
//         <PMGroupForm
//           fetchPmGroups={fetchPmGroups}
//           toggleForm={toggleForm}
//           initialData={selectedGroup || {}}
//           setSelectedGroup={setSelectedGroup}
//         />
//       )}
//     </div>
//   );
// };

// export default PreventiveMaintenance;



import React, { useState, useEffect, useContext } from 'react';
import './PreventiveMaintainance.css';
import PMGroupForm from './PreventiveMaintainanceGroupForm';
import PMGroupTable from './PreventiveMaintainanceGroupTable';
import { AuthContext } from "../AuthContext/AuthContext";
import baseURL from '../ApiUrl/Apiurl';
import Swal from 'sweetalert2';
import axios from 'axios';

const PreventiveMaintenance = () => { 
  const [showForm, setShowForm] = useState(false);
  const [pmGroups, setPmGroups] = useState([]);
  const { userRole, userId, logout } = useContext(AuthContext);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states (server-side)
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem('pmGroup_searchTerm') || '';
  });
  const [entriesPerPage, setEntriesPerPage] = useState(() => {
    return Number(sessionStorage.getItem('pmGroup_entriesPerPage')) || 10;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(sessionStorage.getItem('pmGroup_currentPage')) || 1;
  });

  // Server-side pagination data
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Save pagination state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('pmGroup_searchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('pmGroup_entriesPerPage', entriesPerPage);
  }, [entriesPerPage]);

  useEffect(() => {
    sessionStorage.setItem('pmGroup_currentPage', currentPage);
  }, [currentPage]);

  // Handle browser back button and swipe gesture when form is open
  useEffect(() => {
    if (showForm) {
      window.history.pushState({ formOpen: true }, '', window.location.pathname);
      
      const handlePopState = (event) => {
        if (showForm) {
          event.preventDefault();
          setShowForm(false);
          setSelectedGroup(null);
          window.history.pushState({ formOpen: true }, '', window.location.pathname);
        }
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showForm]);

  // Fetch users data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/?page=1&page_size=100`);
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch PM groups with pagination
  const fetchPmGroups = async (page = currentPage, size = entriesPerPage, search = searchTerm) => {
    setFetching(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page,
        page_size: size
      });

      // Add search parameter if exists
      if (search) {
        params.append('search', search);
      }

      // Add user_id if available
      if (userId) {
        params.append('user_id', userId);
      }

      const response = await axios.get(`${baseURL}/pm-groups/?${params.toString()}`);
      
      if (response.data.status === "success") {
        const data = response.data.data || [];
        const pagination = response.data.pagination || {};
        
        // Sort by created_at descending
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setPmGroups(sortedData);
        setTotalCount(pagination.total_count || 0);
        setTotalPages(pagination.total_pages || 1);
        setHasNextPage(pagination.has_next || false);
        setHasPreviousPage(pagination.has_previous || false);
        setCurrentPage(pagination.current_page || 1);
      } else {
        setError('Failed to load PM groups');
        setPmGroups([]);
      }
    } catch (error) {
      console.error('Error fetching PM groups:', error);
      setError('Failed to fetch PM groups. Please try again.');
      setPmGroups([]);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch PM groups. Please try again later.',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setFetching(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchPmGroups(1, entriesPerPage, searchTerm)
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Refetch when pagination or search changes
  useEffect(() => {
    if (!loading) {
      const debounceTimer = setTimeout(() => {
        fetchPmGroups(currentPage, entriesPerPage, searchTerm);
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [currentPage, entriesPerPage, searchTerm]);

  // Function to get username from user_id
  const getUsernameById = (userId) => {
    if (!userId || users.length === 0) return userId;
    const user = users.find(user => user.user_id === userId);
    return user ? user.username : userId;
  };

  const handleDelete = async (pmGroupId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(`${baseURL}/pm-groups/${pmGroupId}/`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Refresh the current page data
          fetchPmGroups(currentPage, entriesPerPage, searchTerm);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'PM Group has been deleted.',
            confirmButtonColor: '#3085d6',
          });
        } else {
          throw new Error('Failed to delete PM Group');
        }
      }
    } catch (error) {
      console.error('Error deleting PM Group:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete PM Group',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const toggleForm = () => {
    setShowForm(false);
    setSelectedGroup(null);
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setShowForm(true);
  };

  // Handler for search change - resets to page 1
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    sessionStorage.setItem('pmGroup_currentPage', 1);
  };

  // Handler for entries per page change - resets to page 1
  const handleEntriesPerPageChange = (value) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
    sessionStorage.setItem('pmGroup_currentPage', 1);
  };

  // Handler for page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div className="text-center my-4">Loading PM groups...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  return (
    <div className="pm-container">
      {!showForm ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div>
              <h2 className="pm-title">Preventive Maintenance Group</h2>
              <p className="pm-subtitle">Manage preventive maintenance groups</p>
            </div>
            <button
              onClick={() => {
                setSelectedGroup(null);
                setShowForm(true);
              }}
              className="btn btn-primary"
            >
              Add New PM Group
            </button>
          </div>
          <PMGroupTable
            pmGroups={pmGroups}
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={handleEntriesPerPageChange}
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
            totalPages={totalPages}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            fetching={fetching}
            onDelete={handleDelete}
            onEdit={handleEdit}
            users={users}
            getUsernameById={getUsernameById}
          />
        </>
      ) : (
        <PMGroupForm
          fetchPmGroups={() => fetchPmGroups(currentPage, entriesPerPage, searchTerm)}
          toggleForm={toggleForm}
          initialData={selectedGroup || {}}
          setSelectedGroup={setSelectedGroup}
        />
      )}
    </div>
  );
};

export default PreventiveMaintenance;