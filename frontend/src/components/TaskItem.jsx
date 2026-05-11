import { useState } from "react";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.task_title);
  const [desc, setDesc] = useState(task.task_desc || "");
  const [error, setError] = useState("");

  const done = task.task_status === "completed";

  const saveEdit = async () => {
    if (!title.trim()) { setError("Title cannot be empty."); return; }
    try {
      await onEdit(task.task_id, title.trim(), desc.trim() || null);
      setEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.task_title}"?`)) onDelete(task.task_id);
  };

  return (
    <div className={`task-item ${done ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle(task.task_id)}
        title="Toggle status"
      />

      {editing ? (
        <div className="edit-area">
          {error && <p className="error">{error}</p>}
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} />
          <div className="edit-actions">
            <button onClick={saveEdit}>Save</button>
            <button className="btn-cancel" onClick={() => { setEditing(false); setError(""); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="task-body">
          <span className="task-title">{task.task_title}</span>
          {task.task_desc && <span className="task-desc">{task.task_desc}</span>}
          <span className="task-meta">
            {task.task_status} · {new Date(task.created_at).toLocaleDateString()} {new Date(task.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
        </div>
      )}

      <div className="task-actions">
        {!editing && <button className="btn-edit" onClick={() => setEditing(true)}>Edit</button>}
        <button className="btn-delete" onClick={handleDelete}>✕</button>
      </div>
    </div>
  );
}