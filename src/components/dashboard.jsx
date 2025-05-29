// src/components/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { supabase } from "../supabaseClient";
import "./dashboard.css"; // Import the CSS file for styling

export default function DashboardPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [newRequests, setNewRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [pendingAllRequests, setPendingAllRequests] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  // Fetch the user's own requests
  const fetchUserRequests = async (email) => {
    let query = supabase
      .from("Requests")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_email", email);
    const { data: userRequests, error: requestsError } = await query;
    if (requestsError) throw requestsError;
    setRequests(userRequests || []);
    const pendingRequests =
      userRequests?.filter((r) => r.status === "pending") || [];
    setNewRequests(pendingRequests);
  };

  // Fetch all requests for managers (not just pending)
  const fetchAllRequests = async () => {
    setLoadingPending(true);
    const { data: allRequests, error: allRequestsError } = await supabase
      .from("Requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (allRequestsError) throw allRequestsError;
    setPendingAllRequests(allRequests || []);
    setLoadingPending(false);
  };

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/login");
          return;
        }

        const role = user.user_metadata?.role;
        setUserRole(role);
        setUserEmail(user.email);

        await fetchUserRequests(user.email);
        if (role === "manager") {
          await fetchAllRequests();
        }
      } catch (err) {
        setError(err.message);
        setLoadingPending(false);
      } finally {
        setLoading(false);
      }
    };
    checkUserAndFetchData();
  }, [navigate]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const { error } = await supabase
        .from("Requests")
        .update({ status: newStatus })
        .eq("id", requestId);
      if (error) throw error;
      // After update, re-fetch both tables for managers
      await fetchUserRequests(userEmail);
      if (userRole === "manager") {
        await fetchAllRequests();
      }
    } catch (err) {
      alert("Error updating request: " + err.message);
    }
  };

  const handleAllRequestsClick = () => {
    navigate("/all-materials");
  };

  if (loading)
    return (
      <div className="dashboard-root">
        <Sidebar />
        <div className="dashboard-content">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="dashboard-root">
        <Sidebar />
        <div className="dashboard-content">
          <div className="error-message">Error: {error}</div>
        </div>
      </div>
    );

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-content">
        <div className="cards">
          <div className="card clickable" onClick={handleAllRequestsClick}>
            <span className="card-icon card-blue">
              <span role="img" aria-label="calendar">
                📅
              </span>
            </span>
            <div className="card-label">ALL MATERIALS REQUESTED</div>
            <div className="card-number">
              {userRole === "manager"
                ? pendingAllRequests.length
                : requests.length}
            </div>
          </div>
          <div className="card">
            <span className="card-icon card-blue">
              <span role="img" aria-label="new">
                ⏳
              </span>
            </span>
            <div className="card-label">NEW REQUESTS</div>
            <div className="card-number">
              {userRole === "manager"
                ? pendingAllRequests.filter((r) => r.status === "pending")
                    .length
                : requests.filter((r) => r.status === "pending").length}
            </div>
          </div>
          <div className="card">
            <span className="card-icon card-blue">
              <span role="img" aria-label="rejected">
                ❌
              </span>
            </span>
            <div className="card-label">REJECTED REQUESTS</div>
            <div className="card-number">
              {userRole === "manager"
                ? pendingAllRequests.filter((r) => r.status === "rejected")
                    .length
                : requests.filter((r) => r.status === "rejected").length}
            </div>
          </div>
          <div className="card">
            <span className="card-icon card-blue">
              <span role="img" aria-label="completed">
                🚚
              </span>
            </span>
            <div className="card-label">COMPLETED REQUESTS</div>
            <div className="card-number">
              {userRole === "manager"
                ? pendingAllRequests.filter((r) => r.status === "completed")
                    .length
                : requests.filter((r) => r.status === "completed").length}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40 }}>
          <h3 style={{ marginBottom: 16, color: "#2563eb" }}>
            Your Material Requests
          </h3>
          {requests.length === 0 ? (
            <div className="no-requests">No requests found.</div>
          ) : (
            <div className="requests-table-wrapper">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Region</th>
                    <th>District</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>{new Date(req.created_at).toLocaleDateString()}</td>
                      <td>{req.device_type}</td>
                      <td>{req.item}</td>
                      <td>{req.quantity}</td>
                      <td>{req.region}</td>
                      <td>{req.district}</td>
                      <td>
                        <span
                          className={`status-badge ${req.status || "pending"}`}
                        >
                          {req.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Manager Approval Table */}
        {userRole === "manager" && (
          <div style={{ marginTop: 60 }}>
            <h3 style={{ marginBottom: 16, color: "#2563eb" }}>
              All Requests (Approve/Reject/Status)
            </h3>
            {loadingPending ? (
              <div className="loading">Loading requests...</div>
            ) : pendingAllRequests.length === 0 ? (
              <div className="no-requests">No requests found.</div>
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
                    {pendingAllRequests.map((request) => (
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
                          {request.status === "pending" ? (
                            <div className="action-buttons">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    request.id,
                                    "manager_approved"
                                  )
                                }
                              >
                                ✓
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(request.id, "rejected")
                                }
                              >
                                ✕
                              </button>
                            </div>
                          ) : request.status === "manager_approved" ? (
                            <span style={{ color: "green" }}>✔</span>
                          ) : request.status === "completed" ? (
                            <span style={{ color: "blue" }}>Completed</span>
                          ) : request.status === "rejected" ? (
                            <span style={{ color: "red" }}>✕</span>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
