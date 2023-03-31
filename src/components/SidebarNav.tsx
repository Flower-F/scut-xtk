import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { type SidebarNavItem } from '~/types/nav';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/Accordion';
import { cn } from '~/utils/common';

interface SidebarNavProps {
  items?: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const major = searchParams.get('major');

  return items?.length ? (
    <div className='w-full'>
      {items.map((item, index) => (
        <div key={index} className={cn('pb-6')}>
          <h4 className='mb-1 rounded-md px-2 py-1 text-sm font-semibold'>{item.title}</h4>
          {item.items?.length && <SidebarNavItems items={item.items} pathname={pathname} tag={major || ''} />}
        </div>
      ))}
    </div>
  ) : null;
}

interface SidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string;
  tag: string;
}

export function SidebarNavItems({ items, pathname, tag }: SidebarNavItemsProps) {
  console.log('items: ', items);

  return items.length ? (
    <div className='grid grid-flow-row auto-rows-max text-sm'>
      <Accordion type='single' collapsible>
        {items.map((item, index) => (
          <AccordionItem value={item.title} key={index} className='px-2'>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            {item.items.map((item, index) =>
              item.href ? (
                <AccordionContent key={index}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex w-full items-center rounded-md px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800',
                      item.disabled && 'cursor-not-allowed opacity-60',
                      {
                        'bg-slate-100 dark:bg-slate-800': `${pathname}?major=${tag}` === item.href,
                      }
                    )}
                    target={item.external ? '_blank' : ''}
                    rel={item.external ? 'noreferrer' : ''}
                  >
                    {item.title}
                    {item.label && (
                      <span className='ml-2 rounded-md bg-teal-100 px-1.5 py-0.5 text-xs no-underline group-hover:no-underline dark:text-slate-900'>
                        {item.label}
                      </span>
                    )}
                  </Link>
                </AccordionContent>
              ) : (
                <span key={index} className='cursor-not-allowed'>
                  <AccordionContent>{item.title}</AccordionContent>
                </span>
              )
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ) : null;
}
