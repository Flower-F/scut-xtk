import { SiteHeader } from '~/components/SideHeader';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
    </>
  );
}
