import { getAnalyticsOverview, getAnalyticsTrend } from "@/lib/api-server";
import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";

export default async function AnalyticsPage() {
  const [overview, trend] = await Promise.all([getAnalyticsOverview(), getAnalyticsTrend(14)]);
  return <AnalyticsCharts overview={overview} trend={trend} />;
}
