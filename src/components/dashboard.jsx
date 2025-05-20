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

  const fetchRequests = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setRequests([]);
      setNewRequests([]);
      setLoading(false);
      return;
    }

    // Fetch all user-specific requests
    const { data: userRequests, error: userError } = await supabase
      .from("Requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    console.log("Logged-in user ID:", user.id);
    console.log("Fetched user requests:", userRequests);

    const newOnes = userRequests?.filter(
      (r) => r.status?.trim().toLowerCase() === "new"
    );

    if (userError) {
      console.error("Error fetching requests for user:", userError);
      setRequests([]);
      setNewRequests([]);
    } else {
      setRequests(userRequests || []);
      setNewRequests(newOnes || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel("requests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Requests",
        },
        (payload) => {
          console.log("Change received!", payload);
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAllRequestsClick = () => {
    navigate("/all-requests");
  };

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
              {loading ? "..." : requests.length}
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
              {loading ? "..." : newRequests.length}
            </div>
          </div>

          <div className="card">
            <span className="card-icon card-blue">
              <span role="img" aria-label="rejected">
                ❌
              </span>
            </span>
            <div className="card-label">REJECTED REQUESTS</div>
            <div className="card-number">-</div>
          </div>
          <div className="card">
            <span className="card-icon card-blue">
              <span role="img" aria-label="completed">
                🚚
              </span>
            </span>
            <div className="card-label">COMPLETED REQUESTS</div>
            <div className="card-number">-</div>
          </div>
        </div>
        <div style={{ marginTop: 40 }}>
          <h3 style={{ marginBottom: 16, color: "#2563eb" }}>
            Your Material Requests
          </h3>
          {loading ? (
            <div>Loading...</div>
          ) : requests.length === 0 ? (
            <div>No requests found.</div>
          ) : (
            <div className="requests-table-wrapper">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Region</th>
                    <th>District</th>
                    <th>Description</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.deviceType}</td>
                      <td>
                        {req.deviceType === "LAN" ? req.lanItem : req.wanItem}
                      </td>
                      <td>{req.quantity}</td>
                      <td>{req.region}</td>
                      <td>{req.district}</td>
                      <td>{req.description}</td>
                      <td>{req.reason}</td>
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
