'use client';

import * as React from 'react';

interface ChartPreviewCardProps {
  symbol: string;
}

export const ChartPreviewCard = React.forwardRef<HTMLDivElement, ChartPreviewCardProps>(
  ({ symbol }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    // Use a unique ID for each widget instance to prevent conflicts
    const widgetId = React.useMemo(() => `tradingview-widget-${Math.random().toString(36).substr(2, 9)}`, [symbol]);

    React.useEffect(() => {
      const container = containerRef.current;
      if (!container || !symbol) return;

      const getTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light';

      const createWidget = () => {
        // Ensure the container is empty before creating a new widget.
        if(container) {
            container.innerHTML = '';
        }
        
        const theme = getTheme();

        const widgetConfig = {
            "symbol": symbol,
            "width": "100%",
            "height": "100%",
            "locale": "en",
            "dateRange": "12M",
            "colorTheme": theme,
            "isTransparent": true,
            "autosize": true,
            "largeChartUrl": "",
            "noTimeScale": false,
        };

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-chart.js';
        script.async = true;
        script.innerHTML = JSON.stringify(widgetConfig);

        container?.appendChild(script);
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

    // This outer div is what gets screenshotted
    return (
      <div ref={ref} className="bg-background rounded-lg border p-2">
        <div ref={containerRef} className="tradingview-widget-container h-48 w-full" />
      </div>
    );
  }
);

ChartPreviewCard.displayName = 'ChartPreviewCard';
