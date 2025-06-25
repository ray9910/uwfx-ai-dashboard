'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TradeIdea } from '@/types';
import { BookOpen, TrendingUp, TrendingDown, Target, Shield, Percent, Bot, Pencil, Check, Trash2 } from 'lucide-react';
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

interface TradeJournalCardProps {
  journal: TradeIdea[];
  className?: string;
  isGenerating?: boolean;
  hideHeader?: boolean;
}

const StatItem = ({ label, value, variant, icon }: { label: string; value: string | number; variant?: 'default' | 'positive' | 'negative', icon: React.ReactNode }) => {
  const colors = {
    default: 'bg-secondary text-secondary-foreground',
    positive: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    negative: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  }
  return (
      <div className="flex-1 space-y-1 rounded-lg bg-background p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {icon}
            <span>{label}</span>
          </div>
          <p className={`font-semibold text-lg ${variant ? colors[variant] : ''}`}>{value}</p>
      </div>
  )
};

export function TradeJournalCard({ journal, className, isGenerating, hideHeader = false }: TradeJournalCardProps) {
  const { updateTradeNotes, deleteTrade } = useAppContext();
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

  return (
    <Card className={cn(className, "flex flex-col")}>
      {!hideHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span>Trade Journal</span>
          </CardTitle>
          <CardDescription>
              AI-generated trade ideas and analysis. Click on an item to see details.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn("flex-1", { "pt-6": hideHeader })}>
        <AlertDialog>
          <ScrollArea className="h-[600px] pr-4">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {isGenerating && (
                  <Card>
                      <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="space-y-2">
                                  <Skeleton className="h-4 w-[250px]" />
                                  <Skeleton className="h-4 w-[200px]" />
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              )}
              {journal.length > 0 ? (
                journal.map((trade) => {
                  const isEditing = editingNoteId === trade.id;
                  return (
                    <AccordionItem value={trade.id} key={trade.id} className="border-b-0">
                      <Card className="overflow-hidden">
                        <AccordionTrigger className="p-4 hover:no-underline hover:bg-muted/50" onOpenChange={(isOpen) => !isOpen && setEditingNoteId(null)}>
                            <div className="flex flex-1 items-center justify-between gap-4">
                                <div className='flex items-center gap-3'>
                                    <div className={cn("p-2 rounded-full", trade.direction === 'LONG' ? 'bg-success' : 'bg-destructive-muted')}>
                                        {trade.direction === 'LONG' ? <TrendingUp className="h-5 w-5 text-success-strong" /> : <TrendingDown className="h-5 w-5 text-destructive" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-base">{trade.ticker}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(trade.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <Badge variant={trade.direction === 'LONG' ? 'default' : 'destructive'} className={cn(trade.direction === 'LONG' ? "bg-success text-success-foreground" : "bg-destructive-muted text-destructive-muted-foreground")}>{trade.direction}</Badge>
                                    <Badge variant="secondary">{trade.status}</Badge>
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
                              <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg border">{trade.rationale}</p>
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
                                  <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg border flex-1 whitespace-pre-wrap min-h-[100px]">
                                    {trade.userNotes || 'Click "Edit" to add your notes.'}
                                  </p>
                                  <Button size="sm" variant="outline" onClick={() => handleEditClick(trade)}>
                                    <Pencil size={16} /> Edit
                                  </Button>
                                </div>
                              )}
                            </div>
                            <Separator />
                            <div className="flex justify-end pt-4">
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" onClick={() => setTradeToDelete(trade)}>
                                        <Trash2 className="mr-2" />
                                        Delete Trade
                                    </Button>
                                </AlertDialogTrigger>
                            </div>
                          </div>
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  )
                })
              ) : !isGenerating ? (
                 <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border rounded-lg h-80">
                    <Bot className="h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">No saved trades yet.</h3>
                    <p>Use the generator to create your first AI-powered trade idea.</p>
                  </div>
              ) : null}
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