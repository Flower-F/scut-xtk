import Head from 'next/head';
import { useRouter } from 'next/router';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { api } from '~/utils/api';

export default function KnowledgePointPage() {
  const router = useRouter();
  const knowledgePointId = router.query.kid && typeof router.query.kid === 'string' ? router.query.kid : '';

  const knowledgePointName =
    api.knowledgePoint.getKnowledgePointById.useQuery(
      { knowledgePointId },
      {
        enabled: !!router.query.kid,
      }
    ).data?.name || '知识点习题';

  return (
    <>
      <Head>
        <title>{knowledgePointName}</title>
        <meta name='description' content={`知识点${knowledgePointName}的习题`} />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <SidebarLayout>
        <div>
          <h3 className='scroll-m-20 py-6 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
            {knowledgePointName}
          </h3>
          <ul className='grid w-full grid-cols-2 gap-3 p-4'>hello world</ul>
        </div>
      </SidebarLayout>
    </>
  );
}
