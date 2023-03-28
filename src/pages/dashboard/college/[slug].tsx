import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { collegeMapping } from '~/constants/college';
import { DashboardLayout } from '~/layouts/DashboardLayout';

export default function DashboardCollegeDetail() {
  const splitPathnames = usePathname()?.split('/');
  const slug = splitPathnames?.length > 0 ? splitPathnames[splitPathnames.length - 1] : '';

  return (
    <>
      <Head>
        <title>
          习题库 - {slug && slug in collegeMapping ? collegeMapping[slug as keyof typeof collegeMapping] : '未知学院'}
        </title>
        <meta name='description' content='习题库内容的管理面板' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <DashboardLayout>
        <div>DashBoardPage</div>
      </DashboardLayout>
    </>
  );
}
