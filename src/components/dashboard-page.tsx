'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Bot,
  CandlestickChart,
  CreditCard,
  Newspaper,
  BookOpen,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { ChartCard } from './dashboard/chart-card';
import { NewsCard } from './dashboard/news-card';
import { TradeIdeaGeneratorCard } from './dashboard/trade-idea-generator-card';
import { TradeJournalCard } from './dashboard/trade-journal-card';
import { useToast } from '@/hooks/use-toast';
import type { ChartDataPoint, NewsArticle, TradeIdea } from '@/types';
import type { GenerateTradingIdeaOutput } from '@/ai/flows/generate-trading-idea';
import { getChartData, getNewsData } from '@/lib/data';
import { generateIdeaAction } from '@/lib/actions';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

export function DashboardPage() {
  const { toast } = useToast();
  
  const [tradeJournal, setTradeJournal] = React.useState<TradeIdea[]>([]);
  const [credits, setCredits] = React.useState(10);
  
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);
  const [news, setNews] = React.useState<NewsArticle[]>([]);
  
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedIdea, setGeneratedIdea] = React.useState<GenerateTradingIdeaOutput | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [chart, news] = await Promise.all([getChartData(), getNewsData()]);
        setChartData(chart);
        setNews(news);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load dashboard data.',
        });
      } finally {
        setIsDataLoading(false);
      }
    };
    loadData();
  }, [toast]);

  const handleGenerateIdea = async () => {
    if (credits <= 0) {
      toast({
        variant: 'destructive',
        title: 'Out of Credits',
        description: 'Please purchase more credits to generate ideas.',
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedIdea(null);
    setCredits((prev) => prev - 1);

    const result = await generateIdeaAction();

    if (result.success && result.data) {
      setGeneratedIdea(result.data);
      toast({
        title: 'New Trading Idea Generated',
        description: 'Review the new idea below.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error,
      });
      setCredits((prev) => prev + 1); // Refund credit on failure
    }
    setIsGenerating(false);
  };

  const handleSaveToJournal = (idea: GenerateTradingIdeaOutput) => {
    const newTrade: TradeIdea = {
      ...idea,
      id: crypto.randomUUID(),
      ticker: 'MSFT', // Mock ticker
      status: 'Open',
      timestamp: new Date().toISOString(),
    };
    setTradeJournal((prev) => [newTrade, ...prev]);
    setGeneratedIdea(null);
    toast({
      title: 'Idea Saved',
      description: 'The new trading idea has been added to your journal.',
    });
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="size-8 text-primary" />
            <span className="text-lg font-semibold group-data-[state=collapsed]:hidden">Uwfx AI</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" isActive tooltip="Dashboard">
                <CandlestickChart />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Trade Journal">
                <BookOpen />
                <span>Trade Journal</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="News Feed">
                <Newspaper />
                <span>News Feed</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="AI Settings">
                <Bot />
                <span>AI Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton asChild variant="outline" tooltip="Buy Credits">
            <a href="https://polar.sh" target="_blank" rel="noopener noreferrer">
              <CreditCard />
              <span>Buy Credits</span>
            </a>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-svh">
          <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <CreditCard className="mr-2 h-4 w-4" />
                {credits} Credits
              </Badge>
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
            {isDataLoading ? (
               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                 <Skeleton className="lg:col-span-2 h-96" />
                 <Skeleton className="h-96" />
                 <Skeleton className="h-80" />
                 <Skeleton className="h-80" />
               </div>
            ) : (
              <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <ChartCard className="lg:col-span-2" chartData={chartData} />
                  <NewsCard news={news} />
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <TradeIdeaGeneratorCard
                    isGenerating={isGenerating}
                    generatedIdea={generatedIdea}
                    onGenerate={handleGenerateIdea}
                    onSave={handleSaveToJournal}
                  />
                  <TradeJournalCard journal={tradeJournal} />
                </div>
              </>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
