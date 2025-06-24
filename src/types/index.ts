import type { GenerateTradingIdeaOutput } from "@/ai/flows/generate-trading-idea";

export type TradeIdea = GenerateTradingIdeaOutput & {
  id: string;
  ticker: string;
  status: 'Open' | 'Closed';
  timestamp: string;
};

export type NewsArticle = {
  id: string;
  source: string;
  title: string;
  url: string;
  publishedAt: string;
};

export type ChartDataPoint = {
  date: string;
  price: number;
};
