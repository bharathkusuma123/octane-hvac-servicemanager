// ServiceRequestForm.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import baseURL from "../ApiUrl/Apiurl";
import { useCompany } from '../AuthContext/CompanyContext';
import { AuthContext } from '../AuthContext/AuthContext';

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);

  const location = useLocation();
const autoDescription = location.state?.autoDescription || "";
const autoErrorCode = location.state?.autoErrorCode || "";

  const { selectedCompany } = useCompany();
  
  const errorData = location.state?.errorData;
  const pcbSerialNumber = location.state?.pcb_serial_number;

  const errorCodeToProblemType = {
  1: "Water Leakage",
  2: "Power Fault",
  3: "Fan Not Working / Malfunctioning",
  4: "Fan Not Working / Malfunctioning",
  5: "Pump Not Working / Faulty",
  6: "Others",
  7: "Pump Not Working / Faulty",
  8: "Pump Not Working / Faulty",
  9: "Sensor Fault / Error Indication",
  10: "Sensor Fault / Error Indication",
  11: "Sensor Fault / Error Indication",
  12: "Sensor Fault / Error Indication",
  13: "Sensor Fault / Error Indication",
  14: "Sensor Fault / Error Indication",
  15: "Sensor Fault / Error Indication",
  16: "Sensor Fault / Error Indication / Water Leakage",
  17: "HVAC malfunction",
  18: "HVAC malfunction",
  19: "Water Leakage",
  20: "Power Fault"
};


  
  const [form, setForm] = useState({
    service_item: '',
    request_details: '',
    problem_type: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceItems, setServiceItems] = useState([]);
  const [matchedServiceItem, setMatchedServiceItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState('');
  const [problemTypes, setProblemTypes] = useState([]);
// Fetch problem types
useEffect(() => {
  const fetchProblemTypes = async () => {
    try {
      const res = await fetch(`${baseURL}/problem-types/`);
      const result = await res.json();

      console.log("Fetched Problem Types Data:", result);

      if (result.status === "success" && Array.isArray(result.data)) {
        setProblemTypes(result.data);   // ← USE result.data
        console.log("Problem Types Array:", result.data);
      }
    } catch (err) {
      console.error("Error loading problem types:", err);
    }
  };

  fetchProblemTypes();
}, []);

useEffect(() => {
  if (autoErrorCode && problemTypes.length > 0) {

    const mappedTypeName = errorCodeToProblemType[autoErrorCode];

    // Find matching problem type object (matching by name)
    const matchedType = problemTypes.find(
      pt => pt.name.toLowerCase() === mappedTypeName.toLowerCase()
    );

    if (matchedType) {
      setForm(prev => ({
        ...prev,
        problem_type: matchedType.problem_type_id
      }));
    }

    // Auto-fill description
    if (autoDescription) {
      setForm(prev => ({
        ...prev,
        request_details: autoDescription
      }));
    }
  }
}, [problemTypes, autoErrorCode, autoDescription]);


  // Fetch service items & PCB match
  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${selectedCompany}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setServiceItems(data.data);
          
          const matchedItem = data.data.find(item => 
            item.pcb_serial_number === pcbSerialNumber
          );
          
          if (matchedItem) {
            setMatchedServiceItem(matchedItem);
            setForm(prev => ({
              ...prev,
              service_item: matchedItem.service_item_id
            }));

            if (matchedItem.customer) {
              setCustomer(matchedItem.customer);
            }
          }
        }
      } catch (error) {
        console.error('Service item fetch error:', error);
        alert('Error loading service items');
      } finally {
        setIsLoading(false);
      }
    };

    if (pcbSerialNumber) {
      fetchServiceItems();
    } else {
      setIsLoading(false);
    }
  }, [pcbSerialNumber, userId, selectedCompany]);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'service_item' && value) {
      const selectedItem = serviceItems.find(item => item.service_item_id === value);
      setCustomer(selectedItem?.customer || '');
    }
  };

  // Auto Date/Time
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => new Date().toISOString().slice(11, 16);
  console.log("Current Date:", getTodayDate());
  console.log("Current Time:", getCurrentTime());

  // Submit
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  console.log("🚀 Form submission started");

  try {
    const payload = {
      service_item: form.service_item,
      source_type: "Machine Alert",
      preferred_date: getTodayDate(),
      preferred_time: getCurrentTime(),
      request_details: form.request_details,
      problem_type: form.problem_type,
      user_id: userId,
      company_id: selectedCompany,
      status: "Open",
      requested_by: "Service Manager",
      created_by: userId,
      updated_by: userId,
      customer: customer,
      company: selectedCompany
    };

    console.log("📦 Payload being sent:", payload);
    console.log("🌐 Request URL:", `${baseURL}/service-pools/`);

    const response = await fetch(`${baseURL}/service-pools/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("📥 Raw Response:", response);

    const result = await response.json().catch((err) => {
      console.error("❌ JSON Parsing Error:", err);
      throw new Error("Invalid JSON response from server");
    });

    console.log("📄 Parsed Response Body:", result);

    if (response.ok) {
      console.log("✅ API Success:", result);
      alert("Service request submitted successfully!");
      navigate("/servicemanager/error-logs");
    } else {
      console.error("❌ API Error Status:", response.status);
      console.error("❌ API Error Response:", result);
      throw new Error(result.message || "Failed to submit service request");
    }

  } catch (error) {
    console.error("🔥 Final Catch Block Error:", error);
    alert(`Error submitting: ${error.message}`);
  } finally {
    console.log("🔚 Form submission ended");
    setIsSubmitting(false);
  }
};


  const handleCancel = () => navigate('/servicemanager/error-logs');

  if (isLoading) {
    return (
      <div className="container service-request-form mt-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="spinner-border text-primary"></div>
            <p className="mt-2">Loading service items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container service-request-form mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-1">Service Request Form</h5>
          <h6 className="text mb-0" style={{ opacity: 0.9 }}>
            Please fill in the service request details
          </h6>
          {pcbSerialNumber && (
            <div className="mt-2">
              <small>PCB Serial Number: <strong>{pcbSerialNumber}</strong></small>
              {matchedServiceItem && (
                <small className="ms-3">
                  Matched Service: <strong>{matchedServiceItem.service_item_name}</strong>
                </small>
              )}
              {customer && (
                <small className="ms-3 d-block mt-1">
                  Customer: <strong>{customer}</strong>
                </small>
              )}
            </div>
          )}
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* Service Item Field */}
              <div className="col-12">
                <label className="form-label fw-bold">Service Item *</label>
                {matchedServiceItem ? (
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value={`${matchedServiceItem.service_item_name} (${matchedServiceItem.service_item_id})`}
                      readOnly
                      disabled
                    />
                    <input type="hidden" name="service_item" value={matchedServiceItem.service_item_id} />
                    <div className="form-text text-success">
                      Auto-selected from PCB serial number
                    </div>
                  </div>
                ) : (
                  <select
                    name="service_item"
                    value={form.service_item}
                    onChange={handleChange}
                    className="form-control"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select a service item</option>
                    {serviceItems.map(item => (
                      <option key={item.service_item_id} value={item.service_item_id}>
                        {item.service_item_name} ({item.service_item_id})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* ⭐ REPLACED ROW: Problem Type instead of Date/Time */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Problem Type *</label>
                <select
                  name="problem_type"
                  value={form.problem_type}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select Problem Type</option>
                  {problemTypes.map(pt => (
                    <option key={pt.problem_type_id} value={pt.problem_type_id}>
                      {pt.name}
                    </option>
                  ))}
                </select>
                <div className="form-text">Choose the type of problem</div>
              </div>

              {/* Description */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Problem Description *</label>
                <textarea
                  name="request_details"
                  value={form.request_details}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                  required
                  disabled={isSubmitting}
                  placeholder="Describe the problem..."
                />
              </div>

              {/* Buttons */}
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
                  disabled={isSubmitting || !form.service_item}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
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
