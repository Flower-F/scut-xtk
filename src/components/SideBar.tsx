import Link from 'next/link';
import type { ReactNode } from 'react';

export function SideBar({ children }: { children: ReactNode }) {
  return (
    <div className='drawer-mobile drawer'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <main className='drawer-content'>{children}</main>

      <div className='drawer-side'>
        <label htmlFor='my-drawer' className='drawer-overlay'></label>
        <ul className='menu w-56 gap-2 bg-base-100 p-4 text-base-content'>
          <SideBarItem link='/a' title='Sidebar Item 1 Sidebar Item 1 Sidebar Item 1' active />
          <SideBarItem link='/b' title='Sidebar Item 2' />
        </ul>
      </div>
    </div>
  );
}

function SideBarItem({ link, title, active }: { link: string; title: string; className?: string; active?: boolean }) {
  return (
    <li className='w-full'>
      <Link href={link} className={`inline-block w-full truncate ${active ? 'active' : ''}`}>
        {title}
      </Link>
    </li>
  );
}
