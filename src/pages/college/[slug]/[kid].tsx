import { type ReactElement } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { CreateExerciseDialog } from '~/components/CreateExerciseDialog';
import { EditKnowledgePointDialog } from '~/components/EditKnowledgePointDialog';
import { api } from '~/utils/api';

export default function ExercisePage() {
  const router = useRouter();
  const knowledgePointId = router.query.kid && typeof router.query.kid === 'string' ? router.query.kid : '';
  const slug = router.query.slug && typeof router.query.slug === 'string' ? router.query.slug : '';

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
      <div>
        <h3 className='scroll-m-20 py-6 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
          {knowledgePointName}
        </h3>
        <ul className='flex w-full space-x-2'>
          <EditKnowledgePointDialog id={knowledgePointId} name={knowledgePointName} slug={slug} />
          <CreateExerciseDialog knowledgePointId={knowledgePointId} />
        </ul>
      </div>
    </>
  );
}

ExercisePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
