import React, { useState } from "react";
import api from "../api";
import { FaSort, FaSortUp, FaSortDown, FaExternalLinkAlt } from "react-icons/fa";

// Download helper function
function downloadResume(resume_id, token) {
  fetch(`http://localhost:8080/resume_by_id_download?resume_id=${resume_id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(response => {
      if (!response.ok) throw new Error("Download failed");
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume_${resume_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch(err => alert(err.message));
}

// Feedback cell
function FeedbackCell({ value, resume_id, onSave }) {
  const [feedback, setFeedback] = useState(value ?? "");
  const [msg, setMsg] = useState("");
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(resume_id, feedback, setMsg);
      }}
    >
      <textarea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        rows={2}
      />
      <button type="submit" style={{ marginTop: 4, fontSize: 12 }}>
        Save
      </button>
      {msg && <div className="feedback-msg">{msg}</div>}
    </form>
  );
}

// Sortable table
function SortableTable({ columns, data, token, onUserFeedback, onHrFeedback, onDownload }) {
  const [sortKey, setSortKey] = useState("");
  const [ascending, setAscending] = useState(true);

  function getSortedData() {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      let v1 = a[sortKey], v2 = b[sortKey];
      if (typeof v1 === "string") v1 = v1.toLowerCase();
      if (typeof v2 === "string") v2 = v2.toLowerCase();
      if (v1 === undefined || v1 === null) return 1;
      if (v2 === undefined || v2 === null) return -1;
      if (v1 === v2) return 0;
      return (v1 > v2 ? 1 : -1) * (ascending ? 1 : -1);
    });
  }

  function handleSort(col) {
    if (sortKey === col.key) {
      setAscending(!ascending);
    } else {
      setSortKey(col.key);
      setAscending(true);
    }
  }

  const sortedData = getSortedData();

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={col.sortable ? () => handleSort(col) : undefined}
                style={{ cursor: col.sortable ? "pointer" : "default" }}
              >
                {col.label}
                {col.sortable && (
                  sortKey === col.key
                    ? (ascending ? <FaSortUp style={{ marginLeft: 4 }} /> : <FaSortDown style={{ marginLeft: 4 }} />)
                    : <FaSort style={{ marginLeft: 4, opacity: 0.5 }} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>No data found.</td>
            </tr>
          ) : (
            sortedData.map(r => (
              <tr key={r.resume_id}>
                <td>{r.resume_id}</td>
                <td>{r.name}</td>
                <td>{r.contact}</td>
                <td>{r.email}</td>
                <td>{r.openai_match_score ?? "N/A"}</td>
                <td>{r.vector_match_score ?? "N/A"}</td>
                <td>
                  <FeedbackCell
                    value={r.user_feedback}
                    resume_id={r.resume_id}
                    onSave={onUserFeedback}
                  />
                </td>
                <td>
                  <FeedbackCell
                    value={r.hr_feedback}
                    resume_id={r.resume_id}
                    onSave={onHrFeedback}
                  />
                </td>
                <td>
                  <button
                    className="download-btn"
                    onClick={() => onDownload(r.resume_id, token)}
                    title="Download PDF"
                  >
                    <FaExternalLinkAlt />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AiScreener({ token }) {
  // OpenAI
  const [jdFile, setJdFile] = useState(null);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [topK, setTopK] = useState(3);
  const [openaiResults, setOpenaiResults] = useState([]);
  const [openaiLoading, setOpenaiLoading] = useState(false);

  // Vector
  const [jdFileVector, setJdFileVector] = useState(null);
  const [topKVector, setTopKVector] = useState(3);
  const [vectorResults, setVectorResults] = useState([]);
  const [vectorLoading, setVectorLoading] = useState(false);

  // Feedback update helpers
  async function handleUserFeedback(resume_id, feedback, cb) {
    const form = new FormData();
    form.append("resume_id", resume_id);
    form.append("feedback", feedback);
    try {
      await api.post("/feedback/user", form);
      cb("Saved!");
    } catch {
      cb("Failed!");
    }
  }
  async function handleHrFeedback(resume_id, feedback, cb) {
    const form = new FormData();
    form.append("resume_id", resume_id);
    form.append("feedback", feedback);
    try {
      await api.post("/feedback/hr", form);
      cb("Saved!");
    } catch {
      cb("Failed!");
    }
  }

  async function handleOpenAISubmit(e) {
    e.preventDefault();
    setOpenaiLoading(true);
    setOpenaiResults([]);
    const form = new FormData();
    form.append("jd", jdFile);
    form.append("top_k", topK);
    for (let f of resumeFiles) form.append("resumes", f);
    try {
      const res = await api.post("/resumes_for_jd_openai", form);
      setOpenaiResults(res.data);
    } catch {
      setOpenaiResults([]);
    }
    setOpenaiLoading(false);
  }

  async function handleVectorSubmit(e) {
    e.preventDefault();
    setVectorLoading(true);
    setVectorResults([]);
    const form = new FormData();
    form.append("jd", jdFileVector);
    form.append("top_k", topKVector);
    try {
      const res = await api.post("/resumes_for_jd_vector", form);
      setVectorResults(res.data);
    } catch {
      setVectorResults([]);
    }
    setVectorLoading(false);
  }

  // Table columns
  const columns = [
    { key: "resume_id", label: "Resume ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "contact", label: "Contact", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "openai_match_score", label: "OpenAI Score", sortable: true },
    { key: "vector_match_score", label: "Vector Score", sortable: true },
    { key: "user_feedback", label: "User Feedback", sortable: false },
    { key: "hr_feedback", label: "HR Feedback", sortable: false },
    { key: "pdf", label: "PDF", sortable: false },
  ];

  return (
    <div style={{ maxWidth: 1600, margin: "32px auto" }}>
      <h2>AI Screener</h2>
      {/* OpenAI */}
      <form onSubmit={handleOpenAISubmit} style={{ marginBottom: 24 }}>
        <h3>OpenAI Matching (Upload Resumes + JD)</h3>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={e => setResumeFiles([...e.target.files])}
          required
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={e => setJdFile(e.target.files[0])}
          required
          style={{ marginLeft: 8 }}
        />
        <input
          type="number"
          value={topK}
          min={1}
          max={10}
          onChange={e => setTopK(Number(e.target.value))}
          style={{ marginLeft: 8, width: 60 }}
        />
        <span style={{ marginLeft: 8 }}>Top K</span>
        <button type="submit" style={{ marginLeft: 12, padding: "6px 18px" }} disabled={openaiLoading}>
          {openaiLoading ? "Matching..." : "Find Matches"}
        </button>
      </form>
      {openaiLoading && <div style={{ marginBottom: 16 }}>Matching...</div>}
      <SortableTable
        columns={columns}
        data={openaiResults}
        token={token}
        onUserFeedback={handleUserFeedback}
        onHrFeedback={handleHrFeedback}
        onDownload={downloadResume}
      />

      {/* Vector */}
      <form onSubmit={handleVectorSubmit} style={{ marginBottom: 24 }}>
        <h3>Vector Matching (DB Resumes + JD)</h3>
        <input
          type="file"
          accept="application/pdf"
          onChange={e => setJdFileVector(e.target.files[0])}
          required
        />
        <input
          type="number"
          value={topKVector}
          min={1}
          max={10}
          onChange={e => setTopKVector(Number(e.target.value))}
          style={{ marginLeft: 8, width: 60 }}
        />
        <span style={{ marginLeft: 8 }}>Top K</span>
        <button type="submit" style={{ marginLeft: 12, padding: "6px 18px" }} disabled={vectorLoading}>
          {vectorLoading ? "Matching..." : "Find Matches"}
        </button>
      </form>
      {vectorLoading && <div style={{ marginBottom: 16 }}>Matching...</div>}
      <SortableTable
        columns={columns}
        data={vectorResults}
        token={token}
        onUserFeedback={handleUserFeedback}
        onHrFeedback={handleHrFeedback}
        onDownload={downloadResume}
      />
    </div>
  );
}
