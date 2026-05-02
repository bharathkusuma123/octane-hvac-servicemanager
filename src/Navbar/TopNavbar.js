import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../Logos/hvac-logo-new.jpg";
import baseURL from "../ApiUrl/Apiurl";
import { useCompany } from "../AuthContext/CompanyContext";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const { selectedCompany, updateCompany } = useCompany();
  const [userData, setUserData] = useState(null);
  const [companiesData, setCompaniesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [pmBadgeCount, setPmBadgeCount] = useState(0);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ─── Fetch PM badge count ────────────────────────────────────────────────
  const fetchPmBadgeCount = async (companyId, uid) => {
  if (!companyId || !uid) return;
  try {
    const response = await fetch(
      `${baseURL}/service-item-pm-schedules/?user_id=${uid}&company_id=${companyId}`
    );
    const data = await response.json();
    if (data.status === "success") {
      // Count ONLY Factory + Pending + is_alert_sent true
      const count = data.data.filter((schedule) =>
        schedule.responsible?.toLowerCase() === "factory" &&
        schedule.status === "Pending" &&
        schedule.is_alert_sent === true
      ).length;

      setPmBadgeCount(count);
    }
  } catch (err) {
    console.error("Failed to fetch PM badge count", err);
  }
};

  // ─── Fetch companies ─────────────────────────────────────────────────────
  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${baseURL}/companies/`);
      const data = await response.json();
      if (data.status === "success") {
        setCompaniesData(data.data);
      }
    } catch (error) {
      console.error("Failed to load companies data", error);
    }
  };

  const getCompanyDisplayName = (companyId) => {
    if (!companiesData || companiesData.length === 0) return companyId;
    const company = companiesData.find((comp) => comp.company_id === companyId);
    return company ? `${company.company_name} (${company.company_id})` : companyId;
  };

  // ─── Fetch user data on mount ────────────────────────────────────────────
  useEffect(() => {
    if (userRole === "service-manager" && userId) {
      setLoading(true);
      fetchCompanies().then(() => {
        fetch(`${baseURL}/users/`)
          .then((res) => res.json())
          .then((data) => {
            const matchedUser = Array.isArray(data)
              ? data.find((user) => user.user_id === userId)
              : null;

            if (matchedUser) {
              setUserData(matchedUser);
              setUsername(matchedUser.username || matchedUser.full_name);
              const storedCompany = localStorage.getItem("selectedCompany");
              if (!storedCompany) {
                updateCompany(matchedUser.default_company);
              }
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("Failed to load user data", err);
            setLoading(false);
          });
      });
    }
  }, [userRole, userId, updateCompany]);

  // ─── Re-fetch badge whenever selectedCompany changes ────────────────────
  useEffect(() => {
    if (selectedCompany && userId) {
      fetchPmBadgeCount(selectedCompany, userId);
    }
  }, [selectedCompany, userId]);

  if (userRole !== "service-manager") return null;

  const handleCompanyChange = (e) => {
    updateCompany(e.target.value);
  };

  // ─── Nav items ────────────────────────────────────────────────────────────
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
        {
          path: "/servicemanager/preventive-maintainance-schedule",
          label: "P M Schedule",
          badge: pmBadgeCount, // ← badge count passed here
        },
      ],
    },
    {
      label: "Service Pool",
      dropdown: [
        { path: "/servicemanager/service-pool", label: "Service Pool" },
        {
          path: "/servicemanager/service-table-history",
          label: "Service Table History",
        },
      ],
    },
    {
      label: "Customers",
      dropdown: [
        { path: "/servicemanager/new-customer", label: "Customer Details" },
        {
          path: "/servicemanager/customer-complaints",
          label: "Customer Complaints",
        },
        {
          path: "/servicemanager/customer-feedback",
          label: "Customer Feedbacks",
        },
      ],
    },
    {
      label: "Service Items",
      path: "/servicemanager/new-service-item",
      label: "Service Items",
    },
    { path: "/servicemanager/error-logs", label: "Error Logs" },
  ];

  // ─── Badge pill component ─────────────────────────────────────────────────
  const Badge = ({ count }) => {
    if (!count || count === 0) return null;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#dc3545",
          color: "white",
          borderRadius: "50%",
          minWidth: "18px",
          height: "18px",
          fontSize: "11px",
          fontWeight: "700",
          marginLeft: "6px",
          padding: "0 4px",
          lineHeight: 1,
          verticalAlign: "middle",
        }}
      >
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  if (loading) {
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
            <span style={{ color: "white" }}>Loading...</span>
          </div>
          <div className="nav-user">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="top-navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-brand">
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "100px", height: "50px" }}
          />
        </div>

        {/* Nav Links */}
        <div className="nav-links">
          {navItems.map((item) =>
            item.dropdown ? (
              <div key={item.label} className="dropdown">
                {/* Show badge on parent toggle if any child has a badge */}
                <button className="dropdown-toggle">
                  {item.label}
                  {item.dropdown.some((s) => s.badge > 0) && (
                    <Badge
                      count={item.dropdown.reduce(
                        (sum, s) => sum + (s.badge || 0),
                        0
                      )}
                    />
                  )}
                </button>
                <div className="dropdown-menu">
                  {item.dropdown.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={
                        location.pathname === subItem.path ? "active" : ""
                      }
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {subItem.label}
                      {subItem.badge > 0 && <Badge count={subItem.badge} />}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname === item.path ? "active" : ""
                }
              >
                {item.label}
              </Link>
            )
          )}

          {/* Company selector */}
          {userData && (
            <select
              className="form-select ms-3"
              value={selectedCompany}
              onChange={handleCompanyChange}
              style={{ minWidth: "220px" }}
              title={getCompanyDisplayName(selectedCompany)}
            >
              <option value={userData.default_company}>
                {getCompanyDisplayName(userData.default_company)}
              </option>
              {Array.isArray(userData.companies) &&
                userData.companies
                  .filter((comp) => comp !== userData.default_company)
                  .map((comp) => (
                    <option key={comp} value={comp}>
                      {getCompanyDisplayName(comp)}
                    </option>
                  ))}
            </select>
          )}
        </div>

        {/* User info + Logout */}
        <div className="nav-user">
          {username && (
            <span
              style={{
                color: "white",
                marginRight: "15px",
                fontWeight: "500",
              }}
            >
              Hi, {username}
            </span>
          )}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;