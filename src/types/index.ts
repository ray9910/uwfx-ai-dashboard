import type { GenerateTradingIdeaOutput } from "@/ai/flows/generate-trading-idea";

export type TradeIdea = GenerateTradingIdeaOutput & {
  id: string;
  status: 'Open' | 'Closed';
  timestamp: string;
};

export type ChartDataPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type TickerSuggestion = {
  symbol: string;
  companyName: string;
};

export type NewsArticle = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
};
