import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { type SidebarNavItem } from '~/types/nav';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/Accordion';
import { cn } from '~/utils/common';

interface SidebarNavProps {
  items?: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const searchParams = useSearchParams();
  const knowledgePointId = searchParams.get('knowledgePointId');

  return items?.length ? (
    <div className='w-full'>
      {items.map((item, index) => (
        <div key={index} className={cn('pb-6')}>
          <h4 className='mb-1 rounded-md px-2 py-1 text-sm font-semibold'>{item.name}</h4>
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
        {items.map((item) => (
          <AccordionItem value={item.name} key={item.id} className='px-2'>
            <AccordionTrigger>{item.name}</AccordionTrigger>
            {item.items.map((item) => (
              <AccordionContent key={item.id}>
                <Link
                  href={`/college/${collegeSlug}?knowledgePointId=${item.id}`}
                  className={cn(
                    'group flex w-full items-center rounded-md px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800',
                    item.disabled && 'cursor-not-allowed opacity-60',
                    {
                      'bg-slate-100 dark:bg-slate-800': item.id === knowledgePointId,
                    }
                  )}
                  target={item.external ? '_blank' : ''}
                  rel={item.external ? 'noreferrer' : ''}
                >
                  {item.name}
                  {item.label && (
                    <span className='ml-2 rounded-md bg-teal-100 px-1.5 py-0.5 text-xs no-underline group-hover:no-underline dark:text-slate-900'>
                      {item.label}
                    </span>
                  )}
                </Link>
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ) : null;
}
