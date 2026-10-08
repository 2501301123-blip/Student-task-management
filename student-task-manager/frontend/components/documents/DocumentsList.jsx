"use client";

import { useState } from "react";
import { FileText, Image as ImageIcon, FileSpreadsheet, File, Plus, Trash2, Search } from "lucide-react";
import { createDocument, deleteDocument } from "@/lib/api";

const TYPE_ICONS = {
  pdf: FileText,
  doc: FileText,
  design: ImageIcon,
  image: ImageIcon,
  sheet: FileSpreadsheet,
  file: File,
};

export default function DocumentsList({ initialDocuments, projects }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "pdf", size: "", project: "" });

  const filtered = documents.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const doc = await createDocument({ ...form, project: form.project || null, size: form.size || "0 KB" });
    setDocuments((prev) => [doc, ...prev]);
    setForm({ name: "", type: "pdf", size: "", project: "" });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    setDocuments((prev) => prev.filter((d) => d._id !== id));
    try {
      await deleteDocument(id);
    } catch (err) {
      // no-op; in production we'd restore + toast the error
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm w-64"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus size={16} /> Add Document
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => {
          const Icon = TYPE_ICONS[doc.type] || File;
          return (
            <div key={doc._id} className="card p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0">
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100 truncate">{doc.name}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                  {doc.project?.name || "No project"} · {doc.size}
                </p>
              </div>
              <button onClick={() => handleDelete(doc._id)} className="text-gray-300 dark:text-slate-600 hover:text-red-500 shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-slate-500 col-span-full text-center py-10">No documents found.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="card card-static animate-scale-in w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">Add Document</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">File Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Report.pdf"
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                >
                  <option value="pdf">PDF</option>
                  <option value="doc">Doc</option>
                  <option value="sheet">Spreadsheet</option>
                  <option value="image">Image</option>
                  <option value="design">Design</option>
                  <option value="file">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Project</label>
                <select
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                >
                  <option value="">None</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
