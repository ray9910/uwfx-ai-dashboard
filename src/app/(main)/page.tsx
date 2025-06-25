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
        </header>

        <main className="flex flex-col gap-8">
          <TradeIdeaGeneratorCard
            isGenerating={isGenerating}
            onGenerate={handleGenerateIdea}
            credits={credits}
          />
          <TradeJournalCard
            journal={tradeJournal}
            isGenerating={isGenerating}
          />
        </main>
      </div>
    </div>
  );
}
