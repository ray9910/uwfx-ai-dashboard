'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { NewsArticle } from '@/types';
import { Newspaper } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  news: NewsArticle[];
  className?: string;
}

export function NewsCard({ news, className }: NewsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          <span>Latest News</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {news.map((item, index) => (
              <div key={item.id}>
                <div className="flex flex-col gap-1.5">
                  <a href={item.url} rel="noopener noreferrer" className="font-medium hover:text-primary transition-colors">
                    {item.title}
                  </a>
                  <div className="text-sm text-muted-foreground flex items-center justify-between">
                    <span>{item.source}</span>
                    <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</span>
                  </div>
                </div>
                {index < news.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
