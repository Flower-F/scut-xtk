import { type ReactElement } from 'react';
import Head from 'next/head';

import { MainLayout } from '~/layouts/MainLayout';

export default function GetStartedPage() {
  return (
    <>
      <Head>
        <title>使用说明</title>
        <meta name='description' content='习题库的使用说明' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>使用说明</div>
    </>
  );
}

GetStartedPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
