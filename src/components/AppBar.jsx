import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./appbar.css";

export default function AppBar({ title = "Dashboard" }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="appbar">
      <div className="appbar-content">
        <h1 className="appbar-title">{title}</h1>
        <button onClick={handleSignOut} className="signout-button">
          <span>
            <i class="fas fa-sign-out-alt"></i>{" "}
          </span>{" "}
          Sign Out
        </button>
      </div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
    </nav>
  );
}
