import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./login.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, []);

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header-graphic">
          <div className="login-header-content">
            <h2 className="login-title">Welcome Back !</h2>
            <p className="login-subtitle">
              Sign in to continue to ECG Dashboard.
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
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="email"
            name="email"
            placeholder="ECG Username"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div className="remember-me-row">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Log In"}
          </button>
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/signup">Signup now</Link>
        </p>
      </div>
    </div>
  );
}
