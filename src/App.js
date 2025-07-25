// // App.js
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
//   useNavigate,
//   Link,
// } from "react-router-dom";
// import "./App.css";

// import ServiceManagerLogin from "./Login/Login";
// import NewCustomer from "./Customer/NewCustomer";
// import PreventiveMaintainanceChart from "./PreventiveMaintainanceChart/PreventiveMaintainanceChart";
// import PreventiveMaintainance from "./PreventiveMaintainanceGroup/PreventiveMaintainance";
// import ServiceItemComponents from "./ServiceItemComponents/ServiceItemComponents";
// import NewServiceItem from "./ServiceItems/NewServiceItem";
// import ServicePool from "./ServicePool/ServicePool";
// import AuthProvider from "./AuthContext/AuthContext";
// import CustomerComplaints from "./CustomerComplaints/Complaints";
// import ServiceOrders from "./ServiceOrders/ServiceOrders";

// import ServiceRequestDetail from './ServicePool/ServiceRequestDetail';
// import logo from "./Logos/hvac-logo-new.jpg";

// // Placeholder for ServiceOrders component (create this if not available yet)
// // const ServiceOrders = () => <div>Service Orders Page</div>;

// // 🔹 TopNavbar
// const TopNavbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const userRole = localStorage.getItem("userRole");

//   const handleLogout = () => {
//     localStorage.removeItem("userRole");
//     navigate("/");
//   };

//   if (userRole !== "service-manager") return null;

//   const navItems = [
//     {
//       label: "Preventive Maintenance",
//       dropdown: [
//         {
//           path: "/servicemanager/preventive-maintainance-group",
//           label: "P M Group",
//         },
//         {
//           path: "/servicemanager/preventive-maintainance-chart",
//           label: "P M Chart",
//         },
//       ],
//     },
//     {
//       label: "Services",
//       dropdown: [
//         { path: "/servicemanager/service-pool", label: "Service Pool" },
//         { path: "/servicemanager/service-orders", label: "Service Orders" },
//       ],
//     },
//     { path: "/servicemanager/new-customer", label: "Customer" },
//     {
//     label: "Service Items",
//     dropdown: [
//       { path: "/servicemanager/new-service-item", label: "Items" },
//       { path: "/servicemanager/service-item-components", label: "Components" },
//     ],
//   },
//     // { path: "/servicemanager/service-item-components", label: "Service Item Components" },

//     { path: "/servicemanager/customer-complaints", label: "Customer Complaints" },
//   ];

//   return (
//     <nav className="top-navbar">
//       <div className="nav-container">
//         <div className="nav-brand">
//           <img
//                 src={logo}
//                 alt="Company Logo"
//                 style={{ width: "100px", height: "50px" }}
//             />
//         </div>
//         <div className="nav-links">
//           {navItems.map((item) =>
//             item.dropdown ? (
//               <div key={item.label} className="dropdown">
//                 <button className="dropdown-toggle">{item.label}</button>
//                 <div className="dropdown-menu">
//                   {item.dropdown.map((subItem) => (
//                     <Link
//                       key={subItem.path}
//                       to={subItem.path}
//                       className={location.pathname === subItem.path ? "active" : ""}
//                     >
//                       {subItem.label}
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={location.pathname === item.path ? "active" : ""}
//               >
//                 {item.label}
//               </Link>
//             )
//           )}
//         </div>
//         <div className="nav-user">
//           <button onClick={handleLogout} className="logout-btn">
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// // 🔒 Protected Layout
// const PanelLayout = ({ children }) => (
//   <>
//     <TopNavbar />
//     <div className="panel-content">{children}</div>
//   </>
// );

// // 🔒 Route Protection
// const ProtectedRoute = ({ children }) => {
//   const userRole = localStorage.getItem("userRole");
//   if (userRole !== "service-manager") {
//     return <Navigate to="/" replace />;
//   }
//   return <PanelLayout>{children}</PanelLayout>;
// };

// // 🔁 Main App
// function App() {
//   return (
//      <AuthProvider>
//     <Router>
//       <Routes>
//         <Route path="/" element={<ServiceManagerLogin />} />
//         <Route
//           path="/servicemanager/new-customer"
//           element={
//             <ProtectedRoute>
//               <NewCustomer />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/servicemanager/preventive-maintainance-chart"
//           element={
//             <ProtectedRoute>
//               <PreventiveMaintainanceChart />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/servicemanager/preventive-maintainance-group"
//           element={
//             <ProtectedRoute>
//               <PreventiveMaintainance />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/servicemanager/service-item-components"
//           element={
//             <ProtectedRoute>
//               <ServiceItemComponents />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/servicemanager/new-service-item"
//           element={
//             <ProtectedRoute>
//               <NewServiceItem />
//             </ProtectedRoute>
//           }
//         />
//           <Route
//           path="/servicemanager/customer-complaints"
//           element={
//             <ProtectedRoute>
//               <CustomerComplaints />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/servicemanager/service-pool"
//           element={
//             <ProtectedRoute>
//               <ServicePool />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/servicemanager/service-orders"
//           element={
//             <ProtectedRoute>
//               <ServiceOrders />
//             </ProtectedRoute>
//           }
//         />
//           <Route
//           path="/servicemanager/service-requests/:requestId"
//           element={
//             <ProtectedRoute>
//               <ServiceRequestDetail  />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//     </AuthProvider>
//   );
// }

// export default App;











import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import ServiceManagerLogin from "./Login/Login";
import NewCustomer from "./Customer/NewCustomer";
import PreventiveMaintainanceChart from "./PreventiveMaintainanceChart/PreventiveMaintainanceChart";
import PreventiveMaintainance from "./PreventiveMaintainanceGroup/PreventiveMaintainance";
import ServiceItemComponents from "./ServiceItemComponents/ServiceItemComponents";
import NewServiceItem from "./ServiceItems/NewServiceItem";
import ServicePool from "./ServicePool/ServicePool";
import AuthProvider from "./AuthContext/AuthContext";
import CustomerComplaints from "./CustomerComplaints/Complaints";
import ServiceOrders from "./ServiceOrders/ServiceOrders";
import ServiceRequestDetail from './ServicePool/ServiceRequestDetail';
import SignUpScreen from "./Login/SignUpScreen";
import SignupSetPassword from "./Login/SignupSetPassword";
import PanelLayout from "./Navbar/PanelLayout"
import ContactPage from "./Customer/ContactPage";
import CustomerSatisfactionSurvey from "./CustomerSurvey/CustomerSatisfactionSurvey";
import ServiceContractForm from './ServiceItems/ServiceContractForm';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
           <Route path="/contact-api" element={<ContactPage />} />
          <Route path="/" element={<ServiceManagerLogin />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/signupset-password-screen" element={<SignupSetPassword />} />
          
          <Route
            path="/servicemanager/new-customer"
            element={
              <PanelLayout>
                <NewCustomer />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/preventive-maintainance-chart"
            element={
              <PanelLayout>
                <PreventiveMaintainanceChart />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/preventive-maintainance-group"
            element={
              <PanelLayout>
                <PreventiveMaintainance />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/service-item-components"
            element={
              <PanelLayout>
                <ServiceItemComponents />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/new-service-item"
            element={
              <PanelLayout>
                <NewServiceItem />
              </PanelLayout>
            }
          />
           <Route
            path="/servicemanager/service-contract"
            element={
              <PanelLayout>
                <ServiceContractForm />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/customer-complaints"
            element={
              <PanelLayout>
                <CustomerComplaints />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/service-pool"
            element={
              <PanelLayout>
                <ServicePool />
              </PanelLayout>
            }
          />
           <Route
            path="/servicemanager/customer-feedback"
            element={
              <PanelLayout>
                <CustomerSatisfactionSurvey />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/service-orders"
            element={
              <PanelLayout>
                <ServiceOrders />
              </PanelLayout>
            }
          />
          <Route
            path="/servicemanager/service-requests/:requestId"
            element={
              <PanelLayout>
                <ServiceRequestDetail />
              </PanelLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;