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
    if (!container || !symbol) return;

    const getTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    const createWidget = () => {
      // Ensure the container is empty before creating a new widget.
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
        "calendar": false,
        "details": false,
        "hotlist": false,
        "hide_side_toolbar": true,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "withdateranges": false,
        "watchlist": [],
        "compareSymbols": [],
        "studies": [],
        "backgroundColor": "transparent",
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

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          createWidget();
          return;
        }
      }
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
    <Card className="h-[550px] bg-transparent">
      <CardContent className="pt-6 h-full">
        <div ref={containerRef} className="tradingview-widget-container h-full" />
      </CardContent>
    </Card>
  );
}
