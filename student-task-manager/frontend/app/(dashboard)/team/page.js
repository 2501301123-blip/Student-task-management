import { getTeam } from "@/lib/api-server";
import TeamGrid from "@/components/team/TeamGrid";

export default async function TeamPage() {
  const team = await getTeam();
  return <TeamGrid initialTeam={team} />;
}
