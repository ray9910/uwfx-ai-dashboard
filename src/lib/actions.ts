
'use server';

import { generateTradingIdea } from '@/ai/flows/generate-trading-idea';
import { getChartData } from '@/lib/data';

export async function generateIdeaAction() {
  try {
    const chartData = await getChartData(); 

    // The AI prompt expects stringified JSON
    const input = {
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
