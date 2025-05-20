import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./appbar.css";

export default function AppBar({ title = "Dashboard" }) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const getUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.role) {
        // Format the role for display (e.g., "regular_user" -> "Regular User")
        const formattedRole = user.user_metadata.role
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        setUserRole(formattedRole);
      }
    };
    getUserRole();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="appbar">
      <div className="appbar-content">
        <h1 className="appbar-title">{title}</h1>
        <div className="appbar-right">
          {userRole && (
            <span className="user-role">
              <i className="fas fa-user-tag"></i> {userRole}
            </span>
          )}
          <button onClick={handleSignOut} className="signout-button">
            <span>
              <i className="fas fa-sign-out-alt"></i>{" "}
            </span>{" "}
            Sign Out
          </button>
        </div>
      </div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
    </nav>
  );
}
