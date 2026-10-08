import { getDocuments, getProjects } from "@/lib/api-server";
import DocumentsList from "@/components/documents/DocumentsList";

export default async function DocumentsPage() {
  const [documents, projects] = await Promise.all([getDocuments(), getProjects()]);
  return <DocumentsList initialDocuments={documents} projects={projects} />;
}
