import * as React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function PaywallPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
            <header className="mb-8">
                 <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 p-3 text-primary">
                    <Icons.logo className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">Pricing Plans</h1>
                <p className="mt-2 text-muted-foreground">Choose a plan to get access to all features.</p>
            </header>
            
            <main>
                <Card>
                    <CardHeader>
                        <CardTitle>Coming Soon</CardTitle>
                        <CardDescription>
                            Subscription plans are not yet available. Please check back later.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </main>
        </div>
    </div>
  );
}
