const BASE = "http://localhost:8000/api/tasks";

const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
};

export const getTasks = () => fetch(BASE).then(handle);

export const createTask = (task_title, task_desc) =>
  fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task_title, task_desc }),
  }).then(handle);

export const updateTask = (id, task_title, task_desc) =>
  fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task_title, task_desc }),
  }).then(handle);

export const toggleTask = (id) =>
  fetch(`${BASE}/${id}/toggle`, { method: "PATCH" }).then(handle);

export const deleteTask = (id) =>
  fetch(`${BASE}/${id}`, { method: "DELETE" }).then(handle);