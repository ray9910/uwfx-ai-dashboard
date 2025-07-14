
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import type { PolarProduct } from '@/types';
import { useAppContext } from '@/context/app-provider';
import { useAuth } from '@/context/auth-provider';

// This is a client-side only dependency
declare const polar: any;

// Helper to format price from cents
const formatPrice = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};

export const ProductCard = ({ product }: { product: PolarProduct }) => {
    const { user } = useAuth();
    const { activateSubscription } = useAppContext();
    const [isRedirecting, setIsRedirecting] = React.useState(false);
    const hasFeatures = product.features && product.features.length > 0;

    const handleCheckout = () => {
        if (!user || !user.email) {
            console.error("User is not authenticated or does not have an email.");
            return;
        }

        polar.checkout({
            product_id: product.id,
            customer_email: user.email,
            onSuccess: () => {
                setIsRedirecting(true);
                // Call the function from AppContext to update Firestore and redirect
                activateSubscription();
            }
        });
    }

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                {product.description && (
                    <CardDescription>{product.description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex-1">
                {product.price && (
                    <div className="mb-6">
                        <span className="text-4xl font-bold">{formatPrice(product.price.price_amount, product.price.price_currency)}</span>
                        <span className="text-sm text-muted-foreground">/ month</span>
                    </div>
                )}

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
                 <Button className="w-full" onClick={handleCheckout} disabled={!user || isRedirecting}>
                    {isRedirecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isRedirecting ? 'Redirecting...' : 'Subscribe'}
                </Button>
            </CardFooter>
        </Card>
    );
};
