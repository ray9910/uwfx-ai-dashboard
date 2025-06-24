'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandlestickChart } from 'lucide-react';

interface ChartCardProps {
  className?: string;
}

export function ChartCard({ className }: ChartCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScriptAppended = useRef(false);

  useEffect(() => {
    if (containerRef.current && !isScriptAppended.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
          "allow_symbol_change": true,
          "calendar": false,
          "details": false,
          "hide_side_toolbar": true,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_volume": false,
          "hotlist": false,
          "interval": "D",
          "locale": "en",
          "save_image": true,
          "style": "1",
          "symbol": "NASDAQ:MSFT",
          "theme": "light",
          "timezone": "Etc/UTC",
          "backgroundColor": "#ffffff",
          "gridColor": "rgba(46, 46, 46, 0.06)",
          "watchlist": [],
          "withdateranges": false,
          "compareSymbols": [],
          "studies": [],
          "autosize": true
      });
      containerRef.current.appendChild(script);
      isScriptAppended.current = true;
    }
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CandlestickChart className="h-6 w-6" />
          <span>Market Overview (MSFT)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-96 w-full p-0">
        <div className="tradingview-widget-container h-full w-full" ref={containerRef}>
          <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
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
