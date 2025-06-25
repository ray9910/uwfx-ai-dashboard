'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as htmlToImage from 'html-to-image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Lightbulb, Loader, Upload, ImageIcon, Search, CreditCard } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useDebounce } from '@/hooks/use-debounce';
import type { TickerSuggestion } from '@/types';
import { suggestTickersAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { ChartPreviewCard } from './chart-preview-card';

const formSchema = z.object({
  query: z.string().min(1, 'Please select a valid asset.'),
  tradingStyle: z.enum(['Day Trader', 'Swing Trader']),
  screenshot: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TradeIdeaGeneratorCardProps {
  isGenerating: boolean;
  onGenerate: (query: string, tradingStyle: 'Day Trader' | 'Swing Trader', screenshotDataUri: string | null) => void;
  credits: number;
}

export function TradeIdeaGeneratorCard({ isGenerating, onGenerate, credits }: TradeIdeaGeneratorCardProps) {
  const { toast } = useToast();
  const [screenshotPreview, setScreenshotPreview] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<TickerSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [previewSymbol, setPreviewSymbol] = React.useState<string | null>(null);
  const chartPreviewRef = React.useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      tradingStyle: 'Swing Trader',
    },
  });

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchQuery.length < 1) {
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
  }, [debouncedSearchQuery]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshotPreview(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    let finalScreenshotDataUri = screenshotPreview;

    if (!finalScreenshotDataUri && chartPreviewRef.current) {
      try {
        finalScreenshotDataUri = await htmlToImage.toPng(chartPreviewRef.current, {
          backgroundColor: document.documentElement.classList.contains('dark') ? '#0c0a09' : '#ffffff',
          // Ensure the iframe content is loaded before capturing
          // This is a simple delay, more robust solutions might be needed for complex charts
          imageTimeout: 2000, 
        });
      } catch (error) {
        console.error('Could not generate chart screenshot:', error);
        toast({
          variant: 'destructive',
          title: 'Screenshot Failed',
          description: 'Could not capture chart. Please upload one manually or try again.',
        });
      }
    }

    onGenerate(values.query, values.tradingStyle, finalScreenshotDataUri);
    form.reset({ query: values.query, tradingStyle: values.tradingStyle, screenshot: undefined });
    setScreenshotPreview(null);
    setPreviewSymbol(values.query); // Keep the preview visible after generation
  };

  const handleSuggestionSelect = (suggestion: TickerSuggestion) => {
    form.setValue('query', suggestion.symbol);
    setSearchQuery(suggestion.symbol);
    setPreviewSymbol(suggestion.symbol);
    setIsPopoverOpen(false);
    setSuggestions([]);
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <span>AI Trade Generator</span>
        </CardTitle>
        <CardDescription>
          Select an asset, your trading style, and let the AI find your next trade.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Asset Symbol or Company</FormLabel>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="e.g. 'Apple' or 'AAPL'"
                            className="pl-10"
                            autoComplete="off"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              field.onChange(e.target.value);
                              if (e.target.value !== form.getValues('query')) {
                                setPreviewSymbol(null);
                              }
                               if (e.target.value.length > 0 && !isPopoverOpen) {
                                setIsPopoverOpen(true);
                              }
                            }}
                          />
                        </div>
                      </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewSymbol && !screenshotPreview && (
              <div className="space-y-2">
                <FormLabel>Chart Preview</FormLabel>
                <ChartPreviewCard symbol={previewSymbol} ref={chartPreviewRef} />
              </div>
            )}

            <FormField
              control={form.control}
              name="tradingStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trading Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trading style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Day Trader">Day Trader</SelectItem>
                      <SelectItem value="Swing Trader">Swing Trader</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="screenshot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Override Screenshot (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none">
                        {screenshotPreview ? <ImageIcon/> : <Upload />}
                       </div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="pl-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handleFileChange(e);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {screenshotPreview && (
              <div className="mt-4 border rounded-lg p-2 bg-background">
                <img src={screenshotPreview} alt="Screenshot preview" className="rounded-md w-full max-h-48 object-contain" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
             <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>{credits} Credits Remaining</span>
              </div>
            <Button type="submit" className="w-full" disabled={isGenerating || credits <= 0}>
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generate New Idea (1 Credit)
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
