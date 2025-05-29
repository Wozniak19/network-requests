import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../supabaseClient";
import "../components/dashboard.css";

export default function GeneralManagerView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all relevant requests
  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Requests")
      .select("*")
      .in("status", ["manager_approved", "authorized", "rejected"])
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      setRequests([]);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const { error } = await supabase
        .from("Requests")
        .update({ status: newStatus })
        .eq("id", requestId);
      if (error) throw error;
      await fetchRequests();
    } catch (err) {
      alert("Error updating request: " + err.message);
    }
  };

  // Card counts
  const allCount = requests.length;
  const pendingCount = requests.filter(
    (r) => r.status === "manager_approved"
  ).length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;
  const authorizedCount = requests.filter(
    (r) => r.status === "authorized"
  ).length;

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-content">
        <div className="cards">
          <div className="card">
            <span className="card-icon card-blue">
              <span role="img" aria-label="calendar">
                📅
              </span>
            </span>
            <div className="card-label">ALL MANAGER APPROVED REQUESTS</div>
            <div className="card-number">{allCount}</div>
          </div>
          <div className="card">
            <span className="card-icon card-blue">
              <span role="img" aria-label="hourglass">
                ⏳
              </span>
            </span>
            <div className="card-label">PENDING AUTHORIZATION</div>
            <div className="card-number">{pendingCount}</div>
          </div>
          <div className="card">
            <span className="card-icon card-blue">
              <span role="img" aria-label="rejected">
                ❌
              </span>
            </span>
            <div className="card-label">REJECTED REQUESTS</div>
            <div className="card-number">{rejectedCount}</div>
          </div>
          <div className="card">
            <span className="card-icon card-blue">
              <span role="img" aria-label="authorized">
                ✅
              </span>
            </span>
            <div className="card-label">AUTHORIZED REQUESTS</div>
            <div className="card-number">{authorizedCount}</div>
          </div>
        </div>

        {/* Authorized Requests Table */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ marginBottom: 16, color: "#2563eb" }}>
            Authorized Requests
          </h3>
          {authorizedCount === 0 ? (
            <div className="no-requests">No authorized requests found.</div>
          ) : (
            <div className="requests-table-wrapper">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Device Type</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Region</th>
                    <th>District</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests
                    .filter((r) => r.status === "authorized")
                    .map((request) => (
                      <tr key={request.id}>
                        <td>
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td>{request.user_email}</td>
                        <td>{request.device_type}</td>
                        <td>{request.item}</td>
                        <td>{request.quantity}</td>
                        <td>{request.region}</td>
                        <td>{request.district}</td>
                        <td>{request.reason}</td>
                        <td>
                          <span className={`status-badge ${request.status}`}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Manager Approved Requests Table */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ marginBottom: 16, color: "#2563eb" }}>
            Manager Approved Requests
          </h3>
          {loading ? (
            <div className="loading">Loading requests...</div>
          ) : error ? (
            <div className="error-message">Error: {error}</div>
          ) : pendingCount === 0 ? (
            <div className="no-requests">
              No manager approved requests found.
            </div>
          ) : (
            <div className="requests-table-wrapper">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Device Type</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Region</th>
                    <th>District</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests
                    .filter((r) => r.status === "manager_approved")
                    .map((request) => (
                      <tr key={request.id}>
                        <td>
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td>{request.user_email}</td>
                        <td>{request.device_type}</td>
                        <td>{request.item}</td>
                        <td>{request.quantity}</td>
                        <td>{request.region}</td>
                        <td>{request.district}</td>
                        <td>{request.reason}</td>
                        <td>
                          <span className={`status-badge ${request.status}`}>
                            {request.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() =>
                                handleStatusUpdate(request.id, "authorized")
                              }
                              className="approve-button gm-action-btn"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(request.id, "rejected")
                              }
                              className="reject-button gm-action-btn"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
