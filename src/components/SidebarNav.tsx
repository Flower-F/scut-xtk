import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { type SidebarNavItem } from '~/types/nav';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/Accordion';
import { cn } from '~/utils/common';
import { CreateKnowledgePointDialog } from './CreateKnowledgePointDialog';

interface SidebarNavProps {
  items?: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const searchParams = useSearchParams();
  const knowledgePointId = searchParams.get('knowledgePointId');

  return items?.length ? (
    <div className='w-full'>
      {items.map((item) => (
        <div key={item.id} className='pb-6'>
          <h4 className='scroll-m-20 text-center text-xl font-semibold tracking-tight hover:underline'>
            <Link href={`/college/${item.slug || ''}`} className='inline-block w-full'>
              {item.name}
            </Link>
          </h4>
          {item.items?.length && (
            <SidebarNavItems
              items={item.items}
              collegeSlug={item.slug || ''}
              knowledgePointId={knowledgePointId || ''}
            />
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
                  href={`/college/${collegeSlug}?knowledgePointId=${knowledgePoint.id}`}
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
