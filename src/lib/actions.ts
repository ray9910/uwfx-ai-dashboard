
'use server';

import { generateTradingIdea } from '@/ai/flows/generate-trading-idea';
import { getChartData, getNewsData } from '@/lib/data';

export async function generateIdeaAction() {
  try {
    const chartData = await getChartData(); 
    const newsData = await getNewsData();

    // The AI prompt expects stringified JSON
    const input = {
      chartData: JSON.stringify(chartData),
      newsData: JSON.stringify(newsData.slice(0, 5)), // Use a subset of news for the prompt
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
