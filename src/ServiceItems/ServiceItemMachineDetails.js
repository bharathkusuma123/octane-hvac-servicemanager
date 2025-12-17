// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import baseURL from '../ApiUrl/Apiurl';
// import { useCompany } from "../AuthContext/CompanyContext";
// import { AuthContext } from "../AuthContext/AuthContext";

// const ServiceItemMachineDetails = () => {
//   const { pcbSerialNumber } = useParams();
//   const navigate = useNavigate();
//   const [machineData, setMachineData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { selectedCompany } = useCompany();
//   const { userId } = useContext(AuthContext);

// useEffect(() => {
//   const fetchMachineData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await axios.get(
//         `${baseURL}/latest-all-sensor-data/${pcbSerialNumber}/?company_id=${selectedCompany}&user_id=${userId}`
//       );

//       if (response.data?.status === "success") {
//         setMachineData(response.data); // 👈 store full response
//       } else {
//         setError(response.data?.message || "Failed to fetch machine data");
//       }

//     } catch (error) {
//       console.error("Error fetching machine data:", error);
//       setError("Failed to load machine data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (pcbSerialNumber && userId && selectedCompany) {
//     fetchMachineData();
//   } else {
//     setLoading(false);
//     setError("Missing required parameters");
//   }
// }, [pcbSerialNumber, selectedCompany, userId]);


//   const handleBack = () => {
//     navigate(-1);
//   };

//   // Function to format value display
//   const formatValue = (data) => {
//     if (!data) return 'N/A';
//     return `${data.value} ${data.unit}`.trim();
//   };

//   // Function to get status badge
//   const getStatusBadge = (value) => {
//     if (value === "0" || value === 0) {
//       return <span className="badge bg-danger">Off</span>;
//     } else if (value === "1" || value === 1) {
//       return <span className="badge bg-success">On</span>;
//     }
//     return <span className="badge bg-secondary">{value}</span>;
//   };

//  const getModesBadge = (value) => {
//   const map = {
//     0: "Shutdown",
//     1: "IDEC",
//     2: "Auto",
//     3: "Fan",
//     4: "Indirect",
//     5: "Direct",
//   };

//   const label = map[value] || "Unknown";

//   return <span className="badge bg-primary">{label}</span>;
// };


// const getfanspeedBadge = (value) => {
//   const map = {
//     3: "Shutdown",
//     0: "High",
//     1: "Medium",
//     2: "Low",
//   };

//   const label = map[value] || "Unknown";

//   return <span className="badge bg-primary">{label}</span>;
// };



//   // Function to get error/alarm status
//   const getErrorStatus = (value) => {
//     if (value === "0" || value === 0) {
//       return <span className="badge bg-success">No Error</span>;
//     } else {
//       return <span className="badge bg-danger">Error</span>;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mt-5">
//         <div className="text-center">Loading machine data...</div>
//       </div>
//     );
//   }

//   if (error || !machineData) {
//     return (
//       <div className="container mt-5">
//         <div className="card">
//           <div className="card-header bg-danger text-white">
//             <h5 className="mb-0">Error</h5>
//           </div>
//           <div className="card-body">
//             <div className="alert alert-danger">
//               <strong>Error:</strong> {error}
//             </div>
//             <div className="d-flex gap-2">
//               <button className="btn btn-primary" onClick={handleBack}>
//                 Go Back
//               </button>
//               <button 
//                 className="btn btn-secondary" 
//                 onClick={() => navigate('/servicemanager/service-pool')}
//               >
//                 Return to Service Pool
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4 service-request-formview">
//       <div className="card">
//         <div className="card-header d-flex justify-content-between align-items-center">
//           <div>
//             <h5 className="mb-1" style={{color:'white'}}>Machine Details</h5>
//             <h6 className="text-white mb-0">Real-time machine data and status</h6>
//           </div>
//           <div>
//             <button 
//               className="btn btn-light btn-sm" 
//               onClick={handleBack}
//             >
//               &larr; Back
//             </button>
//           </div>
//         </div>

//      <div className="card-body">

// <div className="alert alert-info mb-3 d-flex justify-content-between align-items-center">
//   <div>
//     <strong>PCB Serial Number:</strong> {machineData.pcb_serial_number}
//   </div>

//   <div>
//     <strong>Status:</strong>{" "}
//     {machineData.is_online ? (
//       <span className="badge bg-success ms-2">Online</span>
//     ) : (
//       <span className="badge bg-danger ms-2">Offline</span>
//     )}
//   </div>
// </div>


//   {/* Sensor Data Table */}
//   <div className="table-responsive">
//     <table className="table table-bordered table-striped">
//       <thead className="table-dark">
//         <tr>
//           <th>S.No.</th>
//           <th>Code</th>
//           <th>Name</th>
//           <th>Value</th>
//           <th>Unit</th>
//           <th>Timestamp</th>
//         </tr>
//       </thead>
//       <tbody>
//         {machineData.data && machineData.data.length > 0 ? (
//           machineData.data.map((item, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{item.code}</td>
//               <td>{item.name}</td>
//               <td>{item.value}</td>
//               <td>{item.unit || "-"}</td>
//               <td>
//                 {new Date(item.timestamp).toLocaleString()}
//               </td>
//             </tr>
//           ))
//         ) : (
//           <tr>
//             <td colSpan="6" className="text-center text-muted">
//               No sensor data available
//             </td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   </div>

// </div>

//       </div>
//     </div>
//   );
// };

// export default ServiceItemMachineDetails;



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
          `${baseURL}/latest-all-sensor-data/${pcbSerialNumber}/?company_id=${selectedCompany}&user_id=${userId}`
        );

        if (response.data?.status === "success") {
          setMachineData(response.data);
        } else {
          setError(response.data?.message || "Failed to fetch machine data");
        }

      } catch (error) {
        console.error("Error fetching machine data:", error);
        setError("Failed to load machine data");
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
        {/* Card Header with inline styling */}
        <div 
          className="card-header d-flex justify-content-between align-items-center"
          style={{
            backgroundColor: '#0096d6',
            color: 'white',
            padding: '15px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div>
            <h5 className="mb-1" style={{color:'white', fontWeight: '600'}}>Machine Details</h5>
            <h6 className="text-white mb-0" style={{opacity: '0.9'}}>Real-time machine data and status</h6>
          </div>
          <div>
            <button 
              className="btn btn-light btn-sm" 
              onClick={handleBack}
              style={{
                backgroundColor: 'white',
                color: '#0096d6',
                border: 'none',
                fontWeight: '500'
              }}
            >
              &larr; Back
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="alert alert-info mb-3 d-flex justify-content-between align-items-center">
            <div>
              <strong>PCB Serial Number:</strong> {machineData.pcb_serial_number}
            </div>

            <div>
              <strong>Status:</strong>{" "}
              {machineData.is_online ? (
                <span className="badge bg-success ms-2">Online</span>
              ) : (
                <span className="badge bg-danger ms-2">Offline</span>
              )}
            </div>
          </div>

          {/* Sensor Data Table with column widths */}
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead style={{
                backgroundColor: '#0096d6',
                color: 'white'
              }}>
                <tr>
                  <th style={{width: '5%', borderColor: 'rgba(255,255,255,0.2)'}}>S.No.</th>
                  <th style={{width: '15%', borderColor: 'rgba(255,255,255,0.2)'}}>Code</th>
                  <th style={{width: '25%', borderColor: 'rgba(255,255,255,0.2)'}}>Name</th>
                  <th style={{width: '15%', borderColor: 'rgba(255,255,255,0.2)'}}>Value</th>
                  <th style={{width: '10%', borderColor: 'rgba(255,255,255,0.2)'}}>Unit</th>
                  <th style={{width: '30%', borderColor: 'rgba(255,255,255,0.2)'}}>Timestamp</th>
                </tr>
              </thead>
            <tbody>
  {machineData.data && machineData.data.length > 0 ? (
    machineData.data
      // ❌ remove Error Code row
      .filter(item => item.code !== "EC")
      .map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.code}</td>
          <td>{item.name}</td>

          {/* ✅ VALUE COLUMN LOGIC */}
          <td>
            {item.code === "MD"
              ? getModesBadge(item.value)
              : item.code === "FS"
              ? getfanspeedBadge(item.value)
              : item.value}
          </td>

          <td>{item.unit || "-"}</td>
          <td>{new Date(item.timestamp).toLocaleString()}</td>
        </tr>
      ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center text-muted">
        No sensor data available
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItemMachineDetails;