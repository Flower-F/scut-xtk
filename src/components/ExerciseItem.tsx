import { difficultyWithoutAllMapping, exerciseTypeWithoutAllMapping } from '~/constants/mapping';
import { api, type RouterOutputs } from '~/utils/api';
import 'dayjs/locale/zh-cn';
import { useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Icons } from '~/components/Icons';
import { Button, buttonVariants } from '~/components/ui/Button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/Collapsible';
import { cn } from '~/utils/common';

dayjs.extend(relativeTime);

type ExerciseItem = RouterOutputs['exercise']['getExerciseList']['exerciseList'][number];

interface ExerciseItemProps extends ExerciseItem {
  knowledgePointId?: string;
  collegeSlug?: string;
}

export function ExerciseItem({ knowledgePointId, collegeSlug, ...exercise }: ExerciseItemProps) {
  const [isOpened, setIsOpened] = useState(false);

  const exerciseContext = api.useContext().exercise;
  const bookmarkExercise = api.exercise.bookmarkExercise.useMutation({
    onSuccess: async () => {
      if (knowledgePointId && collegeSlug) {
        await exerciseContext.getExerciseList.invalidate();
      } else {
        await exerciseContext.getUserBookmarkList.invalidate();
      }
    },
  });
  const removeBookmarkExercise = api.exercise.removeBookmarkExercise.useMutation({
    onSuccess: async () => {
      if (knowledgePointId && collegeSlug) {
        await exerciseContext.getExerciseList.invalidate();
      } else {
        await exerciseContext.getUserBookmarkList.invalidate();
      }
    },
  });

  async function onBookmark() {
    await bookmarkExercise.mutateAsync({
      exerciseId: exercise.id,
    });
  }

  async function onRemoveBookmark() {
    await removeBookmarkExercise.mutateAsync({
      exerciseId: exercise.id,
    });
  }

  return (
    <li className='flex w-full flex-col space-y-4 rounded-md border border-slate-200 px-6 py-4 dark:border-slate-700'>
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
          最近更新：{dayjs(exercise.updatedAt).locale('zh-cn').fromNow()}
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

      <Collapsible open={isOpened} onOpenChange={setIsOpened} className={`relative ${isOpened ? 'pb-16' : ''}`}>
        <CollapsibleContent forceMount className={cn('overflow-hidden', !isOpened && 'max-h-16')}>
          <div className='space-y-4'>
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
          </div>
        </CollapsibleContent>

        <div
          className={cn(
            'absolute flex items-center justify-center bg-gradient-to-b from-white to-white p-2 dark:from-slate-900/30 dark:to-slate-900/90',
            isOpened ? 'inset-x-0 bottom-0 h-12' : 'inset-0'
          )}
        >
          <CollapsibleTrigger asChild>
            <Button variant='subtle' className='h-8 text-xs'>
              {isOpened ? '隐藏答案' : '显示答案'}
            </Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>

      <div className='flex items-center justify-end space-x-4'>
        {exercise.bookmarks.length > 0 ? (
          <Button onClick={onRemoveBookmark}>
            <Icons.BookmarkMinus className='mr-2 h-5 w-5' /> 取消收藏
          </Button>
        ) : (
          <Button onClick={onBookmark}>
            <Icons.BookmarkPlus className='mr-2 h-5 w-5' /> 收藏
          </Button>
        )}

        {collegeSlug && knowledgePointId ? (
          <div>
            <Link
              href={`/college/${collegeSlug}/${knowledgePointId}/${exercise.id}`}
              className={cn(buttonVariants({ variant: 'subtle' }), 'space-x-2')}
            >
              <div>查看详情</div>
              <Icons.ChevronRight className='h-4 w-4' />
            </Link>
          </div>
        ) : null}
      </div>
    </li>
  );
}
