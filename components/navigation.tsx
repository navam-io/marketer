"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, FileText, FolderKanban, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  match: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: <Home className="h-4 w-4" />,
    match: (pathname) => pathname === '/'
  },
  {
    href: '/sources',
    label: 'Sources',
    icon: <FileText className="h-4 w-4" />,
    match: (pathname) => pathname === '/sources'
  },
  {
    href: '/campaigns',
    label: 'Campaigns',
    icon: <FolderKanban className="h-4 w-4" />,
    match: (pathname) => pathname.startsWith('/campaigns')
  }
];

export function Navigation() {
  const pathname = usePathname();

  // Build breadcrumb trail
  const breadcrumbs = React.useMemo(() => {
    const trail: NavItem[] = [];

    for (const item of NAV_ITEMS) {
      if (item.match(pathname)) {
        trail.push(item);
        break;
      }
    }

    return trail;
  }, [pathname]);

  const currentPage = breadcrumbs[breadcrumbs.length - 1];

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar - Brand and Primary Navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="font-bold text-xl">Navam Marketer</div>
            </Link>

            {/* Primary Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.match(pathname);
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'gap-2',
                        isActive && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Tagline */}
          <div className="hidden lg:block text-sm text-muted-foreground">
            Marketing Automation for Bootstrapped Founders
          </div>
        </div>

        {/* Breadcrumb Bar - Workflow Context */}
        {currentPage && pathname !== '/' && (
          <div className="flex items-center gap-2 pb-3 text-sm text-muted-foreground border-t pt-3">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <div className="flex items-center gap-1 text-foreground font-medium">
              {currentPage.icon}
              <span>{currentPage.label}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
