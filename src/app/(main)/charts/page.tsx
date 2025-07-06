'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Newspaper } from 'lucide-react';
import { MarketChartCard } from '@/components/dashboard/market-chart-card';
import { Card, CardContent } from '@/components/ui/card';

export default function ChartsPage() {
  const [selectedSymbol] = React.useState('AAPL');

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
              Charts
            </h1>
          </div>
        </header>

        <main className="flex-1">
          <Card className="h-[550px] bg-transparent">
            <CardContent className="pt-6 h-full">
              <MarketChartCard 
                symbol={selectedSymbol} 
                className="h-full"
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
