import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const response = await axios.get(API);
      setTasks(response.data);
      setError("");
    } catch {
      setError("Cannot connect to backend. Check server.js and MongoDB.");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await axios.post(API, { title: title.trim() });
      setTitle("");
      loadTasks();
    } catch {
      setError("Could not add task.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      loadTasks();
    } catch {
      setError("Could not update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      loadTasks();
    } catch {
      setError("Could not delete task.");
    }
  };

  const statuses = ["Pending", "Ongoing", "Completed"];

  return (
    <div className="dashboard">
      <header className="topbar">
        <h2>TaskFlow</h2>
        <span>Project Management Dashboard</span>
      </header>

      <main className="container py-4">
        <h1>My Tasks</h1>
        <p className="subtitle">Organize your work. Track your progress.</p>

        <div className="row g-3 mb-4">
          {statuses.map((status) => (
            <div className="col-12 col-md-4" key={status}>
              <div className={`summary ${status.toLowerCase()}`}>
                <p>{status} Tasks</p>
                <h2>{tasks.filter((t) => t.status === status).length}</h2>
              </div>
            </div>
          ))}
        </div>

        <form className="add-form" onSubmit={addTask}>
          <input
            className="form-control"
            placeholder="Enter a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            + Add Task
          </button>
        </form>

        {error && <div className="alert alert-warning mt-3">{error}</div>}

        <div className="row g-4 mt-2">
          {statuses.map((status) => (
            <div className="col-12 col-md-4" key={status}>
              <section className="task-column">
                <h5>{status}</h5>

                {tasks.filter((t) => t.status === status).length === 0 && (
                  <p className="empty">No tasks yet</p>
                )}

                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <article className="task-card" key={task._id}>
                      <h6>{task.title}</h6>
                      <span className={`status-tag ${status.toLowerCase()}`}>
                        {task.status}
                      </span>

                      <select
                        className="form-select mt-3"
                        value={task.status}
                        onChange={(e) =>
                          updateStatus(task._id, e.target.value)
                        }
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <button
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </article>
                  ))}
              </section>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
