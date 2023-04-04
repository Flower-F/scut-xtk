import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { CreateCourseDialog } from '~/components/CreateCourseDialog';
import { UpdateCourseDialog } from '~/components/UpdateCourseDialog';
import { api } from '~/utils/api';

export default function CollegeDetailPage() {
  const router = useRouter();
  const slug = router.query.slug && typeof router.query.slug === 'string' ? router.query.slug : '';
  // const college = slug && slug in collegeMapping ? collegeMapping[slug as keyof typeof collegeMapping] : '选择学院';
  const college = api.college.getCollegeName.useQuery({ slug }).data?.name || '未知学院';

  const searchParams = useSearchParams();
  const knowledgePointId = searchParams.get('knowledgePointId');

  const courseList = api.course.getCourseList.useQuery({ slug }).data;

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
        <div>
          <h2 className='scroll-m-20 py-6 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
            {college}
          </h2>
          <ul className='grid w-full grid-cols-2 gap-3 p-4'>
            {courseList?.length
              ? courseList.map((item) => <UpdateCourseDialog key={item.id} id={item.id} name={item.name} />)
              : null}
            <CreateCourseDialog slug={slug} />
          </ul>
        </div>
      </SidebarLayout>
    </>
  );
}
