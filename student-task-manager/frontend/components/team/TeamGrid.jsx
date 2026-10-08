"use client";

import { useState } from "react";
import { Plus, Mail, Trash2 } from "lucide-react";
import { createMember, deleteMember } from "@/lib/api";

const STATUS_DOT = {
  online: "bg-green-500",
  away: "bg-yellow-500",
  offline: "bg-gray-300 dark:bg-slate-600",
};

const COLORS = ["#6366f1", "#ec4899", "#22c55e", "#f59e0b", "#06b6d4", "#a855f7"];

export default function TeamGrid({ initialTeam }) {
  const [team, setTeam] = useState(initialTeam);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Member" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const color = COLORS[team.length % COLORS.length];
      const member = await createMember({ ...form, avatarColor: color });
      setTeam((prev) => [...prev, member]);
      setForm({ name: "", email: "", role: "Member" });
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setTeam((prev) => prev.filter((m) => m._id !== id));
    try {
      await deleteMember(id);
    } catch (err) {
      // no-op
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((m) => (
          <div key={m._id} className="card p-5 flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: m.avatarColor }}
              >
                {m.name?.charAt(0)}
              </div>
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${STATUS_DOT[m.status] || STATUS_DOT.offline}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 dark:text-slate-100 truncate">{m.name}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">{m.role}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                <Mail size={11} /> {m.email}
              </p>
            </div>
            <button onClick={() => handleDelete(m._id)} className="text-gray-300 dark:text-slate-600 hover:text-red-500 shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {team.length === 0 && <p className="text-sm text-gray-400 dark:text-slate-500 col-span-full text-center py-10">No team members yet.</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="card card-static animate-scale-in w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">Add Team Member</h2>
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
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Role</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-60">
                  {submitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
