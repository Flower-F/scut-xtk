import type { ReactNode } from 'react';
import { NavBar } from '../components/NavBar';
import { SideBar } from '../components/SideBar';

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <SideBar>{children}</SideBar>
    </>
  );
}
