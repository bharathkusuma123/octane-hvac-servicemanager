import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../Logos/hvac-logo-new.jpg";
import baseURL from "../ApiUrl/Apiurl";
import { useCompany } from "../AuthContext/CompanyContext";

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const { selectedCompany, updateCompany } = useCompany();
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
     localStorage.removeItem("selectedCompany"); // Remove from localStorage
  updateCompany("");
    navigate("/");
  };

  useEffect(() => {
    if (userRole === "service-manager" && userId) {
      fetch(`${baseURL}/users/`)
        .then((res) => res.json())
        .then((data) => {
          const matchedUser = Array.isArray(data)
            ? data.find((user) => user.user_id === userId)
            : null;

          if (matchedUser) {
            setUserData(matchedUser);
            const storedCompany = localStorage.getItem("selectedCompany");
            if (!storedCompany) {
              updateCompany(matchedUser.default_company);
            }
          }
        })
        .catch((err) => console.error("Failed to load user data", err));
    }
  }, [userRole, userId, updateCompany]);

  if (userRole !== "service-manager") return null;

  const handleCompanyChange = (e) => {
    updateCompany(e.target.value);
  };

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
    { path: "/servicemanager/customer-complaints", label: "Customer Complaints" },
  ];

  return (
    <nav className="top-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "100px", height: "50px" }}
          />
        </div>
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

          {userData && (
            <select
              className="form-select ms-3"
              value={selectedCompany}
              onChange={handleCompanyChange}
              style={{ minWidth: "150px" }}
            >
              <option value={userData.default_company}>
                {userData.default_company}
              </option>
              {Array.isArray(userData.companies) &&
                userData.companies
                  .filter((comp) => comp !== userData.default_company)
                  .map((comp) => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
            </select>
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

export default TopNavbar;