// src/pages/ManagerView.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ManagerView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  // Get current user and their role
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        navigate("/login");
        return;
      }

      const role = user.user_metadata?.role;
      setUserRole(role);

      if (role !== "manager") {
        navigate("/dashboard");
        return;
      }

      fetchRequests();
    };

    getUser();
  }, []);

  // Fetch all requests for manager view
  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Requests")
      .select("*")
      .in("user_role", ["regular_user", "network_staff"]);

    if (error) {
      console.error("Error fetching requests:", error.message);
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  // Approve or Reject a request
  const handleApproval = async (requestId, decision) => {
    const { error } = await supabase
      .from("Requests")
      .update({
        manager_approval: decision,
        status: decision === "rejected" ? "rejected" : "manager_approved",
      })
      .eq("id", requestId);

    if (error) {
      console.error("Approval Error:", error.message);
    } else {
      await fetchRequests(); // Refresh list
    }

    console.log("Approving request:", requestId, "Decision:", decision);
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading requests...</p>;

  return (
    <div className="container">
      <h2>Material Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Sub-Type</th>
              <th>Qty</th>
              <th>Region</th>
              <th>District</th>
              <th>Reason</th>
              <th>Submitted By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.device_type}</td>
                <td>{req.device_sub_type}</td>
                <td>{req.quantity}</td>
                <td>{req.region}</td>
                <td>{req.district}</td>
                <td>{req.reason}</td>
                <td>{req.user_email}</td>
                <td>
                  <span className={`status-badge ${req.status}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          handleApproval(req.id, "manager_approved")
                        }
                      >
                        ✅
                      </button>{" "}
                      <button
                        onClick={() => handleApproval(req.id, "rejected")}
                      >
                        ❌
                      </button>
                    </>
                  ) : req.status === "manager_approved" ? (
                    <span style={{ color: "green" }}>✔</span>
                  ) : req.status === "completed" ? (
                    <span style={{ color: "blue" }}>Completed</span>
                  ) : req.status === "rejected" ? (
                    <span style={{ color: "red" }}>✕</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
