
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, BarChart, BookOpen, ChevronRight, Menu, CheckCircle } from 'lucide-react';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-transparent hover:border-primary/50">
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
  const { user, loading } = useAuth();

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
            {loading ? (
                <Skeleton className="h-10 w-32" />
            ) : user ? (
                <Button asChild>
                <Link href="/dashboard">
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
                    {loading ? (
                        <Skeleton className="h-10 w-full" />
                    ) : user ? (
                        <Button asChild className="w-full">
                            <Link href="/dashboard">Go to Dashboard</Link>
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
        <section className="py-20 md:py-32">
            <div className="container grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                    AI-Powered Trading Insights
                    </h1>
                    <p className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground mb-10">
                    Stop guessing, start winning. Let our AI analyze charts and generate high-probability trade ideas for you.
                    </p>
                    <Button size="lg" asChild>
                    <Link href="/sign-up">
                        Get Started for Free
                    </Link>
                    </Button>
                    <div className="mt-12">
                        <p className="text-sm text-muted-foreground mb-4">AS FEATURED IN</p>
                        <div className="flex justify-center md:justify-start items-center gap-8 opacity-60">
                            <Icons.logo className="h-6 w-auto" />
                            <Icons.logo className="h-6 w-auto" />
                            <Icons.logo className="h-6 w-auto" />
                            <Icons.logo className="h-6 w-auto" />
                        </div>
                    </div>
                </div>
                <div>
                    <Image 
                        src="https://placehold.co/800x600.png"
                        alt="AI Trading Analysis"
                        width={800}
                        height={600}
                        data-ai-hint="trading analysis"
                        className="rounded-xl shadow-2xl"
                    />
                </div>
            </div>
        </section>

        <section id="features" className="py-20 md:py-32 bg-secondary/50">
          <div className="container space-y-24">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose Uwfx AI?</h2>
              <p className="max-w-xl mx-auto text-muted-foreground mt-4">
                We combine cutting-edge AI with a user-friendly interface to give you a trading edge.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <Image src="https://placehold.co/600x400.png" data-ai-hint="ai bot" alt="AI Trade Generator" width={600} height={400} className="rounded-lg shadow-lg" />
                </div>
                <div>
                    <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                        <Bot size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">AI Trade Generator</h3>
                    <p className="text-muted-foreground">Upload any chart screenshot and our AI will provide a detailed trade plan, including entry, stop loss, and take profit levels. It does the heavy lifting, so you can focus on execution.</p>
                </div>
            </div>

             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="md:order-2">
                    <Image src="https://placehold.co/600x400.png" data-ai-hint="chart analysis" alt="Comprehensive Analysis" width={600} height={400} className="rounded-lg shadow-lg" />
                </div>
                <div className="md:order-1">
                     <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                        <BarChart size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Comprehensive Analysis</h3>
                    <p className="text-muted-foreground">Our AI performs deep technical analysis, identifying key patterns, support/resistance levels, and candlestick signals that human traders might miss, giving you a comprehensive view of the market.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <Image src="https://placehold.co/600x400.png" data-ai-hint="journal notebook" alt="Personal Trade Journal" width={600} height={400} className="rounded-lg shadow-lg" />
                </div>
                <div>
                     <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                        <BookOpen size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Personal Trade Journal</h3>
                    <p className="text-muted-foreground">Automatically save and manage all generated ideas. Add your own notes, track performance over time, and learn from every trade to refine your strategy for long-term success.</p>
                </div>
            </div>

          </div>
        </section>
        
        <section id="pricing" className="py-20 md:py-32">
            <div className="container max-w-5xl">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
                    <p className="max-w-xl mx-auto text-muted-foreground mt-4">
                        Start for free, and choose a plan that scales with your trading journey.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="p-8 shadow-lg flex flex-col">
                        <h3 className="text-2xl font-bold">Free Plan</h3>
                        <p className="text-muted-foreground mt-2">Perfect for getting started</p>
                        <p className="text-5xl font-bold my-6">$0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                        <ul className="space-y-3 text-muted-foreground mb-8">
                            <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> 15 AI analyses per month</li>
                            <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Full access to Trade Journal</li>
                            <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Community support</li>
                        </ul>
                        <Button size="lg" className="w-full mt-auto" asChild>
                            <Link href="/sign-up">Start Trading Now</Link>
                        </Button>
                    </Card>
                    <Card className="p-8 shadow-2xl flex flex-col border-2 border-primary relative">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                                Most Popular
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold">Pro Plan</h3>
                        <p className="text-muted-foreground mt-2">For serious traders</p>
                        <p className="text-5xl font-bold my-6">$19<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                        <ul className="space-y-3 text-muted-foreground mb-8">
                            <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> 500 AI analyses per month</li>
                            <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Full access to Trade Journal</li>
                            <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Advanced chart integrations</li>
                             <li className="flex items-center gap-2"><CheckCircle className="text-primary h-5 w-5" /> Priority email support</li>
                        </ul>
                        <Button size="lg" className="w-full mt-auto" asChild>
                            <Link href="/sign-up">Go Pro</Link>
                        </Button>
                    </Card>
                </div>
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

    