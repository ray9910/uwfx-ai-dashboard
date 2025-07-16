
'use client';

import * as React from 'react';
import { TradeIdeaGeneratorCard } from '@/components/dashboard/trade-idea-generator-card';
import { TradeJournalCard } from '@/components/dashboard/trade-journal-card';
import { useAppContext } from '@/context/app-provider';
import { useAuth } from '@/context/auth-provider';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, TrendingUp, TrendingDown, Target } from 'lucide-react';
import type { TradeIdea } from '@/types';

const SummaryStatCard = ({ title, value, change, icon, iconBgColor }: { title: string; value: string | number; change?: string; icon: React.ReactNode, iconBgColor: string }) => (
    <Card className="bg-card/80 backdrop-blur-sm border-white/10 shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className={`p-2 rounded-lg ${iconBgColor}`}>
                {icon}
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {change && <p className="text-xs text-muted-foreground">{change}</p>}
        </CardContent>
    </Card>
);

const getTradeStats = (journal: TradeIdea[]) => {
    const totalTrades = journal.length;
    const longTrades = journal.filter(t => t.direction === 'LONG').length;
    const shortTrades = journal.filter(t => t.direction === 'SHORT').length;
    const totalConfidence = journal.reduce((acc, t) => acc + t.confidence, 0);
    const avgConfidence = totalTrades > 0 ? Math.round(totalConfidence / totalTrades) : 0;

    return { totalTrades, longTrades, shortTrades, avgConfidence };
}

export default function DashboardPage() {
  const { tradeJournal, credits, isGenerating, isLoadingData, handleGenerateIdea } = useAppContext();
  const { user } = useAuth();
  const { totalTrades, longTrades, shortTrades, avgConfidence } = getTradeStats(tradeJournal);

  return (
    <div className="flex flex-col min-h-svh">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 sm:px-6 backdrop-blur-sm">
        <div className="hidden md:block">
            <SidebarTrigger />
        </div>
        <h1 className="text-xl font-semibold">Welcome back, {user?.displayName?.split(' ')[0] ?? 'Trader'}!</h1>
        <div className="ml-auto">
            <Badge variant="outline" className="text-sm py-1 px-3 border-primary/50 bg-primary/10 text-primary font-semibold">
                {credits} Credits
            </Badge>
        </div>
      </header>
      <main className="flex-1 flex flex-col gap-8 p-4 md:p-6 lg:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryStatCard title="Total Ideas" value={totalTrades} icon={<BarChart className="h-4 w-4 text-primary-foreground" />} iconBgColor="bg-primary/80" />
              <SummaryStatCard title="Buy Signals" value={longTrades} change={`${totalTrades > 0 ? Math.round((longTrades/totalTrades)*100) : 0}% of total`} icon={<TrendingUp className="h-4 w-4 text-success-foreground" />} iconBgColor="bg-success/80" />
              <SummaryStatCard title="Sell Signals" value={shortTrades} change={`${totalTrades > 0 ? Math.round((shortTrades/totalTrades)*100) : 0}% of total`} icon={<TrendingDown className="h-4 w-4 text-destructive-foreground" />} iconBgColor="bg-destructive/80" />
              <SummaryStatCard title="Avg Confidence" value={`${avgConfidence}%`} icon={<Target className="h-4 w-4 text-blue-300" />} iconBgColor="bg-blue-500/80" />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <TradeIdeaGeneratorCard
                isGenerating={isGenerating}
                onGenerate={handleGenerateIdea}
                credits={credits}
            />
            <TradeJournalCard
                journal={tradeJournal}
                isGenerating={isGenerating}
                isLoading={isLoadingData}
            />
          </div>
      </main>
    </div>
  );
}
