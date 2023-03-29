import { type ReactNode } from 'react';

import { type NavItem, type NavItemWithChildren } from '~/types/nav';
import { SiteFooter } from '~/components/SiteFooter';
import { SiteHeader } from '~/components/SiteHeader';
import { collegeMapping } from '~/constants/college';

interface MainLayoutProps {
  children: ReactNode;
  mobileNavItems?: NavItemWithChildren[];
}

const partialMainNavItems: NavItem[] = (Object.keys(collegeMapping) as Array<keyof typeof collegeMapping>)
  .map((key) => {
    return {
      title: collegeMapping[key],
      href: `/dashboard/college/${key}`,
    };
  })
  .slice(0, 6);

export function MainLayout({ children, mobileNavItems }: MainLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader mobileNavItems={mobileNavItems} mainNavItems={partialMainNavItems} />
      <div className='container flex-1'>{children}</div>
      <SiteFooter />
    </div>
  );
}
