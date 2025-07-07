import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, BarChart, BookOpen, ChevronRight, Menu } from 'lucide-react';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
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

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button asChild>
              <Link href="/dashboard">
                Go to Dashboard <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
                    <Button asChild className="w-full">
                      <Link href="/dashboard">
                        Go to Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              AI-Powered Trading Insights
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
              Stop guessing, start winning. Let our AI analyze charts and generate high-probability trade ideas for you.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard">
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
                description="Our AI performs deep technical analysis, identifying key patterns and signals that human traders might miss."
              />
              <FeatureCard 
                icon={<BookOpen size={28} />} 
                title="Personal Trade Journal" 
                description="Automatically save and manage all generated ideas. Add your own notes and track performance over time."
              />
            </div>
          </div>
        </section>
        
        <section id="pricing" className="py-20 md:py-32">
            <div className="container max-w-4xl">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
                    <p className="max-w-xl mx-auto text-muted-foreground mt-4">
                        Start for free, and pay only for what you need as you grow.
                    </p>
                </div>
                <div className="border rounded-xl p-8 text-center shadow-lg">
                    <h3 className="text-2xl font-bold">Free Plan</h3>
                    <p className="text-5xl font-bold my-6">$0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                    <ul className="space-y-3 text-muted-foreground mb-8">
                        <li>15 AI analyses per month</li>
                        <li>Full access to Trade Journal</li>
                        <li>Community support</li>
                    </ul>
                    <Button size="lg" className="w-full" asChild>
                         <Link href="/dashboard">
                            Start Trading Now
                          </Link>
                    </Button>
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
