import Head from 'next/head';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { api } from '~/utils/api';

// export const sidebarNavItems = [
//   {
//     title: '网站介绍',
//     items: [
//       {
//         title: '网站背景',
//         href: '/',
//         items: [],
//       },
//       {
//         title: '使用说明',
//         href: '/get-started',
//         items: [],
//       },
//     ],
//   },
//   {
//     title: '学院选择',
//     items: (Object.keys(collegeMapping) as Array<keyof typeof collegeMapping>).map((key) => {
//       return {
//         title: collegeMapping[key],
//         href: `/college/${key}`,
//         items: [],
//       };
//     }),
//   },
// ];

export default function GetStartedPage() {
  const sidebarNavItems = api.knowledgePoint.getSidebarNavItems.useQuery({}).data;

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
