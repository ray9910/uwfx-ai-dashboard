'use client';

import * as React from 'react';
import { TradeJournalCard } from '@/components/dashboard/trade-journal-card';
import { useAppContext } from '@/context/app-provider';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BookOpen } from 'lucide-react';

export default function JournalPage() {
    const { tradeJournal, isGenerating } = useAppContext();

    return (
        <div className="flex flex-col min-h-svh p-4 md:p-6 lg:p-8">
            <div className="bg-card rounded-xl border p-4 sm:p-6 lg:p-8 w-full flex-1 flex flex-col">
                <header className="flex items-center gap-4 mb-8">
                     <div className="hidden md:block">
                        <SidebarTrigger />
                    </div>
                    <h1 className="text-2xl font-semibold flex items-center gap-3">
                        <BookOpen className="h-6 w-6" />
                        Trade Journal
                    </h1>
                </header>
                <main className="flex-1">
                    <TradeJournalCard journal={tradeJournal} isGenerating={isGenerating} className="h-full" hideHeader />
                </main>
            </div>
        </div>
    );
}
