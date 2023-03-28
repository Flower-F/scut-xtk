import Link from 'next/link';

import { type NavItem, type NavItemWithChildren } from '~/types/nav';
import { Icons } from '~/components/Icons';
import { MainNav } from '~/components/MainNav';
import { MobileNav } from '~/components/MobileNav';
import { ThemeToggle } from '~/components/ThemeToggle';
import { buttonVariants } from '~/components/ui/Button';
import { collegeMapping } from '~/constants/college';

const mainNavItems: NavItem[] = (Object.keys(collegeMapping) as Array<keyof typeof collegeMapping>)
  .map((key) => {
    return {
      title: key,
      href: `/dashboard/${collegeMapping[key]}`,
    };
  })
  .slice(0, 6);

export function SiteHeader({ sidebarNavItems }: { sidebarNavItems?: NavItemWithChildren[] }) {
  return (
    <header className='sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900'>
      <div className='container flex h-16 items-center'>
        <MainNav items={mainNavItems} />
        <MobileNav items={sidebarNavItems} />
        <div className='flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end'>
          <nav className='flex items-center space-x-1'>
            <Link href='https://github.com/shadcn/ui' target='_blank' rel='noreferrer'>
              <div
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                  className: 'text-slate-700 dark:text-slate-400',
                })}
              >
                <Icons.GitHub className='h-5 w-5' />
                <span className='sr-only'>GitHub</span>
              </div>
            </Link>
            <Link href='https://twitter.com/shadcn' target='_blank' rel='noreferrer'>
              <div
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                  className: 'text-slate-700 dark:text-slate-400',
                })}
              >
                <Icons.Twitter className='h-5 w-5 fill-current' />
                <span className='sr-only'>Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
