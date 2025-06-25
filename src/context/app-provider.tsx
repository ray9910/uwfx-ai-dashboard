'use client';

import * as React from 'react';
import type { TradeIdea } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { generateIdeaAction } from '@/lib/actions';

interface AppContextType {
  tradeJournal: TradeIdea[];
  credits: number;
  isGenerating: boolean;
  handleGenerateIdea: (query: string, tradingStyle: 'Day Trader' | 'Swing Trader', screenshotDataUri: string | null) => Promise<void>;
  updateTradeNotes: (tradeId: string, notes: string) => void;
  deleteTrade: (tradeId: string) => void;
}

const AppContext = React.createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [tradeJournal, setTradeJournal] = React.useState<TradeIdea[]>([]);
  const [credits, setCredits] = React.useState(10);
  const [isGenerating, setIsGenerating] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedJournal = localStorage.getItem('uwfx-trade-journal');
      if (storedJournal) {
        setTradeJournal(JSON.parse(storedJournal));
      }
      const storedCredits = localStorage.getItem('uwfx-user-credits');
      if (storedCredits) {
        setCredits(JSON.parse(storedCredits));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      localStorage.setItem('uwfx-trade-journal', '[]');
      localStorage.setItem('uwfx-user-credits', '10');
    }
  }, []);

  const syncJournalToLocalStorage = (journal: TradeIdea[]) => {
    try {
      localStorage.setItem('uwfx-trade-journal', JSON.stringify(journal));
    } catch (error) {
      console.error("Failed to write journal to localStorage", error);
    }
  };

  const syncCreditsToLocalStorage = (credits: number) => {
     try {
      localStorage.setItem('uwfx-user-credits', JSON.stringify(credits));
    } catch (error) {
      console.error("Failed to write credits to localStorage", error);
    }
  };

  const addTrade = (trade: TradeIdea) => {
    setTradeJournal((prev) => {
      const newJournal = [trade, ...prev];
      syncJournalToLocalStorage(newJournal);
      return newJournal;
    });
  };

  const updateTradeNotes = (tradeId: string, notes: string) => {
    setTradeJournal(prev => {
        const newJournal = prev.map(trade => 
            trade.id === tradeId ? { ...trade, userNotes: notes } : trade
        );
        syncJournalToLocalStorage(newJournal);
        return newJournal;
    });
  };

  const deleteTrade = (tradeId: string) => {
    setTradeJournal(prev => {
        const newJournal = prev.filter(trade => trade.id !== tradeId);
        syncJournalToLocalStorage(newJournal);
        toast({
          title: 'Trade Deleted',
          description: 'The trade idea has been removed from your journal.',
        })
        return newJournal;
    });
  };

  const spendCredit = () => {
    setCredits((prev) => {
      const newCredits = Math.max(0, prev - 1);
      syncCreditsToLocalStorage(newCredits);
      return newCredits;
    });
  };
  
  const refundCredit = () => {
    setCredits((prev) => {
      const newCredits = prev + 1;
      syncCreditsToLocalStorage(newCredits);
      return newCredits;
    });
  };

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
    spendCredit();

    const result = await generateIdeaAction(query, tradingStyle, screenshotDataUri);

    if (result.success && result.data) {
      const newTrade: TradeIdea = {
        ...result.data,
        id: crypto.randomUUID(),
        status: 'Open',
        timestamp: new Date().toISOString(),
      };
      addTrade(newTrade);
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
      refundCredit();
    }
    setIsGenerating(false);
  };

  return (
    <AppContext.Provider value={{ tradeJournal, credits, isGenerating, handleGenerateIdea, updateTradeNotes, deleteTrade }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
