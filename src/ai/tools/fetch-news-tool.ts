'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getNewsForSymbol} from '@/services/news';
import {summarizeNewsData} from '@/ai/flows/summarize-news-data';

export const fetchNewsTool = ai.defineTool(
    {
        name: 'fetchStockNews',
        description: 'Fetches recent news articles for a given stock ticker and returns a summary. Use this to get fundamental context for a trading idea.',
        inputSchema: z.object({
            ticker: z.string().describe('The stock ticker symbol (e.g., AAPL, GOOG).'),
        }),
        outputSchema: z.string().describe('A summary of the recent news and market sentiment for the stock.'),
    },
    async (input) => {
        console.log(`Fetching news for ${input.ticker}`);
        const articles = await getNewsForSymbol(input.ticker);
        
        if (articles.length === 0) {
            return 'No recent news found for this ticker.';
        }

        const newsData = articles.map(a => `Title: ${a.title}\nDescription: ${a.description}`).join('\n\n');

        const { summary } = await summarizeNewsData({
            ticker: input.ticker,
            newsData: newsData,
        });

        return summary;
    }
);
