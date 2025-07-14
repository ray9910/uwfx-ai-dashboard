
'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  CandlestickChart,
  CreditCard,
  BookOpen,
  LogOut,
  User,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { AppProvider, useAppContext } from '@/context/app-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';


function AppLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { credits, isLoadingData } = useAppContext();
    const { user, loading, signOut, subscriptionStatus, isSubscriptionLoading } = useAuth();

    React.useEffect(() => {
        if (!loading && !user) {
            router.replace('/sign-in');
            return;
        }

        if (!isSubscriptionLoading && user && subscriptionStatus !== 'active') {
            router.replace('/paywall');
        }

    }, [user, loading, router, subscriptionStatus, isSubscriptionLoading, pathname]);

    if (loading || isSubscriptionLoading || !user || subscriptionStatus !== 'active') {
        return (
            <div className="flex h-svh w-full items-center justify-center bg-background">
                 <div className="flex flex-col items-center gap-4">
                    <Icons.logo className="size-12 text-primary animate-pulse" />
                    <p className="text-muted-foreground">Loading Your Dashboard...</p>
                 </div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="md:hidden p-2 fixed top-0 left-0 z-20">
                <SidebarTrigger />
            </div>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <Icons.logo className="size-8 text-primary" />
                        <span className="text-lg font-semibold group-data-[state=collapsed]:hidden">Uwfx AI</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/dashboard'} tooltip="Dashboard">
                                <Link href="/dashboard">
                                    <CandlestickChart />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/dashboard/journal'} tooltip="Trade Journal">
                                <Link href="/dashboard/journal">
                                    <BookOpen />
                                    <span>Trade Journal</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <div className="w-full space-y-2 group-data-[state=collapsed]:hidden">
                        <Separator className="my-2 bg-sidebar-border" />
                        <div className="px-2 text-sm text-sidebar-foreground/70">
                            <p>Credits</p>
                            {isLoadingData ? (
                                <>
                                    <Skeleton className="h-2 w-full mt-1" />
                                    <Skeleton className="h-3 w-3/4 mt-2" />
                                </>
                            ) : (
                                <>
                                    <Progress value={(credits / 15) * 100} className="h-2 mt-1 bg-sidebar-accent" />
                                    <p className="text-xs mt-1">{credits} of 15 remaining</p>
                                </>
                            )}
                        </div>
                        <SidebarMenuButton asChild variant="outline" className="w-full bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90">
                            <a href="https://polar.sh" target="_blank" rel="noopener noreferrer">
                                <CreditCard />
                                <span>Buy Credits</span>
                            </a>
                        </SidebarMenuButton>
                    </div>
                    <Separator className="my-2 bg-sidebar-border" />
                    <TooltipProvider delayDuration={0}>
                      <div className="flex items-center justify-between gap-3 p-2 group-data-[state=collapsed]:flex-col group-data-[state=collapsed]:gap-2 group-data-[state=collapsed]:items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/dashboard/profile" className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>{user.displayName?.[0].toUpperCase() ?? user.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="group-data-[state=collapsed]:hidden">
                                        <p className="font-semibold text-sm text-sidebar-foreground max-w-[120px] truncate" title={user.displayName ?? user.email!}>{user.displayName ?? user.email}</p>
                                    </div>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="group-data-[state=expanded]:hidden">
                                Profile Management
                            </TooltipContent>
                          </Tooltip>

                          <div className="flex items-center group-data-[state=collapsed]:flex-col group-data-[state=collapsed]:gap-2">
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" onClick={signOut} className="h-9 w-9 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                          <LogOut className="h-5 w-5" />
                                      </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="group-data-[state=expanded]:hidden">Sign Out</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                    <ThemeToggle className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
                                </TooltipTrigger>
                                <TooltipContent side="right" className="group-data-[state=expanded]:hidden">Toggle Theme</TooltipContent>
                              </Tooltip>
                          </div>
                      </div>
                    </TooltipProvider>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="bg-transparent">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
        </AppProvider>
    )
}

    