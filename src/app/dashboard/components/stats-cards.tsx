import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertTriangle, Users } from "lucide-react";

const stats = [
  {
    title: "Completed Tasks",
    value: "1,204",
    icon: CheckCircle2,
    change: "+12.5%",
    changeType: "increase",
    color: "text-green-500",
  },
  {
    title: "Schedule Adherence",
    value: "92%",
    icon: Clock,
    change: "+2.1%",
    changeType: "increase",
    color: "text-green-500",
  },
  {
    title: "Overdue Tasks",
    value: "12",
    icon: AlertTriangle,
    change: "-5.2%",
    changeType: "decrease",
    color: "text-red-500",
  },
  {
    title: "Active Employees",
    value: "48",
    icon: Users,
    change: "+2",
    changeType: "increase",
    color: "text-blue-500",
  },
];

export default function StatsCards() {
  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stat.color}>{stat.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
