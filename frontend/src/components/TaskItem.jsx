import { useState } from "react";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.task_title);
  const [desc, setDesc] = useState(task.task_desc || "");
  const [error, setError] = useState("");
  const initialDueDate = task.due_at ? new Date(task.due_at).toISOString().split("T")[0] : "";
  const initialDueTime = task.due_at ? new Date(task.due_at).toTimeString().slice(0, 5) : "";
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [dueTime, setDueTime] = useState(initialDueTime);


  const done = task.task_status === "COMPLETED";
  const isOverdue =
    task.task_status === "PENDING" &&
    task.due_at &&
    new Date() > new Date(task.due_at);

  const saveEdit = async () => {
    if (!title.trim()) { setError("Title cannot be empty."); return; }
    let dueDateTime = null;
    if (dueDate) {
      const timePart = dueTime ? `${dueTime}:00` : "00:00:00";
      dueDateTime = `${dueDate}T${timePart}`;
    }
    try {
      await onEdit(task.task_id, title.trim(), desc.trim() || null, dueDateTime);
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
    <div className={`task-item ${done ? "COMPLETED" : ""}`}>
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
          <div className="due-edit-group">
            <label>Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="due-edit-group">
            <label>Due Time</label>
            <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
          </div>
          <div className="edit-actions">
            <button onClick={saveEdit}>Save</button>
            <button className="btn-cancel" onClick={() => { setEditing(false); setError(""); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="task-body">
          <span className="task-title">
            {task.task_title}
            {isOverdue && (<span style={{color: "red", marginLeft: "8px", fontWeight: "bold", }}> [OVERDUE]</span>)}
          </span>
          {task.task_desc && <span className="task-desc">{task.task_desc}</span>}
          <span className="task-meta">
            {task.task_status} · {new Date(task.created_at).toLocaleDateString()} {new Date(task.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
          {task.due_at && (
            <span className="task-meta">
              Due:{" "}
              {new Date(task.due_at).toLocaleDateString()}{" "}
              {new Date(task.due_at).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>)}
        </div>
      )}

      <div className="task-actions">
        {!editing && <button className="btn-edit" onClick={() => setEditing(true)}>Edit</button>}
        <button className="btn-delete" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}