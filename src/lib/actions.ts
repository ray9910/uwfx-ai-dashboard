
'use server';

import { generateTradingIdea, type GenerateTradingIdeaInput } from '@/ai/flows/generate-trading-idea';
import { suggestTickers } from '@/ai/flows/suggest-tickers';

export async function generateIdeaAction(tradingStyle: 'Day Trader' | 'Swing Trader', screenshotDataUri: string) {
  try {
    const input: GenerateTradingIdeaInput = {
      tradingStyle,
      screenshotDataUri,
    };

    const idea = await generateTradingIdea(input);
    return { success: true, data: idea };
  } catch (error) {
    console.error('Error generating trading idea:', error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}

export async function suggestTickersAction(query: string) {
  try {
    const suggestions = await suggestTickers({ query });
    return { success: true, data: suggestions };
  } catch (error) {
    console.error('Error suggesting tickers:', error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}

export async function checkApiKeys() {
  return {
    twelveData: !!process.env.TWELVE_DATA_API_KEY,
    newsApi: !!process.env.NEWS_API_KEY,
  };
}
