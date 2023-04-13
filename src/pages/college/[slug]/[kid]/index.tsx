import { type ReactElement } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { DifficultyType, ExerciseType } from '@prisma/client';
import InfiniteScroll from 'react-infinite-scroll-component';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { CreateExerciseDialog } from '~/components/CreateExerciseDialog';
import { EditKnowledgePointDialog } from '~/components/EditKnowledgePointDialog';
import { ExerciseItem } from '~/components/ExerciseItem';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/RadioGroup';
import { difficultyTypeMapping, exerciseTypeMapping } from '~/constants/mapping';
import { api } from '~/utils/api';

const LIMIT = 10;

export default function KnowledgePointDetailPage() {
  const router = useRouter();
  const knowledgePointId = router.query.kid && typeof router.query.kid === 'string' ? router.query.kid : '';
  const collegeSlug = router.query.slug && typeof router.query.slug === 'string' ? router.query.slug : '';

  const knowledgePoint = api.knowledgePoint.getKnowledgePointById.useQuery(
    { knowledgePointId },
    {
      enabled: !!router.query.kid,
    }
  ).data;

  const knowledgePointName = knowledgePoint?.name || '知识点习题';

  const getExerciseList = api.exercise.getExerciseList.useInfiniteQuery(
    {
      limit: LIMIT,
      knowledgePointId,
    },
    {
      enabled: !!router.query.kid,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <>
      <Head>
        <title>{knowledgePointName}</title>
        <meta name='description' content={`知识点${knowledgePointName}的习题`} />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        <div className='flex w-full items-center justify-between'>
          <h3 className='scroll-m-20 py-6 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
            {knowledgePointName}
          </h3>

          <div className='flex items-center space-x-3'>
            <EditKnowledgePointDialog knowledgePointId={knowledgePointId} />
            <CreateExerciseDialog knowledgePointId={knowledgePointId} />
          </div>
        </div>

        <div className='flex flex-col space-y-4'>
          <div className='flex w-full items-center space-x-4'>
            <Input type='text' className='w-full' />
            <Button className='shrink-0'>查找题目</Button>
          </div>

          <div className='flex items-center'>
            <div className='shrink-0'>题目难度：</div>
            <RadioGroup defaultValue={DifficultyType.ANY} className='flex flex-row flex-wrap items-center'>
              {(Object.keys(DifficultyType) as Array<keyof typeof DifficultyType>).map((key) => (
                <div className='flex items-center space-x-2' key={key}>
                  <RadioGroupItem value={DifficultyType[key]} id={DifficultyType[key]} />
                  <Label htmlFor={DifficultyType[key]}>{difficultyTypeMapping[DifficultyType[key]]}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className='flex items-center'>
            <div className='shrink-0'>题目类型：</div>
            <RadioGroup defaultValue={ExerciseType.ALL_QUESTION} className='flex flex-row flex-wrap items-center'>
              {(Object.keys(ExerciseType) as Array<keyof typeof ExerciseType>).map((key) => (
                <div className='flex items-center space-x-2' key={key}>
                  <RadioGroupItem value={ExerciseType[key]} id={ExerciseType[key]} />
                  <Label htmlFor={ExerciseType[key]}>{exerciseTypeMapping[ExerciseType[key]]}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <InfiniteScroll
          dataLength={getExerciseList.data?.pages.flatMap((page) => page.exerciseList).length ?? 0}
          next={getExerciseList.fetchNextPage}
          hasMore={Boolean(getExerciseList.hasNextPage)}
          loader={<div className='text-center font-bold'>试题加载中...</div>}
          endMessage={<div className='text-center font-bold'>暂无其他题目</div>}
        >
          <ul className='my-6 space-y-6'>
            {getExerciseList.isSuccess &&
              getExerciseList.data.pages
                .flatMap((page) => page.exerciseList)
                .map((exercise) => {
                  return (
                    <ExerciseItem
                      key={exercise.id}
                      knowledgePointId={knowledgePointId}
                      collegeSlug={collegeSlug}
                      user={exercise.user}
                      id={exercise.id}
                      updatedAt={exercise.updatedAt}
                      options={exercise.options}
                      type={exercise.type}
                      difficulty={exercise.difficulty}
                      question={exercise.question}
                      answer={exercise.answer}
                      analysis={exercise.analysis}
                    />
                  );
                })}
          </ul>
        </InfiniteScroll>
      </div>
    </>
  );
}

KnowledgePointDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
