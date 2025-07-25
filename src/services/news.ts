'use server';

import type { NewsArticle } from '@/types';

export async function getNewsForSymbol(symbol: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn('NEWS_API_KEY is not set. The fetchStockNews tool will return no data.');
    return [];
  }

  // Extract the base ticker, e.g., 'AAPL' from 'NASDAQ:AAPL'
  const baseTicker = symbol.split(':').pop() || symbol;

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      baseTicker
    )}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}&language=en`;
    
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

    if (!response.ok) {
      console.error(`News API request failed with status: ${response.status}`);
      const errorBody = await response.text();
      console.error('News API error body:', errorBody);
      return [];
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      console.error('News API returned an error:', data.message);
      return [];
    }

    return data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    console.error('Error fetching news data:', error);
    return [];
  }
}
