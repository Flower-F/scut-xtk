import Head from 'next/head';
import { usePathname } from 'next/navigation';

import { DashboardLayout } from '~/layouts/DashboardLayout';
import { collegeMapping } from '~/constants/college';

export default function DashboardCollegeDetail() {
  const splitPathnames = usePathname()?.split('/');
  const slug = splitPathnames?.length > 0 ? splitPathnames[splitPathnames.length - 1] : '';
  const college = slug && slug in collegeMapping ? collegeMapping[slug as keyof typeof collegeMapping] : undefined;

  return (
    <>
      <Head>
        <title>{college ? college : '选择学院'}</title>
        <meta name='description' content='习题库内容的管理面板' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <DashboardLayout>
        <div>DashBoardPage</div>
      </DashboardLayout>
    </>
  );
}
