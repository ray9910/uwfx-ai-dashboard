'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { TradeIdea } from '@/types';
import { BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface TradeJournalCardProps {
  journal: TradeIdea[];
}

export function TradeJournalCard({ journal }: TradeJournalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span>Trade Journal</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead className="text-right">Entry</TableHead>
                <TableHead className="text-right">Stop Loss</TableHead>
                <TableHead className="text-right">Take Profit</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journal.length > 0 ? (
                journal.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-medium">{trade.ticker}</TableCell>
                    <TableCell className="text-right">${trade.entry.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-destructive">${trade.stopLoss.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-success-strong">${trade.takeProfit1.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={trade.status === 'Open' ? 'default' : 'secondary'}>
                        {trade.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No saved trades yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
