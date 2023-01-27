import type { ReactNode } from 'react';
import { NavBar } from './NavBar';
import { SideBar } from './SideBar';

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <SideBar>{children}</SideBar>
    </>
  );
}
