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
    fetchPmGroups();
  }, []);

  useEffect(() => {
    const filtered = pmGroups.filter(group =>
      Object.values(group).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGroups(filtered);
    setCurrentPage(1);
  }, [searchTerm, pmGroups]);

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
            onEdit={handleEdit} // pass onEdit function

          />
        </>
      ) : (
        <PMGroupForm
          fetchPmGroups={fetchPmGroups}
          toggleForm={toggleForm}
           initialData={selectedGroup || {}} // send selected group for edit
        />
      )}
    </div>
  );
};

export default PreventiveMaintenance;