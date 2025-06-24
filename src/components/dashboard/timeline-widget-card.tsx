'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineWidgetCardProps {
  className?: string;
}

export function TimelineWidgetCard({ className }: TimelineWidgetCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScriptAppended = useRef(false);

  useEffect(() => {
    if (containerRef.current && !isScriptAppended.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
          "displayMode": "regular",
          "feedMode": "symbol",
          "symbol": "BITSTAMP:BTCUSD",
          "colorTheme": "light",
          "isTransparent": false,
          "locale": "en",
          "width": "100%",
          "height": 550
      });
      containerRef.current.appendChild(script);
      isScriptAppended.current = true;
    }
  }, []);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6" />
          <span>Market Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="tradingview-widget-container" ref={containerRef} style={{height: '550px', width: '100%'}}>
          <div className="tradingview-widget-container__widget"></div>
          <div className="tradingview-widget-copyright" style={{textAlign: 'center', fontSize: '13px'}}>
            <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank" style={{ color: '#2962FF', textDecoration: 'none' }}>
              <span>Track all markets on TradingView</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
