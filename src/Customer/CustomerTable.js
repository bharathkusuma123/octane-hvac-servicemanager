// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const CustomerTable = ({ toggleForm }) => {
//   const [customers, setCustomers] = useState([]);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await axios.get('http://175.29.21.7:8006/users/');
        
//         // Filter and sort customers by created_at descending
//         const filteredAndSorted = response.data
//           .filter(user => user.role === 'Customer')
//           .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
//         setCustomers(filteredAndSorted);
//       } catch (error) {
//         console.error('Error fetching customer data:', error);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   return (
//     <>
//       <h2 className="customer-title">Customers</h2>
//       <p className="customer-subtitle">Manage customer records</p>
//       <div className="d-flex justify-content-end mb-3">
//         <button onClick={toggleForm} className="btn btn-primary">
//           Add New Customer
//         </button>
//       </div>

//       <div className="table-responsive">
//         <table className="table table-striped table-hover">
//           <thead className="table-dark">
//             <tr>
//               <th>Customer ID</th>
//               <th>Full Name</th>
//               <th>Username</th>
//               <th>Email</th>
//               <th>Mobile</th>
//               <th>City</th>
//               <th>Type</th>
//               <th>Status</th>
//               <th>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((customer, index) => (
//               <tr key={index}>
//                 <td>{customer.user_id}</td>
//                 <td>{customer.full_name}</td>
//                 <td>{customer.username}</td>
//                 <td>{customer.email}</td>
//                 <td>{customer.mobile_no}</td>
//                 <td>{customer.city}</td>
//                 <td>{customer.customer_type}</td>
//                 <td>
//                   <span className={`badge ${
//                     customer.status === 'Active' ? 'bg-success' :
//                     customer.status === 'Inactive' ? 'bg-warning text-dark' :
//                     'bg-danger'
//                   }`}>
//                     {customer.status}
//                   </span>
//                 </td>
//                 <td>{new Date(customer.created_at).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default CustomerTable;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerTable = ({ toggleForm }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://175.29.21.7:8006/customers/');
      const filteredAndSorted = response.data.data
        .filter(user => user.status === 'Active') 
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setCustomers(filteredAndSorted);
      setFilteredCustomers(filteredAndSorted);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  fetchCustomers();
}, []);

  useEffect(() => {
    const results = customers.filter(customer =>
      Object.values(customer)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, customers]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCustomers.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage);

  return (
    <>

   <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
  <div>
    <h2 className="customer-title mb-0">Customers</h2>
    <p className="customer-subtitle mb-0 text-muted">Manage customer records</p>
  </div>
  <button onClick={toggleForm} className="btn btn-primary">
    Add New Customer
  </button>
</div>
      
     <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
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
    placeholder="Search customers..."
    className="form-control w-auto"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

      <div className="table-responsive mb-4">
        <table className="table ">
          <thead className="new-customer-table-header">
            <tr>
              <th>S.No</th>
              <th>Customer ID</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>City</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.length > 0 ? (
              currentEntries.map((customer, index) => (
                <tr key={index}>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{customer.customer_id}</td>
                  <td>{customer.full_name}</td>
                  <td>{customer.username}</td>
                  <td>{customer.email}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.city}</td>
                  <td>{customer.customer_type}</td>
                  <td>
                    <span className={`badge ${
                      customer.status === 'Active' ? 'bg-success' :
                      customer.status === 'Inactive' ? 'bg-warning text-dark' :
                      'bg-danger'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>{new Date(customer.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {/* <div className="pagination-controls d-flex justify-content-center mt-3">
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
      </div> */}
        {totalPages > 1 && (
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
    </>
  );
};

export default CustomerTable;

