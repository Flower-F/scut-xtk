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

export default function DashBoardGetStartedPage() {
  return (
    <>
      <Head>
        <title>使用说明</title>
        <meta name='description' content='习题库的使用说明' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <SidebarLayout sidebarNavItems={sidebarNavItems}>
        <div>使用说明</div>
      </SidebarLayout>
    </>
  );
}
