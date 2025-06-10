// import React, { useState } from 'react';

// const PMGroupForm = ({ fetchPmGroups, toggleForm }) => {
//   const [formData, setFormData] = useState({
//     pm_group_id: '',
//     pm_group_name: '',
//     series: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newGroup = {
//       ...formData,
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//       created_by: 'Service Manager',
//       updated_by: 'Service Manager'
//     };

//     try {
//       const response = await fetch('http://175.29.21.7:8006/pm-groups/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newGroup)
//       });

//       if (!response.ok) throw new Error('Failed to submit PM group');

//       await response.json();
//       alert('PM Group added successfully!');
//       fetchPmGroups();
//       toggleForm();
//     } catch (error) {
//       console.error('POST error:', error);
//       alert('Failed to add PM group. Please try again.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="pm-form">
//       <div className="row mb-3">
//         <div className="col-md-4">
//           <label className="form-label">PM Group ID</label>
//           <input
//             type="text"
//             className="form-control"
//             name="pm_group_id"
//             value={formData.pm_group_id}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <label className="form-label">PM Group Name</label>
//           <input
//             type="text"
//             className="form-control"
//             name="pm_group_name"
//             value={formData.pm_group_name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="col-md-4">
//           <label className="form-label">Series</label>
//           <input
//             type="text"
//             className="form-control"
//             name="series"
//             value={formData.series}
//             onChange={handleChange}
//             required
//           />
//         </div>
//       </div>
//       <div className="d-flex justify-content-end gap-2">
//         <button type="button" className="btn btn-outline-secondary" onClick={toggleForm}>
//           Cancel
//         </button>
//         <button type="submit" className="btn btn-primary">Save Maintenance</button>
//       </div>
//     </form>
//   );
// };

// export default PMGroupForm;



import React, { useState } from 'react';
import baseURL from '../ApiUrl/Apiurl';

// import './Component.css';
const PMGroupForm = ({ fetchPmGroups, toggleForm, initialData = {} }) => {
  const isEditMode = !!initialData?.pm_group_id;

  const [formData, setFormData] = useState({
    pm_group_id: initialData.pm_group_id || '',
    pm_group_name: initialData.pm_group_name || '',
    series: initialData.series || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timestamp = new Date().toISOString();

    const payload = {
      ...formData,
      created_at: isEditMode ? initialData.created_at : timestamp,
      updated_at: timestamp,
      created_by: 'Service Manager',
      updated_by: 'Service Manager'
    };

    const url = isEditMode
 ? `${baseURL}/pm-groups/${formData.pm_group_id}/`
      : `${baseURL}/pm-groups/`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to submit PM group');

      await response.json();
      alert(`PM Group ${isEditMode ? 'updated' : 'added'} successfully!`);
      fetchPmGroups();
      toggleForm();
    } catch (error) {
      console.error('POST error:', error);
      alert('Failed to save PM group. Please try again.');
    }
  };

  return (
    <div className="container mt-4 service-request-form">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-1">{isEditMode ? 'Edit PM Group' : 'Add PM Group'}</h5>
          <h6 className="text" style={{ color: 'white' }}>
            Fill in PM group details below
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">PM Group ID</label>
                <input
                  type="text"
                  name="pm_group_id"
                  className="form-control"
                  placeholder="Enter PM Group ID"
                  value={formData.pm_group_id}
                  onChange={handleChange}
                  readOnly={isEditMode}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">PM Group Name</label>
                <input
                  type="text"
                  name="pm_group_name"
                  className="form-control"
                  placeholder="Enter PM Group Name"
                  value={formData.pm_group_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Series</label>
                <input
                  type="text"
                  name="series"
                  className="form-control"
                  placeholder="Enter Series"
                  value={formData.series}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-center mt-3 gap-3">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PMGroupForm;

