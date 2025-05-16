import React, { useState } from "react";
import api from "../api";

export default function AuthPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (!username.trim() || !password) {
      setErr("Username and password are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(
        "/token",
        new URLSearchParams({ username, password })
      );
      onLogin(res.data.access_token);
    } catch {
      setErr("Invalid username or password.");
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit} autoComplete="on">
        <label htmlFor="username" className="auth-label">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="auth-input"
          disabled={loading}
        />
        <label htmlFor="password" className="auth-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="auth-input"
          disabled={loading}
        />
        {err && <div className="auth-error">{err}</div>}
        <button
          type="submit"
          className="auth-btn"
          disabled={loading || !username.trim() || !password}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
