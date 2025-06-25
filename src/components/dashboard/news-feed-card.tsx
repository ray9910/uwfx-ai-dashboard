'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

export function NewsFeedCard() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    const createWidget = () => {
      container.innerHTML = '';
      
      const theme = getTheme();

      const widgetConfig = {
        "displayMode": "regular",
        "feedMode": "all_symbols",
        "colorTheme": theme,
        "isTransparent": true,
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
  }, []); // This effect runs only once on mount

  return (
    <Card className="flex flex-col h-[550px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          <span>Market Timeline</span>
        </CardTitle>
        <CardDescription>Latest news and events across all markets.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <div ref={containerRef} className="tradingview-widget-container h-full" />
      </CardContent>
    </Card>
  );
}
