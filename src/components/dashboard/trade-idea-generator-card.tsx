'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Lightbulb, Loader, Save } from 'lucide-react';
import type { GenerateTradingIdeaOutput } from '@/ai/flows/generate-trading-idea';
import { Badge } from '../ui/badge';

interface TradeIdeaGeneratorCardProps {
  isGenerating: boolean;
  generatedIdea: GenerateTradingIdeaOutput | null;
  onGenerate: () => void;
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
          <div className="text-center text-muted-foreground space-y-3">
            <Lightbulb className="h-12 w-12 mx-auto" />
            <h3 className="font-semibold text-lg text-foreground">Ready for a new idea?</h3>
            <p className="text-sm max-w-xs mx-auto">Click the button below to use one credit and let our AI generate a fresh trading idea based on the latest market data.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {generatedIdea ? (
          <div className="w-full flex gap-2">
            <Button variant="outline" className="w-full" onClick={onGenerate} disabled={isGenerating}>
              {isGenerating ? <Loader className="animate-spin" /> : <Lightbulb />}
              Generate Another
            </Button>
            <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => onSave(generatedIdea)}>
              <Save />
              Save to Journal
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={onGenerate} disabled={isGenerating}>
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
