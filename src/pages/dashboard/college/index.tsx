import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { type NavItem } from '~/types/nav';
import { MainLayout } from '~/layouts/MainLayout';
import { collegeMapping } from '~/constants/college';
import { cn } from '~/utils/common';

const mainNavItems: NavItem[] = (Object.keys(collegeMapping) as Array<keyof typeof collegeMapping>).map((key) => {
  return {
    title: collegeMapping[key],
    href: `/dashboard/college/${key}`,
  };
});

export default function CollegePage() {
  return (
    <>
      <Head>
        <title>学院全览</title>
        <meta name='description' content='学院全览' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainLayout>
        <ul className='grid w-full grid-cols-2 gap-3 p-4 md:grid-cols-3'>
          {mainNavItems?.length
            ? mainNavItems.map((item, index) => <ListItem key={index} title={item.title} href={item.href || '/'} />)
            : null}
        </ul>
      </MainLayout>
    </>
  );
}

const ListItem = forwardRef<ElementRef<typeof Link>, ComponentPropsWithoutRef<typeof Link>>(
  ({ className, title, href, ...props }, ref) => {
    return (
      <li>
        <Link href={href} ref={ref} passHref legacyBehavior {...props}>
          <a
            className={cn(
              'inline-block w-full select-none space-y-1 rounded-md p-3 no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-700 dark:focus:bg-slate-700',
              className
            )}
          >
            {title}
          </a>
        </Link>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
