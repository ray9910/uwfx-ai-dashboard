'use server';

/**
 * @fileOverview Suggests stock tickers based on a user query.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { TickerSuggestion } from '@/types';

const SuggestTickersInputSchema = z.object({
  query: z.string().describe("A company name, partial name, or partial ticker symbol."),
});
export type SuggestTickersInput = z.infer<typeof SuggestTickersInputSchema>;

const TickerSuggestionSchema = z.object({
  symbol: z.string().describe('The stock ticker symbol.'),
  companyName: z.string().describe('The full name of the company.'),
});

const SuggestTickersOutputSchema = z.object({
  suggestions: z.array(TickerSuggestionSchema).describe('A list of up to 5 suggested stock tickers.'),
});
export type SuggestTickersOutput = z.infer<typeof SuggestTickersOutputSchema>;


export async function suggestTickers(input: SuggestTickersInput): Promise<TickerSuggestion[]> {
  const result = await suggestTickersFlow(input);
  return result.suggestions;
}

const prompt = ai.definePrompt({
  name: 'suggestTickersPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: SuggestTickersInputSchema},
  output: {schema: SuggestTickersOutputSchema},
  prompt: `You are a financial AI assistant. Your task is to suggest stock tickers based on a user's query.
The query might be a company name, a partial name, or a partial ticker.
Provide a list of up to 5 relevant stock tickers and their official company names.

User query: "{{{query}}}"

Return your response in the specified JSON format.
`,
});

const suggestTickersFlow = ai.defineFlow(
  {
    name: 'suggestTickersFlow',
    inputSchema: SuggestTickersInputSchema,
    outputSchema: SuggestTickersOutputSchema,
  },
  async (input) => {
    if (!input.query || input.query.length < 2) {
      return { suggestions: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
