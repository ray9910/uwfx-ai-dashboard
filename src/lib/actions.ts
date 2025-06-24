
'use server';

import { generateTradingIdea } from '@/ai/flows/generate-trading-idea';
import { getChartData } from '@/lib/data';

export async function generateIdeaAction(query: string, tradingStyle: string) {
  try {
    // In a real app, you would fetch chart data for the ticker identified from the query.
    // For now, we continue to use mock data.
    const chartData = await getChartData(); 

    const input = {
      query,
      tradingStyle,
      chartData: JSON.stringify(chartData),
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
