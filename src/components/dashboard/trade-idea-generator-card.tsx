'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Lightbulb, Loader, Save, Upload, ImageIcon } from 'lucide-react';
import type { GenerateTradingIdeaOutput } from '@/ai/flows/generate-trading-idea';
import { Badge } from '../ui/badge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  tradingStyle: z.enum(['Day Trader', 'Swing Trader']),
  screenshot: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TradeIdeaGeneratorCardProps {
  selectedSymbol: string;
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


export function TradeIdeaGeneratorCard({ selectedSymbol, isGenerating, generatedIdea, onGenerate, onSave }: TradeIdeaGeneratorCardProps) {
  const [screenshotPreview, setScreenshotPreview] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tradingStyle: 'Swing Trader',
    },
  });

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
    form.reset({ tradingStyle: form.getValues('tradingStyle'), screenshot: undefined });
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
      <CardContent className="flex-grow">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground h-full">
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <p className="font-medium">Analyzing market data for {selectedSymbol}...</p>
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
          <div className='flex flex-col gap-6'>
            <div className="w-full text-center p-4 border rounded-lg bg-background">
              <p className="text-sm text-muted-foreground">Asset for Analysis</p>
              <p className="text-xl font-bold text-primary">{selectedSymbol}</p>
            </div>
            <Form {...form}>
              <form id="trade-idea-form" onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
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
          </div>
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
          <Button form="trade-idea-form" type="submit" className="w-full" disabled={isGenerating || !selectedSymbol}>
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
