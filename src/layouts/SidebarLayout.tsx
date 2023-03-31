import { type ReactNode } from 'react';

import { type NavItemWithChildren } from '~/types/nav';
import { MainLayout } from '~/layouts/MainLayout';
import { SidebarNav } from '~/components/SidebarNav';
import { ScrollArea } from '~/components/ui/ScrollArea';

interface SidebarLayoutProps {
  children: ReactNode;
  sidebarNavItems?: NavItemWithChildren[];
}

export function SidebarLayout({ children, sidebarNavItems }: SidebarLayoutProps) {
  return (
    <MainLayout mobileNavItems={sidebarNavItems}>
      <div className='flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10'>
        <aside className='fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-r-slate-100 dark:border-r-slate-700 md:sticky md:block md:py-4 lg:py-10'>
          <ScrollArea>
            <SidebarNav items={sidebarNavItems} />
          </ScrollArea>
        </aside>
        {children}
      </div>
    </MainLayout>
  );
}
