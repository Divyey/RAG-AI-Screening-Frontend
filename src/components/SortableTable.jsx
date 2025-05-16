// src/components/SortableTable.jsx
import React, { useState } from "react";
import { FaSort, FaSortUp, FaSortDown, FaExternalLinkAlt } from "react-icons/fa";

function getSortedData(data, sortKey, ascending) {
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

export default function SortableTable({ columns, data, token, onUserFeedback, onHrFeedback, onDownload }) {
  const [sortKey, setSortKey] = useState("");
  const [ascending, setAscending] = useState(true);

  const sortedData = getSortedData(data, sortKey, ascending);

  function handleSort(col) {
    if (sortKey === col.key) {
      setAscending(!ascending);
    } else {
      setSortKey(col.key);
      setAscending(true);
    }
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{ cursor: col.sortable ? "pointer" : "default", whiteSpace: "nowrap" }}
                onClick={col.sortable ? () => handleSort(col) : undefined}
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

// Inline feedback cell
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
        style={{ width: "100%" }}
      />
      <button type="submit" style={{ marginTop: 4, fontSize: 12 }}>
        Save
      </button>
      {msg && <div style={{ fontSize: 12, color: "green" }}>{msg}</div>}
    </form>
  );
}
