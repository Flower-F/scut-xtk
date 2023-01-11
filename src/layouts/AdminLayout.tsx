import type { ReactNode } from 'react';
import { NavBar } from '../components/NavBar';

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <main className='w-screen'>{children}</main>
    </>
  );
}
