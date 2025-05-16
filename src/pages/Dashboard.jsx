import React, { useEffect, useState } from "react";
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
                <td>{r.openai_match_score ?? "N/A"}</td>
                <td>{r.vector_match_score ?? "N/A"}</td>
                <td>{r.job_title ?? "N/A"}</td>
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

export default function Dashboard({ token }) {
  const [total, setTotal] = useState(null);
  const [resumeId, setResumeId] = useState("");
  const [resumeDetails, setResumeDetails] = useState(null);
  const [detailErr, setDetailErr] = useState("");
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch total resumes
  const fetchTotalResumes = () => {
    setTotal(null);
    api.get("/total_resume")
      .then(res => setTotal(res.data.total))
      .catch(() => setTotal(0));
  };

  // Fetch summary table
  const fetchResumesSummary = () => {
    setLoading(true);
    api.get("/resumes_summary")
      .then(res => setResumes(res.data))
      .catch(() => setResumes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTotalResumes();
  }, []);

  useEffect(() => {
    fetchResumesSummary();
  }, [refreshKey]);

  // Fetch by ID
  async function handleGetResumeById(e) {
    e.preventDefault();
    setDetailErr("");
    setResumeDetails(null);
    try {
      const res = await api.get("/resume_by_id", { params: { resume_id: resumeId } });
      setResumeDetails(res.data);
    } catch {
      setDetailErr("Resume not found.");
    }
  }

  // Feedback handlers
  async function handleUserFeedbackSubmit(resume_id, feedback, cb) {
    const form = new FormData();
    form.append("resume_id", resume_id);
    form.append("feedback", feedback);
    try {
      await api.post("/feedback/user", form);
      cb("Saved!");
      setRefreshKey(k => k + 1);
    } catch {
      cb("Failed!");
    }
  }
  async function handleHrFeedbackSubmit(resume_id, feedback, cb) {
    const form = new FormData();
    form.append("resume_id", resume_id);
    form.append("feedback", feedback);
    try {
      await api.post("/feedback/hr", form);
      cb("Saved!");
      setRefreshKey(k => k + 1);
    } catch {
      cb("Failed!");
    }
  }

  // Table columns
  const columns = [
    { key: "resume_id", label: "Resume ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "openai_match_score", label: "OpenAI Score", sortable: true },
    { key: "vector_match_score", label: "Vector Score", sortable: true },
    { key: "job_title", label: "Job Title", sortable: true },
    { key: "user_feedback", label: "User Feedback", sortable: false },
    { key: "hr_feedback", label: "HR Feedback", sortable: false },
    { key: "pdf", label: "PDF", sortable: false },
  ];

  return (
    <div style={{ maxWidth: 1600, margin: "32px auto" }}>
      <h2>Dashboard</h2>
      <div style={{ marginBottom: 24 }}>
        <b>Total Resumes:</b>{" "}
        {total === null ? (
          <span style={{ color: "#888" }}>Loading...</span>
        ) : (
          <span>{total}</span>
        )}
      </div>
      {/* Side by side: resume_by_id and download */}
      <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
        <div style={{ flex: 1, borderRight: "1px solid #ccc", paddingRight: 16 }}>
          <h3>Get Resume By ID</h3>
          <form onSubmit={handleGetResumeById} style={{ marginBottom: 8 }}>
            <input
              value={resumeId}
              onChange={e => setResumeId(e.target.value)}
              placeholder="Resume ID"
              required
              style={{ marginRight: 8 }}
            />
            <button type="submit">Get</button>
          </form>
          {detailErr && <div style={{ color: "red" }}>{detailErr}</div>}
          {resumeDetails && (
            <pre style={{ background: "#f0f0f0", padding: 8, maxHeight: 250, overflow: "auto" }}>
              {JSON.stringify(resumeDetails, null, 2)}
            </pre>
          )}
        </div>
        <div style={{ flex: 1, paddingLeft: 16 }}>
          <h3>Download Resume By ID</h3>
          <form onSubmit={e => { e.preventDefault(); downloadResume(resumeId, token); }}>
            <input
              value={resumeId}
              onChange={e => setResumeId(e.target.value)}
              placeholder="Resume ID"
              required
              style={{ marginRight: 8 }}
            />
            <button type="submit">Download</button>
          </form>
        </div>
      </div>
      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", margin: "32px 0" }}>Loading...</div>
      ) : (
        <SortableTable
          columns={columns}
          data={resumes}
          token={token}
          onUserFeedback={handleUserFeedbackSubmit}
          onHrFeedback={handleHrFeedbackSubmit}
          onDownload={downloadResume}
        />
      )}
    </div>
  );
}
