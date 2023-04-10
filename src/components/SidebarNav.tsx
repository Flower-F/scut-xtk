import Link from 'next/link';
import { useRouter } from 'next/router';

import { type SidebarNavItem } from '~/types/nav';
import { CreateKnowledgePointDialog } from '~/components/CreateKnowledgePointDialog';
import { Icons } from '~/components/Icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/Accordion';
import { cn } from '~/utils/common';

interface SidebarNavProps {
  items?: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const router = useRouter();
  const knowledgePointId = router.query.kid && typeof router.query.kid === 'string' ? router.query.kid : '';

  return items?.length ? (
    <div className='w-full'>
      {items.map((college) => (
        <div key={college.id} className='pb-6'>
          {knowledgePointId ? (
            <Link
              href={`/college/${college.slug || ''}`}
              className='mb-2 flex w-full items-center text-lg hover:underline'
            >
              <Icons.ChevronLeft className='mr-2 h-6 w-6' />
              管理课程
            </Link>
          ) : null}

          {college.items?.length ? (
            <SidebarNavItems
              items={college.items}
              collegeSlug={college.slug || ''}
              knowledgePointId={knowledgePointId || ''}
            />
          ) : (
            <div>课程列表为空</div>
          )}
        </div>
      ))}
    </div>
  ) : null;
}

interface SidebarNavItemsProps {
  items: SidebarNavItem[];
  knowledgePointId: string;
  collegeSlug: string;
}

export function SidebarNavItems({ items, knowledgePointId, collegeSlug }: SidebarNavItemsProps) {
  return items.length ? (
    <div className='grid grid-flow-row auto-rows-max text-sm'>
      <Accordion type='single' collapsible>
        {items.map((course) => (
          <AccordionItem value={course.name} key={course.id} className='px-2'>
            <AccordionTrigger>{course.name}</AccordionTrigger>
            {course.items.map((knowledgePoint) => (
              <AccordionContent key={knowledgePoint.id}>
                <Link
                  href={`/college/${collegeSlug}/${knowledgePoint.id}`}
                  className={cn(
                    'group flex w-full items-center rounded-md px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800',
                    knowledgePoint.disabled && 'cursor-not-allowed opacity-60',
                    {
                      'bg-slate-100 dark:bg-slate-800': knowledgePoint.id === knowledgePointId,
                    }
                  )}
                  target={knowledgePoint.external ? '_blank' : ''}
                  rel={knowledgePoint.external ? 'noreferrer' : ''}
                >
                  {knowledgePoint.name}
                  {knowledgePoint.label && (
                    <span className='ml-2 rounded-md bg-teal-100 px-1.5 py-0.5 text-xs no-underline group-hover:no-underline dark:text-slate-900'>
                      {knowledgePoint.label}
                    </span>
                  )}
                </Link>
              </AccordionContent>
            ))}
            <AccordionContent>
              <CreateKnowledgePointDialog courseId={course.id} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ) : null;
}
