'use server';

/**
 * @fileOverview Generates AI-powered insights for dashboard metrics.
 *
 * - generateInsights - A function that generates insights based on key metrics.
 * - GenerateInsightsInput - The input type for the generateInsights function.
 * - GenerateInsightsOutput - The return type for the generateInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsInputSchema = z.object({
  metrics: z
    .string()
    .describe('Key metrics displayed on the dashboard (e.g., task completion rate, employee schedule adherence).'),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;

const GenerateInsightsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key metrics.'),
  suggestedActions: z
    .string()
    .describe('Suggested actions based on the insights derived from the metrics.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `You are an AI assistant providing insights based on dashboard metrics.

  Summarize the key metrics provided and suggest actionable steps based on the insights.

  Metrics: {{{metrics}}}
  `,
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
