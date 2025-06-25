'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MarketChartCardProps {
  symbol: string;
}

// This component uses the TradingView Advanced Real-Time Chart Widget.
// It works by creating a script tag with a JSON configuration and appending it to the DOM.
// The script then finds its container and replaces it with an iframe.
export function MarketChartCard({ symbol }: MarketChartCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [theme, setTheme] = React.useState('light');

  // Helper function to get the current theme from the document
  const getAppTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  // Effect to detect theme changes on the root element
  React.useEffect(() => {
    setTheme(getAppTheme()); // Set initial theme

    const observer = new MutationObserver(() => {
      setTheme(getAppTheme());
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Re-create the widget whenever the symbol or theme changes
  React.useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    
    // Configuration object for the TradingView widget, based on your request
    const widgetConfig = {
      "autosize": true,
      "symbol": symbol,
      "interval": "30",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1",
      "locale": "en",
      "allow_symbol_change": true,
      "save_image": true,
      "details": true,
      "hotlist": false,
      "calendar": false,
      "withdateranges": true,
      "range": "3M",
      "hide_side_toolbar": false,
      "backgroundColor": theme === 'dark' ? "hsl(var(--card))" : "hsl(var(--background))",
      "gridColor": theme === 'dark' ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify(widgetConfig);

    // Clear the container and append the new script to re-initialize the widget
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);

  }, [symbol, theme]);

  return (
    <Card className="h-[550px]">
      <CardContent className="pt-6 h-full">
        {/* This div is the container where the TradingView widget will be rendered */}
        <div ref={containerRef} className="tradingview-widget-container h-full" />
      </CardContent>
    </Card>
  );
}
