'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Lightbulb, Loader, Save, Search, Upload, ImageIcon } from 'lucide-react';
import type { GenerateTradingIdeaOutput } from '@/ai/flows/generate-trading-idea';
import { Badge } from '../ui/badge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { suggestTickersAction } from '@/lib/actions';
import type { TickerSuggestion } from '@/types';

const formSchema = z.object({
  query: z.string().min(1, { message: 'Please enter a company name or ticker.' }),
  tradingStyle: z.enum(['Day Trader', 'Swing Trader']),
  screenshot: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TradeIdeaGeneratorCardProps {
  isGenerating: boolean;
  generatedIdea: GenerateTradingIdeaOutput | null;
  onGenerate: (data: Omit<FormValues, 'screenshot'>, screenshotDataUri: string | null) => void;
  onSave: (idea: GenerateTradingIdeaOutput) => void;
}

const StatItem = ({ label, value, variant = 'default' }: { label: string; value: string | number; variant?: 'default' | 'positive' | 'negative' }) => {
    const colors = {
        default: 'bg-secondary text-secondary-foreground',
        positive: 'bg-success text-success-foreground',
        negative: 'bg-destructive-muted text-destructive-muted-foreground',
    }
    return (
        <div className="flex justify-between items-center p-3 rounded-lg bg-background">
            <span className="text-sm text-muted-foreground">{label}</span>
            <Badge className={`font-semibold text-sm ${colors[variant]}`}>{value}</Badge>
        </div>
    )
};


export function TradeIdeaGeneratorCard({ isGenerating, generatedIdea, onGenerate, onSave }: TradeIdeaGeneratorCardProps) {
  const [screenshotPreview, setScreenshotPreview] = React.useState<string | null>(null);

  const [suggestions, setSuggestions] = React.useState<TickerSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedTicker, setSelectedTicker] = React.useState<TickerSuggestion | null>(null);
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const suggestionsContainerRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      tradingStyle: 'Swing Trader',
    },
  });

  const queryValue = form.watch('query');

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsContainerRef.current && !suggestionsContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (selectedTicker && queryValue !== selectedTicker.symbol) {
        setSelectedTicker(null);
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (!queryValue || queryValue.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setShowSuggestions(true);
    setIsSuggestionsLoading(true);
    
    debounceTimeoutRef.current = setTimeout(async () => {
      const result = await suggestTickersAction(queryValue);
      if (result.success && result.data) {
        setSuggestions(result.data);
      } else {
        setSuggestions([]);
        console.error("Failed to fetch suggestions:", result.error);
      }
      setIsSuggestionsLoading(false);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [queryValue, selectedTicker]);
  
  const handleSuggestionClick = (suggestion: TickerSuggestion) => {
    setSelectedTicker(suggestion);
    form.setValue('query', suggestion.symbol, { shouldValidate: true });
    setShowSuggestions(false);
  };

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

  const onSubmit = (values: FormValues) => {
    const { screenshot, ...rest } = values;
    onGenerate(rest, screenshotPreview);
  };

  const handleGenerateClick = () => {
    setScreenshotPreview(null);
    setSelectedTicker(null);
    form.reset({ query: form.getValues('query'), tradingStyle: form.getValues('tradingStyle'), screenshot: undefined });
    form.handleSubmit(onSubmit)();
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <span>AI Trade Idea Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <p className="font-medium">Analyzing market data...</p>
            <p className="text-sm text-center">Our AI is crafting a new trading idea for you.</p>
          </div>
        ) : generatedIdea ? (
          <div className="w-full space-y-4">
            <div className='space-y-2'>
                <StatItem label="Ticker" value={generatedIdea.ticker} />
                <StatItem label="Entry Price" value={`$${generatedIdea.entry}`} />
                <StatItem label="Stop Loss" value={`$${generatedIdea.stopLoss}`} variant="negative"/>
                <StatItem label="Take Profit 1" value={`$${generatedIdea.takeProfit1}`} variant="positive" />
                <StatItem label="Take Profit 2" value={`$${generatedIdea.takeProfit2}`} variant="positive" />
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">Rationale:</h4>
              <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg border">{generatedIdea.rationale}</p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form id="trade-idea-form" onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <div className="text-center text-muted-foreground space-y-2 mb-6">
                <Lightbulb className="h-12 w-12 mx-auto" />
                <h3 className="font-semibold text-lg text-foreground">Find Your Next Trade</h3>
                <p className="text-sm max-w-xs mx-auto">Describe the asset, upload a chart screenshot, select your trading style, and let our AI find an opportunity for you.</p>
              </div>

              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name or Ticker</FormLabel>
                    <FormControl>
                      <div className="relative" ref={suggestionsContainerRef}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="e.g. 'Apple' or 'AAPL'" 
                          className="pl-10" 
                          {...field}
                          autoComplete="off"
                          onFocus={() => {
                            if (field.value?.length > 1 && suggestions.length > 0) {
                              setShowSuggestions(true);
                            }
                          }}
                        />
                        {showSuggestions && (
                          <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {isSuggestionsLoading ? (
                              <div className="flex items-center justify-center p-3 text-sm text-muted-foreground">
                                <Loader className="h-4 w-4 mr-2 animate-spin" />
                                Loading...
                              </div>
                            ) : suggestions.length > 0 ? (
                              <ul>
                                {suggestions.map((s) => (
                                  <li
                                    key={s.symbol}
                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleSuggestionClick(s);
                                    }}
                                  >
                                    <span className="font-semibold">{s.symbol}</span>
                                    <span className="ml-2 text-muted-foreground">{s.companyName}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="p-3 text-sm text-center text-muted-foreground">
                                No suggestions found.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {selectedTicker && (
                        <p className="text-sm text-muted-foreground pt-1">
                            Selected: <span className="font-semibold text-foreground">{selectedTicker.companyName} ({selectedTicker.symbol})</span>
                        </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                    <FormLabel>Upload Chart Screenshot (Optional)</FormLabel>
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

            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter>
        {generatedIdea ? (
          <div className="w-full flex gap-2">
            <Button variant="outline" className="w-full" onClick={handleGenerateClick} disabled={isGenerating}>
              {isGenerating ? <Loader className="animate-spin" /> : <Lightbulb />}
              Generate Another
            </Button>
            <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => onSave(generatedIdea)}>
              <Save />
              Save to Journal
            </Button>
          </div>
        ) : (
          <Button form="trade-idea-form" type="submit" className="w-full" disabled={isGenerating}>
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
        )}
      </CardFooter>
    </Card>
  );
}
