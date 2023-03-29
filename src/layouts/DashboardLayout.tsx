import { type ReactNode } from 'react';

import { MainLayout } from '~/layouts/MainLayout';
import { SidebarNav } from '~/components/SidebarNav';
import { ScrollArea } from '~/components/ui/ScrollArea';
import { collegeMapping } from '~/constants/college';

const sidebarNavItems = [
  {
    title: '网站介绍',
    items: [
      {
        title: '网站背景',
        href: '/dashboard',
        items: [],
      },
      {
        title: '使用说明',
        href: '/dashboard/get-started',
        items: [],
      },
      // {
      //   title: 'Typography',
      //   href: '/docs/primitives/typography',
      //   items: [],
      // },
    ],
  },
  // {
  //   title: 'Community',
  //   items: [
  //     {
  //       title: 'Figma',
  //       href: '/figma',
  //       label: 'New',
  //       items: [],
  //     },
  //   ],
  // },
  {
    title: '学院选择',
    items: (Object.keys(collegeMapping) as Array<keyof typeof collegeMapping>).map((key) => {
      return {
        title: collegeMapping[key],
        href: `/dashboard/college/${key}`,
        items: [],
      };
    }),
  },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <MainLayout mobileNavItems={sidebarNavItems}>
      <div className='flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10'>
        <aside className='fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-r-slate-100 dark:border-r-slate-700 md:sticky md:block md:py-4 lg:py-10'>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='mb-2.5 w-full'>
                {college}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='h-[400px] w-full overflow-y-auto'>
              <DropdownMenuLabel>切换学院</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={college}>
                {sidebarNavItems.map((item) => {
                  return item.items.length
                    ? item.items.map((item) => (
                        <DropdownMenuRadioItem value={item.title} key={item.title}>
                          <Link href={item.href} className='inline-block w-full'>
                            {item.title}
                          </Link>
                        </DropdownMenuRadioItem>
                      ))
                    : null;
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <ScrollArea>
            <SidebarNav items={sidebarNavItems} />
          </ScrollArea>
        </aside>
        {children}
      </div>
    </MainLayout>
  );
}
