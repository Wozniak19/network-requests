// src/App.jsx
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/dashboard";
import Login from "./pages/login";
import Signup from "./pages/signup";
import QuestionForm from "./pages/questionForm";
import AllRequests from "./pages/allRequests";
import AllMaterials from "./pages/allMaterials";
import AppBar from "./components/AppBar";
import ManagerView from "./pages/ManagerView";
import GeneralManagerView from "./pages/GeneralManagerView";

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const getTitle = () => {
    const path = location.pathname;
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/questions":
        return "Application for Materials";
      case "/all-requests":
        return "All Requests";
      case "/all-materials":
        return "All Materials Page";
      default:
        return "Dashboard";
    }
  };

  return (
    <>
      {!isAuthPage && <AppBar title={getTitle()} />}
      <div style={{ paddingTop: isAuthPage ? "0" : "64px" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/questions" element={<QuestionForm />} />
          <Route path="/all-requests" element={<AllRequests />} />
          <Route path="/all-materials" element={<AllMaterials />} />
          <Route path="/general-manager" element={<GeneralManagerView />} />
          {/* Redirect any unknown route to /dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
