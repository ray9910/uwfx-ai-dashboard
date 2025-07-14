
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, BarChart, BookOpen, ChevronRight, Menu } from 'lucide-react';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="text-center">
    <CardHeader>
      <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
        {icon}
      </div>
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function LandingPage() {
  const { user, loading, subscriptionStatus, isSubscriptionLoading } = useAuth();

  const getDashboardHref = () => {
    if (!user) return '/sign-in';
    return subscriptionStatus === 'active' ? '/dashboard' : '/paywall';
  }

  return (
    <div className="flex flex-col min-h-svh bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold">Uwfx AI</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">Features</Link>
              <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {loading || isSubscriptionLoading ? (
                <Skeleton className="h-10 w-32" />
            ) : user ? (
                <Button asChild>
                  <Link href={getDashboardHref()}>
                    Go to Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
            ) : (
                <>
                <Button variant="ghost" asChild>
                    <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                    <Link href="/sign-up">Get Started</Link>
                </Button>
                </>
            )}
          </div>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="mt-6 flex h-full flex-col">
                  <div className="flex items-center gap-2">
                    <Icons.logo className="h-8 w-8 text-primary" />
                    <span className="text-lg font-bold">Uwfx AI</span>
                  </div>
                  <nav className="mt-6 grid gap-4">
                    <SheetClose asChild>
                      <Link
                        href="#features"
                        className="text-lg font-medium hover:text-primary"
                      >
                        Features
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="#pricing"
                        className="text-lg font-medium hover:text-primary"
                      >
                        Pricing
                      </Link>
                    </SheetClose>
                  </nav>
                  <div className="mt-auto space-y-4">
                    <ThemeToggle />
                    {loading || isSubscriptionLoading ? (
                        <Skeleton className="h-10 w-full" />
                    ) : user ? (
                        <Button asChild className="w-full">
                            <Link href={getDashboardHref()}>Go to Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button asChild className="w-full" variant="outline">
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                             <Button asChild className="w-full">
                                <Link href="/sign-up">Get Started</Link>
                            </Button>
                        </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 md:py-32 text-center">
            <div className="container">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                AI-Powered Trading Insights
                </h1>
                <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
                Stop guessing, start winning. Let our AI analyze charts and generate high-probability trade ideas for you.
                </p>
                <Button size="lg" asChild>
                <Link href="/sign-up">
                    Get Started for Free
                </Link>
                </Button>
            </div>
        </section>

        <section id="features" className="py-20 md:py-32 bg-secondary/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose Uwfx AI?</h2>
              <p className="max-w-xl mx-auto text-muted-foreground mt-4">
                We combine cutting-edge AI with a user-friendly interface to give you a trading edge.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Bot size={28} />}
                title="AI Trade Generator"
                description="Upload any chart screenshot and our AI will provide a detailed trade plan, including entry, stop loss, and take profit levels."
              />
              <FeatureCard 
                icon={<BarChart size={28} />}
                title="Comprehensive Analysis"
                description="Our AI performs deep technical analysis, identifying key patterns, support/resistance levels, and candlestick signals."
              />
              <FeatureCard 
                icon={<BookOpen size={28} />}
                title="Personal Trade Journal"
                description="Automatically save and manage all generated ideas. Track performance over time and learn from every trade."
              />
            </div>
          </div>
        </section>
        
        <section id="pricing" className="py-20 md:py-32">
            <div className="container max-w-md text-center">
                 <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
                <p className="text-muted-foreground mt-4 mb-8">
                    Start for free, and choose a plan that scales with your trading journey.
                </p>
                <Card>
                    <CardHeader>
                        <CardTitle>Free Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold mb-4">$0 <span className="text-lg font-normal text-muted-foreground">/month</span></p>
                        <p className="text-muted-foreground">Includes 15 AI analyses per month</p>
                        <Button className="mt-6 w-full" asChild>
                            <Link href="/sign-up">Start Trading Now</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Uwfx AI. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

    