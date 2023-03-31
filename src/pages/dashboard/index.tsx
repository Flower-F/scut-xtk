import Head from 'next/head';

import { MainLayout } from '~/layouts/MainLayout';

export default function DashBoardPage() {
  return (
    <>
      <Head>
        <title>习题库管理面板</title>
        <meta name='description' content='习题库内容的管理面板' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainLayout>
        <div>网站介绍</div>
      </MainLayout>
    </>
  );
}
