import { useState, type ReactElement } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { SidebarLayout } from '~/layouts/SidebarLayout';
import { EditExerciseDialog } from '~/components/EditExerciseDialog';
import { Icons } from '~/components/Icons';
import { Button } from '~/components/ui/Button';
import { difficultyWithoutAllMapping, exerciseTypeWithoutAllMapping } from '~/constants/mapping';
import { api } from '~/utils/api';

export default function ExerciseDetailPage() {
  const router = useRouter();
  const exerciseId = router.query.eid && typeof router.query.eid === 'string' ? router.query.eid : '';
  const collegeSlug = router.query.slug && typeof router.query.slug === 'string' ? router.query.slug : '';

  const exercise = api.exercise.getExercise.useQuery(
    { exerciseId },
    {
      enabled: !!router.query.eid,
    }
  ).data;
  const [error, setError] = useState('');

  const exerciseContext = api.useContext().exercise;
  const deleteExercise = api.exercise.deleteExercise.useMutation({
    onSuccess: async () => {
      toast.success('习题已删除');
      await exerciseContext.invalidate();
      await router.push(`/college/${collegeSlug}/${exercise?.knowledgePoint.id || ''}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function onDeleteCourse() {
    await deleteExercise.mutateAsync({
      exerciseId,
    });
  }

  const bookmarkExercise = api.exercise.bookmarkExercise.useMutation({
    onSuccess: async () => {
      await exerciseContext.getExercise.invalidate();
    },
  });
  const removeBookmarkExercise = api.exercise.removeBookmarkExercise.useMutation({
    onSuccess: async () => {
      await exerciseContext.getExercise.invalidate();
    },
  });

  async function onBookmark({ exerciseId }: { exerciseId: string }) {
    await bookmarkExercise.mutateAsync({
      exerciseId,
    });
  }

  async function onRemoveBookmark({ exerciseId }: { exerciseId: string }) {
    await removeBookmarkExercise.mutateAsync({
      exerciseId,
    });
  }

  return exercise ? (
    <div className='mt-6 flex w-full flex-col space-y-4 rounded-md border border-slate-200 px-6 py-4 dark:border-slate-700'>
      <div className='flex flex-wrap items-end justify-between space-y-2 border-b pb-2'>
        <div className='flex items-center space-x-2'>
          <div className='flex shrink-0 select-none items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-700 hover:text-slate-50'>
            题目难度：{difficultyWithoutAllMapping[exercise.difficulty]}
          </div>
          <div className='flex shrink-0 select-none items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-700 hover:text-slate-50'>
            题目类型：{exerciseTypeWithoutAllMapping[exercise.type]}
          </div>
        </div>
        <div className='text-sm text-slate-700 dark:text-slate-400'>
          最近更新：{dayjs(exercise.updatedAt).format('YYYY-MM-DD')}
        </div>
      </div>

      <div>
        <div className='text-lg font-semibold'>题目：</div>
        <p>{exercise.question}</p>

        {exercise.options.length > 0 ? (
          <ul>
            {exercise.options.map((option, index) => (
              <li key={option.id} className='flex items-start'>
                <div className='mr-1'>{String.fromCharCode(String(index + 1).charCodeAt(0) + 16)}.</div>
                <div>{option.content}</div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div>
        <div className='text-lg font-semibold'>答案：</div>
        <p>{exercise.answer}</p>
      </div>

      {exercise.analysis ? (
        <div>
          <div className='text-lg font-semibold'>解析：</div>
          <p>{exercise.analysis}</p>
        </div>
      ) : null}

      {exercise.user ? (
        <div>
          <div className='text-lg font-semibold'>上传时间与上传人：</div>
          <div className='flex items-center space-x-2'>
            <p>{exercise.user.name}</p>
            <p>{dayjs(exercise.createdAt).format('YYYY-MM-DD')}</p>
          </div>
        </div>
      ) : null}

      <div>
        <div className='text-lg font-semibold'>关联知识点：</div>
        <Link href={`/college/${collegeSlug}/${exercise.knowledgePoint.id}`} className='underline'>
          <p>{exercise.knowledgePoint.name}</p>
        </Link>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center space-x-4'>
          {exercise.bookmarks.length > 0 ? (
            <Button onClick={() => onRemoveBookmark({ exerciseId: exercise.id })}>
              <Icons.BookmarkMinus className='mr-2 h-5 w-5' /> 取消收藏
            </Button>
          ) : (
            <Button onClick={() => onBookmark({ exerciseId: exercise.id })}>
              <Icons.BookmarkPlus className='mr-2 h-5 w-5' /> 收藏
            </Button>
          )}

          <EditExerciseDialog
            exerciseId={exerciseId}
            answer={exercise.answer}
            analysis={exercise.analysis || ''}
            question={exercise.question}
            options={exercise.options}
            type={exercise.type}
            difficulty={exercise.difficulty}
          />

          <Button variant='destructive' onClick={onDeleteCourse}>
            删除该习题
          </Button>
        </div>

        {error ? <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{error}</div> : null}
      </div>
    </div>
  ) : null;
}

ExerciseDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
