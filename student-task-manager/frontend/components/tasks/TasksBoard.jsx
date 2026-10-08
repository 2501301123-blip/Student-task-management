"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { getTasks, deleteTask, updateTask } from "@/lib/api";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badges";
import AddTaskModal from "./AddTaskModal";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function TasksBoard({ initialTasks, projects, team }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [project, setProject] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Re-fetch from the backend whenever a filter changes (server-side filtering
  // via query params, demonstrating the REST API filter contract).
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (project) params.project = project;
    if (search) params.search = search;

    const timeout = setTimeout(() => {
      getTasks(params)
        .then(setTasks)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300); // debounce search typing

    return () => clearTimeout(timeout);
  }, [search, status, priority, project]);

  const counts = useMemo(() => {
    return {
      total: tasks.length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  }, [tasks]);

  const handleStatusChange = async (task, newStatus) => {
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)));
    try {
      await updateTask(task._id, { status: newStatus, completed: newStatus === "done" });
    } catch (err) {
      // revert on failure
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    }
  };

  const handleDelete = async (id) => {
    const prev = tasks;
    setTasks((p) => p.filter((t) => t._id !== id));
    try {
      await deleteTask(id);
    } catch (err) {
      setTasks(prev);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm w-56 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      <p className="text-xs text-gray-400 dark:text-slate-500">
        Showing {counts.total} task{counts.total !== 1 && "s"} · {counts.done} completed
        {loading && " · updating..."}
      </p>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-700 text-left text-gray-400 dark:text-slate-500 text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Task</th>
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="px-5 py-3 font-medium">Assignee</th>
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Due</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-gray-50/60 dark:hover:bg-slate-800/60">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-800 dark:text-slate-100">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-gray-400 dark:text-slate-500 line-clamp-1">{task.description}</p>
                  )}
                </td>
                <td className="px-5 py-3 text-gray-500 dark:text-slate-400">{task.project?.name || "—"}</td>
                <td className="px-5 py-3 text-gray-500 dark:text-slate-400">{task.assignee?.name || "Unassigned"}</td>
                <td className="px-5 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-5 py-3">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className="text-xs border border-gray-200 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-gray-500 dark:text-slate-400">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-gray-300 dark:text-slate-600 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-400 dark:text-slate-500 text-sm">
                  No tasks match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddTaskModal
          onClose={() => setShowAdd(false)}
          onCreated={(task) => setTasks((prev) => [task, ...prev])}
        />
      )}
    </div>
  );
}
