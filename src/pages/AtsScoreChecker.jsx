import React, { useState } from "react";
import api from "../api";

function ProgressBar({ value, max = 100, color = "#2563eb" }) {
  const percent = Math.round((value / max) * 100);
  return (
    <div
      className="progress-bar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
      style={{
        width: "100%",
        background: "#e5e7eb",
        borderRadius: 8,
        height: 22,
        margin: "8px 0",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          background: color,
          height: "100%",
          borderRadius: 8,
          transition: "width 0.5s",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          color: "#fff",
          fontWeight: 600,
          fontSize: 15,
          paddingRight: 12
        }}
      >
        {percent}%
      </div>
    </div>
  );
}

export default function AtsScoreChecker({ token }) {
  // Left: Resume Score
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeScore, setResumeScore] = useState(null);
  const [resumeFeedback, setResumeFeedback] = useState("");
  const [latestResumeId, setLatestResumeId] = useState("");
  const [loadingLeft, setLoadingLeft] = useState(false);

  // Right: Resume vs JD
  const [inputResume, setInputResume] = useState(null);
  const [inputJD, setInputJD] = useState(null);
  const [jdResult, setJdResult] = useState(null);
  const [loadingRight, setLoadingRight] = useState(false);

  // Feedback states (now in right section)
  const [userFeedback, setUserFeedback] = useState("");
  const [hrFeedback, setHrFeedback] = useState("");
  const [userFeedbackMsg, setUserFeedbackMsg] = useState("");
  const [hrFeedbackMsg, setHrFeedbackMsg] = useState("");

  async function handleResumeScore(e) {
    e.preventDefault();
    setLoadingLeft(true);
    setResumeScore(null);
    setResumeFeedback("");
    const form = new FormData();
    form.append("resume", resumeFile);
    try {
      const res = await api.post("/resume_score", form);
      setResumeScore(res.data.openai_score);
      setResumeFeedback(res.data.feedback);
      setLatestResumeId(res.data.resume_id);
    } catch {
      setResumeFeedback("Failed to score resume.");
    }
    setLoadingLeft(false);
  }

  async function handleResumeVsJD(e) {
    e.preventDefault();
    setLoadingRight(true);
    setJdResult(null);
    const form = new FormData();
    form.append("resume_id", latestResumeId); 
    form.append("resume", inputResume);
    form.append("jd", inputJD);
    try {
      const res = await api.post("/resume_vs_jd_score", form);
      setJdResult(res.data);
    } catch {
      setJdResult({ error: "Failed to match." });
    }
    setLoadingRight(false);
  }

  async function handleUserFeedback(e) {
    e.preventDefault();
    setUserFeedbackMsg("");
    const form = new FormData();
    form.append("resume_id", latestResumeId);
    form.append("feedback", userFeedback);
    try {
      await api.post("/feedback/user", form);
      setUserFeedbackMsg("Feedback submitted!");
      setUserFeedback("");
    } catch {
      setUserFeedbackMsg("Failed to submit feedback.");
    }
  }

  async function handleHrFeedback(e) {
    e.preventDefault();
    setHrFeedbackMsg("");
    const form = new FormData();
    form.append("resume_id", latestResumeId);
    form.append("feedback", hrFeedback);
    try {
      await api.post("/feedback/hr", form);
      setHrFeedbackMsg("HR feedback submitted!");
      setHrFeedback("");
    } catch {
      setHrFeedbackMsg("Failed to submit HR feedback.");
    }
  }

  return (
    <div style={{ display: "flex", gap: 32, maxWidth: 1100, margin: "32px auto" }}>
      {/* Left: Resume Score */}
      <div style={{ flex: 1, background: "#fff", padding: 24, borderRadius: 8 }}>
        <h3>Resume Score (OpenAI)</h3>
        <form onSubmit={handleResumeScore}>
          <label style={{ display: "block", marginBottom: 6, color: "#2563eb", fontWeight: 500 }}>
            Please upload your Resume (PDF) here:
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setResumeFile(e.target.files[0])}
              required
            />
            <button type="submit" style={{ padding: "6px 18px" }} disabled={loadingLeft}>
              {loadingLeft ? "Scoring..." : "Get Score"}
            </button>
          </div>
        </form>
        {resumeScore !== null && (
          <div style={{ marginTop: 16 }}>
            <div><b>Score:</b></div>
            <ProgressBar value={resumeScore} max={100} color="#2563eb" />
            <div><b>Feedback:</b> {resumeFeedback}</div>
          </div>
        )}
      </div>
      {/* Right: Resume vs JD */}
      <div style={{ flex: 1, background: "#fff", padding: 24, borderRadius: 8 }}>
        <h3>Resume vs JD Score</h3>
        {!latestResumeId ? (
          <div style={{ color: "#2563eb", marginBottom: 8, fontWeight: 500 }}>
            Please upload your Resume first.
          </div>
        ) : (
          <>
            <form onSubmit={handleResumeVsJD}>
              <label style={{ display: "block", marginBottom: 6, color: "#2563eb", fontWeight: 500 }}>
                Please upload Resume (PDF) and Job Description (PDF) here:
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={e => setInputResume(e.target.files[0])}
                  required
                />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={e => setInputJD(e.target.files[0])}
                  required
                />
                <button type="submit" style={{ padding: "6px 18px" }} disabled={loadingRight}>
                  {loadingRight ? "Matching..." : "Match"}
                </button>
              </div>
            </form>
            {jdResult && (
              <div style={{ marginTop: 16 }}>
                {jdResult.error ? (
                  <div style={{ color: "red" }}>{jdResult.error}</div>
                ) : (
                  <>
                    <div><b>Resume ID:</b> {jdResult.resume_id}</div>
                    <div><b>OpenAI Match Score:</b> {jdResult.openai_match_score}</div>
                    <div><b>Vector Match Score:</b> {jdResult.vector_match_score}</div>
                  </>
                )}
                {/* Feedback forms after JD result */}
                <div style={{ marginTop: 24, borderTop: "1px solid #eee", paddingTop: 16 }}>
                  <h4>Submit Feedback</h4>
                  <form onSubmit={handleUserFeedback}>
                    <textarea
                      value={userFeedback}
                      onChange={e => setUserFeedback(e.target.value)}
                      placeholder="Your feedback about the matching results..."
                      rows={3}
                      style={{ width: "100%", margin: "8px 0" }}
                      required
                    />
                    <button type="submit" className="feedback-btn">
                      Submit User Feedback
                    </button>
                    {userFeedbackMsg && <div className="feedback-msg" style={{ color: "green" }}>{userFeedbackMsg}</div>}
                  </form>
                  <form onSubmit={handleHrFeedback} style={{ marginTop: 16 }}>
                    <textarea
                      value={hrFeedback}
                      onChange={e => setHrFeedback(e.target.value)}
                      placeholder="HR feedback about the candidate..."
                      rows={3}
                      style={{ width: "100%", margin: "8px 0" }}
                      required
                    />
                    <button type="submit" className="feedback-btn">
                      Submit HR Feedback
                    </button>
                    {hrFeedbackMsg && <div className="feedback-msg" style={{ color: "green" }}>{hrFeedbackMsg}</div>}
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
