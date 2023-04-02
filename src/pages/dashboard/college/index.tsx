import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { type NavItem } from '~/types/nav';
import { MainLayout } from '~/layouts/MainLayout';
import { Icons } from '~/components/Icons';
import { Button } from '~/components/ui/Button';
import { collegeMapping } from '~/constants/college';
import { cn } from '~/utils/common';

const mainNavItems: NavItem[] = (Object.keys(collegeMapping) as Array<keyof typeof collegeMapping>).map((key) => {
  return {
    title: collegeMapping[key],
    href: `/dashboard/college/${key}`,
  };
});

export default function CollegePage() {
  const { data: sessionData } = useSession();

  console.log('sessionData: ', sessionData);

  return (
    <>
      <Head>
        <title>学院全览</title>
        <meta name='description' content='学院全览' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainLayout>
        <h2 className='scroll-m-20 py-6 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
          学院全览
        </h2>
        <ul className='grid w-full grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:grid-cols-4'>
          {mainNavItems?.length
            ? mainNavItems.map((item, index) => <ListItem key={index} title={item.title} href={item.href || '/'} />)
            : null}
          {sessionData?.user.role === 'ADMIN' ? (
            <Button className='gap-2'>
              <Icons.PlusCircle /> 添加学院
            </Button>
          ) : null}
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
              'inline-block w-full select-none space-y-1 rounded-md p-3 text-center no-underline outline-none transition-colors hover:bg-slate-100 hover:underline focus:bg-slate-100 dark:hover:bg-slate-700 dark:focus:bg-slate-700',
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
