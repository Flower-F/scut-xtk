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

export const createCourseInputSchema = z.object({
  name: z.string().nonempty('课程名称不得为空'),
});

export type CreateCourseInput = z.TypeOf<typeof createCourseInputSchema>;

interface CreateCourseDialogProps {
  collegeSlug: string;
}

export function CreateCourseDialog({ collegeSlug }: CreateCourseDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseInputSchema),
  });
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const courseContext = api.useContext().course;
  const knowledgePointContext = api.useContext().knowledgePoint;

  const createCourse = api.course.createCourse.useMutation({
    onSuccess: async () => {
      toast.success('课程创建成功');
      await courseContext.invalidate();
      await knowledgePointContext.invalidate();
      reset();
      setOpenDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function onCreateCourse(input: Omit<CreateCourseInput, 'slug'>) {
    await createCourse.mutateAsync({
      ...input,
      collegeSlug,
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild onClick={() => setOpenDialog(true)}>
        <Button className='gap-2 text-base' size='lg'>
          <Icons.PlusCircle /> 添加课程
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <form onSubmit={handleSubmit(onCreateCourse)}>
          <DialogHeader>
            <DialogTitle>新增课程信息</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='name'>课程名称</Label>
              <Controller
                name='name'
                control={control}
                defaultValue=''
                render={({ field }) => <Input type='text' id='name' placeholder='请输入课程名称' {...field} />}
              />
              {errors.name ? (
                <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.name.message}</div>
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
