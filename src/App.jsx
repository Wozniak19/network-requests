// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/dashboard";
import Login from "./pages/login";
import Signup from "./pages/signup";
import QuestionForm from "./pages/questionForm";
import AllRequests from "./pages/allRequests";
import AppBar from "./components/AppBar";

function App() {
  const getTitle = () => {
    const path = window.location.pathname;
    switch (path) {
      case "/":
      case "/login":
        return "Login";
      case "/signup":
        return "Sign Up";
      case "/dashboard":
        return "Dashboard";
      case "/questions":
        return "Questions";
      case "/all-requests":
        return "All Requests";
      default:
        return "Network Requests";
    }
  };

  return (
    <>
      <AppBar title={getTitle()} />
      <div style={{ paddingTop: "64px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/questions" element={<QuestionForm />} />
          <Route path="/all-requests" element={<AllRequests />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
