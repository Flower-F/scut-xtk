import { type ReactElement } from 'react';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
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

function standardDifficulty(difficulty: string | null): DifficultyType | undefined {
  if (!difficulty) {
    return 'ANY';
  }

  if (Object.values(DifficultyType).some((a) => difficulty === a)) {
    return difficulty as DifficultyType;
  }

  return 'ANY';
}

function standardType(type: string | null): ExerciseType | undefined {
  if (!type) {
    return 'ALL_QUESTION';
  }

  if (Object.values(ExerciseType).some((a) => type === a)) {
    return type as ExerciseType;
  }

  return 'ALL_QUESTION';
}

export default function KnowledgePointDetailPage() {
  const router = useRouter();
  const knowledgePointId = router.query.kid && typeof router.query.kid === 'string' ? router.query.kid : '';
  const collegeSlug = router.query.slug && typeof router.query.slug === 'string' ? router.query.slug : '';

  const searchParams = useSearchParams();
  const difficulty = standardDifficulty(searchParams.get('difficulty'));
  const type = standardType(searchParams.get('type'));
  const keyword = searchParams.get('keyword');

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
      keyword,
      type,
      difficulty,
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
            <EditKnowledgePointDialog
              knowledgePointId={knowledgePointId}
              name={knowledgePoint?.name || ''}
              label={knowledgePoint?.label || ''}
            />
            <CreateExerciseDialog knowledgePointId={knowledgePointId} />
          </div>
        </div>

        <form className='flex flex-col space-y-4'>
          {router.isReady ? (
            <div className='flex items-center'>
              <div className='shrink-0'>题目难度：</div>
              <RadioGroup defaultValue={difficulty} name='difficulty' className='flex flex-row flex-wrap items-center'>
                {(Object.keys(DifficultyType) as Array<keyof typeof DifficultyType>).map((key) => (
                  <div className='flex items-center space-x-2' key={key}>
                    <RadioGroupItem value={DifficultyType[key]} id={DifficultyType[key]} />
                    <Label htmlFor={DifficultyType[key]}>{difficultyTypeMapping[DifficultyType[key]]}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : null}

          {router.isReady ? (
            <div className='flex items-center'>
              <div className='shrink-0'>题目类型：</div>
              <RadioGroup defaultValue={type} name='type' className='flex flex-row flex-wrap items-center'>
                {(Object.keys(ExerciseType) as Array<keyof typeof ExerciseType>).map((key) => (
                  <div className='flex items-center space-x-2' key={key}>
                    <RadioGroupItem value={ExerciseType[key]} id={ExerciseType[key]} />
                    <Label htmlFor={ExerciseType[key]}>{exerciseTypeMapping[ExerciseType[key]]}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : null}

          <div className='flex w-full items-center space-x-4'>
            <Input
              type='search'
              name='keyword'
              className='w-full'
              placeholder='请输入题目的关键词（知识点、题目、答案等）'
              defaultValue={keyword || ''}
            />
            <Button className='shrink-0' type='submit'>
              查找题目
            </Button>
          </div>
        </form>

        <InfiniteScroll
          dataLength={getExerciseList.data?.pages.flatMap((page) => page.exerciseList).length ?? 0}
          next={getExerciseList.fetchNextPage}
          hasMore={Boolean(getExerciseList.hasNextPage)}
          loader={<div className='pb-6 text-center font-bold'>试题加载中...</div>}
          endMessage={<div className='pb-6 text-center font-bold'>暂无其他题目</div>}
        >
          <ul className='space-y-6 py-6'>
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
                      bookmarks={exercise.bookmarks}
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
