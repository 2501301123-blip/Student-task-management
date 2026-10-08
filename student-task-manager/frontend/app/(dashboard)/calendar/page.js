import { getEvents } from "@/lib/api-server";
import CalendarView from "@/components/calendar/CalendarView";

export default async function CalendarPage() {
  const now = new Date();
  const events = await getEvents({ month: now.getMonth() + 1, year: now.getFullYear() });
  return <CalendarView initialEvents={events} initialMonth={now.getMonth()} initialYear={now.getFullYear()} />;
}
