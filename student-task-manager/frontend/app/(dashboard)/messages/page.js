import { getMessages, getTeam } from "@/lib/api-server";
import MessagesPanel from "@/components/messages/MessagesPanel";

export default async function MessagesPage() {
  const [messages, team] = await Promise.all([getMessages(), getTeam()]);
  return <MessagesPanel initialMessages={messages} team={team} />;
}
