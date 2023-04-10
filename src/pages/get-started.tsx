import Head from 'next/head';

import { SidebarLayout } from '~/layouts/SidebarLayout';

export default function GetStartedPage() {
  return (
    <>
      <Head>
        <title>使用说明</title>
        <meta name='description' content='习题库的使用说明' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <SidebarLayout>
        <div>使用说明</div>
      </SidebarLayout>
    </>
  );
}
