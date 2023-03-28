import Link from 'next/link';
import { Icons } from '~/components/Icons';
import { MainNav } from '~/components/MainNav';
import { ThemeToggle } from '~/components/ThemeToggle';
import { buttonVariants } from '~/components/ui/Button';

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900'>
      <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
        <MainNav
          items={[
            {
              title: 'Home',
              href: '/',
            },
          ]}
        />
        <div className='flex flex-1 items-center justify-end space-x-4'>
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
