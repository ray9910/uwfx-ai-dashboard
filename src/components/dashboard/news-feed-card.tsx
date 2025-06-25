'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

// This component uses the TradingView Timeline Widget.
export function NewsFeedCard() {
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
  
  // Re-create the widget whenever the theme changes
  React.useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    
    // Configuration for the TradingView Timeline Widget
    const widgetConfig = {
      "displayMode": "regular",
      "feedMode": "all_symbols",
      "colorTheme": theme,
      "isTransparent": false,
      "locale": "en",
      "largeChartUrl": "/charts",
      "width": "100%",
      "height": "100%"
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.innerHTML = JSON.stringify(widgetConfig);

    // Clear the container and append the new script to re-initialize the widget
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(script);

  }, [theme]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          <span>Market Timeline</span>
        </CardTitle>
        <CardDescription>Latest news and events across all markets.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        {/* This div is the container where the TradingView widget will be rendered */}
        <div ref={containerRef} className="tradingview-widget-container h-full" />
      </CardContent>
    </Card>
  );
}
