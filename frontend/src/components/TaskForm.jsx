import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    let dueDateTime = null;
    if (dueDate) {
      const timePart = dueTime ? `${dueTime}:00` : "00:00:00";
      dueDateTime = `${dueDate}T${timePart}`;
    }
    try {
      await onAdd(title.trim(), desc.trim() || null, dueDateTime);
      setTitle("");
      setDesc("");
      setDueDate("");
      setDueTime("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <h2>New Task</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Task title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description (optional)"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={2}
      />
      <div className="due-date-group">
        <label>Due Date</label>
        <input
          type="date"
          placeholder="Format: YYYY-MM-DD (optional)"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div className="due-time-group">
        <label>Due Time</label>
        <input
          type="time"
          placeholder="Format: HH:MM (optional, Requires Due Date)"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}