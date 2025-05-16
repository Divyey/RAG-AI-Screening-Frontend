// src/components/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegFileAlt } from "react-icons/fa";

export default function Header({ token, onLogout }) {
  const location = useLocation();
  return (
    <header>
      <div style={{ display: "flex", alignItems: "center" }}>
        <FaRegFileAlt size={28} color="#2563eb" style={{ marginRight: 12 }} />
        <span style={{ fontWeight: 700, fontSize: 22, color: "#2563eb", marginRight: 32 }}>
          ATS Screener
        </span>
        <Link to="/ats-score" className={`header-link${location.pathname === "/ats-score" ? " active" : ""}`}>ATS Score</Link>
        <Link to="/dashboard" className={`header-link${location.pathname === "/dashboard" ? " active" : ""}`}>Dashboard</Link>
        <Link to="/ai-screener" className={`header-link${location.pathname === "/ai-screener" ? " active" : ""}`}>AI Screener</Link>
      </div>
      {token && <button onClick={onLogout}>Logout</button>}
    </header>
  );
}
