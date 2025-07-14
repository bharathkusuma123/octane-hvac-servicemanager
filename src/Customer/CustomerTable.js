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

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import baseURL from '../ApiUrl/Apiurl';
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";

const CustomerTable = ({ toggleForm }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedCompany } = useCompany();
  console.log('Selected company object:', selectedCompany);
   const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Selected company:', selectedCompany); // This is already the company ID
         console.log('User ID:', userId);

      if (!userId || !selectedCompany) {
        setError('Missing user ID or company ID');
        return;
      }
         const response = await axios.get(
        `${baseURL}/customers/?user_id=${userId}&company_id=${selectedCompany}`
      );
        const filteredAndSorted = response.data.data
          .filter(user => user.status === 'Active')
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setCustomers(filteredAndSorted);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setError('Failed to load customers');
      } finally {
        setLoading(false); 
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on selected company and search term
  useEffect(() => {
    let results = customers;
    
    // First filter by selected company if one is selected
    if (selectedCompany) {
      results = results.filter(customer => 
        customer.company === selectedCompany
      );
    }
    
    // Then apply search term filter
    if (searchTerm) {
      results = results.filter(customer =>
        Object.values(customer)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCustomers(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCompany, searchTerm, customers]);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCustomers.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredCustomers.length / entriesPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) return <div className="text-center my-4">Loading customers...</div>;
  if (error) return <div className="alert alert-danger my-4">{error}</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div>
          <h2 className="customer-title mb-0">Customers</h2>
          <p className="customer-subtitle mb-0 text-muted">
            {selectedCompany ? `Showing customers for ${selectedCompany}` : 'Showing all customers'}
          </p>
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
        <table className="table">
          <thead className="new-customer-table-header">
            <tr>
              <th>S.No</th>
              <th>Customer ID</th>
              <th>Company</th>
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
                  <td>{customer.company}</td>
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
                  <td>{formatDate(customer.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  {selectedCompany 
                    ? `No customers found for ${selectedCompany}${searchTerm ? ' matching your search' : ''}`
                    : 'No customers found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
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
                disabled={currentPage === totalPages}
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
