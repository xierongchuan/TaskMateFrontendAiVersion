import AiInsights from "./components/ai-insights";
import StatsCards from "./components/stats-cards";
import TaskChart from "./components/task-chart";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
      <div className="grid gap-6 sm:grid-cols-2 lg:col-span-3">
        <StatsCards />
      </div>

      <div className="lg:col-span-2">
        <TaskChart />
      </div>

      <div className="lg:col-span-1">
        <AiInsights />
      </div>
    </div>
  );
}
