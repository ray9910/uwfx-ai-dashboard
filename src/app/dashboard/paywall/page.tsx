'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Check, Loader2 } from 'lucide-react';

export default function PaywallPage() {
  const { activateSubscription, subscriptionStatus } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (subscriptionStatus === 'active') {
      router.replace('/dashboard');
    }
  }, [subscriptionStatus, router]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await activateSubscription();
      // The redirect is handled in the activateSubscription function
    } catch (error) {
      console.error('Failed to activate subscription', error);
      setIsLoading(false);
    }
  };

  if (subscriptionStatus === 'active') {
    return null; // Don't render anything if user is subscribed, redirect will handle it
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                <Icons.logo className="h-8 w-8" />
            </div>
          <CardTitle>Unlock Your Trading Potential</CardTitle>
          <CardDescription>
            Subscribe to Uwfx AI to get unlimited access to our AI-powered trade idea generator and advanced analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-secondary/50 p-6">
            <h3 className="text-lg font-semibold mb-4">Pro Plan Features</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited AI Trade Idea Generations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Full Access to Trade Journal</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Advanced Chart Analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Priority Support</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubscribe} className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Subscribe Now (Test)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
