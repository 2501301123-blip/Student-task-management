import { getProjects } from "@/lib/api-server";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsGrid initialProjects={projects} />;
}
