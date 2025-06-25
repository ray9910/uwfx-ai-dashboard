'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Newspaper,
  CandlestickChart,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { AppProvider, useAppContext } from '@/context/app-provider';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { credits } = useAppContext();

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
                            <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Dashboard">
                                <Link href="/">
                                    <CandlestickChart />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/journal'} tooltip="Trade Journal">
                                <Link href="/journal">
                                    <BookOpen />
                                    <span>Trade Journal</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/charts'} tooltip="Charts & News">
                                <Link href="/charts">
                                    <Newspaper />
                                    <span>Charts & News</span>
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
                            <Progress value={(credits / 15) * 100} className="h-2 mt-1 bg-sidebar-accent" />
                            <p className="text-xs mt-1">{credits} of 15 remaining</p>
                        </div>
                        <SidebarMenuButton asChild variant="outline" className="w-full bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90">
                            <a href="https://polar.sh" target="_blank" rel="noopener noreferrer">
                                <CreditCard />
                                <span>Buy Credits</span>
                            </a>
                        </SidebarMenuButton>
                    </div>
                    <Separator className="my-2 bg-sidebar-border" />
                    <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="group-data-[state=collapsed]:hidden">
                            <p className="font-semibold text-sm text-sidebar-foreground">User</p>
                            <p className="text-xs text-sidebar-foreground/70">user@email.com</p>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="bg-transparent">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
        </AppProvider>
    )
}
