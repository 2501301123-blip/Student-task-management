"use client";

import StatCard from "@/components/ui/StatCard";
import { CheckSquare, FolderKanban, Users, AlertTriangle } from "lucide-react";

const STATUS_COLORS = {
  todo: "#9ca3af",
  "in-progress": "#3b82f6",
  review: "#a855f7",
  done: "#22c55e",
};

const PRIORITY_COLORS = {
  low: "#9ca3af",
  medium: "#eab308",
  high: "#f97316",
  urgent: "#ef4444",
};

export default function AnalyticsCharts({ overview, trend }) {
  const maxTrend = Math.max(1, ...trend.map((t) => Math.max(t.created, t.completed)));
  const totalByStatus = overview.byStatus.reduce((sum, s) => sum + s.count, 0) || 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={overview.totalTasks} icon={CheckSquare} accent="brand" />
        <StatCard label="Completion Rate" value={overview.completionRate} suffix="%" icon={CheckSquare} accent="green" />
        <StatCard label="Total Members" value={overview.totalMembers} icon={Users} accent="orange" />
        <StatCard label="Overdue Tasks" value={overview.overdue} icon={AlertTriangle} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-4">Task Activity (Last 14 Days)</h3>
          <div className="flex items-end gap-2 h-48">
            {trend.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-slate-500 self-center mx-auto">No task activity yet.</p>
            )}
            {trend.map((t) => (
              <div key={t._id} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  <div
                    className="w-1/2 rounded-t bg-brand-500/80"
                    style={{ height: `${(t.created / maxTrend) * 100}%` }}
                    title={`Created: ${t.created}`}
                  />
                  <div
                    className="w-1/2 rounded-t bg-green-500/80"
                    style={{ height: `${(t.completed / maxTrend) * 100}%` }}
                    title={`Completed: ${t.completed}`}
                  />
                </div>
                <span className="text-[9px] text-gray-400 dark:text-slate-500 rotate-0">
                  {new Date(t._id).getDate()}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand-500/80" /> Created
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-green-500/80" /> Completed
            </span>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-4">Tasks by Status</h3>
          <div className="space-y-3">
            {overview.byStatus.map((s) => (
              <div key={s._id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize text-gray-600 dark:text-slate-300">{s._id?.replace("-", " ")}</span>
                  <span className="text-gray-400 dark:text-slate-500">{s.count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(s.count / totalByStatus) * 100}%`,
                      backgroundColor: STATUS_COLORS[s._id] || "#9ca3af",
                    }}
                  />
                </div>
              </div>
            ))}
            {overview.byStatus.length === 0 && <p className="text-sm text-gray-400 dark:text-slate-500">No data yet.</p>}
          </div>
        </div>
      </div>

      {/* Priority breakdown */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-4">Tasks by Priority</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {overview.byPriority.map((p) => (
            <div key={p._id} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
              <p
                className="text-2xl font-semibold"
                style={{ color: PRIORITY_COLORS[p._id] || "#6366f1" }}
              >
                {p.count}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 capitalize mt-1">{p._id}</p>
            </div>
          ))}
          {overview.byPriority.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-slate-500 col-span-full text-center">No data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
