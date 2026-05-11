import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    try {
      await onAdd(title.trim(), desc.trim() || null);
      setTitle("");
      setDesc("");
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
      <button type="submit">Add Task</button>
    </form>
  );
}