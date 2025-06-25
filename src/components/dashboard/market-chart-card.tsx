'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MarketChartCardProps {
  symbol: string;
}

export function MarketChartCard({ symbol }: MarketChartCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    const createWidget = () => {
      container.innerHTML = '';
      
      const theme = getTheme();

      const widgetConfig = {
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "timezone": "Etc/UTC",
        "theme": theme,
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "save_image": true,
        "details": false,
        "hotlist": false,
        "calendar": false,
        "withdateranges": false,
        "hide_side_toolbar": false,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "watchlist": [],
        "compareSymbols": [],
        "studies": [],
        // Match the card background color from globals.css
        "backgroundColor": theme === 'dark' ? 'hsl(231 15% 12%)' : 'hsl(225 47% 95%)',
        "gridColor": theme === 'dark' ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.innerHTML = JSON.stringify(widgetConfig);

      container.appendChild(script);
    };

    createWidget();

    const observer = new MutationObserver(() => {
        createWidget();
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      if (container) {
          container.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <Card className="h-[550px]">
      <CardContent className="pt-6 h-full">
        <div ref={containerRef} className="tradingview-widget-container h-full" />
      </CardContent>
    </Card>
  );
}
