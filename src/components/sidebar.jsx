// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./sidebar.css"; // Import the CSS file for styling

export default function Sidebar() {
  const [homeOpen, setHomeOpen] = useState(true);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  // Always render the regular user menu, no manager dashboard link, no role-based logic
  return (
    <div className="sidebar">
      <div className="logo-section">
        <img src="/official_ecg_logo.jpg" alt="ECG Logo" className="logo" />
      </div>
      <div className="sidebar-title">MENU</div>
      <ul className="sidebar-menu">
        <li>
          <button
            className="dropdown-toggle"
            onClick={() => setHomeOpen(!homeOpen)}
          >
            <span className="sidebar-icon">🏠</span> Home
          </button>
          {homeOpen && (
            <ul className="submenu">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <button
            className="dropdown-toggle"
            onClick={() => setMaterialsOpen(!materialsOpen)}
          >
            <span className="sidebar-icon">📦</span> Materials
          </button>
          {materialsOpen && (
            <ul className="submenu">
              <li>
                <Link to="/questions">Apply for Materials</Link>
              </li>
              <li>
                <Link to="/all-materials">View all Materials Requested</Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}
