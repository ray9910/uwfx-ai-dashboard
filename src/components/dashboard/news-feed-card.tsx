'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getNewsForSymbol } from '@/lib/news';
import type { NewsArticle } from '@/types';
import { Skeleton } from '../ui/skeleton';
import { Newspaper } from 'lucide-react';
import { Separator } from '../ui/separator';

interface NewsFeedCardProps {
  symbol: string;
}

export function NewsFeedCard({ symbol }: NewsFeedCardProps) {
  const [news, setNews] = React.useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchNews() {
      if (!symbol) return;
      setIsLoading(true);
      const articles = await getNewsForSymbol(symbol);
      setNews(articles);
      setIsLoading(false);
    }
    fetchNews();
  }, [symbol]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          <span>Latest News ({symbol})</span>
        </CardTitle>
        <CardDescription>Top headlines for the selected asset.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[550px] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2 p-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="space-y-2">
              {news.map((article, index) => (
                <React.Fragment key={article.url}>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <h3 className="font-semibold text-sm leading-tight">{article.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{article.source} &middot; {new Date(article.publishedAt).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.description}</p>
                  </a>
                  {index < news.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground pt-10">
              <p>No news found for {symbol}.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
