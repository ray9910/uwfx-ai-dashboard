import type { GenerateTradingIdeaOutput } from "@/ai/flows/generate-trading-idea";

export type TradeIdea = GenerateTradingIdeaOutput & {
  id: string;
  status: 'Open' | 'Closed';
  timestamp: string;
};

export type ChartDataPoint = {
  date: string;
  price: number;
};
