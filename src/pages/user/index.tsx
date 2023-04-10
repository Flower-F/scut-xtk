import { type ReactElement } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

import { MainLayout } from '~/layouts/MainLayout';
import { AdminUserTable } from '~/components/AdminUserTable';

export default function UserPage() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>用户主页</title>
        <meta name='description' content='习题库用户主页' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>{sessionData?.user.role === 'ADMIN' ? <AdminUserTable /> : <div>用户收藏夹</div>}</div>{' '}
    </>
  );
}

UserPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
