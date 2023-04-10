import Head from 'next/head';
import { useRouter } from 'next/router';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { CreateCourseDialog } from '~/components/CreateCourseDialog';
import { UpdateCourseDialog } from '~/components/UpdateCourseDialog';
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
      <SidebarLayout>
        <div>
          <h3 className='scroll-m-20 py-6 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
            {collegeName}
          </h3>
          <ul className='grid w-full grid-cols-2 gap-3 p-4'>
            {courseList?.length
              ? courseList.map((item) => <UpdateCourseDialog key={item.id} id={item.id} name={item.name} />)
              : null}
            <CreateCourseDialog collegeSlug={slug} />
          </ul>
        </div>
      </SidebarLayout>
    </>
  );
}
