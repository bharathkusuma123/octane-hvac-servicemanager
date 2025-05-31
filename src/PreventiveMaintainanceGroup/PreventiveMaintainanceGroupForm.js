import React, { useState } from 'react';

const PMGroupForm = ({ fetchPmGroups, toggleForm }) => {
  const [formData, setFormData] = useState({
    pm_group_id: '',
    pm_group_name: '',
    series: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newGroup = {
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'Service Manager',
      updated_by: 'Service Manager'
    };

    try {
      const response = await fetch('http://175.29.21.7:8006/pm-groups/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
      });

      if (!response.ok) throw new Error('Failed to submit PM group');

      await response.json();
      alert('PM Group added successfully!');
      fetchPmGroups();
      toggleForm();
    } catch (error) {
      console.error('POST error:', error);
      alert('Failed to add PM group. Please try again.');
    }
  };

  return (
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
        <button type="button" className="btn btn-outline-secondary" onClick={toggleForm}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">Save Maintenance</button>
      </div>
    </form>
  );
};

export default PMGroupForm;
