import AiInsights from "./components/ai-insights";
import StatsCards from "./components/stats-cards";
import TaskChart from "./components/task-chart";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:gap-8 xl:grid-cols-3">
      <div className="grid gap-6 md:grid-cols-2 xl:col-span-3">
        <StatsCards />
      </div>

      <div className="grid gap-6 xl:col-span-2">
        <TaskChart />
      </div>

      <div className="grid gap-6 xl:col-span-1">
        <AiInsights />
      </div>
    </div>
  );
}
