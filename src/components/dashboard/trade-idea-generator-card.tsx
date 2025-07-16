
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Lightbulb, Loader, CreditCard, Upload, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  tradingStyle: z.enum(['Day Trader', 'Swing Trader']),
  screenshot: z
    .any()
    .refine((files) => files?.length === 1, 'A chart screenshot is required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface TradeIdeaGeneratorCardProps {
  isGenerating: boolean;
  onGenerate: (tradingStyle: 'Day Trader' | 'Swing Trader', screenshotDataUri: string) => void;
  credits: number;
}

export function TradeIdeaGeneratorCard({ isGenerating, onGenerate, credits }: TradeIdeaGeneratorCardProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [screenshotPreview, setScreenshotPreview] = React.useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [formData, setFormData] = React.useState<FormValues | null>(null);


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
    if (!screenshotPreview) {
        toast({
            variant: 'destructive',
            title: 'Screenshot Missing',
            description: 'Please upload a chart screenshot for analysis.',
        });
        return;
    }
    setFormData(values);
    setShowConfirmDialog(true);
  };

  const handleConfirmGenerate = () => {
    if (formData && screenshotPreview) {
      onGenerate(formData.tradingStyle, screenshotPreview);
      form.reset();
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setScreenshotPreview(null);
      setFormData(null);
    }
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Card className="bg-card/80 backdrop-blur-sm border-white/10 shadow-lg h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <span>AI Trade Generator</span>
          </CardTitle>
          <CardDescription>
            Upload a chart and let our AI find your next trade.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
            <CardContent className="space-y-6 flex-1">
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
                    <FormLabel>Upload Chart Screenshot</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none">
                          {screenshotPreview ? <ImageIcon/> : <Upload />}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          className="pl-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          ref={(e) => {
                            field.ref(e);
                            fileInputRef.current = e;
                          }}
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
            <CardFooter className="flex-col items-stretch gap-4 mt-auto">
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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm Chart Analysis</AlertDialogTitle>
                <AlertDialogDescription>
                    This will use 1 credit. Are you sure you want to analyze this chart?
                </AlertDialogDescription>
            </AlertDialogHeader>
            {screenshotPreview && (
                <div className="mt-4 border rounded-lg p-2 bg-background">
                    <img src={screenshotPreview} alt="Screenshot preview" className="rounded-md w-full max-h-64 object-contain" />
                </div>
            )}
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setFormData(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmGenerate} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : "Confirm & Generate"}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
