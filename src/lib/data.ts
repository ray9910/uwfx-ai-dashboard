import type { ChartDataPoint } from '@/types';

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
