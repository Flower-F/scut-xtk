import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '~/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/Dialog';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { api } from '~/utils/api';

const updateCollegeInputSchema = z.object({
  name: z.string().nonempty('学院姓名不得为空'),
  slug: z.string().nonempty('学院标识不得为空'),
});

type UpdateCollegeInput = z.TypeOf<typeof updateCollegeInputSchema>;

export function UpdateCollegeDialog({ name, id, slug }: { id: string; name: string; slug: string }) {
  const [error, setError] = useState('');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCollegeInput>({
    resolver: zodResolver(updateCollegeInputSchema),
  });

  const collegeContext = api.useContext().college;
  const updateCollege = api.college.updateCollege.useMutation({
    onSuccess: async () => {
      toast.success('学院信息修改成功');
      await collegeContext.invalidate();
      reset();
      setOpenUpdateDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function onSubmitUpdateCollege(input: Omit<UpdateCollegeInput, 'id'>, { id }: { id: string }) {
    await updateCollege.mutateAsync({
      ...input,
      id,
    });
  }

  return (
    <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
      <DialogTrigger asChild>
        <Button variant='ghost' className='text-base' onClick={() => setOpenUpdateDialog(true)}>
          {name}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <form onSubmit={handleSubmit((data) => onSubmitUpdateCollege(data, { id }))}>
          <DialogHeader>
            <DialogTitle>编辑学院信息</DialogTitle>
            <div className='grid gap-4 py-4'>
              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='name'>学院名称</Label>
                <Controller
                  name='name'
                  control={control}
                  defaultValue={name || ''}
                  render={({ field }) => <Input type='text' id='name' placeholder='请输入学院名称' {...field} />}
                />
                {errors.name ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.name.message}</div>
                ) : null}
              </div>
              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='slug'>学院标识</Label>
                <Controller
                  name='slug'
                  control={control}
                  defaultValue={slug || ''}
                  render={({ field }) => <Input type='text' id='slug' placeholder='请输入学院标识' {...field} />}
                />
                {errors.slug ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.slug.message}</div>
                ) : null}
              </div>
            </div>

            {error ? <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{error}</div> : null}
            <DialogFooter>
              <Button type='submit'>提交</Button>
            </DialogFooter>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  );
}
