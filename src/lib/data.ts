import type { ChartDataPoint } from '@/types';

export const getChartData = async (symbol: string): Promise<ChartDataPoint[]> => {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) {
    console.warn('TWELVE_DATA_API_KEY is not set. Returning empty chart data.');
    return [];
  }

  // Extract the base ticker, e.g., 'AAPL' from 'NASDAQ:AAPL'
  const baseTicker = symbol.split(':').pop() || symbol;

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(
      baseTicker
    )}&interval=1day&outputsize=90&apikey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Twelve Data API request failed with status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return [];
    }

    const data = await response.json();

    if (data.status !== 'ok' || !data.values) {
      console.error('Twelve Data API returned an error or no values:', data.message || data.code);
      return [];
    }

    // The API returns data in reverse chronological order, so we reverse it to have the oldest data first.
    return data.values
      .map((v: any) => ({
        date: v.datetime,
        open: parseFloat(v.open),
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        close: parseFloat(v.close),
        volume: parseInt(v.volume, 10),
      }))
      .reverse();
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }
};
