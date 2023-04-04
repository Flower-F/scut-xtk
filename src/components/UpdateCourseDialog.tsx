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

const updateCourseInputSchema = z.object({
  name: z.string().nonempty('课程姓名不得为空'),
});

type UpdateCourseInput = z.TypeOf<typeof updateCourseInputSchema>;

export function UpdateCourseDialog({ name, id }: { id: string; name: string }) {
  const [updateCourseError, setUpdateCourseError] = useState('');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateCourseInput>({
    resolver: zodResolver(updateCourseInputSchema),
  });

  const courseContext = api.useContext().course;
  const updateCourse = api.course.updateCourse.useMutation({
    onSuccess: async () => {
      toast.success('课程信息修改成功');
      await courseContext.invalidate();
      reset();
      setOpenUpdateDialog(false);
    },
    onError: (err) => {
      setUpdateCourseError(err.message);
    },
  });

  async function onSubmitUpdateCourse(input: Omit<UpdateCourseInput, 'id'>, { id }: { id: string }) {
    await updateCourse.mutateAsync({
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
        <form onSubmit={handleSubmit((data) => onSubmitUpdateCourse(data, { id }))}>
          <DialogHeader>
            <DialogTitle>编辑课程信息</DialogTitle>
            <div className='grid gap-4 py-4'>
              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='name'>课程名称</Label>
                <Controller
                  name='name'
                  control={control}
                  defaultValue={name || ''}
                  render={({ field }) => <Input type='text' id='name' placeholder='请输入课程名称' {...field} />}
                />
                {errors.name ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.name.message}</div>
                ) : null}
              </div>
            </div>

            {updateCourseError ? (
              <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{updateCourseError}</div>
            ) : null}
            <DialogFooter>
              <Button type='submit'>提交</Button>
            </DialogFooter>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>
  );
}
