import type { NewsArticle, ChartDataPoint } from '@/types';

export const getNewsData = async (): Promise<NewsArticle[]> => {
  // Mock data, in a real app this would fetch from an API like NewsAPI
  return Promise.resolve([
    { id: '1', source: 'Bloomberg', title: 'Tech Stocks Rally on Positive Inflation Report', url: '#', publishedAt: '2023-10-27T14:00:00Z' },
    { id: '2', source: 'Reuters', title: 'Federal Reserve Hints at Pausing Rate Hikes', url: '#', publishedAt: '2023-10-27T13:30:00Z' },
    { id: '3', source: 'Financial Times', title: 'Corporate Earnings Exceed Expectations in Q3', url: '#', publishedAt: '2023-10-27T12:00:00Z' },
    { id: '4', source: 'Wall Street Journal', title: 'Global Supply Chain Pressures Begin to Ease', url: '#', publishedAt: '2023-10-27T11:45:00Z' },
    { id: '5', source: 'CNBC', title: 'Energy Sector Sees Volatility Amid Geopolitical Tensions', url: '#', publishedAt: '2023-10-27T10:10:00Z' },
  ]);
};

export const getChartData = async (): Promise<ChartDataPoint[]> => {
  // Mock data, in a real app this would fetch from an API like Twelve Data
  const data: ChartDataPoint[] = [];
  let price = 150.00;
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    price += (Math.random() - 0.49) * 4;
    price = Math.max(price, 120);
    data.push({
      date: date.toLocaleDateString('en-CA'), // YYYY-MM-DD
      price: parseFloat(price.toFixed(2)),
    });
  }
  return Promise.resolve(data);
};
