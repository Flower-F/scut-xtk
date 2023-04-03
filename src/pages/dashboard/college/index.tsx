import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { type NavItem } from '~/types/nav';
import { MainLayout } from '~/layouts/MainLayout';
import { Icons } from '~/components/Icons';
import { Button } from '~/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/Dialog';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { collegeMapping } from '~/constants/college';
import { cn } from '~/utils/common';

const mainNavItems: NavItem[] = (Object.keys(collegeMapping) as Array<keyof typeof collegeMapping>).map((key) => {
  return {
    title: collegeMapping[key],
    href: `/dashboard/college/${key}`,
  };
});

export const updateCollegeInputSchema = z.object({
  name: z.string().nonempty('学院姓名不得为空'),
  slug: z.string().nonempty('学院标识不得为空'),
});

type UpdateCollegeInput = z.TypeOf<typeof updateCollegeInputSchema>;

export const createCollegeInputSchema = z.object({
  name: z.string().nonempty('学院姓名不得为空'),
  slug: z.string().nonempty('学院标识不得为空'),
});

type CreateCollegeInput = z.TypeOf<typeof createCollegeInputSchema>;

export default function DashboardCollegePage() {
  const { data: sessionData } = useSession();
  const updateCollegeForm = useForm<UpdateCollegeInput>();
  const createCollegeForm = useForm<CreateCollegeInput>({
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  console.log('sessionData: ', sessionData);

  return (
    <>
      <Head>
        <title>学院全览</title>
        <meta name='description' content='学院全览' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainLayout>
        <div className='flex items-center justify-center gap-4'>
          <h2 className='scroll-m-20 py-6 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
            学院全览
          </h2>
          {/* {sessionData?.user.role ? (
            <Button className='p-2' variant='ghost' onClick={() => setIsEditing(!isEditing)}>
              <Icons.Edit />
            </Button>
          ) : null} */}
        </div>
        <ul className='grid w-full grid-cols-2 gap-3 p-4 md:grid-cols-3 xl:grid-cols-4'>
          {mainNavItems?.length
            ? mainNavItems.map((item, index) =>
                sessionData?.user.role === 'ADMIN' ? (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Button variant='ghost' className='text-base'>
                        {item.title}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-[425px]'>
                      <DialogHeader>
                        <DialogTitle>编辑学院信息</DialogTitle>
                      </DialogHeader>
                      <form className='grid gap-4 py-4'>
                        <div className='grid w-full items-center gap-1.5'>
                          <Label htmlFor='name'>学院名称</Label>
                          <Controller
                            name='name'
                            control={updateCollegeForm.control}
                            render={({ field }) => (
                              <Input
                                type='text'
                                id='name'
                                placeholder='请输入学院名称'
                                defaultValue={item.title}
                                {...field}
                              />
                            )}
                          />
                          {updateCollegeForm.formState.errors.name ? (
                            <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                              {updateCollegeForm.formState.errors.name.message}
                            </div>
                          ) : null}
                        </div>
                        <div className='grid w-full items-center gap-1.5'>
                          <Label htmlFor='slug'>学院标识</Label>
                          <Controller
                            name='slug'
                            control={updateCollegeForm.control}
                            render={({ field }) => (
                              <Input
                                type='text'
                                id='slug'
                                placeholder='请输入学院标识'
                                defaultValue={item.slug || ''}
                                {...field}
                              />
                            )}
                          />
                          {updateCollegeForm.formState.errors.slug ? (
                            <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                              {updateCollegeForm.formState.errors.slug.message}
                            </div>
                          ) : null}
                        </div>
                      </form>
                      <DialogFooter>
                        <Button type='submit'>提交</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <ListItem key={index} title={item.title} href={item.href || '/'} />
                )
              )
            : null}
          {sessionData?.user.role === 'ADMIN' ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className='gap-2'>
                  <Icons.PlusCircle /> 添加学院
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>编辑学院信息</DialogTitle>
                </DialogHeader>
                <form className='grid gap-4 py-4'>
                  <div className='grid w-full items-center gap-1.5'>
                    <Label htmlFor='name'>学院名称</Label>
                    <Controller
                      name='name'
                      control={updateCollegeForm.control}
                      render={({ field }) => (
                        <Input type='text' id='name' placeholder='请输入学院名称' defaultValue='' {...field} />
                      )}
                    />
                    {updateCollegeForm.formState.errors.name ? (
                      <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                        {updateCollegeForm.formState.errors.name.message}
                      </div>
                    ) : null}
                  </div>
                  <div className='grid w-full items-center gap-1.5'>
                    <Label htmlFor='slug'>学院标识</Label>
                    <Controller
                      name='slug'
                      control={updateCollegeForm.control}
                      render={({ field }) => (
                        <Input type='text' id='slug' placeholder='请输入学院标识' defaultValue='' {...field} />
                      )}
                    />
                    {updateCollegeForm.formState.errors.slug ? (
                      <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                        {updateCollegeForm.formState.errors.slug.message}
                      </div>
                    ) : null}
                  </div>
                </form>
                <DialogFooter>
                  <Button type='submit'>提交</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null}
        </ul>
      </MainLayout>
    </>
  );
}

const ListItem = forwardRef<ElementRef<typeof Link>, ComponentPropsWithoutRef<typeof Link>>(
  ({ className, title, href, ...props }, ref) => {
    return (
      <li>
        <Link href={href} ref={ref} passHref legacyBehavior {...props}>
          <a
            className={cn(
              'inline-block w-full select-none rounded-md p-3 text-center no-underline outline-none transition-colors hover:bg-slate-100 hover:underline focus:bg-slate-100 dark:hover:bg-slate-700 dark:focus:bg-slate-700',
              className
            )}
          >
            {title}
          </a>
        </Link>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
