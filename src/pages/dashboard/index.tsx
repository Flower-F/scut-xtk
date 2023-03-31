import Head from 'next/head';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { collegeMapping } from '~/constants/college';

export const sidebarNavItems = [
  {
    title: '网站介绍',
    items: [
      {
        title: '网站背景',
        href: '/dashboard',
        items: [],
      },
      {
        title: '使用说明',
        href: '/dashboard/get-started',
        items: [],
      },
    ],
  },
  {
    title: '学院选择',
    items: (Object.keys(collegeMapping) as Array<keyof typeof collegeMapping>).map((key) => {
      return {
        title: collegeMapping[key],
        href: `/dashboard/college/${key}`,
        items: [],
      };
    }),
  },
];

export default function DashBoardPage() {
  return (
    <>
      <Head>
        <title>习题库管理面板</title>
        <meta name='description' content='习题库内容的管理面板' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <SidebarLayout sidebarNavItems={sidebarNavItems}>
        <div>网站介绍</div>
      </SidebarLayout>
    </>
  );
}
