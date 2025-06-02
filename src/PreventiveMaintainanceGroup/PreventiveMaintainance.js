import React, { useState, useEffect, useContext } from 'react';
import './PreventiveMaintainance.css';
import PMGroupForm from './PreventiveMaintainanceGroupForm';
import PMGroupTable from './PreventiveMaintainanceGroupTable';
import { AuthContext } from "../AuthContext/AuthContext";

const PreventiveMaintenance = () => { 
  const [showForm, setShowForm] = useState(false);
  const [pmGroups, setPmGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredGroups, setFilteredGroups] = useState([]);

  const { userRole, userId, logout } = useContext(AuthContext);



  const fetchPmGroups = async () => {
    try {
      const response = await fetch('http://175.29.21.7:8006/pm-groups/');
      const result = await response.json();
      const sortedData = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPmGroups(sortedData);
    } catch (error) {
      console.error('Error fetching PM groups:', error);
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

  return (
    <>
    
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
          />
        </>
      ) : (
        <>
          <h2 className="pm-title">Preventive Maintenance Group</h2>
          <p className="pm-subtitle">Enter details for new preventive maintenance group</p>
          <PMGroupForm
            fetchPmGroups={fetchPmGroups}
            toggleForm={toggleForm}
          />
        </>
      )}
    </div>
    </>
  );
};

export default PreventiveMaintenance;
