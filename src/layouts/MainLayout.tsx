import { type NavItemWithChildren } from '~/types/nav';
import { SiteFooter } from '~/components/SiteFooter';
import { SiteHeader } from '~/components/SiteHeader';

interface LayoutProps {
  children: React.ReactNode;
  sidebarNavItems?: NavItemWithChildren[];
}

export function MainLayout({ children, sidebarNavItems }: LayoutProps) {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader sidebarNavItems={sidebarNavItems} />
      <div className='container flex-1'>{children}</div>
      <SiteFooter />
    </div>
  );
}
