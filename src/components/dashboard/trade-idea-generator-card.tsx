'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as htmlToImage from 'html-to-image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Lightbulb, Loader, CreditCard, Upload, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketChartCard } from './market-chart-card';
import { Input } from '../ui/input';

const formSchema = z.object({
  tradingStyle: z.enum(['Day Trader', 'Swing Trader']),
  screenshot: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TradeIdeaGeneratorCardProps {
  isGenerating: boolean;
  onGenerate: (tradingStyle: 'Day Trader' | 'Swing Trader', screenshotDataUri: string) => void;
  credits: number;
}

export function TradeIdeaGeneratorCard({ isGenerating, onGenerate, credits }: TradeIdeaGeneratorCardProps) {
  const { toast } = useToast();
  const chartRef = React.useRef<HTMLDivElement>(null);
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

  const onSubmit = async (values: FormValues) => {
    let finalScreenshotDataUri: string | null = screenshotPreview;

    if (!finalScreenshotDataUri) {
      if (!chartRef.current) {
        toast({
          variant: 'destructive',
          title: 'Chart Error',
          description: 'Could not find the chart to screenshot.',
        });
        return;
      }

      try {
        finalScreenshotDataUri = await htmlToImage.toPng(chartRef.current, {
          pixelRatio: 1,
          backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
          imageTimeout: 2000,
        });
      } catch (error) {
        console.error('Could not generate chart screenshot:', error);
        toast({
          variant: 'destructive',
          title: 'Screenshot Failed',
          description: 'Could not capture chart. Please try again or provide a manual upload.',
        });
        return;
      }
    }

    if (!finalScreenshotDataUri) {
        toast({
            variant: 'destructive',
            title: 'Screenshot Missing',
            description: 'Could not generate or find a screenshot for analysis.',
        });
        return;
    }
    
    onGenerate(values.tradingStyle, finalScreenshotDataUri);
    form.reset({ tradingStyle: values.tradingStyle, screenshot: undefined });
    setScreenshotPreview(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <span>AI Trade Generator</span>
        </CardTitle>
        <CardDescription>
          Adjust the chart below, select your trading style, and let the AI find your next trade.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <FormLabel>Live Chart</FormLabel>
              <div className="h-[400px] mt-2 rounded-lg border overflow-hidden bg-background">
                <MarketChartCard ref={chartRef} symbol="NASDAQ:AAPL" className="h-full" />
              </div>
            </div>

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
