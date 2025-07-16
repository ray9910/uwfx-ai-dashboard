
'use client';

import * as React from 'react';
import type { TradeIdea } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { generateIdeaAction } from '@/lib/actions';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  increment,
  writeBatch,
  getDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';


interface AppContextType {
  tradeJournal: TradeIdea[];
  credits: number;
  isGenerating: boolean;
  isLoadingData: boolean;
  handleGenerateIdea: (tradingStyle: 'Day Trader' | 'Swing Trader', screenshotDataUri: string) => Promise<void>;
  updateTradeNotes: (tradeId: string, notes: string) => void;
  deleteTrade: (tradeId: string) => void;
  updateTradeStatus: (tradeId: string, status: TradeIdea['status']) => void;
}

const AppContext = React.createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [tradeJournal, setTradeJournal] = React.useState<TradeIdea[]>([]);
  const [credits, setCredits] = React.useState(0);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      setIsLoadingData(true);
      
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeCredits = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setCredits(docSnap.data().credits ?? 0);
        } else {
          console.error("User document not found, cannot load credits.");
        }
      });

      const journalCollectionRef = collection(db, 'users', user.uid, 'journal');
      const q = query(journalCollectionRef, orderBy('timestamp', 'desc'));
      const unsubscribeJournal = onSnapshot(q, (querySnapshot) => {
        const journalData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                timestamp: data.timestamp?.toDate().toISOString() ?? new Date().toISOString(),
            } as TradeIdea
        });
        setTradeJournal(journalData);
        setIsLoadingData(false);
      }, (error) => {
        console.error("Error fetching journal:", error);
        setIsLoadingData(false);
      });

      return () => {
        unsubscribeCredits();
        unsubscribeJournal();
      };
    } else {
      // Not logged in
      setTradeJournal([]);
      setCredits(0);
      setIsLoadingData(false);
    }
  }, [user]);

  const updateTradeNotes = async (tradeId: string, notes: string) => {
    if (!user) return;
    const tradeDocRef = doc(db, 'users', user.uid, 'journal', tradeId);
    await updateDoc(tradeDocRef, { userNotes: notes });
    toast({ title: 'Notes Updated' });
  };
  
  const updateTradeStatus = async (tradeId: string, status: TradeIdea['status']) => {
    if (!user) return;
    const tradeDocRef = doc(db, 'users', user.uid, 'journal', tradeId);
    await updateDoc(tradeDocRef, { status });
    toast({
      title: 'Trade Status Updated',
      description: `The trade status has been set to ${status}.`,
    });
  };

  const deleteTrade = async (tradeId: string) => {
    if (!user) return;
    const tradeDocRef = doc(db, 'users', user.uid, 'journal', tradeId);
    await deleteDoc(tradeDocRef);
    toast({
      title: 'Trade Deleted',
      description: 'The trade idea has been removed from your journal.',
    })
  };

  const handleGenerateIdea = async (tradingStyle: 'Day Trader' | 'Swing Trader', screenshotDataUri: string) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to generate an idea.' });
        return;
    }
    if (credits <= 0) {
      toast({
        variant: 'destructive',
        title: 'Out of Credits',
        description: 'Please purchase more credits to generate ideas.',
      });
      return;
    }
    
    setIsGenerating(true);
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { credits: increment(-1) });

    const result = await generateIdeaAction(tradingStyle, screenshotDataUri);

    if (result.success && result.data) {
      const journalCollectionRef = collection(db, 'users', user.uid, 'journal');
      await addDoc(journalCollectionRef, {
        ...result.data,
        status: 'Open',
        timestamp: serverTimestamp(),
      });
      toast({
        title: 'New Trading Idea Generated',
        description: `The new idea for ${result.data.ticker} has been added to your journal.`,
      });
    } else {
      await updateDoc(userDocRef, { credits: increment(1) }); // Refund credit on failure
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }
    setIsGenerating(false);
  };

  const contextValue = {
    tradeJournal,
    credits,
    isGenerating,
    isLoadingData,
    handleGenerateIdea,
    updateTradeNotes,
    deleteTrade,
    updateTradeStatus,
  };

  return (
    <AppContext.Provider value={contextValue}>
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
