import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import AtsScoreChecker from "./pages/AtsScoreChecker";
import Dashboard from "./pages/Dashboard";
import AiScreener from "./pages/AiScreener";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  function handleLogin(token) {
    setToken(token);
    localStorage.setItem("token", token);
    navigate("/ats-score");
  }
  function handleLogout() {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      {token && <Header token={token} onLogout={handleLogout} />}
      <Routes>
        {!token ? (
          <Route path="*" element={<AuthPage onLogin={handleLogin} />} />
        ) : (
          <>
            <Route path="/ats-score" element={<AtsScoreChecker token={token} />} />
            <Route path="/dashboard" element={<Dashboard token={token} />} />
            <Route path="/ai-screener" element={<AiScreener token={token} />} />
            <Route path="*" element={<Navigate to="/ats-score" />} />
          </>
        )}
      </Routes>
    </>
  );
}
