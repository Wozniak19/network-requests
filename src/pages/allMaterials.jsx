import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Sidebar from "../components/Sidebar";
import "./allMaterials.css";

export default function AllMaterials() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    const { data: userRequests, error: userError } = await supabase
      .from("Requests")
      .select(
        "id, created_at, user_email, status, item, device_type, quantity, region, district, reason"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (userError) {
      console.error("Error fetching requests for user:", userError);
      setRequests([]);
    } else {
      setRequests(userRequests || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-content">
        <h2 className="page-title">All Materials Requested</h2>
        {loading ? (
          <div className="loading">Loading...</div>
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
                  <th>Description</th>
                  <th>Reason</th>
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
                    <td>{req.description}</td>
                    <td>{req.reason}</td>
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
    </div>
  );
}
