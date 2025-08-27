// import React, { useState } from 'react';

// const PreventiveMaintainanceSchedule = () => {
//   const [activeTab, setActiveTab] = useState('factory');

//   // Static data for factory tab
//   const factoryData = [
//     { id: 1, name: 'Factory A', location: 'New York', production: '500 units' },
//     { id: 2, name: 'Factory B', location: 'Chicago', production: '300 units' },
//     { id: 3, name: 'Factory C', location: 'Los Angeles', production: '750 units' },
//     { id: 4, name: 'Factory D', location: 'Houston', production: '450 units' },
//   ];

//   // Static data for customer tab
//   const customerData = [
//     { id: 1, name: 'Customer A', location: 'Boston', orders: '25 units' },
//     { id: 2, name: 'Customer B', location: 'Seattle', orders: '40 units' },
//     { id: 3, name: 'Customer C', location: 'Miami', orders: '15 units' },
//     { id: 4, name: 'Customer D', location: 'Denver', orders: '60 units' },
//   ];

//   // Handle raise request button click
//   const handleRaiseRequest = (id, type) => {
//     alert(`Request raised for ${type} ID: ${id}`);
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1>Factory and Customer Management</h1>
      
//       {/* Tabs */}
//       <div style={{ marginBottom: '20px' }}>
//         <button 
//           onClick={() => setActiveTab('factory')}
//           style={{
//             padding: '10px 20px',
//             marginRight: '10px',
//             backgroundColor: activeTab === 'factory' ? '#4CAF50' : '#f1f1f1',
//             color: activeTab === 'factory' ? 'white' : 'black',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Factory
//         </button>
//         <button 
//           onClick={() => setActiveTab('customer')}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: activeTab === 'customer' ? '#4CAF50' : '#f1f1f1',
//             color: activeTab === 'customer' ? 'white' : 'black',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Customer
//         </button>
//       </div>
      
//       {/* Factory Tab Content */}
//       {activeTab === 'factory' && (
//         <div>
//           <h2>Factory List</h2>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f2f2f2' }}>
//                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
//                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
//                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Location</th>
//                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Production</th>
//                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {factoryData.map((factory) => (
//                 <tr key={factory.id}>
//                   <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{factory.id}</td>
//                   <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{factory.name}</td>
//                   <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{factory.location}</td>
//                   <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{factory.production}</td>
//                   <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
//                     <button 
//                       onClick={() => handleRaiseRequest(factory.id, 'Factory')}
//                       style={{
//                         padding: '8px 12px',
//                         backgroundColor: '#4CAF50',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       Raise Request
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
      
//       {/* Customer Tab Content */}
//       {activeTab === 'customer' && (
//         <div>
//           <h2>Customer List</h2>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f2f2f2' }}>
//                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
//                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
//                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Location</th>
//                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Orders</th>
//                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {customerData.map((customer) => (
//                 <tr key={customer.id}>
//                   <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{customer.id}</td>
//                   <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{customer.name}</td>
//                   <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{customer.location}</td>
//                   <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{customer.orders}</td>
//                   <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
//                     <button 
//                       onClick={() => handleRaiseRequest(customer.id, 'Customer')}
//                       style={{
//                         padding: '8px 12px',
//                         backgroundColor: '#4CAF50',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       Raise Request
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PreventiveMaintainanceSchedule;






// import React, { useState } from 'react';

// const PreventiveMaintainanceSchedule = () => {
//   const [activeTab, setActiveTab] = useState('factory');

//   // Static data for factory tab
//   const factoryData = [
//     { id: 1, name: 'Factory A', location: 'New York', production: '500 units' },
//     { id: 2, name: 'Factory B', location: 'Chicago', production: '300 units' },
//     { id: 3, name: 'Factory C', location: 'Los Angeles', production: '750 units' },
//     { id: 4, name: 'Factory D', location: 'Houston', production: '450 units' },
//   ];

//   // Static data for customer tab
//   const customerData = [
//     { id: 1, name: 'Customer A', location: 'Boston', orders: '25 units' },
//     { id: 2, name: 'Customer B', location: 'Seattle', orders: '40 units' },
//     { id: 3, name: 'Customer C', location: 'Miami', orders: '15 units' },
//     { id: 4, name: 'Customer D', location: 'Denver', orders: '60 units' },
//   ];

//   // Handle raise request button click
//   const handleRaiseRequest = (id, type) => {
//     alert(`Request raised for ${type} ID: ${id}`);
//   };

//   return (
//     <div className="pm-container">
//       <h1 className="delegate-title">Factory and Customer Management</h1>
      
//       {/* Tabs */}
//       <div style={{ marginBottom: '20px' }}>
//         <button 
//           onClick={() => setActiveTab('factory')}
//           style={{
//             padding: '10px 20px',
//             marginRight: '10px',
//             backgroundColor: activeTab === 'factory' ? '#0096D6' : '#f1f1f1',
//             color: activeTab === 'factory' ? 'white' : 'black',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontWeight: '500'
//           }}
//         >
//           Factory
//         </button>
//         <button 
//           onClick={() => setActiveTab('customer')}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: activeTab === 'customer' ? '#0096D6' : '#f1f1f1',
//             color: activeTab === 'customer' ? 'white' : 'black',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontWeight: '500'
//           }}
//         >
//           Customer
//         </button>
//       </div>
      
//       {/* Factory Tab Content */}
//       {activeTab === 'factory' && (
//         <div>
//           <h2 className="pm-title">Factory List</h2>
//           <div className="table-responsive">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th className="pm-chart-table-header">ID</th>
//                   <th className="pm-chart-table-header">Name</th>
//                   <th className="pm-chart-table-header">Location</th>
//                   <th className="pm-chart-table-header">Production</th>
//                   <th className="pm-chart-table-header">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {factoryData.map((factory) => (
//                   <tr key={factory.id}>
//                     <td>{factory.id}</td>
//                     <td>{factory.name}</td>
//                     <td>{factory.location}</td>
//                     <td>{factory.production}</td>
//                     <td>
//                       <button 
//                         onClick={() => handleRaiseRequest(factory.id, 'Factory')}
//                         className="btn btn-primary btn-sm"
//                       >
//                         Raise Request
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
      
//       {/* Customer Tab Content */}
//       {activeTab === 'customer' && (
//         <div>
//           <h2 className="pm-title">Customer List</h2>
//           <div className="table-responsive">
//             <table className="table">
//              <thead className="bg-[#0096D6] text-white">
//             <tr>
//             <th className="pm-chart-table-header">ID</th>
//             <th className="pm-chart-table-header">Name</th>
//             <th className="pm-chart-table-header">Location</th>
//             <th className="pm-chart-table-header">Production</th>
//             <th className="pm-chart-table-header">Action</th>
//             </tr>
//             </thead>

//               <tbody>
//                 {customerData.map((customer) => (
//                   <tr key={customer.id}>
//                     <td>{customer.id}</td>
//                     <td>{customer.name}</td>
//                     <td>{customer.location}</td>
//                     <td>{customer.orders}</td>
//                     <td>
//                       <button 
//                         onClick={() => handleRaiseRequest(customer.id, 'Customer')}
//                         className="btn btn-primary btn-sm"
//                       >
//                         Raise Request
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PreventiveMaintainanceSchedule;



import React, { useState } from 'react';

const PreventiveMaintainanceSchedule = () => {
  const [activeTab, setActiveTab] = useState('factory');

  // Static data for factory tab
  const factoryData = [
    { id: 1, name: 'Factory A', location: 'New York', production: '500 units' },
    { id: 2, name: 'Factory B', location: 'Chicago', production: '300 units' },
    { id: 3, name: 'Factory C', location: 'Los Angeles', production: '750 units' },
    { id: 4, name: 'Factory D', location: 'Houston', production: '450 units' },
  ];

  // Static data for customer tab
  const customerData = [
    { id: 1, name: 'Customer A', location: 'Boston', orders: '25 units' },
    { id: 2, name: 'Customer B', location: 'Seattle', orders: '40 units' },
    { id: 3, name: 'Customer C', location: 'Miami', orders: '15 units' },
    { id: 4, name: 'Customer D', location: 'Denver', orders: '60 units' },
  ];

  // Handle raise request button click
  const handleRaiseRequest = (id, type) => {
    alert(`Request raised for ${type} ID: ${id}`);
  };

  // Define the blue color for consistency
  const blueColor = '#0096D6';

  return (
    <div className="pm-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="delegate-title" style={{ color: '#333', marginBottom: '20px' }}>Factory and Customer Management</h1>
      
      {/* Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('factory')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'factory' ? blueColor : '#f1f1f1',
            color: activeTab === 'factory' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Factory
        </button>
        <button 
          onClick={() => setActiveTab('customer')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'customer' ? blueColor : '#f1f1f1',
            color: activeTab === 'customer' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Customer
        </button>
      </div>
      
      {/* Factory Tab Content */}
      {activeTab === 'factory' && (
        <div>
          <h2 className="pm-title" style={{ color: '#333', marginBottom: '15px' }}>Factory List</h2>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Location</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Production</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {factoryData.map((factory) => (
                  <tr key={factory.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px' }}>{factory.id}</td>
                    <td style={{ padding: '12px' }}>{factory.name}</td>
                    <td style={{ padding: '12px' }}>{factory.location}</td>
                    <td style={{ padding: '12px' }}>{factory.production}</td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => handleRaiseRequest(factory.id, 'Factory')}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: blueColor,
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Raise Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Customer Tab Content */}
      {activeTab === 'customer' && (
        <div>
          <h2 className="pm-title" style={{ color: '#333', marginBottom: '15px' }}>Customer List</h2>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Location</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Orders</th>
                  <th style={{ padding: '12px', backgroundColor: blueColor, color: 'white', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {customerData.map((customer) => (
                  <tr key={customer.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px' }}>{customer.id}</td>
                    <td style={{ padding: '12px' }}>{customer.name}</td>
                    <td style={{ padding: '12px' }}>{customer.location}</td>
                    <td style={{ padding: '12px' }}>{customer.orders}</td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => handleRaiseRequest(customer.id, 'Customer')}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: blueColor,
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Raise Request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreventiveMaintainanceSchedule;