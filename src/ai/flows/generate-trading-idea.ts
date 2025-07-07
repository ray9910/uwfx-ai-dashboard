
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
  model: (process.env.GOOGLE_AI_MODEL as any) || 'googleai/gemini-1.5-pro',
  input: {schema: GenerateTradingIdeaInputSchema},
  output: {schema: GenerateTradingIdeaOutputSchema},
  prompt: `You are an expert trading signal generator and stock market analyst, skilled in technical analysis. Your goal is to produce high-quality, actionable trading ideas.

Your task is to generate a structured trading idea based *only* on a user-provided chart screenshot. Follow this Chain of Thought process meticulously for maximum accuracy:

**Step 1: Identify the Ticker**
*   Carefully examine the screenshot to find the official stock ticker symbol. This is critical. If you cannot find a ticker, state that in the rationale and do not proceed.

**Step 2: Analyze the Market Structure (The "Big Picture")**
*   **Trend Analysis:** Is the overall trend bullish (higher highs and higher lows), bearish (lower highs and lower lows), or ranging/sideways?
*   **Key Levels:** Identify major horizontal support and resistance zones. These are areas where price has reacted multiple times in the past.
*   **Chart Patterns:** Look for larger patterns that define the market structure, such as channels, triangles, wedges, or head and shoulders.

**Step 3: Analyze the Price Action (The "Immediate Picture")**
*   **Candlestick Patterns:** Scrutinize the most recent candles. Are there any classic reversal or continuation patterns like dojis, hammers, engulfing patterns, or morning/evening stars, especially near your identified key levels?
*   **Volume Analysis (if visible):** Is there a surge in volume confirming a breakout or a potential reversal? Note this if visible.

**Step 4: Synthesize and Formulate the Trade Idea**
*   **Build the Narrative:** Combine your findings from Steps 2 and 3 into a clear, logical story. For example: "The stock is in an overall uptrend and has just pulled back to a key support level. At this level, a bullish engulfing candlestick pattern has formed, suggesting the uptrend is likely to resume."
*   **Define Trade Parameters:** Based on your narrative, determine the trade direction (LONG or SHORT).
    *   **Entry:** Propose a specific entry price, typically just above the high of a bullish signal candle or just below the low of a bearish one.
    *   **Stop Loss:** Place the stop loss at a logical point that would invalidate your idea (e.g., below the key support level or the low of the signal candle for a LONG trade).
    *   **Take Profit:** Set two realistic take profit targets. TP1 should be at the next minor resistance/support level, and TP2 at the next major one.
*   **Assign Confidence Score:** Based on how many factors align (e.g., trend, key level, strong candlestick pattern), assign a confidence score from 0-100. A trade with multiple confirming factors should have a higher score.
*   **Tailor to Trading Style:** Adjust the tightness of your stop loss and take profit levels based on the user's selected trading style: "{{{tradingStyle}}}". Day traders need tighter targets than swing traders.

**Step 5: Format the Output**
*   Provide your final, synthesized analysis in the specified JSON format. The rationale must be comprehensive, walking through the logic from your step-by-step analysis.

User-provided screenshot:
{{media url=screenshotDataUri}}

Provide your response in the specified JSON format.
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
