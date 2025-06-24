
'use server';

import { generateTradingIdea, type GenerateTradingIdeaInput } from '@/ai/flows/generate-trading-idea';
import { suggestTickers } from '@/ai/flows/suggest-tickers';
import { getChartData } from '@/lib/data';
import { getNewsForSymbol } from './news';

export async function generateIdeaAction(query: string, tradingStyle: 'Day Trader' | 'Swing Trader', screenshotDataUri: string | null) {
  try {
    const chartData = await getChartData(query);
    const newsArticles = await getNewsForSymbol(query);

    // Format news for the prompt
    const newsData = newsArticles.length > 0 
      ? newsArticles.map(article => `- ${article.title} (${article.source})`).join('\n') 
      : undefined;
    
    if (chartData.length === 0) {
      return { success: false, error: 'Could not fetch chart data. Please check the ticker symbol and your API key.' };
    }

    const input: GenerateTradingIdeaInput = {
      query,
      tradingStyle,
      chartData: JSON.stringify(chartData),
      newsData,
    };

    if (screenshotDataUri) {
      input.screenshotDataUri = screenshotDataUri;
    }

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
