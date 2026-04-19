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
   const { logout } = useContext(AuthContext);
  const [alertCount, setAlertCount] = useState(0);

   const handleLogout = () => {
  logout();   // ✅ centralized logout
  navigate("/");
};

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
    if (company) {
      return `${company.company_name} (${company.company_id})`;
    }
    return companyId;
  };

  // Fetch PM alert count with date + frequency logic
  const fetchAlertCount = async () => {
    if (!userId || !selectedCompany) return;
    try {
      const [schedulesRes, chartsRes] = await Promise.all([
        fetch(`${baseURL}/service-item-pm-schedules/?user_id=${userId}&company_id=${selectedCompany}`),
        fetch(`${baseURL}/pm-charts/?company_id=${selectedCompany}`),
      ]);

      const schedulesData = await schedulesRes.json();
      const chartsJson = await chartsRes.json();

      // Build chart lookup map { chart_id: frequency_days }
      const chartMap = {};
      if (chartsJson.status === "success") {
        chartsJson.data.forEach((chart) => {
          chartMap[chart.chart_id] = chart.frequency_days;
        });
      }

      if (schedulesData.status === "success") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const count = schedulesData.data.filter((schedule) => {
          if (!schedule.is_alert_sent || schedule.status !== "Pending") return false;

          const overdueDate = new Date(schedule.overdue_alert_date);
          overdueDate.setHours(0, 0, 0, 0);

          // Within alert window — count it
          if (today <= overdueDate) return true;

          // Past overdue — check frequency cycle restart
          const frequencyDays = chartMap[schedule.chart];
          if (!frequencyDays) return false;

          const nextEnableDate = new Date(overdueDate);
          nextEnableDate.setDate(nextEnableDate.getDate() + frequencyDays);
          nextEnableDate.setHours(0, 0, 0, 0);

          return today >= nextEnableDate;
        }).length;

        setAlertCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch PM alert count", error);
    }
  };

  // ✅ Listen for custom event fired from PM Schedule page after raise request
  useEffect(() => {
    const handlePMUpdate = () => {
      fetchAlertCount();
    };

    window.addEventListener("pm-schedule-updated", handlePMUpdate);
    return () => window.removeEventListener("pm-schedule-updated", handlePMUpdate);
  }, [selectedCompany, userId]);

  // ✅ Fetch on mount + company change + poll every 30 seconds
  useEffect(() => {
    fetchAlertCount();

    const interval = setInterval(() => {
      fetchAlertCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedCompany, userId]);

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
        {
          path: "/servicemanager/preventive-maintainance-schedule",
          label: (
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              P M Schedule
              {alertCount > 0 && (
                <span
                  style={{
                    backgroundColor: "#e53e3e",
                    color: "white",
                    borderRadius: "50%",
                    fontSize: "11px",
                    fontWeight: "bold",
                    minWidth: "18px",
                    height: "18px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                  }}
                >
                  {alertCount}
                </span>
              )}
            </span>
          ),
        },
      ],
    },
    {
      label: "Service Pool",
      dropdown: [
        { path: "/servicemanager/service-pool", label: "Service Pool" },
        { path: "/servicemanager/service-table-history", label: "Service Table History" },
      ],
    },
    {
      label: "Customers",
      dropdown: [
        { path: "/servicemanager/new-customer", label: "Customer Details" },
        { path: "/servicemanager/customer-complaints", label: "Customer Complaints" },
        { path: "/servicemanager/customer-feedback", label: "Customer Feedbacks" },
      ],
    },
    {
      label: "Service Items",
      path: "/servicemanager/new-service-item",
      label: "Service Items",
    },
    { path: "/servicemanager/error-logs", label: "Error Logs" },
  ];

  if (loading) {
    return (
      <nav className="top-navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <img src={logo} alt="Company Logo" style={{ width: "100px", height: "50px" }} />
          </div>
          <div className="nav-links">
            <span style={{ color: "white" }}>Loading...</span>
          </div>
          <div className="nav-user">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="top-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <img src={logo} alt="Company Logo" style={{ width: "100px", height: "50px" }} />
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
        <div className="nav-user">
          {username && (
            <span style={{ color: "white", marginRight: "15px", fontWeight: "500" }}>
              Hi, {username}
            </span>
          )}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;