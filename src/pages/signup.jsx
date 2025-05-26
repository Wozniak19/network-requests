import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./login.css"; // Use the same styling as login

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "", // Add role field
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          role: formData.role, // Add role to user metadata
        },
      },
    });
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setError("");
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header-graphic">
          <div className="login-header-content">
            <h2 className="login-title">Create Account</h2>
            <p className="login-subtitle">
              Sign up to access the ECG Dashboard.
            </p>
          </div>
        </div>
        <div className="login-logo-circle">
          <img
            src="/official_ecg_logo.jpg"
            alt="ECG Logo"
            className="login-logo"
          />
        </div>
        {error && <div className="error">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="ECG Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select your role</option>
            <option value="regular_user">Regular User</option>
            <option value="network_staff">Network Staff</option>
            <option value="manager">Manager</option>
            <option value="general_manager">General Manager</option>
          </select>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="signup-text">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
