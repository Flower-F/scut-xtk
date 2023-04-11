import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { MainLayout } from '~/layouts/MainLayout';
import { CreateCollegeDialog } from '~/components/CreateCollegeDialog';
import { EditCollegeDialog } from '~/components/EditCollegeDialog';
import { buttonVariants } from '~/components/ui/Button';
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
      <div>
        <h3 className='scroll-m-20 py-6 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
          学院全览
        </h3>
        <ul className='grid w-full grid-cols-2 gap-3 p-4 md:grid-cols-3 xl:grid-cols-4'>
          {getCollegeList.data?.length
            ? getCollegeList.data.map((item) =>
                sessionData?.user.role === 'ADMIN' ? (
                  <EditCollegeDialog key={item.id} collegeId={item.id} name={item.name} slug={item.slug} />
                ) : (
                  <ListItem key={item.id} title={item.name} href={`/college/${item.slug}`} />
                )
              )
            : null}
          {sessionData?.user.role === 'ADMIN' ? <CreateCollegeDialog /> : null}
        </ul>
      </div>
    </>
  );
}

const ListItem = forwardRef<ElementRef<typeof Link>, ComponentPropsWithoutRef<typeof Link>>(
  ({ className, title, href, ...props }, ref) => {
    return (
      <li>
        <Link href={href} ref={ref} passHref legacyBehavior {...props}>
          <a className={cn(buttonVariants({ variant: 'subtle', size: 'lg' }), 'w-full text-base', className)}>
            {title}
          </a>
        </Link>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

CollegePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
