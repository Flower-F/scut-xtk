import Head from 'next/head';
import { DashboardLayout } from '~/layouts/DashboardLayout';

export default function DashBoardPage() {
  return (
    <>
      <Head>
        <title>习题库管理面板</title>
        <meta name='description' content='习题库内容的管理面板' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <DashboardLayout>
        <div>DashBoardPage</div>
      </DashboardLayout>
    </>
  );
}
