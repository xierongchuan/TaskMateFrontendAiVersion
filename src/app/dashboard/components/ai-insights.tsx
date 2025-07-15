"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { generateInsights } from "@/ai/flows/generate-insights";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type Insights = {
  summary: string;
  suggestedActions: string;
};

export default function AiInsights() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateInsights = async () => {
    setLoading(true);
    setInsights(null);
    try {
      const keyMetrics = "Task Completion Rate: 85%, Schedule Adherence: 92%, Overdue Tasks: 12";
      const result = await generateInsights({ metrics: keyMetrics });
      setInsights(result);
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate AI insights. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <Wand2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-headline">AI Insights</CardTitle>
        </div>
        <CardDescription>
          Generate summaries and actions based on your current metrics.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}
        {insights && (
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Summary</h3>
              <p className="text-muted-foreground">{insights.summary}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Suggested Actions</h3>
              <p className="text-muted-foreground">{insights.suggestedActions}</p>
            </div>
          </div>
        )}
        {!loading && !insights && (
            <div className="text-center text-muted-foreground py-8">
                Click the button to generate insights.
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateInsights} disabled={loading} className="w-full">
          {loading ? "Generating..." : "Generate Insights"}
        </Button>
      </CardFooter>
    </Card>
  );
}
