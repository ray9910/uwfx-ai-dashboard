'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { checkApiKeys, suggestTickersAction } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Newspaper, Search } from 'lucide-react';
import { MarketChartCard } from '@/components/dashboard/market-chart-card';
import { NewsFeedCard } from '@/components/dashboard/news-feed-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import type { TickerSuggestion } from '@/types';

export default function ChartsPage() {
  const [apiKeys, setApiKeys] = React.useState({ twelveData: true, newsApi: true });
  const [selectedSymbol, setSelectedSymbol] = React.useState('AAPL');
  
  const [searchQuery, setSearchQuery] = React.useState(selectedSymbol);
  const [suggestions, setSuggestions] = React.useState<TickerSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    async function checkKeys() {
      const keys = await checkApiKeys();
      setApiKeys(keys);
    }
    checkKeys();
  }, []);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchQuery.length < 2 || debouncedSearchQuery === selectedSymbol) {
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
  }, [debouncedSearchQuery, selectedSymbol]);

  const handleSuggestionSelect = (suggestion: TickerSuggestion) => {
    setSearchQuery(suggestion.symbol);
    setSelectedSymbol(suggestion.symbol);
    setIsPopoverOpen(false);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedSymbol(searchQuery);
    setIsPopoverOpen(false);
  };

  return (
    <div className="flex flex-col min-h-svh p-4 md:p-6 lg:p-8">
      <div className="bg-card rounded-xl border p-4 sm:p-6 lg:p-8 w-full flex-1 flex flex-col">
        <header className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SidebarTrigger />
            </div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              <Newspaper className="h-6 w-6" />
              Charts & News
            </h1>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full max-w-sm">
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
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="end">
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
        </header>

        {(!apiKeys.twelveData || !apiKeys.newsApi) && (
          <Alert variant="destructive" className="mb-8">
            <Terminal className="h-4 w-4" />
            <AlertTitle>API Key(s) Missing!</AlertTitle>
            <AlertDescription>
              The application is running in a limited mode. Please add your{' '}
              {!apiKeys.twelveData && <strong>TWELVE_DATA_API_KEY</strong>}
              {!apiKeys.twelveData && !apiKeys.newsApi && ' and '}
              {!apiKeys.newsApi && <strong>NEWS_API_KEY</strong>} to the{' '}
              <code>.env</code> file in the project root to enable all features.
            </AlertDescription>
          </Alert>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          <div className="lg:col-span-2">
            <MarketChartCard 
              symbol={selectedSymbol} 
            />
          </div>
          <div className="lg:col-span-1">
            <NewsFeedCard symbol={selectedSymbol} />
          </div>
        </main>
      </div>
    </div>
  );
}
