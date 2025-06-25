'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import type { TickerSuggestion } from '@/types';
import { suggestTickersAction } from '@/lib/actions';

declare const TradingView: any;

interface MarketChartCardProps {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export function MarketChartCard({ symbol, onSymbolChange }: MarketChartCardProps) {
  const [searchQuery, setSearchQuery] = React.useState(symbol);
  const [suggestions, setSuggestions] = React.useState<TickerSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetId = React.useId().replace(/:/g, '');
  const containerId = `tradingview-widget-container-${widgetId}`;
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchQuery.length < 2 || debouncedSearchQuery === symbol) {
        setSuggestions([]);
        return;
      }
      setIsSuggestionsLoading(true);
      const result = await suggestTickersAction(debouncedSearchQuery);
      if (result.success && result.data) {
        setSuggestions(result.data);
      } else {
        setSuggestions([]);
      }
      setIsSuggestionsLoading(false);
    };

    fetchSuggestions();
  }, [debouncedSearchQuery, symbol]);


  React.useEffect(() => {
    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    const createWidget = () => {
       if (containerRef.current && typeof TradingView !== 'undefined') {
        containerRef.current.innerHTML = '';
        
        new TradingView.widget({
          "width": "100%",
          "height": 500,
          "symbol": symbol,
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": document.documentElement.classList.contains('dark') ? 'dark' : 'light',
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "allow_symbol_change": false,
          "container_id": containerId,
        });
      }
    }

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = createWidget;
      document.body.appendChild(script);
    } else if (typeof TradingView !== 'undefined') {
      createWidget();
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, containerId]);

  const handleSuggestionSelect = (suggestion: TickerSuggestion) => {
    setSearchQuery(suggestion.symbol);
    onSymbolChange(suggestion.symbol);
    setIsPopoverOpen(false);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSymbolChange(searchQuery);
    setIsPopoverOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Chart</CardTitle>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 pt-2">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g. 'Apple' or 'AAPL'"
                    className="pl-10"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search for a stock..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    isLoading={isSuggestionsLoading}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {suggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion.symbol}
                          value={`${suggestion.symbol} - ${suggestion.companyName}`}
                          onSelect={() => handleSuggestionSelect(suggestion)}
                        >
                          <strong>{suggestion.symbol}</strong>
                          <span className="ml-2 text-muted-foreground">{suggestion.companyName}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          <Button type="submit">Load</Button>
        </form>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} id={containerId} className="tradingview-widget-container h-[500px]" />
      </CardContent>
    </Card>
  );
}
