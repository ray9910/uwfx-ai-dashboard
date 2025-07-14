import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Check, X } from 'lucide-react';
import { getProducts } from '@/lib/polar';
import type { PolarProduct } from '@/types';

// Helper to format price from cents
const formatPrice = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};

const ProductCard = ({ product }: { product: PolarProduct }) => {
    const hasFeatures = product.features && product.features.length > 0;
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                {product.description && (
                    <CardDescription>{product.description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex-1">
                <div className="mb-6">
                    <span className="text-4xl font-bold">{formatPrice(product.price.price_amount, product.price.price_currency)}</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                </div>

                {hasFeatures && (
                    <>
                        <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase">What's included</h3>
                        <ul className="space-y-3">
                            {product.features.map((feature) => (
                                <li key={feature.id} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">{feature.name}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </CardContent>
            <CardFooter>
                 <Button className="w-full">
                    Subscribe
                </Button>
            </CardFooter>
        </Card>
    );
};


const FallbackPricing = () => (
    <Card>
        <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>Get full access to all features.</CardDescription>
        </CardHeader>
        <CardContent>
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
            <Button className="w-full">
                Subscribe
            </Button>
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
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <FallbackPricing />
                        <FallbackPricing />
                    </div>
                )}
            </main>
        </div>
    </div>
  );
}
