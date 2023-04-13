import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DifficultyType, ExerciseType } from '@prisma/client';
import InfiniteScroll from 'react-infinite-scroll-component';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { CreateExerciseDialog } from '~/components/CreateExerciseDialog';
import { EditKnowledgePointDialog } from '~/components/EditKnowledgePointDialog';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/RadioGroup';
import {
  difficultyTypeMapping,
  difficultyWithoutAllMapping,
  exerciseTypeMapping,
  exerciseTypeWithoutAllMapping,
} from '~/constants/mapping';
import { api } from '~/utils/api';
import { cn } from '~/utils/common';

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
          loader={<h4>Loading...</h4>}
          endMessage={<p className='text-center font-bold'>已经到底了</p>}
        >
          {getExerciseList.isSuccess &&
            getExerciseList.data.pages
              .flatMap((page) => page.exerciseList)
              .map((exercise, index) => {
                return (
                  <ListItem key={index} href={`/college/${collegeSlug}/${knowledgePointId}/${exercise.id}`}>
                    <div>{exerciseTypeWithoutAllMapping[exercise.type]}</div>
                    <div>{difficultyWithoutAllMapping[exercise.difficulty]}</div>
                    <div>{exercise.question}</div>
                    <div>{exercise.answer}</div>
                  </ListItem>
                );
              })}
        </InfiniteScroll>
      </div>
    </>
  );
}

const ListItem = forwardRef<ElementRef<typeof Link>, ComponentPropsWithoutRef<typeof Link>>(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <Link
          href={href}
          ref={ref}
          legacyBehavior
          {...props}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-700 dark:focus:bg-slate-700',
            className
          )}
        >
          <div>
            <div className='text-sm font-medium leading-none'>{title}</div>
            {children}
          </div>
        </Link>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

KnowledgePointDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
