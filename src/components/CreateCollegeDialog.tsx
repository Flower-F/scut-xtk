import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Icons } from '~/components/Icons';
import { Button } from '~/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/Dialog';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { api } from '~/utils/api';

const createCollegeInputSchema = z.object({
  name: z.string().nonempty('学院姓名不得为空'),
  slug: z.string().nonempty('学院标识不得为空'),
});

type CreateCollegeInput = z.TypeOf<typeof createCollegeInputSchema>;

export function CreateCollegeDialog() {
  const createCollegeForm = useForm<CreateCollegeInput>({
    resolver: zodResolver(createCollegeInputSchema),
  });
  const [createCollegeError, setCreateCollegeError] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const collegeContext = api.useContext().college;
  const createCollege = api.college.createCollege.useMutation({
    onSuccess: async () => {
      toast.success('学院创建成功');
      await collegeContext.invalidate();
      createCollegeForm.reset();
      setOpenCreateDialog(false);
    },
    onError: (err) => {
      setCreateCollegeError(err.message);
    },
  });

  async function onSubmitCreateCollege(input: CreateCollegeInput) {
    await createCollege.mutateAsync(input);
  }

  return (
    <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
      <DialogTrigger asChild onClick={() => setOpenCreateDialog(true)}>
        <Button className='gap-2'>
          <Icons.PlusCircle /> 添加学院
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <form onSubmit={createCollegeForm.handleSubmit(onSubmitCreateCollege)}>
          <DialogHeader>
            <DialogTitle>新增学院信息</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='name'>学院名称</Label>
              <Controller
                name='name'
                control={createCollegeForm.control}
                defaultValue=''
                render={({ field }) => <Input type='text' id='name' placeholder='请输入学院名称' {...field} />}
              />
              {createCollegeForm.formState.errors.name ? (
                <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                  {createCollegeForm.formState.errors.name.message}
                </div>
              ) : null}
            </div>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='slug'>学院标识</Label>
              <Controller
                name='slug'
                control={createCollegeForm.control}
                defaultValue=''
                render={({ field }) => <Input type='text' id='slug' placeholder='请输入学院标识' {...field} />}
              />
              {createCollegeForm.formState.errors.slug ? (
                <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                  {createCollegeForm.formState.errors.slug.message}
                </div>
              ) : null}
            </div>
          </div>

          {createCollegeError ? (
            <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{createCollegeError}</div>
          ) : null}
          <DialogFooter>
            <Button type='submit'>提交</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
