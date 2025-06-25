'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';

declare const TradingView: any;

interface MarketChartCardProps {
  symbol: string;
}

export function MarketChartCard({ symbol }: MarketChartCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetId = React.useId().replace(/:/g, '');
  const containerId = `tradingview-widget-container-${widgetId}`;
  
  React.useEffect(() => {
    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    const createWidget = () => {
       if (containerRef.current && typeof TradingView !== 'undefined' && symbol) {
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

  return (
    <Card>
      <CardContent className="pt-6">
        <div ref={containerRef} id={containerId} className="tradingview-widget-container h-[500px]" />
      </CardContent>
    </Card>
  );
}
