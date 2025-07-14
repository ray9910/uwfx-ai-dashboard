
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Check, Loader2 } from 'lucide-react';
import { useAppContext } from '@/context/app-provider';

export default function PaywallPage() {
  const { user, subscriptionStatus, isSubscriptionLoading } = useAuth();
  const { activateSubscription } = useAppContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isSubscriptionLoading && subscriptionStatus === 'active') {
      router.replace('/dashboard');
    }
  }, [subscriptionStatus, isSubscriptionLoading, router]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await activateSubscription();
      // The redirect is handled in the activateSubscription function which is now in AppContext
    } catch (error) {
      console.error('Failed to activate subscription', error);
      setIsLoading(false);
    }
  };
  
  // Show a loading state while we verify subscription status
  if (isSubscriptionLoading || !user) {
    return (
        <div className="flex h-svh w-full items-center justify-center bg-background">
             <div className="flex flex-col items-center gap-4">
                <Icons.logo className="size-12 text-primary animate-pulse" />
                <p className="text-muted-foreground">Verifying Subscription...</p>
             </div>
        </div>
    );
  }

  // If user is somehow subscribed and lands here, the useEffect will redirect them.
  // We can return null to avoid a flash of content.
  if (subscriptionStatus === 'active') {
    return null; 
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
