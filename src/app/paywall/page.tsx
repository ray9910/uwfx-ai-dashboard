import * as React from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Check, X } from 'lucide-react';
import { getProducts } from '@/lib/polar';
import type { PolarProduct } from '@/types';
import { ProductCard } from '@/components/paywall/product-card';

// Helper to format price from cents
const formatPrice = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};

const FallbackPricing = () => (
    <Card className="flex flex-col">
        <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>Get full access to all features.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
             <div className="mb-6">
                <span className="text-4xl font-bold">$10.00</span>
                <span className="text-sm text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Unlimited AI Generations</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> Full Trade Journal Access</li>
            </ul>
        </CardContent>
        <CardFooter>
            <div className="w-full text-center text-sm text-muted-foreground">
                Could not load plan.
            </div>
        </CardFooter>
    </Card>
)

export default async function PaywallPage() {
    let products: PolarProduct[] = [];
    let error: string | null = null;
    
    try {
        products = await getProducts();
    } catch (e: any) {
        console.error(e.message);
        error = "Could not load subscription plans. Please try again later.";
    }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-4xl">
            <header className="mb-8 text-center">
                 <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 p-3 text-primary">
                    <Icons.logo className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">Unlock Your Trading Potential</h1>
                <p className="mt-2 text-muted-foreground">Choose a plan to get unlimited access to all features.</p>
            </header>
            
            <main>
                {error ? (
                     <Card className="flex flex-col items-center justify-center p-8 text-center">
                        <X className="h-8 w-8 text-destructive mb-4" />
                        <CardTitle className="text-destructive">An Error Occurred</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </Card>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                       {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <FallbackPricing />
                    </div>
                )}
            </main>
        </div>
    </div>
  );
}
