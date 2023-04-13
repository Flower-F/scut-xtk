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

export const createCollegeInputSchema = z.object({
  name: z.string().nonempty('学院名称不得为空'),
  collegeSlug: z.string().nonempty('学院标识不得为空'),
});

export type CreateCollegeInput = z.TypeOf<typeof createCollegeInputSchema>;

export function CreateCollegeDialog() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCollegeInput>({
    resolver: zodResolver(createCollegeInputSchema),
  });
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const collegeContext = api.useContext().college;
  const createCollege = api.college.createCollege.useMutation({
    onSuccess: async () => {
      toast.success('学院创建成功');
      await collegeContext.invalidate();
      reset();
      setOpenDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function onCreateCollege(input: CreateCollegeInput) {
    await createCollege.mutateAsync(input);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild onClick={() => setOpenDialog(true)}>
        <Button className='gap-2 text-base' size='lg'>
          <Icons.PlusCircle /> 添加学院
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <form onSubmit={handleSubmit(onCreateCollege)}>
          <DialogHeader>
            <DialogTitle>新增学院信息</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='name'>学院名称</Label>
              <Controller
                name='name'
                control={control}
                defaultValue=''
                render={({ field }) => <Input type='text' id='name' placeholder='请输入学院名称' {...field} />}
              />
              {errors.name ? (
                <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.name.message}</div>
              ) : null}
            </div>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='slug'>学院标识</Label>
              <Controller
                name='collegeSlug'
                control={control}
                defaultValue=''
                render={({ field }) => <Input type='text' id='slug' placeholder='请输入学院标识' {...field} />}
              />
              {errors.collegeSlug ? (
                <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.collegeSlug.message}</div>
              ) : null}
            </div>
          </div>

          {error ? <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{error}</div> : null}
          <DialogFooter>
            <Button type='submit'>提交</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
