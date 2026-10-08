"use client";

import { useState } from "react";
import { Plus, Calendar, Users } from "lucide-react";
import { createProject } from "@/lib/api";

const STATUS_FILTERS = ["all", "active", "on-hold", "completed", "archived"];

export default function ProjectsGrid({ initialProjects }) {
  const [projects, setProjects] = useState(initialProjects);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", deadline: "" });
  const [submitting, setSubmitting] = useState(false);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const project = await createProject(form);
      setProjects((prev) => [{ ...project, taskCount: 0, doneCount: 0 }, ...prev]);
      setForm({ name: "", description: "", deadline: "" });
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${
                filter === s ? "bg-brand-600 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              {s.replace("-", " ")}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <div key={p._id} className="card p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <span className="badge bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 capitalize">{p.status.replace("-", " ")}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-slate-100">{p.name}</h3>
              <p className="text-sm text-gray-400 dark:text-slate-500 mt-1 line-clamp-2">{p.description}</p>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-slate-500">
              <span>{p.doneCount ?? 0}/{p.taskCount ?? 0} tasks done</span>
              {p.deadline && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {new Date(p.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
            {p.members?.length > 0 && (
              <div className="flex items-center gap-1 -space-x-2">
                {p.members.slice(0, 4).map((m) => (
                  <div
                    key={m._id}
                    title={m.name}
                    className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-semibold text-white"
                    style={{ backgroundColor: m.avatarColor }}
                  >
                    {m.name?.charAt(0)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-slate-500 col-span-full text-center py-10">No projects in this category.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="card card-static animate-scale-in w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-60"
                >
                  {submitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
