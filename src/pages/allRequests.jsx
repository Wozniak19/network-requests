import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";
import "./allRequests.css";

export default function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRequests([]);
        return;
      }
      const { data, error } = await supabase
        .from("Requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-content">
        <h2 className="page-title">All Material Requests</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : requests.length === 0 ? (
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
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{new Date(req.created_at).toLocaleDateString()}</td>
                    <td>{req.deviceType}</td>
                    <td>{req.deviceType === "LAN" ? req.lanItem : req.wanItem}</td>
                    <td>{req.quantity}</td>
                    <td>{req.region}</td>
                    <td>{req.district}</td>
                    <td>{req.reason}</td>
                    <td>
                      <span className={`status-badge ${req.status || 'pending'}`}>
                        {req.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 