import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { MainLayout } from '~/layouts/MainLayout';
import { CreateCollegeDialog } from '~/components/CreateCollegeDialog';
import { UpdateCollegeDialog } from '~/components/UpdateCollegeDialog';
import { api } from '~/utils/api';
import { cn } from '~/utils/common';

export default function CollegePage() {
  const { data: sessionData } = useSession();

  const getCollegeList = api.college.getCollegeList.useQuery();

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
        <ul className='grid w-full grid-cols-2 gap-3 p-4 md:grid-cols-3 xl:grid-cols-4'>
          {getCollegeList.data?.length
            ? getCollegeList.data.map((item) =>
                sessionData?.user.role === 'ADMIN' ? (
                  <UpdateCollegeDialog key={item.id} id={item.id} name={item.name} slug={item.slug} />
                ) : (
                  <ListItem key={item.id} title={item.name} href={`/college/${item.slug}`} />
                )
              )
            : null}
          {sessionData?.user.role === 'ADMIN' ? <CreateCollegeDialog /> : null}
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
              'inline-block w-full select-none rounded-md p-3 text-center no-underline outline-none transition-colors hover:bg-slate-100 hover:underline focus:bg-slate-100 dark:hover:bg-slate-700 dark:focus:bg-slate-700',
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
