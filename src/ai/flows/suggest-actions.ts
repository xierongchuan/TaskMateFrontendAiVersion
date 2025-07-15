'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting actions based on key metrics and summaries.
 *
 * The flow takes key metrics and summaries as input and returns AI-driven suggestions on actions the user should take.
 * It exports:
 * - `suggestActions`: The main function to call the flow.
 * - `SuggestActionsInput`: The input type for the `suggestActions` function.
 * - `SuggestActionsOutput`: The output type for the `suggestActions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActionsInputSchema = z.object({
  keyMetrics: z.string().describe('Key metrics to be summarized.'),
  summary: z.string().describe('Summary of the key metrics.'),
});

export type SuggestActionsInput = z.infer<typeof SuggestActionsInputSchema>;

const SuggestActionsOutputSchema = z.object({
  suggestions: z.string().describe('AI-driven suggestions on actions to take.'),
});

export type SuggestActionsOutput = z.infer<typeof SuggestActionsOutputSchema>;

export async function suggestActions(input: SuggestActionsInput): Promise<SuggestActionsOutput> {
  return suggestActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActionsPrompt',
  input: {schema: SuggestActionsInputSchema},
  output: {schema: SuggestActionsOutputSchema},
  prompt: `You are an AI assistant designed to provide actionable suggestions based on key metrics and summaries.

  Based on the following key metrics: {{{keyMetrics}}}
  And the following summary: {{{summary}}}

  Suggest actions that the user should take to improve the metrics. Be specific and provide clear steps.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestActionsFlow = ai.defineFlow(
  {
    name: 'suggestActionsFlow',
    inputSchema: SuggestActionsInputSchema,
    outputSchema: SuggestActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
