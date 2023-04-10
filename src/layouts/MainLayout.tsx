import { type ReactNode } from 'react';

import { type NavItemWithChildren } from '~/types/nav';
import { SiteFooter } from '~/components/SiteFooter';
import { SiteHeader } from '~/components/SiteHeader';
import { api } from '~/utils/api';

interface MainLayoutProps {
  children: ReactNode;
  mobileNavItems?: NavItemWithChildren[];
}

export function MainLayout({ children, mobileNavItems }: MainLayoutProps) {
  const collegeList = api.college.getCollegeList.useQuery().data;

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader mobileNavItems={mobileNavItems} mainNavItems={collegeList} />
      <div className='container flex-1'>{children}</div>
      <SiteFooter />
    </div>
  );
}
