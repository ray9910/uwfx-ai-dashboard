'use client';

import * as React from 'react';
import { TradeIdeaGeneratorCard } from '@/components/dashboard/trade-idea-generator-card';
import { TradeJournalCard } from '@/components/dashboard/trade-journal-card';
import { useAppContext } from '@/context/app-provider';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardPage() {
  const { tradeJournal, credits, isGenerating, handleGenerateIdea } = useAppContext();

  return (
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
  );
}
