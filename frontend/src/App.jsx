import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import { getTasks, createTask, toggleTask, deleteTask, updateTask } from "./services/api";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getTasks();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (title, desc, dueDateTime) => {
    const task = await createTask(title, desc, dueDateTime);
    setTasks((prev) => [task, ...prev]);
  };

  const handleToggle = async (id) => {
    const updated = await toggleTask(id);
    setTasks((prev) => prev.map((t) => (t.task_id === id ? updated : t)));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.task_id !== id));
  };

  const handleEdit = async (id, title, desc, dueDateTime) => {
    const updated = await updateTask(id, title, desc, dueDateTime);
    setTasks((prev) => prev.map((t) => (t.task_id === id ? updated : t)));
  };

  const visible = tasks.filter((t) =>
    filter === "all" ? true : t.task_status === filter
  );

  return (
    <div className="app">
      <header>
        <h1>Task<span>Manager</span></h1>
        <p className="subtitle">Personal task manager</p>
      </header>

      <main>
        <TaskForm onAdd={handleAdd} />

        <div className="filter-bar">
          {["all", "PENDING", "COMPLETED"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="status-msg">Loading tasks…</p>
        ) : visible.length === 0 ? (
          <p className="status-msg">No tasks here.</p>
        ) : (
          <div className="task-list">
            {visible.map((t) => (
              <TaskItem
                key={t.task_id}
                task={t}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}