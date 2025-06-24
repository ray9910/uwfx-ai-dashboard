'use server';

/**
 * @fileOverview Trading idea generation flow using chart and news data.
 *
 * - generateTradingIdea - A function that generates trading ideas.
 * - GenerateTradingIdeaInput - The input type for the generateTradingIdea function.
 * - GenerateTradingIdeaOutput - The return type for the generateTradingIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradingIdeaInputSchema = z.object({
  chartData: z.string().describe('Chart data as a JSON string.'),
  newsData: z.string().describe('News data as a JSON string.'),
});
export type GenerateTradingIdeaInput = z.infer<typeof GenerateTradingIdeaInputSchema>;

const GenerateTradingIdeaOutputSchema = z.object({
  entry: z.number().describe('Entry price for the trade.'),
  stopLoss: z.number().describe('Stop loss price for the trade.'),
  takeProfit1: z.number().describe('First take profit price for the trade.'),
  takeProfit2: z.number().describe('Second take profit price for the trade.'),
  rationale: z.string().describe('Rationale for the trading idea.'),
});
export type GenerateTradingIdeaOutput = z.infer<typeof GenerateTradingIdeaOutputSchema>;

export async function generateTradingIdea(input: GenerateTradingIdeaInput): Promise<GenerateTradingIdeaOutput> {
  return generateTradingIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradingIdeaPrompt',
  input: {schema: GenerateTradingIdeaInputSchema},
  output: {schema: GenerateTradingIdeaOutputSchema},
  prompt: `You are an expert trading signal generator. Analyze the provided chart data and news data to generate a structured trading idea.

Chart Data: {{{chartData}}}
News Data: {{{newsData}}}

Provide the trading idea in the following JSON format:
{
  "entry": <entry_price>,
  "stopLoss": <stop_loss_price>,
  "takeProfit1": <take_profit_1_price>,
  "takeProfit2": <take_profit_2_price>,
  "rationale": <rationale_for_the_trade>
}
`,
});

const generateTradingIdeaFlow = ai.defineFlow(
  {
    name: 'generateTradingIdeaFlow',
    inputSchema: GenerateTradingIdeaInputSchema,
    outputSchema: GenerateTradingIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
