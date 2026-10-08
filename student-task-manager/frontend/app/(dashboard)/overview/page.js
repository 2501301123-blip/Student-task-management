import { CheckSquare, FolderKanban, Users, AlertTriangle } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badges";
import { getAnalyticsOverview, getTasks, getProjects } from "@/lib/api-server";

// Server Component: data is fetched on the server for every request (no-store),
// then streamed down as HTML — no client-side loading spinner needed.
export default async function OverviewPage() {
  const [stats, recentTasks, projects] = await Promise.all([
    getAnalyticsOverview(),
    getTasks(),
    getProjects(),
  ]);

  const upcoming = recentTasks
    .filter((t) => t.status !== "done")
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={stats.totalTasks} icon={CheckSquare} accent="brand" />
        <StatCard label="Completion Rate" value={stats.completionRate} suffix="%" icon={CheckSquare} accent="green" />
        <StatCard label="Active Projects" value={stats.activeProjects} icon={FolderKanban} accent="orange" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-4">Upcoming Tasks</h3>
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-slate-500">No pending tasks. Nice work!</p>
            )}
            {upcoming.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-100">{task.title}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                    {task.project?.name || "No project"}
                    {task.dueDate && ` · Due ${new Date(task.dueDate).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-4">Active Projects</h3>
          <div className="space-y-4">
            {projects.slice(0, 5).map((p) => (
              <div key={p._id}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-200 truncate">{p.name}</p>
                  <span className="text-xs text-gray-400 dark:text-slate-500">{p.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.progress}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-gray-400 dark:text-slate-500">No projects yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
