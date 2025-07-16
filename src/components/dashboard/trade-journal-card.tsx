'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TradeIdea } from '@/types';
import { BookOpen, TrendingUp, TrendingDown, Target, Shield, Percent, Bot, Pencil, Check, Trash2, ChevronDown, Circle, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { useAppContext } from '@/context/app-provider';
import { Button, buttonVariants } from '../ui/button';
import { Textarea } from '../ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TradeJournalCardProps {
  journal: TradeIdea[];
  className?: string;
  isGenerating?: boolean;
  isLoading?: boolean;
  hideHeader?: boolean;
  searchQuery?: string;
}

const StatItem = ({ label, value, variant, icon }: { label: string; value: string | number; variant?: 'default' | 'positive' | 'negative', icon: React.ReactNode }) => {
  const colors = {
    default: 'text-foreground',
    positive: 'text-green-400',
    negative: 'text-red-400',
  }
  return (
      <div className="flex-1 space-y-1 rounded-lg bg-background/50 p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {icon}
            <span>{label}</span>
          </div>
          <p className={`font-semibold text-lg ${variant ? colors[variant] : ''}`}>{value}</p>
      </div>
  )
};

const StatusBadge = ({ status }: { status: TradeIdea['status'] }) => {
  if (status === 'Win') {
    return <Badge className="border-transparent bg-success/80 text-success-foreground hover:bg-success">{status}</Badge>;
  }
  if (status === 'Loss') {
    return <Badge variant="destructive">{status}</Badge>;
  }
  if (status === 'Break-even') {
    return <Badge variant="secondary">{status}</Badge>;
  }
  return <Badge variant="outline">{status}</Badge>;
};

const JournalSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="bg-card/80 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>
        ))}
    </div>
);


export function TradeJournalCard({ journal, className, isGenerating, isLoading, hideHeader = false, searchQuery }: TradeJournalCardProps) {
  const { updateTradeNotes, deleteTrade, updateTradeStatus } = useAppContext();
  const [editingNoteId, setEditingNoteId] = React.useState<string | null>(null);
  const [currentNote, setCurrentNote] = React.useState('');
  const [tradeToDelete, setTradeToDelete] = React.useState<TradeIdea | null>(null);

  const handleEditClick = (trade: TradeIdea) => {
    setEditingNoteId(trade.id);
    setCurrentNote(trade.userNotes || '');
  };

  const handleSaveClick = (tradeId: string) => {
    updateTradeNotes(tradeId, currentNote);
    setEditingNoteId(null);
  };

  const handleCancelClick = () => {
    setEditingNoteId(null);
  };

  const confirmDelete = () => {
    if (tradeToDelete) {
      deleteTrade(tradeToDelete.id);
      setTradeToDelete(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return <JournalSkeleton />;
    }

    if (journal.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg h-full min-h-[400px]">
                <Bot className="h-12 w-12 mb-4" />
                {searchQuery && searchQuery.length > 0 ? (
                  <>
                    <h3 className="text-lg font-semibold text-foreground">No trades found.</h3>
                    <p>Try searching for a different ticker.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-foreground">No saved trades yet.</h3>
                    <p>Use the generator to create your first AI-powered trade idea.</p>
                  </>
                )}
              </div>
        );
    }

    return journal.map((trade) => {
        const isEditing = editingNoteId === trade.id;
        return (
          <AccordionItem value={trade.id} key={trade.id} className="border-b-0">
            <div className="bg-card/80 backdrop-blur-sm border border-white/10 shadow-lg rounded-lg overflow-hidden">
              <AccordionTrigger className="p-4 hover:no-underline hover:bg-white/5 w-full">
                  <div className="flex flex-1 items-center justify-between gap-4">
                      <div className='flex items-center gap-3'>
                          <div className={cn("p-2 rounded-lg", trade.direction === 'LONG' ? 'bg-success/80' : 'bg-destructive/80')}>
                              {trade.direction === 'LONG' ? <TrendingUp className="h-5 w-5 text-success-foreground" /> : <TrendingDown className="h-5 w-5 text-destructive-foreground" />}
                          </div>
                          <div>
                              <p className="font-bold text-base">{trade.ticker}</p>
                              <p className="text-xs text-muted-foreground">{new Date(trade.timestamp).toLocaleString()}</p>
                          </div>
                      </div>
                      <div className='flex items-center gap-4'>
                          <Badge variant={trade.direction === 'LONG' ? 'default' : 'destructive'} className={cn(trade.direction === 'LONG' ? "bg-success/80 text-success-foreground" : "bg-destructive/80 text-destructive-foreground")}>{trade.direction}</Badge>
                          <StatusBadge status={trade.status} />
                      </div>
                  </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <StatItem label="Entry" value={`$${trade.entry.toFixed(2)}`} icon={<TrendingUp size={16}/>} />
                    <StatItem label="Stop Loss" value={`$${trade.stopLoss.toFixed(2)}`} variant="negative" icon={<Shield size={16}/>}/>
                    <StatItem label="Confidence" value={`${trade.confidence}%`} icon={<Percent size={16}/>}/>
                  </div>
                   <div className="flex flex-col sm:flex-row gap-4">
                    <StatItem label="Take Profit 1" value={`$${trade.takeProfit1.toFixed(2)}`} variant="positive" icon={<Target size={16}/>}/>
                    <StatItem label="Take Profit 2" value={`$${trade.takeProfit2.toFixed(2)}`} variant="positive" icon={<Target size={16}/>}/>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><Bot size={16}/> Rationale</h4>
                    <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border">{trade.rationale}</p>
                  </div>

                   <div>
                    <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><Pencil size={16}/> My Thoughts</h4>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add your thoughts on this trade..."
                          value={currentNote}
                          onChange={(e) => setCurrentNote(e.target.value)}
                          rows={4}
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveClick(trade.id)}>
                            <Check size={16} /> Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelClick}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border flex-1 whitespace-pre-wrap min-h-[100px]">
                          {trade.userNotes || 'Click "Edit" to add your notes.'}
                        </p>
                        <Button size="sm" variant="outline" onClick={() => handleEditClick(trade)}>
                          <Pencil size={16} /> Edit
                        </Button>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-muted-foreground">Status:</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-[150px] justify-between">
                                    {trade.status} <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[150px]">
                                <DropdownMenuLabel>Set Outcome</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => updateTradeStatus(trade.id, 'Open')}>
                                    <Circle className="mr-2 h-4 w-4" />
                                    <span>Open</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => updateTradeStatus(trade.id, 'Win')}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-success-strong" />
                                    <span>Win</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => updateTradeStatus(trade.id, 'Loss')}>
                                    <XCircle className="mr-2 h-4 w-4 text-destructive" />
                                    <span>Loss</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => updateTradeStatus(trade.id, 'Break-even')}>
                                    <MinusCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>Break-even</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <AlertDialogTrigger asChild>
                          <Button variant="destructive" onClick={() => setTradeToDelete(trade)}>
                              <Trash2 className="mr-2" />
                              Delete Trade
                          </Button>
                      </AlertDialogTrigger>
                  </div>
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        )
      })
  }

  return (
    <Card className={cn(className, "flex flex-col bg-transparent border-0 shadow-none")}>
      {!hideHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6" />
            <span>Recent Analyses</span>
          </CardTitle>
          <CardDescription>
              Your AI-generated trade ideas. Click to expand.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn("flex-1", { "pt-6": hideHeader })}>
        <AlertDialog>
          <ScrollArea className="h-[600px] -mr-4 pr-4">
            <Accordion type="single" collapsible className="w-full space-y-4" onValueChange={() => setEditingNoteId(null)}>
              {isGenerating && <JournalSkeleton />}
              {renderContent()}
            </Accordion>
          </ScrollArea>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the trade idea for <span className="font-semibold">{tradeToDelete?.ticker}</span> from your journal.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className={cn(buttonVariants({ variant: "destructive" }))}>
                      Delete
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
