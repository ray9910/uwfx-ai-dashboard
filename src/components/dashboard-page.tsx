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
import {
  Bot,
  CandlestickChart,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { TradeIdeaGeneratorCard } from './dashboard/trade-idea-generator-card';
import { TradeJournalCard } from './dashboard/trade-journal-card';
import { useToast } from '@/hooks/use-toast';
import type { TradeIdea } from '@/types';
import { generateIdeaAction } from '@/lib/actions';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';

export function DashboardPage() {
  const { toast } = useToast();
  
  const [tradeJournal, setTradeJournal] = React.useState<TradeIdea[]>([]);
  const [credits, setCredits] = React.useState(10);
  
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateIdea = async (query: string, tradingStyle: 'Day Trader' | 'Swing Trader', screenshotDataUri: string | null) => {
    if (credits <= 0) {
      toast({
        variant: 'destructive',
        title: 'Out of Credits',
        description: 'Please purchase more credits to generate ideas.',
      });
      return;
    }
    
    setIsGenerating(true);
    setCredits((prev) => prev - 1);

    const result = await generateIdeaAction(query, tradingStyle, screenshotDataUri);

    if (result.success && result.data) {
      const newTrade: TradeIdea = {
        ...result.data,
        id: crypto.randomUUID(),
        status: 'Open',
        timestamp: new Date().toISOString(),
      };
      setTradeJournal((prev) => [newTrade, ...prev]);
      toast({
        title: 'New Trading Idea Generated',
        description: `The new idea for ${result.data.ticker} has been added to your journal.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error || 'An unknown error occurred.',
      });
      setCredits((prev) => prev + 1); // Refund credit on failure
    }
    setIsGenerating(false);
  };

  return (
    <SidebarProvider>
      <div className="md:hidden p-2 fixed top-0 left-0 z-20">
        <SidebarTrigger />
      </div>
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
            <header className="flex items-center gap-4 mb-8">
              <div className="hidden md:block">
                <SidebarTrigger />
              </div>
              <h1 className="text-2xl font-semibold">AI Trading Desk</h1>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
              <div className="lg:col-span-1">
                <TradeIdeaGeneratorCard
                  isGenerating={isGenerating}
                  onGenerate={handleGenerateIdea}
                  credits={credits}
                />
              </div>
              <div className="lg:col-span-2">
                <TradeJournalCard
                  journal={tradeJournal}
                  isGenerating={isGenerating}
                />
              </div>
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
