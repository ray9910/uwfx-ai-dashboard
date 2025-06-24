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
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';

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
          <div className="w-full space-y-2 group-data-[state=collapsed]:hidden">
            <Separator className="my-2 bg-sidebar-border" />
            <div className="px-2 text-sm text-sidebar-foreground/70">
              <p>Credits</p>
              <Progress value={(credits / 15) * 100} className="h-2 mt-1 bg-sidebar-accent" />
              <p className="text-xs mt-1">{credits} of 15 remaining</p>
            </div>
            <SidebarMenuButton asChild variant="outline" className="w-full bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90">
              <a href="https://polar.sh" target="_blank" rel="noopener noreferrer">
                <CreditCard />
                <span>Buy Credits</span>
              </a>
            </SidebarMenuButton>
          </div>
          <Separator className="my-2 bg-sidebar-border" />
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="group-data-[state=collapsed]:hidden">
              <p className="font-semibold text-sm text-sidebar-foreground">User</p>
              <p className="text-xs text-sidebar-foreground/70">user@email.com</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-transparent">
        <div className="flex flex-col min-h-svh p-4 md:p-6 lg:p-8">
          <div className="bg-card rounded-xl border p-4 sm:p-6 lg:p-8 w-full flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold">AI Trading Desk</h1>
            </div>

            {isDataLoading ? (
               <div className="flex-1 flex flex-col gap-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <Skeleton className="lg:col-span-2 h-96" />
                  <Skeleton className="h-96" />
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <Skeleton className="h-96" />
                  <Skeleton className="h-96" />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-8">
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
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
