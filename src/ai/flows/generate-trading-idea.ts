'use server';

/**
 * @fileOverview Trading idea generation flow using a chart screenshot.
 *
 * - generateTradingIdea - A function that generates trading ideas from a screenshot.
 * - GenerateTradingIdeaInput - The input type for the generateTradingIdea function.
 * - GenerateTradingIdeaOutput - The return type for the generateTradingIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradingIdeaInputSchema = z.object({
  tradingStyle: z.enum(['Day Trader', 'Swing Trader']).describe('The trading style for the idea.'),
  screenshotDataUri: z.string().describe(
    "A mandatory screenshot of a chart, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type GenerateTradingIdeaInput = z.infer<typeof GenerateTradingIdeaInputSchema>;

const GenerateTradingIdeaOutputSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol for the trading idea, identified from the chart screenshot.'),
  direction: z.enum(['LONG', 'SHORT']).describe('The direction of the trade, either LONG or SHORT.'),
  entry: z.number().describe('Entry price for the trade.'),
  stopLoss: z.number().describe('Stop loss price for the trade.'),
  takeProfit1: z.number().describe('First take profit price for the trade.'),
  takeProfit2: z.number().describe('Second take profit price for the trade.'),
  confidence: z.number().min(0).max(100).int().describe('A confidence score for the trade idea, from 0 to 100.'),
  rationale: z.string().describe('Comprehensive rationale for the trading idea, based purely on technical analysis of the chart (including candlestick patterns).'),
});
export type GenerateTradingIdeaOutput = z.infer<typeof GenerateTradingIdeaOutputSchema>;


export async function generateTradingIdea(input: GenerateTradingIdeaInput): Promise<GenerateTradingIdeaOutput> {
  return generateTradingIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradingIdeaPrompt',
  model: 'googleai/gemini-2.0-flash',
  input: {schema: GenerateTradingIdeaInputSchema},
  output: {schema: GenerateTradingIdeaOutputSchema},
  prompt: `You are an expert trading signal generator and stock market analyst, skilled in technical analysis.

Your task is to generate a structured trading idea based *only* on a user-provided chart screenshot.

Here is your process:

1.  **Identify the official stock ticker symbol from the provided chart screenshot.** This is a critical first step. The ticker is usually clearly visible on the chart.

2.  **Perform a detailed technical analysis of the chart screenshot.**
    *   Identify key support and resistance levels, trendlines, and chart patterns (e.g., head and shoulders, triangles, flags).
    *   **Pay special attention to candlestick patterns.** Look for formations like dojis, hammers, engulfing patterns, or morning/evening stars that indicate potential reversals or continuations.

3.  **Synthesize your technical analysis to create a cohesive trading idea.** Your rationale must clearly explain how the chart analysis (including candlestick patterns) supports your proposed trade. The idea should be tailored to the "{{{tradingStyle}}}" trading style.
    *   A "Day Trader" focuses on very short-term price movements. Your price targets and stop loss should be tight.
    *   A "Swing Trader" aims to capture gains over days or weeks. Your price targets and stop loss can be wider.

4.  **Provide your full response in the specified JSON format.** The rationale should be comprehensive, referencing specific chart patterns and candlestick formations.

User-provided screenshot:
{{media url=screenshotDataUri}}

Provide your response in the following JSON format:
{
  "ticker": "<identified_ticker_symbol_from_screenshot>",
  "direction": "<LONG_or_SHORT>",
  "entry": <entry_price>,
  "stopLoss": <stop_loss_price>,
  "takeProfit1": <take_profit_1_price>,
  "takeProfit2": <take_profit_2_price>,
  "confidence": <confidence_score_integer_0_to_100>,
  "rationale": "<comprehensive_rationale_based_on_technical_analysis>"
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
