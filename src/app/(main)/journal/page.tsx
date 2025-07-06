'use client';

import * as React from 'react';
import { TradeJournalCard } from '@/components/dashboard/trade-journal-card';
import { useAppContext } from '@/context/app-provider';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BookOpen, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function JournalPage() {
    const { tradeJournal, isGenerating } = useAppContext();
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredJournal = tradeJournal.filter(trade =>
        trade.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-svh p-4 md:p-6 lg:p-8">
            <div className="bg-card rounded-xl border p-4 sm:p-6 lg:p-8 w-full flex-1 flex flex-col">
                <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                     <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <SidebarTrigger />
                        </div>
                        <h1 className="text-2xl font-semibold flex items-center gap-3">
                            <BookOpen className="h-6 w-6" />
                            Trade Journal
                        </h1>
                     </div>
                     <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by ticker..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </header>
                <main className="flex-1">
                    <TradeJournalCard journal={filteredJournal} isGenerating={isGenerating} className="h-full" hideHeader searchQuery={searchQuery} />
                </main>
            </div>
        </div>
    );
}
