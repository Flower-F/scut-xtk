import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { collegeMapping } from '~/constants/college';
import { api } from '~/utils/api';

const sidebarNavItems = [
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

export default function DashboardCollegeDetailPage() {
  const router = useRouter();
  const slug = router.query.slug && typeof router.query.slug === 'string' ? router.query.slug : '';
  const college = slug && slug in collegeMapping ? collegeMapping[slug as keyof typeof collegeMapping] : '选择学院';

  const searchParams = useSearchParams();
  const knowledge = searchParams.get('knowledge');

  const getSidebarNavItems = api.college.getSidebarNavItems.useQuery(
    { slug },
    {
      enabled: !!router.query.slug,
    }
  );

  return (
    <>
      <Head>
        <title>{college}</title>
        <meta name='description' content='习题库管理面板' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <SidebarLayout sidebarNavItems={getSidebarNavItems.data}>
        <div>{college}</div>
      </SidebarLayout>
    </>
  );
}
