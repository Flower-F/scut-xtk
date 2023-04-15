import { useEffect, useState, type ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { DifficultyType, ExerciseType } from '@prisma/client';
import { useSession } from 'next-auth/react';

import { MainLayout } from '~/layouts/MainLayout';
import { AdminUserTable } from '~/components/AdminUserTable';
import { ExerciseItem } from '~/components/ExerciseItem';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/RadioGroup';
import { difficultyTypeMapping, exerciseTypeMapping } from '~/constants/mapping';
import { api } from '~/utils/api';
import { standardDifficulty, standardType } from '~/utils/common';

export default function UserPage() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const searchParams = useSearchParams();
  const difficulty = standardDifficulty(searchParams.get('difficulty') || '');
  const type = standardType(searchParams.get('type') || '');
  const keyword = searchParams.get('keyword');

  const exerciseList = api.exercise.getUserBookmarkList.useQuery({
    keyword,
    type,
    difficulty,
  }).data;

  const getCollege = api.college.getCollegeById.useQuery({
    collegeId: sessionData?.user.collegeId !== null ? sessionData?.user.collegeId : undefined,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>用户主页</title>
        <meta name='description' content='习题库用户主页' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        {sessionData?.user.role === 'ADMIN' ? (
          <AdminUserTable />
        ) : (
          <div>
            <form className='mt-6 flex flex-col space-y-4'>
              {router.isReady ? (
                <div className='flex items-center'>
                  <div className='shrink-0'>题目难度：</div>
                  <RadioGroup
                    defaultValue={difficulty}
                    name='difficulty'
                    className='flex flex-row flex-wrap items-center'
                  >
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
                  <RadioGroup
                    defaultValue={type || 'ALL_QUESTION'}
                    name='type'
                    className='flex flex-row flex-wrap items-center'
                  >
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
                  placeholder='请输入题目或答案的关键词'
                  defaultValue={keyword || ''}
                />
                <Button className='shrink-0' type='submit'>
                  查找题目
                </Button>
              </div>
            </form>

            {exerciseList?.length ? (
              <ul className='space-y-6 py-6'>
                {exerciseList.map((exercise) => {
                  return (
                    <ExerciseItem
                      key={exercise.id}
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
            ) : (
              <div className='py-6 text-center'>
                暂未收藏任何题目，去查看
                <Link href={`/college/${getCollege.data?.slug || ''}`} className='font-semibold underline'>
                  学院知识点
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

UserPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
