'use client';

import * as React from 'react';

interface MarketChartCardProps {
  symbol: string;
  className?: string;
}

export const MarketChartCard = React.forwardRef<HTMLDivElement, MarketChartCardProps>(
  ({ symbol, className }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const container = containerRef.current;
      if (!container || !symbol) return; 

      // On each run, clear the container to ensure a fresh widget.
      container.innerHTML = '';
      
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

      const widgetConfig = {
        "autosize": true,
        "symbol": symbol,
        "interval": "60",
        "timezone": "Etc/UTC",
        "theme": theme,
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true, 
        "save_image": false,
        "calendar": false,
        "details": false,
        "hotlist": false,
        "hide_side_toolbar": false,
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

      // Cleanup when the component unmounts or the symbol changes.
      return () => {
        if (container) {
            container.innerHTML = '';
        }
      };
    }, [symbol]); // Re-run the effect when the symbol changes.

    return (
      <div ref={ref} className={className}>
        <div ref={containerRef} className="tradingview-widget-container h-full w-full" />
      </div>
    );
  }
);

MarketChartCard.displayName = 'MarketChartCard';
