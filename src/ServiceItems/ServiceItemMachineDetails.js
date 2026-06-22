import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Tabs, Tab } from "react-bootstrap";
import baseURL from "../ApiUrl/Apiurl";
import { useCompany } from "../AuthContext/CompanyContext";
import { AuthContext } from "../AuthContext/AuthContext";

const ServiceItemMachineDetails = () => {
  const { pcbSerialNumber } = useParams();
  const navigate = useNavigate();

  const { selectedCompany } = useCompany();
  const { userId } = useContext(AuthContext);

  /* ================= LIVE DATA ================= */
  const [machineData, setMachineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= TABS ================= */
  const [activeTab, setActiveTab] = useState("live");

  /* ================= RETAINED DATA ================= */
  const [retainedData, setRetainedData] = useState([]);
  const [retainedLoading, setRetainedLoading] = useState(false);
  const [retainedError, setRetainedError] = useState(null);

  const [retentionDays, setRetentionDays] = useState(null);

  // Per-batch totals from API (used for pagination)
  const [batchTotals, setBatchTotals] = useState({
    batch1: 0,
    batch2: 0,
    batch3: 0,
    error: 0,
  });

  const [apiPage, setApiPage] = useState(1);
  const [apiPageSize, setApiPageSize] = useState(50);

  /* ================= FETCH LIVE DATA ================= */
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${baseURL}/latest-all-sensor-data/${pcbSerialNumber}/`,
          {
            params: {
              company_id: selectedCompany,
              user_id: userId,
            },
          }
        );

        if (res.data?.status === "success") {
          setMachineData(res.data);
        } else {
          setError("Failed to fetch live data");
        }
      } catch (err) {
        setError("Error loading live data");
      } finally {
        setLoading(false);
      }
    };

    if (pcbSerialNumber && selectedCompany && userId) {
      fetchLiveData();
    }
  }, [pcbSerialNumber, selectedCompany, userId]);

  /* ================= FETCH RETAINED DATA ================= */
  const fetchRetainedData = useCallback(
    async (batchType) => {
      try {
        setRetainedLoading(true);
        setRetainedError(null);
        setRetainedData([]); // ✅ Clear stale data immediately on fetch

        const res = await axios.get(
          `${baseURL}/retained-data/${pcbSerialNumber}/`,
          {
            params: {
              company_id: selectedCompany,
              user_id: userId,
              batch: batchType,
              page: apiPage,
              page_size: apiPageSize,
            },
          }
        );

        if (res.data?.status !== "success") {
          setRetainedError("Failed to load retained data");
          return;
        }

        const data = res.data.data;

        setRetentionDays(data.retention_period_days);

        // ✅ Store all batch totals so pagination is always accurate
        setBatchTotals({
          batch1: data.batch_1?.total_records || 0,
          batch2: data.batch_2?.total_records || 0,
          batch3: data.batch_3?.total_records || 0,
          error: data.error_code?.total_records || 0,
        });

        // ✅ Resolve records and total for current tab
        const batchMap = {
          batch1: { records: data.batch_1?.records || [], total: data.batch_1?.total_records || 0 },
          batch2: { records: data.batch_2?.records || [], total: data.batch_2?.total_records || 0 },
          batch3: { records: data.batch_3?.records || [], total: data.batch_3?.total_records || 0 },
          error:  { records: data.error_code?.records || [], total: data.error_code?.total_records || 0 },
          // "all" tab: API should ideally support batch=all and return paginated combined records.
          // If not, we show all records from this single API call (one page worth).
          all: {
            records: [
              ...(data.batch_1?.records || []),
              ...(data.batch_2?.records || []),
              ...(data.batch_3?.records || []),
              ...(data.error_code?.records || []),
            ],
            total:
              (data.batch_1?.total_records || 0) +
              (data.batch_2?.total_records || 0) +
              (data.batch_3?.total_records || 0) +
              (data.error_code?.total_records || 0),
          },
        };

        const resolved = batchMap[batchType] || { records: [], total: 0 };
        setRetainedData(resolved.records);
        // ✅ Total is stored in batchTotals, not separate state — see getTotalForTab()
      } catch (err) {
        console.error(err);
        setRetainedError("Error loading retained data");
      } finally {
        setRetainedLoading(false);
      }
    },
    [pcbSerialNumber, selectedCompany, userId, apiPage, apiPageSize]
  );

  /* ================= RETAINED EFFECT ================= */
  useEffect(() => {
    if (activeTab !== "live") {
      fetchRetainedData(activeTab);
    }
  }, [activeTab, fetchRetainedData]); // ✅ fetchRetainedData is stable via useCallback

  /* ================= HELPERS ================= */

  // ✅ Returns the correct total for the active tab (used for page count)
  const getTotalForTab = () => {
    const map = {
      batch1: batchTotals.batch1,
      batch2: batchTotals.batch2,
      batch3: batchTotals.batch3,
      error: batchTotals.error,
      all: batchTotals.batch1 + batchTotals.batch2 + batchTotals.batch3 + batchTotals.error,
    };
    return map[activeTab] || 0;
  };

  const totalRecords = getTotalForTab();
  const totalPages = Math.ceil(totalRecords / apiPageSize) || 1;

  /* ================= BADGES ================= */
  const getModesBadge = (value) => {
    const map = { 0: "Shutdown", 1: "IDEC", 2: "Auto", 3: "Fan", 4: "Indirect", 5: "Direct" };
    return <span className="badge bg-primary">{map[value] ?? "Unknown"}</span>;
  };

  const getFanSpeedBadge = (value) => {
    const map = { 3: "Shutdown", 0: "High", 1: "Medium", 2: "Low" };
    return <span className="badge bg-info">{map[value] ?? "Unknown"}</span>;
  };

  /* ================= UI STATES ================= */
  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between">
          <h5 className="mb-0">Machine Details</h5>
          <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <div className="card-body">
          {/* ================= INFO ================= */}
          <div className="alert alert-info d-flex justify-content-between flex-wrap">
            <div>
              <strong>PCB Serial:</strong> {machineData.pcb_serial_number}
            </div>
            <div>
              <span className={`badge ${machineData.is_online ? "bg-success" : "bg-danger"}`}>
                {machineData.is_online ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* ================= TABS ================= */}
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k);
              setApiPage(1); // ✅ Reset to page 1 on tab switch
              setRetainedData([]); // ✅ Clear data immediately on tab switch
            }}
            className="mb-3"
          >
            <Tab eventKey="live" title="Live" />
            <Tab eventKey="batch1" title="Batch 1" />
            <Tab eventKey="batch2" title="Batch 2" />
            <Tab eventKey="batch3" title="Batch 3" />
            <Tab eventKey="error" title="Error Codes" />
            <Tab eventKey="all" title="All" />
          </Tabs>

          {/* ================= LIVE TABLE ================= */}
          {activeTab === "live" && (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-primary">
                  <tr>
                    <th>S.No</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {machineData.data
                    .filter((i) => i.code !== "EC")
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>
                          {item.code === "MD"
                            ? getModesBadge(item.value)
                            : item.code === "FS"
                            ? getFanSpeedBadge(item.value)
                            : item.value}
                        </td>
                        <td>{item.unit || "-"}</td>
                        <td>{new Date(item.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= RETAINED DATA ================= */}
          {activeTab !== "live" && (
            <>
              {/* INFO BAR */}
              <div className="alert alert-secondary d-flex justify-content-between flex-wrap">
                <div>
                  <strong>Retention:</strong> {retentionDays ?? "-"} days
                </div>
                <div>
                  <strong>Total Records:</strong> {totalRecords}
                </div>
                <div>
                  <strong>Page:</strong> {apiPage} / {totalPages} |{" "}
                  <strong>Page Size:</strong> {apiPageSize}
                </div>
              </div>

              {/* DROPDOWNS */}
              <div className="d-flex justify-content-end gap-3 mb-3 flex-wrap">
                <div>
                  <label className="me-2 fw-bold">Page Size</label>
                  <select
                    className="form-select d-inline-block w-auto"
                    value={apiPageSize}
                    onChange={(e) => {
                      setApiPageSize(Number(e.target.value));
                      setApiPage(1); // ✅ Reset page when size changes
                    }}
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000 (Max)</option>
                  </select>
                </div>

                <div>
                  <label className="me-2 fw-bold">Page</label>
                  <select
                    className="form-select d-inline-block w-auto"
                    value={apiPage}
                    onChange={(e) => setApiPage(Number(e.target.value))}
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TABLE */}
              {retainedLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                  <div className="mt-2">Loading retained data...</div>
                </div>
              ) : retainedError ? (
                <div className="alert alert-danger">{retainedError}</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-secondary">
                      <tr>
                        <th>S.No</th>
                        <th>Sensor Code</th>
                        <th>Sensor Name</th>
                        <th>Value</th>
                        <th>Unit</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {retainedData.length > 0 ? (
                        retainedData.map((row, index) => (
                          <tr key={row.sl_no || index}>
                            <td>{row.sl_no || (apiPage - 1) * apiPageSize + index + 1}</td>
                            <td>{row.sensor_code}</td>
                            <td>{row.sensor_name}</td>
                            <td>{row.value}</td>
                            <td>{row.unit || "-"}</td>
                            <td>{new Date(row.timestamp).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted">
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceItemMachineDetails;