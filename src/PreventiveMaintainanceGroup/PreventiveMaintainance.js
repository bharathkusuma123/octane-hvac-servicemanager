// import React from 'react';
// import './PreventiveMaintainance.css';

// const PreventiveMaintenance = () => {
//   return (
//     <div className="pm-container">

//         <h2 className="delegate-title">Preventive Maintainance Group </h2>
//       <p className="delegate-subtitle">Enter details for preventive maintenance</p>
//             <hr />

//       <form className="pm-form">
//         <div className="row mb-3">
//           <div className="col-md-4">
//             <label className="form-label">PM Group ID</label>
//             <input type="text" className="form-control" placeholder="e.g. 101 or MCH-001" />
//           </div>
//            <div className="col-md-4">
//             <label className="form-label">PM Group Name</label>
//             <input type="text" className="form-control" placeholder="e.g. 101 or MCH-001" />
//           </div>
//            <div className="col-md-4">
//             <label className="form-label">Series</label>
//             <input type="text" className="form-control" placeholder="e.g. 101 or MCH-001" />
//           </div>
        
//         </div>

       
//         <div className="d-flex justify-content-end gap-2">
//           <button type="button" className="btn btn-outline-secondary">Cancel</button>
//           <button type="submit" className="btn btn-primary">Save Maintenance</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PreventiveMaintenance;









import React, { useState, useEffect } from 'react';
import './PreventiveMaintainance.css';

const PreventiveMaintenance = () => {
  const [showForm, setShowForm] = useState(false);
  const [pmGroups, setPmGroups] = useState([
    {
      pm_group_id: 'PM001',
      pm_group_name: 'CRS Series Maintenance Plan',
      series: 'CRS Series',
      created_at: '2023-05-01 10:00:00',
      updated_at: '2023-05-10 15:30:00',
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      pm_group_id: 'PM002',
      pm_group_name: 'MCH Series Maintenance Plan',
      series: 'MCH Series',
      created_at: '2023-05-05 09:15:00',
      updated_at: '2023-05-12 11:20:00',
      created_by: 'manager',
      updated_by: 'admin'
    }
  ]);

  const [formData, setFormData] = useState({
    pm_group_id: '',
    pm_group_name: '',
    series: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredGroups, setFilteredGroups] = useState(pmGroups);

  useEffect(() => {
    const filtered = pmGroups.filter(group =>
      Object.values(group).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGroups(filtered);
    setCurrentPage(1);
  }, [searchTerm, pmGroups]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentItems = filteredGroups.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredGroups.length / entriesPerPage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGroup = {
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'current_user',
      updated_by: 'current_user'
    };
    const updatedGroups = [...pmGroups, newGroup];
    setPmGroups(updatedGroups);
    setFormData({ pm_group_id: '', pm_group_name: '', series: '' });
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setFormData({ pm_group_id: '', pm_group_name: '', series: '' });
    }
  };

  return (
    <div className="pm-container">
      {/* Header and Button Row */}
      {!showForm && (
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div>
            <h2 className="pm-title">Preventive Maintenance Group</h2>
            <p className="pm-subtitle">Manage preventive maintenance groups</p>
          </div>
          <button onClick={toggleForm} className="btn btn-primary">
            Add New PM Group
          </button>
        </div>
      )}

      {showForm && (
        <>
          <h2 className="pm-title">Preventive Maintenance Group</h2>
          <p className="pm-subtitle">Enter details for new preventive maintenance group</p>
        </>
      )}
      {!showForm ? (
        <>
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
              </select>
              entries
            </div>
            <input
              type="text"
              className="form-control w-auto"
              placeholder="Search PM groups..."
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
                  <th>PM Group ID</th>
                  <th>PM Group Name</th>
                  <th>Series</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Created By</th>
                  <th>Updated By</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((group, index) => (
                    <tr key={index}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{group.pm_group_id}</td>
                      <td>{group.pm_group_name}</td>
                      <td>{group.series}</td>
                      <td>{group.created_at}</td>
                      <td>{group.updated_at}</td>
                      <td>{group.created_by}</td>
                      <td>{group.updated_by}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No PM groups found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredGroups.length > 0 && (
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
        </>
      ) : (
        <form onSubmit={handleSubmit} className="pm-form">
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">PM Group ID</label>
              <input 
                type="text" 
                className="form-control" 
                name="pm_group_id"
                value={formData.pm_group_id}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">PM Group Name</label>
              <input 
                type="text" 
                className="form-control" 
                name="pm_group_name"
                value={formData.pm_group_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Series</label>
              <input 
                type="text" 
                className="form-control" 
                name="series"
                value={formData.series}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={toggleForm}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Chart
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PreventiveMaintenance;

