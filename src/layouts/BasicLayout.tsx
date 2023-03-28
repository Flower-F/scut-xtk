import { SiteHeader } from '~/components/SiteHeader';
import { SiteFooter } from '~/components/SiteFooter';

interface LayoutProps {
  children: React.ReactNode;
}

export function BasicLayout({ children }: LayoutProps) {
  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <div className='container flex-1'>{children}</div>
      <SiteFooter />
    </div>
  );
}
