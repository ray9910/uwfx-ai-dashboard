import type { GenerateTradingIdeaOutput } from "@/ai/flows/generate-trading-idea";

export type TradeIdea = GenerateTradingIdeaOutput & {
  id: string;
  status: 'Open' | 'Win' | 'Loss' | 'Break-even';
  timestamp: string;
  userNotes?: string;
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

export type SignInForm = {
    email: string;
    password: string;
}
export type SignUpForm = SignInForm;
