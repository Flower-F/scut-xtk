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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout sidebarNavItems={sidebarNavItems}>
      <div className='flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10'>
        <aside className='fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-r-slate-100 dark:border-r-slate-700 md:sticky md:flex'>
          <ScrollArea className='pr-6 lg:py-10'>
            <SidebarNav items={sidebarNavItems} />
          </ScrollArea>
        </aside>
        {children}
      </div>
    </MainLayout>
  );
}
