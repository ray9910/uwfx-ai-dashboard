// Summarizes news data related to a stock.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNewsDataInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock.'),
  newsData: z.string().describe('The news data related to the stock.'),
});
export type SummarizeNewsDataInput = z.infer<typeof SummarizeNewsDataInputSchema>;

const SummarizeNewsDataOutputSchema = z.object({
  summary: z.string().describe('The summary of the news data.'),
});
export type SummarizeNewsDataOutput = z.infer<typeof SummarizeNewsDataOutputSchema>;

export async function summarizeNewsData(input: SummarizeNewsDataInput): Promise<SummarizeNewsDataOutput> {
  return summarizeNewsDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNewsDataPrompt',
  model: 'googleai/gemini-1.5-pro',
  input: {schema: SummarizeNewsDataInputSchema},
  output: {schema: SummarizeNewsDataOutputSchema},
  prompt: `You are an AI assistant that summarizes news data related to a particular stock.

  Summarize the following news data for the stock ticker {{{ticker}}}:

  {{{newsData}}}

  Provide a concise summary of the news data. Focus on the overall market sentiment.
  `,
});

const summarizeNewsDataFlow = ai.defineFlow(
  {
    name: 'summarizeNewsDataFlow',
    inputSchema: SummarizeNewsDataInputSchema,
    outputSchema: SummarizeNewsDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
