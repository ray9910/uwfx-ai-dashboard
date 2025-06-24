'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Lightbulb, Loader, Save, Search } from 'lucide-react';
import type { GenerateTradingIdeaOutput } from '@/ai/flows/generate-trading-idea';
import { Badge } from '../ui/badge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  query: z.string().min(2, { message: 'Please enter a company name or ticker.' }),
  tradingStyle: z.enum(['Day Trader', 'Swing Trader']),
});

type FormValues = z.infer<typeof formSchema>;

interface TradeIdeaGeneratorCardProps {
  isGenerating: boolean;
  generatedIdea: GenerateTradingIdeaOutput | null;
  onGenerate: (data: FormValues) => void;
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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
      tradingStyle: 'Swing Trader',
    },
  });

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
            <form id="trade-idea-form" onSubmit={form.handleSubmit(onGenerate)} className="w-full space-y-6">
              <div className="text-center text-muted-foreground space-y-2 mb-6">
                <Lightbulb className="h-12 w-12 mx-auto" />
                <h3 className="font-semibold text-lg text-foreground">Find Your Next Trade</h3>
                <p className="text-sm max-w-xs mx-auto">Describe the asset you're interested in, select your trading style, and let our AI find an opportunity for you.</p>
              </div>

              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name or Ticker</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="e.g. 'Apple' or 'AAPL'" className="pl-10" {...field} />
                      </div>
                    </FormControl>
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
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter>
        {generatedIdea ? (
          <div className="w-full flex gap-2">
            <Button variant="outline" className="w-full" onClick={form.handleSubmit(onGenerate)} disabled={isGenerating}>
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
