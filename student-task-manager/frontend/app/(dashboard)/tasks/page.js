import TasksBoard from "@/components/tasks/TasksBoard";
import { getTasks, getProjects, getTeam } from "@/lib/api-server";

// Server Component: fetches the initial unfiltered dataset on the server.
// Filtering itself happens client-side in TasksBoard for instant feedback,
// re-fetching from the API whenever filters change.
export default async function TasksPage() {
  const [tasks, projects, team] = await Promise.all([getTasks(), getProjects(), getTeam()]);

  return <TasksBoard initialTasks={tasks} projects={projects} team={team} />;
}
