// ServiceRequestForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    service_item: '',
    preferred_date: '',
    preferred_time: '',
    request_details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static service items data
  const serviceItems = [
    { service_item_id: 'SRV001', service_item_name: 'Hardware Maintenance' },
    { service_item_id: 'SRV002', service_item_name: 'Software Update' },
    { service_item_id: 'SRV003', service_item_name: 'System Diagnostics' },
    { service_item_id: 'SRV004', service_item_name: 'Emergency Repair' },
    { service_item_id: 'SRV005', service_item_name: 'Preventive Maintenance' },
    { service_item_id: 'SRV006', service_item_name: 'Calibration Service' },
    { service_item_id: 'SRV007', service_item_name: 'Technical Support' },
    { service_item_id: 'SRV008', service_item_name: 'Equipment Replacement' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally make your API call
      console.log('Form submitted:', form);
      
      alert('Service request submitted successfully!');
      navigate('/error-logs'); // Redirect back to error logs page
    } catch (error) {
      console.error('Error submitting service request:', error);
      alert('Error submitting service request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/servicemanager/error-logs');
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="container service-request-form mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-1">Service Request Form</h5>
          <h6 className="text mb-0" style={{ color: 'white', opacity: 0.9 }}>
            Please fill in the service request details
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Service Item ID *</label>
                <select
                  name="service_item"
                  value={form.service_item}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Service Item</option>
                  {serviceItems.map((item) => (
                    <option key={item.service_item_id} value={item.service_item_id}>
                      {item.service_item_name} - {item.service_item_id}
                    </option>
                  ))}
                </select>
                <div className="form-text">
                  Choose the type of service you require
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Preferred Service Date *</label>
                <input
                  type="date"
                  name="preferred_date"
                  value={form.preferred_date}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={isSubmitting}
                  min={getTodayDate()}
                />
                <div className="form-text">
                  Select your preferred date for service
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Preferred Service Time *</label>
                <input
                  type="time"
                  name="preferred_time"
                  value={form.preferred_time}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={isSubmitting}
                />
                <div className="form-text">
                  Select your preferred time for service
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-bold">Request Details *</label>
                <textarea
                  name="request_details"
                  value={form.request_details}
                  onChange={handleChange}
                  className="form-control"
                  rows="6"
                  required
                  disabled={isSubmitting}
                  placeholder="Describe the issue or service required in detail..."
                />
                <div className="form-text">
                  Please provide detailed information about the issue or service you require. 
                  Include any error messages, symptoms, or specific requirements.
                </div>
              </div>

              <div className="col-12">
                <div className="alert alert-warning">
                  <strong>Note:</strong> All fields marked with * are required. 
                  Our team will contact you to confirm your service appointment.
                </div>
              </div>

              <div className="d-flex justify-content-center mt-4 gap-3">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-lg" 
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestForm;