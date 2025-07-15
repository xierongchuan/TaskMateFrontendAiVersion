"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart"

const chartData = [
  { week: "Week 1", completed: 186, overdue: 80 },
  { week: "Week 2", completed: 305, overdue: 200 },
  { week: "Week 3", completed: 237, overdue: 120 },
  { week: "Week 4", completed: 273, overdue: 190 },
  { week: "Week 5", completed: 209, overdue: 130 },
]

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--primary))",
  },
  overdue: {
    label: "Overdue",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

export default function TaskChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Task Completion Overview</CardTitle>
        <CardDescription>Weekly completed vs. overdue tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
             <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
            <Bar dataKey="overdue" fill="var(--color-overdue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
