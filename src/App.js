// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link,
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

// Placeholder for ServiceOrders component (create this if not available yet)
const ServiceOrders = () => <div>Service Orders Page</div>;

// 🔹 TopNavbar
const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  if (userRole !== "service-manager") return null;

  const navItems = [
    {
      label: "Preventive Maintenance",
      dropdown: [
        {
          path: "/servicemanager/preventive-maintainance-group",
          label: "P M Group",
        },
        {
          path: "/servicemanager/preventive-maintainance-chart",
          label: "P M Chart",
        },
      ],
    },
    {
      label: "Services",
      dropdown: [
        { path: "/servicemanager/service-pool", label: "Service Pool" },
        { path: "/servicemanager/service-orders", label: "Service Orders" },
      ],
    },
    { path: "/servicemanager/new-customer", label: "Customer" },
    {
    label: "Service Items",
    dropdown: [
      { path: "/servicemanager/new-service-item", label: "Items" },
      { path: "/servicemanager/service-item-components", label: "Components" },
    ],
  },
    // { path: "/servicemanager/service-item-components", label: "Service Item Components" },

    { path: "/servicemanager/customer-complaints", label: "Customer Complaints" },
  ];

  return (
    <nav className="top-navbar">
      <div className="nav-container">
        <div className="nav-brand">Service Manager Panel</div>
        <div className="nav-links">
          {navItems.map((item) =>
            item.dropdown ? (
              <div key={item.label} className="dropdown">
                <button className="dropdown-toggle">{item.label}</button>
                <div className="dropdown-menu">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={location.pathname === subItem.path ? "active" : ""}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
        <div className="nav-user">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

// 🔒 Protected Layout
const PanelLayout = ({ children }) => (
  <>
    <TopNavbar />
    <div className="panel-content">{children}</div>
  </>
);

// 🔒 Route Protection
const ProtectedRoute = ({ children }) => {
  const userRole = localStorage.getItem("userRole");
  if (userRole !== "service-manager") {
    return <Navigate to="/" replace />;
  }
  return <PanelLayout>{children}</PanelLayout>;
};

// 🔁 Main App
function App() {
  return (
     <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<ServiceManagerLogin />} />
        <Route
          path="/servicemanager/new-customer"
          element={
            <ProtectedRoute>
              <NewCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicemanager/preventive-maintainance-chart"
          element={
            <ProtectedRoute>
              <PreventiveMaintainanceChart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicemanager/preventive-maintainance-group"
          element={
            <ProtectedRoute>
              <PreventiveMaintainance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicemanager/service-item-components"
          element={
            <ProtectedRoute>
              <ServiceItemComponents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicemanager/new-service-item"
          element={
            <ProtectedRoute>
              <NewServiceItem />
            </ProtectedRoute>
          }
        />
          <Route
          path="/servicemanager/customer-complaints"
          element={
            <ProtectedRoute>
              <CustomerComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicemanager/service-pool"
          element={
            <ProtectedRoute>
              <ServicePool />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicemanager/service-orders"
          element={
            <ProtectedRoute>
              <ServiceOrders />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
