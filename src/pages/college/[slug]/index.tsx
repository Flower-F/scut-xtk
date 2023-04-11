import { type ReactElement } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { CreateCourseDialog } from '~/components/CreateCourseDialog';
import { EditCourseDialog } from '~/components/EditCourseDialog';
import { api } from '~/utils/api';

export default function CollegeDetailPage() {
  const router = useRouter();
  const slug = router.query.slug && typeof router.query.slug === 'string' ? router.query.slug : '';

  const collegeName = api.college.getCollegeBySlug.useQuery({ collegeSlug: slug }).data?.name || '学院课程';
  const courseList = api.course.getCourseList.useQuery({ collegeSlug: slug }).data;

  return (
    <>
      <Head>
        <title>{collegeName}</title>
        <meta name='description' content={`${collegeName}习题库`} />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        <h3 className='scroll-m-20 py-6 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
          {collegeName}
        </h3>
        <ul className='grid w-full grid-cols-2 gap-3 p-4 lg:grid-cols-3'>
          {courseList?.length
            ? courseList.map((item) => <EditCourseDialog key={item.id} courseId={item.id} name={item.name} />)
            : null}
          <CreateCourseDialog collegeSlug={slug} />
        </ul>
      </div>
    </>
  );
}

CollegeDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
