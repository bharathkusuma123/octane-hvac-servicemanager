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


import React, { useState, useEffect, useContext } from 'react';
import './PreventiveMaintainance.css';
import PMGroupForm from './PreventiveMaintainanceGroupForm';
import PMGroupTable from './PreventiveMaintainanceGroupTable';
import { AuthContext } from "../AuthContext/AuthContext";
import baseURL from '../ApiUrl/Apiurl';
import Swal from 'sweetalert2';

const PreventiveMaintenance = () => { 
  const [showForm, setShowForm] = useState(false);
  const [pmGroups, setPmGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const { userRole, userId, logout } = useContext(AuthContext);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [users, setUsers] = useState([]); // To store user data for search

  // Fetch users data for username search
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${baseURL}/users/`);
      const result = await response.json();
      if (Array.isArray(result)) {
        setUsers(result);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPmGroups = async () => {
    try {
      const response = await fetch(`${baseURL}/pm-groups/`);
      const result = await response.json();
      const sortedData = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPmGroups(sortedData);
    } catch (error) {
      console.error('Error fetching PM groups:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch PM groups. Please try again later.',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  // Function to get username from user_id
  const getUsernameById = (userId) => {
    if (!userId || users.length === 0) return userId;
    
    const user = users.find(user => user.user_id === userId);
    return user ? user.username : userId;
  };

  // Function to get user search data (both ID and username)
  const getUserSearchData = (userId) => {
    if (!userId) return '';
    const user = users.find(user => user.user_id === userId);
    return user ? `${userId} ${user.username}` : userId;
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
          setPmGroups(prev => prev.filter(group => group.pm_group_id !== pmGroupId));
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

  useEffect(() => {
    fetchUsers();
    fetchPmGroups();
  }, []);

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
      setFilteredGroups(pmGroups);
      setCurrentPage(1);
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    const filtered = pmGroups.filter((group) => {
      // Get user data for search
      const createdBySearch = getUserSearchData(group.created_by);
      const updatedBySearch = getUserSearchData(group.updated_by);
      
      // Get dates in multiple formats for search
      const createdDateFormats = formatDateForSearch(group.created_at);
      const updatedDateFormats = formatDateForSearch(group.updated_at);
      
      // Create a comprehensive search string
      const searchableText = [
        // Raw PM group data
        group.pm_group_id || '',
        group.pm_group_name || '',
        group.series || '',
        group.created_at || '',
        group.updated_at || '',
        group.created_by || '',
        group.updated_by || '',
        group.company_id || '',
        group.status || '',
        group.is_active !== undefined ? String(group.is_active) : '',
        group.description || '',
        group.frequency || '',
        group.duration || '',
        
        // Formatted user data for search
        createdBySearch,
        updatedBySearch,
        
        // Dates in multiple formats
        createdDateFormats,
        updatedDateFormats,
        
        // Display values (exactly as shown in table)
        getUsernameById(group.created_by),
        getUsernameById(group.updated_by),
        
        // PM Group name variations for better search
        group.pm_group_name ? `PM ${group.pm_group_name} preventive maintenance group` : '',
        group.series ? `series ${group.series} model` : '',
        
        // Status variations
        group.status === 'Active' ? 'Active Active Active' : '',
        group.status === 'Inactive' ? 'Inactive Inactive Inactive' : '',
        group.status === 'Pending' ? 'Pending Pending Pending' : '',
        
        // Active/Inactive variations
        group.is_active === true ? 'active true yes enabled' : '',
        group.is_active === false ? 'inactive false no disabled' : '',
        
        // Add any other properties that might exist
        ...Object.values(group).filter(val => 
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
    
    setFilteredGroups(filtered);
    setCurrentPage(1);
  }, [searchTerm, pmGroups, users]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setShowForm(true);
  };

  return (
    <div className="pm-container">
      {!showForm ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div>
              <h2 className="pm-title">Preventive Maintenance Group</h2>
              <p className="pm-subtitle">Manage preventive maintenance groups</p>
            </div>
            <button onClick={toggleForm} className="btn btn-primary">Add New PM Group</button>
          </div>
          <PMGroupTable
            filteredGroups={filteredGroups}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onDelete={handleDelete}
            onEdit={handleEdit}
            users={users}
            getUsernameById={getUsernameById}
          />
        </>
      ) : (
        <PMGroupForm
          fetchPmGroups={fetchPmGroups}
          toggleForm={toggleForm}
          initialData={selectedGroup || {}}
          setSelectedGroup={setSelectedGroup}
        />
      )}
    </div>
  );
};

export default PreventiveMaintenance;