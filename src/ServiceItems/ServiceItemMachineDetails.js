import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from '../ApiUrl/Apiurl';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";

const ServiceItemMachineDetails = () => {
  const { pcbSerialNumber } = useParams();
  const navigate = useNavigate();
  const [machineData, setMachineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${baseURL}/get-latest-data/${pcbSerialNumber}/?user_id=${userId}&company_id=${selectedCompany}`
        );
        
        if (response.data.status === "success" && response.data.data) {
          setMachineData(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch machine data");
        }
      } catch (error) {
        console.error("Error fetching machine data:", error);
        
        if (error.response && error.response.status === 403) {
          setError(error.response.data?.message || "You do not have permission to view this machine data");
        } else if (error.response && error.response.status === 404) {
          setError("Machine data not found");
        } else {
          setError("Failed to load machine data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (pcbSerialNumber && userId && selectedCompany) {
      fetchMachineData();
    } else {
      setLoading(false);
      setError("Missing required parameters");
    }
  }, [pcbSerialNumber, selectedCompany, userId]);

  const handleBack = () => {
    navigate(-1);
  };

  // Function to format value display
  const formatValue = (data) => {
    if (!data) return 'N/A';
    return `${data.value} ${data.unit}`.trim();
  };

  // Function to get status badge
  const getStatusBadge = (value) => {
    if (value === "0" || value === 0) {
      return <span className="badge bg-danger">Off</span>;
    } else if (value === "1" || value === 1) {
      return <span className="badge bg-success">On</span>;
    }
    return <span className="badge bg-secondary">{value}</span>;
  };

 const getModesBadge = (value) => {
  const map = {
    0: "Shutdown",
    1: "IDEC",
    2: "Auto",
    3: "Fan",
    4: "Indirect",
    5: "Direct",
  };

  const label = map[value] || "Unknown";

  return <span className="badge bg-primary">{label}</span>;
};


const getfanspeedBadge = (value) => {
  const map = {
    3: "Shutdown",
    0: "High",
    1: "Medium",
    2: "Low",
  };

  const label = map[value] || "Unknown";

  return <span className="badge bg-primary">{label}</span>;
};



  // Function to get error/alarm status
  const getErrorStatus = (value) => {
    if (value === "0" || value === 0) {
      return <span className="badge bg-success">No Error</span>;
    } else {
      return <span className="badge bg-danger">Error</span>;
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">Loading machine data...</div>
      </div>
    );
  }

  if (error || !machineData) {
    return (
      <div className="container mt-5">
        <div className="card">
          <div className="card-header bg-danger text-white">
            <h5 className="mb-0">Error</h5>
          </div>
          <div className="card-body">
            <div className="alert alert-danger">
              <strong>Error:</strong> {error}
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleBack}>
                Go Back
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/servicemanager/service-pool')}
              >
                Return to Service Pool
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 service-request-formview">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1" style={{color:'white'}}>Machine Details</h5>
            <h6 className="text-white mb-0">Real-time machine data and status</h6>
          </div>
          <div>
            <button 
              className="btn btn-light btn-sm" 
              onClick={handleBack}
            >
              &larr; Back
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* PCB Serial Number Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-info">
                <h6 className="mb-1">PCB Serial Number</h6>
                <h4 className="mb-0">{machineData.pcb_serial_number}</h4>
              </div>
            </div>
          </div>

          {/* Temperature and Humidity Data */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="border-bottom pb-2 mb-3">Environmental Data</h6>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Outdoor Temperature</th>
                      <td>{formatValue(machineData.outdoor_temperature)}</td>
                    </tr>
                    <tr>
                      <th>Room Temperature</th>
                      <td>{formatValue(machineData.room_temperature)}</td>
                    </tr>
                    <tr>
                      <th>Room Humidity</th>
                      <td>{formatValue(machineData.room_humidity)}</td>
                    </tr>
                    <tr>
                      <th>Set Temperature</th>
                      <td>{formatValue(machineData.set_temperature)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-6">
              <h6 className="border-bottom pb-2 mb-3">System Status</h6>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>HVAC Status</th>
                      <td>{getStatusBadge(machineData.hvac_on?.value)}</td>
                    </tr>
                    <tr>
                      {/* <th>Mode</th>
                      <td>
                        {machineData.mode?.value === "1" ? (
                          <span className="badge bg-info">Cooling</span>
                        ) : machineData.mode?.value === "2" ? (
                          <span className="badge bg-warning">Heating</span>
                        ) : (
                          <span className="badge bg-secondary">Unknown</span>
                        )}
                      </td> */}
                       <th>Modes</th>
                      <td>{getModesBadge(machineData.mode?.value)}</td>
                    </tr>
                    <tr>
                      <th>Fan Speed</th>
                      <td>{getfanspeedBadge(machineData.fan_speed?.value)}</td>
                    </tr>
                    <tr>
                      <th>HVAC Busy</th>
                      <td>{getStatusBadge(machineData.hvac_busy?.value)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Error and Alarm Status */}
          <div className="row">
            <div className="col-12">
              <h6 className="border-bottom pb-2 mb-3">System Health</h6>
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h5 className="card-title">Error Status</h5>
                      <div className="mt-3">
                        {getErrorStatus(machineData.error_flag?.value)}
                      </div>
                      <p className="text-muted mt-2 mb-0">
                        {machineData.error_flag?.value === "0" ? 
                          "System operating normally" : 
                          "System has detected an error"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h5 className="card-title">Alarm Status</h5>
                      <div className="mt-3">
                        {getErrorStatus(machineData.alarm_occurred?.value)}
                      </div>
                      <p className="text-muted mt-2 mb-0">
                        {machineData.alarm_occurred?.value === "0" ? 
                          "No alarms triggered" : 
                          "Alarm has been triggered"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Raw Data (Optional - for debugging) */}
          {/* <div className="row mt-4">
            <div className="col-12">
              <details>
                <summary className="h6">Raw Data</summary>
                <pre className="mt-2 p-3 bg-light rounded">
                  {JSON.stringify(machineData, null, 2)}
                </pre>
              </details>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ServiceItemMachineDetails;