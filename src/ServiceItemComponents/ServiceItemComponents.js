import React, { useState, useEffect } from "react";
import "./ServiceItemComponents.css";

const ServiceItemComponents = () => {
  const [showForm, setShowForm] = useState(false);
  const [components, setComponents] = useState([
    // Sample data - replace with your actual data
    {
      component_entry_id: 1,
      service_item_id: 101,
      component_id: "COMP-001",
      component_serial_number: "SN123456",
      warranty_start_date: "2023-01-01",
      warranty_end_date: "2025-01-01",
      vendor_id: "VEND-001",
      created_at: "2023-01-15 10:00:00",
      updated_at: "2023-01-15 10:00:00",
      created_by: "admin",
      updated_by: "admin",
    },
    {
      component_entry_id: 2,
      service_item_id: 102,
      component_id: "COMP-002",
      component_serial_number: "SN789012",
      warranty_start_date: "2023-02-01",
      warranty_end_date: "2025-02-01",
      vendor_id: "VEND-002",
      created_at: "2023-02-15 11:30:00",
      updated_at: "2023-02-15 11:30:00",
      created_by: "admin",
      updated_by: "admin",
    },
  ]);

  // New state for dropdown options
  const [serviceItemsOptions, setServiceItemsOptions] = useState([]);
  const [componentOptions, setComponentOptions] = useState([]);

  const [formData, setFormData] = useState({
    service_item_id: "",
    component_id: "",
    component_serial_number: "",
    warranty_start_date: "",
    warranty_end_date: "",
    vendor_id: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFilteredComponents(components);
  }, [components]);

  // Fetch stored Service Item Components
  useEffect(() => {
    fetch("http://175.29.21.7:8006/service-item-components/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          // Optional: transform the data if needed to match table fields
          setComponents(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching service item components:", err);
      });
  }, []);

  useEffect(() => {
    const filtered = components.filter((comp) =>
      Object.values(comp)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredComponents(filtered);
    setCurrentPage(1);
  }, [searchTerm, components]);

  // Fetch Service Items for dropdown
  useEffect(() => {
    fetch("http://175.29.21.7:8006/service-items/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setServiceItemsOptions(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching service items:", err);
      });
  }, []);

  // Fetch Components for dropdown
  useEffect(() => {
    fetch("http://175.29.21.7:8006/components/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setComponentOptions(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching components:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const now = new Date().toISOString();

    const payload = {
      service_component_id: `SC-${Date.now()}`, // unique ID for the service_component
      component_serial_number: formData.component_serial_number,
      warranty_start_date: formData.warranty_start_date,
      warranty_end_date: formData.warranty_end_date,
      vendor_id: formData.vendor_id || "N/A", // assuming 'N/A' is okay for missing vendors
      created_at: now,
      updated_at: now,
      created_by: "service manager",
      updated_by: "service manager",
      service_item: formData.service_item_id,
      component: formData.component_id,
    };

    fetch("http://175.29.21.7:8006/service-item-components/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(JSON.stringify(data));
          });
        }
        return response.json();
      })
      .then((data) => {
        alert("✅ Service Item Component added successfully!");

        const newComponent = {
          component_entry_id: components.length + 1,
          service_item_id: formData.service_item_id,
          component_id: formData.component_id,
          component_serial_number: formData.component_serial_number,
          warranty_start_date: formData.warranty_start_date,
          warranty_end_date: formData.warranty_end_date,
          vendor_id: formData.vendor_id,
          created_at: now,
          updated_at: now,
          created_by: "service manager",
          updated_by: "service manager",
        };

        setComponents([...components, newComponent]);
        setShowForm(false);
        setFormData({
          service_item_id: "",
          component_id: "",
          component_serial_number: "",
          warranty_start_date: "",
          warranty_end_date: "",
          vendor_id: "",
        });
      })
      .catch((error) => {
        console.error("❌ Error posting component:", error);
        alert(`Error: ${error.message}`);
      });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      // Reset form when hiding it
      setFormData({
        service_item_id: "",
        component_id: "",
        component_serial_number: "",
        warranty_start_date: "",
        warranty_end_date: "",
        vendor_id: "",
      });
    }
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentComponents = filteredComponents.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredComponents.length / entriesPerPage);

  return (
    <div className="svc-form-wrapper container shadow-sm">
      <div className="svc-header mb-4">
        <h2 className="svc-title">Service Item Components</h2>
        <p className="svc-subtitle">
          {showForm
            ? "Fill in the service item details below"
            : "Manage service item components"}
        </p>
      </div>

      {!showForm ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
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

            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={toggleForm}
                className="btn btn-primary svc-btn-save"
              >
                Add Component
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Entry ID</th>
                  <th>Service Item</th>
                  <th>Component ID</th>
                  <th>Serial Number</th>
                  <th>Warranty Start</th>
                  <th>Warranty End</th>
                  <th>Vendor</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {currentComponents.length > 0 ? (
                  currentComponents.map((component, index) => (
                    <tr key={component.component_entry_id}>
                      <td>{indexOfFirstEntry + index + 1}</td>
                      <td>{component.service_component_id}</td>
                      <td>{component.service_item}</td>
                      <td>{component.component}</td>
                      <td>{component.component_serial_number}</td>
                      <td>{component.warranty_start_date}</td>
                      <td>{component.warranty_end_date}</td>
                      <td>{component.vendor_id || "-"}</td>
                      <td>{component.created_by}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No components found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="svc-form">
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="service_item_id" className="form-label">
                Service Item
              </label>
              <select
                id="service_item_id"
                name="service_item_id"
                className="form-select"
                value={formData.service_item_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Service Item</option>
                {serviceItemsOptions.map((item) => (
                  <option
                    key={item.service_item_id}
                    value={item.service_item_id}
                  >
                    {item.service_item_id}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="component_id" className="form-label">
                Component
              </label>
              <select
                id="component_id"
                name="component_id"
                className="form-select"
                value={formData.component_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Component</option>
                {componentOptions.map((comp) => (
                  <option key={comp.component_id} value={comp.component_id}>
                    {comp.component_id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="component_serial_number" className="form-label">
                Component Serial Number
              </label>
              <input
                type="text"
                id="component_serial_number"
                name="component_serial_number"
                className="form-control"
                value={formData.component_serial_number}
                onChange={handleChange}
                placeholder="Enter serial number"
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="vendor_id" className="form-label">
                Vendor (optional)
              </label>
              <select
                id="vendor_id"
                name="vendor_id"
                className="form-select"
                value={formData.vendor_id}
                onChange={handleChange}
              >
                <option value="">Select Vendor</option>
                <option value="vendor1">Vendor 1</option>
                <option value="vendor2">Vendor 2</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="warranty_start_date" className="form-label">
                Warranty Start Date
              </label>
              <input
                type="date"
                id="warranty_start_date"
                name="warranty_start_date"
                className="form-control"
                value={formData.warranty_start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="warranty_end_date" className="form-label">
                Warranty End Date
              </label>
              <input
                type="date"
                id="warranty_end_date"
                name="warranty_end_date"
                className="form-control"
                value={formData.warranty_end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={toggleForm}
              className="btn btn-outline-secondary me-2"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Item Component
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ServiceItemComponents;
