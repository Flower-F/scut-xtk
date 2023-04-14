import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import { type NavItem, type NavItemWithChildren } from '~/types/nav';
import { MainNav } from '~/components/MainNav';
import { MobileNav } from '~/components/MobileNav';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Avatar, AvatarFallback } from '~/components/ui/Avatar';
import { cn } from '~/utils/common';
import { Button, buttonVariants } from './ui/Button';

interface SiteHeaderProps {
  mainNavItems?: NavItem[];
  mobileNavItems?: NavItemWithChildren[];
}

export function SiteHeader({ mobileNavItems, mainNavItems }: SiteHeaderProps) {
  const { data: sessionData } = useSession();

  return (
    <header className='sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900'>
      <div className='container flex h-16 items-center'>
        <MainNav items={mainNavItems} />
        <MobileNav items={mobileNavItems} />
        <div className='flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end'>
          <nav className='flex items-center space-x-2'>
            <ThemeToggle />

            {sessionData?.user.id ? (
              <>
                <Link href='/user'>
                  <Avatar>
                    <div className='flex aspect-square h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700'>
                      {sessionData?.user.name.slice(0, 1)}
                    </div>
                    <AvatarFallback />
                  </Avatar>
                </Link>

                <Button onClick={() => void signOut()}>登出</Button>
              </>
            ) : (
              <Link href='/login' className={cn(buttonVariants())}>
                登录
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
