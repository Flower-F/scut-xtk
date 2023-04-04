import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { collegeMapping } from '~/constants/college';
import { api } from '~/utils/api';

export default function CollegeDetailPage() {
  const router = useRouter();
  const slug = router.query.slug && typeof router.query.slug === 'string' ? router.query.slug : '';
  const college = slug && slug in collegeMapping ? collegeMapping[slug as keyof typeof collegeMapping] : '选择学院';

  const searchParams = useSearchParams();
  const knowledgePointId = searchParams.get('knowledgePointId');

  const sidebarNavItems = api.college.getSidebarNavItems.useQuery(
    { slug },
    {
      enabled: !!router.query.slug,
    }
  ).data;

  return (
    <>
      <Head>
        <title>{college}</title>
        <meta name='description' content={`${college}习题库`} />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <SidebarLayout sidebarNavItems={sidebarNavItems}>
        <div>{college}</div>
      </SidebarLayout>
    </>
  );
}
