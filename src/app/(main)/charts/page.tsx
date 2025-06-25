'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { checkApiKeys } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Newspaper } from 'lucide-react';
import { MarketChartCard } from '@/components/dashboard/market-chart-card';
import { NewsFeedCard } from '@/components/dashboard/news-feed-card';

export default function ChartsPage() {
  const [apiKeys, setApiKeys] = React.useState({ twelveData: true, newsApi: true });
  const [selectedSymbol] = React.useState('AAPL');
  
  React.useEffect(() => {
    async function checkKeys() {
      const keys = await checkApiKeys();
      setApiKeys(keys);
    }
    checkKeys();
  }, []);

  return (
    <div className="flex flex-col min-h-svh p-4 md:p-6 lg:p-8">
      <div className="bg-card rounded-xl border p-4 sm:p-6 lg:p-8 w-full flex-1 flex flex-col">
        <header className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SidebarTrigger />
            </div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <Newspaper className="h-6 w-6" />
              Charts & News
            </h1>
          </div>
        </header>

        {!apiKeys.twelveData && (
          <Alert variant="destructive" className="mb-8">
            <Terminal className="h-4 w-4" />
            <AlertTitle>API Key Missing!</AlertTitle>
            <AlertDescription>
              The chart functionality is limited. Please add your{' '}
              <strong>TWELVE_DATA_API_KEY</strong> to the{' '}
              <code>.env</code> file to enable live chart data.
            </AlertDescription>
          </Alert>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          <div className="lg:col-span-2">
            <MarketChartCard 
              symbol={selectedSymbol} 
            />
          </div>
          <div className="lg:col-span-1">
            <NewsFeedCard />
          </div>
        </main>
      </div>
    </div>
  );
}
