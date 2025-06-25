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
  query: z.string().describe("The user's query for a stock, e.g., 'Apple' or 'AAPL'."),
  tradingStyle: z.enum(['Day Trader', 'Swing Trader']).describe('The trading style for the idea.'),
  chartData: z.string().describe('Chart data as a JSON string for the relevant ticker. Each data point includes date, open, high, low, close, and volume.'),
  newsData: z.string().optional().describe('A summary of recent news articles for the ticker.'),
  screenshotDataUri: z.string().optional().describe(
    "An optional screenshot of a chart or other relevant information, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type GenerateTradingIdeaInput = z.infer<typeof GenerateTradingIdeaInputSchema>;

const GenerateTradingIdeaOutputSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol for the trading idea.'),
  direction: z.enum(['LONG', 'SHORT']).describe('The direction of the trade, either LONG or SHORT.'),
  entry: z.number().describe('Entry price for the trade.'),
  stopLoss: z.number().describe('Stop loss price for the trade.'),
  takeProfit1: z.number().describe('First take profit price for the trade.'),
  takeProfit2: z.number().describe('Second take profit price for the trade.'),
  confidence: z.number().min(0).max(100).int().describe('A confidence score for the trade idea, from 0 to 100.'),
  rationale: z.string().describe('Rationale for the trading idea, tailored to the trading style.'),
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
  prompt: `You are an expert trading signal generator and stock market analyst.

1. First, identify the official stock ticker symbol for the user's query: "{{{query}}}".
2. Then, using the provided chart data, recent news, and the trading style of a "{{{tradingStyle}}}", generate a structured trading idea.
    - A "Day Trader" focuses on very short-term price movements, often within the same day.
    - A "Swing Trader" aims to capture gains in a stock within a period of a few days to several weeks.
3. Your analysis should be tailored to the chosen trading style and incorporate sentiment from the news.
4. The provided chart data is a JSON array of daily OHLCV (Open, High, Low, Close, Volume) data. Use this as the primary source for technical analysis.

{{#if screenshotDataUri}}
Also consider the user-provided screenshot in your analysis. The screenshot may contain technical indicators, chart patterns, or other relevant information.
User-provided screenshot: {{media url=screenshotDataUri}}
{{/if}}

Chart Data for the identified ticker:
{{{chartData}}}

{{#if newsData}}
Recent News for the identified ticker:
{{{newsData}}}
{{/if}}

Provide your response in the following JSON format, including the ticker you identified:
{
  "ticker": "<identified_ticker_symbol>",
  "direction": "<LONG_or_SHORT>",
  "entry": <entry_price>,
  "stopLoss": <stop_loss_price>,
  "takeProfit1": <take_profit_1_price>,
  "takeProfit2": <take_profit_2_price>,
  "confidence": <confidence_score_integer_0_to_100>,
  "rationale": "<rationale_for_the_trade_based_on_query_chart_data_and_news_sentiment>"
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
