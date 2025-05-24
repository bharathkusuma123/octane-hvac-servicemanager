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










import React, { useState } from 'react';
import './PreventiveMaintainance.css';

const PreventiveMaintenance = () => {
  const [showForm, setShowForm] = useState(false);
  const [pmGroups, setPmGroups] = useState([
    // Sample data - replace with your actual data
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the data
    console.log('Form submitted:', formData);
    
    // For demo purposes, add to local state
    const newGroup = {
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'current_user', // Replace with actual user
      updated_by: 'current_user'  // Replace with actual user
    };
    
    setPmGroups([...pmGroups, newGroup]);
    setShowForm(false);
    setFormData({ pm_group_id: '', pm_group_name: '', series: '' });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      // Reset form when hiding it
      setFormData({ pm_group_id: '', pm_group_name: '', series: '' });
    }
  };

  return (
    <div className="pm-container">
      <h2 className="pm-title">Preventive Maintenance Group</h2>
      <p className="pm-subtitle">
        {showForm ? 'Enter details for new preventive maintenance group' : 'Manage preventive maintenance groups'}
      </p>
      <hr />

      {!showForm ? (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button 
              onClick={toggleForm}
              className="btn btn-primary"
            >
              Add New PM Group
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
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
                {pmGroups.map((group, index) => (
                  <tr key={index}>
                    <td>{group.pm_group_id}</td>
                    <td>{group.pm_group_name}</td>
                    <td>{group.series}</td>
                    <td>{group.created_at}</td>
                    <td>{group.updated_at}</td>
                    <td>{group.created_by}</td>
                    <td>{group.updated_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                placeholder="e.g. PM001" 
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
                placeholder="e.g. CRS Series Maintenance Plan" 
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
                placeholder="e.g. CRS Series" 
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
              Save Maintenance
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PreventiveMaintenance;