import type { ReactNode } from 'react';
import { NavBar } from './NavBar';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <NavBar />
      <main className='container mt-8 flex items-center justify-center'>{children}</main>
    </div>
  );
}
