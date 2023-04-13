import { difficultyWithoutAllMapping, exerciseTypeWithoutAllMapping } from '~/constants/mapping';
import { type RouterOutputs } from '~/utils/api';
import 'dayjs/locale/zh-cn';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Icons } from '~/components/Icons';
import { buttonVariants } from '~/components/ui/Button';
import { cn } from '~/utils/common';

dayjs.extend(relativeTime);

type ExerciseItem = RouterOutputs['exercise']['getExerciseList']['exerciseList'][number];

interface ExerciseItemProps extends ExerciseItem {
  knowledgePointId: string;
  collegeSlug: string;
}

export function ExerciseItem({ knowledgePointId, collegeSlug, ...exercise }: ExerciseItemProps) {
  return (
    <li>
      <div className='flex w-full flex-col space-y-4 rounded-md border border-slate-200 px-6 py-4 dark:border-slate-700'>
        <div className='flex flex-wrap items-end justify-between space-y-2 border-b pb-2'>
          <div className='flex items-center space-x-2'>
            <div className='flex shrink-0 select-none items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-700 hover:text-slate-50'>
              题目类型：{exerciseTypeWithoutAllMapping[exercise.type]}
            </div>
            <div className='flex shrink-0 select-none items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-700 hover:text-slate-50'>
              题目难度：{difficultyWithoutAllMapping[exercise.difficulty]}
            </div>
          </div>
          <div className='text-sm text-slate-700 dark:text-slate-400'>
            最近更新：{dayjs(exercise.updatedAt).locale('zh-cn').fromNow()}
          </div>
        </div>

        <div>
          <div className='font-semibold'>题目：</div>
          <p>{exercise.question}</p>
        </div>

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

        <div>
          <div className='font-semibold'>答案：</div>
          <p>{exercise.answer}</p>
        </div>

        {exercise.analysis ? (
          <div>
            <div className='font-semibold'>解析：</div>
            <p>{exercise.analysis}</p>
          </div>
        ) : null}

        <div className='text-right'>
          <Link
            href={`/college/${collegeSlug}/${knowledgePointId}/${exercise.id}`}
            className={cn(buttonVariants({ variant: 'subtle' }), 'space-x-2')}
          >
            <div>查看详情</div>
            <Icons.ChevronRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </li>
  );
}
