'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandlestickChart, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ChartCardProps {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
  className?: string;
}

const formSchema = z.object({
  symbol: z.string().min(1, 'Symbol cannot be empty.'),
});

export function ChartCard({ symbol, onSymbolChange, className }: ChartCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: symbol,
    },
  });

  useEffect(() => {
    form.setValue('symbol', symbol);
  }, [symbol, form]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: symbol,
        allow_symbol_change: true,
        calendar: false,
        details: false,
        hide_side_toolbar: true,
        hide_top_toolbar: false,
        hide_legend: false,
        hide_volume: false,
        hotlist: false,
        interval: 'D',
        locale: 'en',
        save_image: true,
        style: '1',
        theme: 'light',
        timezone: 'Etc/UTC',
        backgroundColor: '#ffffff',
        gridColor: 'rgba(46, 46, 46, 0.06)',
        watchlist: [],
        withdateranges: false,
        compareSymbols: [],
        studies: [],
        autosize: true,
      });
      containerRef.current.appendChild(script);
    }
  }, [symbol]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSymbolChange(values.symbol.toUpperCase());
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <CandlestickChart className="h-6 w-6" />
            <span>Market Overview</span>
          </CardTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-start gap-2"
            >
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-auto">
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="e.g. AAPL, XAUUSD"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Load</Button>
            </form>
          </Form>
        </div>
      </CardHeader>
      <CardContent className="h-96 w-full p-0">
        <div
          className="tradingview-widget-container h-full w-full"
          ref={containerRef}
        >
          <div
            className="tradingview-widget-container__widget"
            style={{ height: 'calc(100% - 32px)', width: '100%' }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}
