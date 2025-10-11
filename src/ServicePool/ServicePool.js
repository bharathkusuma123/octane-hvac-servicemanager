import React, { useState, useEffect, useContext } from "react";
import "./ServicePool.css";
import axios from "axios";
import baseURL from "../ApiUrl/Apiurl";
import { useNavigate } from 'react-router-dom';
import { useCompany } from "../AuthContext/CompanyContext";
import Swal from 'sweetalert2';
import { AuthContext } from "../AuthContext/AuthContext";
import AssignmentForm from "./AssignmentForm";
import ServiceTableContent from "./ServiceTableContent";

const ServicePoolTable = () => { 
  const { userId } = useContext(AuthContext);
  const { selectedCompany } = useCompany();
  const navigate = useNavigate();
  
  // State management
  const [showAssignmentScreen, setShowAssignmentScreen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [resources, setResources] = useState([]);
  const [historyResponse, setHistoryResponse] = useState({ data: [] });
  const [customers, setCustomers] = useState([]); // New state for customers
  
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${baseURL}/customers/`, {
        params: {
          user_id: userId,
          company_id: selectedCompany
        }
      });
      
      if (response.data.status === "success" && Array.isArray(response.data.data)) {
        setCustomers(response.data.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    }
  };

  // Fetch engineers and resources
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${baseURL}/users/`);
        const serviceEngineers = usersResponse.data.filter(
          user => user.role === "Service Engineer"
        );
        setEngineers(serviceEngineers);

        if (selectedCompany && userId) {
          const resourcesResponse = await axios.get(`${baseURL}/resources/?company_id=${selectedCompany}&user_id=${userId}`);
          const resourceArray = Array.isArray(resourcesResponse.data?.data) ? resourcesResponse.data.data : [];
          setResources(resourceArray);
          
          // Fetch customers when company and user are available
          await fetchCustomers();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCompany, userId]);

  // Fetch service pool data
  const fetchPoolData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/service-pools/?user_id=${userId}&company_id=${selectedCompany}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json(); 
      const responseData = result.data || result;
      let dataArray = Array.isArray(responseData) ? responseData : [responseData];

      dataArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setData(dataArray);
      setFilteredData(dataArray);
    } catch (err) {
      setError(err.message);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoolData();
  }, [userId, selectedCompany]);

  // Fetch assignment history
  useEffect(() => {
    const fetchAssignmentHistory = async () => {
      try {
        const response = await axios.get(`${baseURL}/assignment-history/`, {
          params: {
            user_id: userId,
            company_id: selectedCompany
          }
        });
        
        const historyData = response.data?.data || response.data || [];
        const sortedHistory = Array.isArray(historyData) 
          ? historyData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : [];
        
        setHistoryResponse({ data: sortedHistory });
      } catch (error) {
        console.error("Error fetching assignment history:", error);
        setHistoryResponse({ data: [] });
      }
    };

    if (userId && selectedCompany) {
      fetchAssignmentHistory();
    }
  }, [userId, selectedCompany]);

  // Apply search filter
  useEffect(() => {
    let results = data;
    
    if (selectedCompany) {
      results = results.filter(item => item.company === selectedCompany);
    }
    
    if (searchTerm) {
      results = results.filter(item =>
        Object.values(item).join(' ').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredData(results);
    setCurrentPage(1);
  }, [selectedCompany, searchTerm, data]);

  // Get customer name by ID
  const getCustomerName = (customerId) => {
    if (!customerId) return "N/A";
    
    const customer = customers.find(cust => cust.customer_id === customerId);
    return customer ? customer.full_name || customer.username || "N/A" : customerId;
  };

  // Handle assign click
  const handleAssignClick = (request) => {
    setCurrentRequest(request);
    setShowAssignmentScreen(true);
  };

  // Handle reopen service (keep your existing implementation)
  const handleReopenService = async (item) => {
    // Your existing handleReopenService implementation
    const result = await Swal.fire({
      icon: 'question',
      title: 'Re-open Service?',
      text: `Are you sure you want to re-open request ${item.request_id}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, Re-open',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Re-opening Service...',
          text: 'Please wait while we create a new service request.',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); },
        });

        const payload = {
          source_type: 'Re-Opened',
          status: 'Open',
          company: item.company,
          service_item: item.service_item?.id || item.service_item,
          customer: item.customer?.id || item.customer,
          request_details: `Reopened from request ${item.request_id}. Original issue: ${item.request_details || 'No details provided'}`,
          alert_details: item.alert_details,
          pm_group: item.pm_group?.id || item.pm_group,
          requested_by: item.requested_by,
          preferred_date: new Date().toISOString().split('T')[0],
          preferred_time: '09:00:00',
          assigned_engineer: null,
          estimated_completion_time: null,
          estimated_price: null,
          est_start_datetime: null,
          est_end_datetime: null,
          dynamics_service_order_no: null,
          created_by: userId,
          updated_by: userId,
          user_id: userId,
          company_id: selectedCompany,
          reopened_from: item.request_id
        };

        Object.keys(payload).forEach(key => {
          if (payload[key] === undefined || payload[key] === null) {
            delete payload[key];
          }
        });

        await axios.post(`${baseURL}/service-pools/`, payload);

        try {
          await axios.put(`${baseURL}/service-pools/${item.request_id}/`, {
            status: 'Reopened',
            updated_by: userId,
            user_id: userId,
            company_id: selectedCompany
          });
        } catch (updateError) {
          console.warn('Note: Original request status update failed:', updateError);
        }

        Swal.fire({
          icon: 'success',
          title: 'Reopened Successfully!',
          html: `<div>
            <p>Original request: <strong>${item.request_id}</strong></p>
            <p class="text-muted">You can now assign this new request to an engineer with updated dates.</p>
          </div>`,
          confirmButtonColor: '#3085d6',
        });

        await fetchPoolData();
        
      } catch (error) {
        console.error('Error reopening service:', error);
        let errorMessage = 'Failed to reopen service request. Please try again.';
        
        if (error.response?.data?.errors) {
          const fieldErrors = error.response.data.errors;
          errorMessage = 'Validation errors: ' + Object.keys(fieldErrors)
            .map(field => `${field}: ${fieldErrors[field].join(', ')}`)
            .join('; ');
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Re-open Failed',
          text: errorMessage,
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  if (loading) return <div className="service-container">Loading...</div>;
  if (error) return <div className="service-container">Error: {error}</div>;

  return (
    <div className="service-container pm-container">
      {!showAssignmentScreen ? (
        <ServiceTableContent
          selectedCompany={selectedCompany}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          filteredData={filteredData}
          historyResponse={historyResponse}
          navigate={navigate}
          handleAssignClick={handleAssignClick}
          handleReopenService={handleReopenService}
          getCustomerName={getCustomerName} // Pass the function as prop
           userId={userId} // Pass userId as prop
        />
      ) : (
        <AssignmentForm
          currentRequest={currentRequest}
          engineers={engineers}
          resources={resources}
          selectedCompany={selectedCompany}
          userId={userId}
          onClose={() => setShowAssignmentScreen(false)}
          onSuccess={fetchPoolData}
        />
      )}
    </div>
  );
};

export default ServicePoolTable;