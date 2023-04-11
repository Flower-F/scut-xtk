import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { type z } from 'zod';

import { createCourseInputSchema, type CreateCourseInput } from '~/components/CreateCourseDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/AlertDialog';
import { Button } from '~/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/Dialog';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { api } from '~/utils/api';

const updateCourseInputSchema = createCourseInputSchema;
type UpdateCourseInput = z.TypeOf<typeof updateCourseInputSchema>;

interface EditCourseDialogProps extends CreateCourseInput {
  courseId: string;
}

export function EditCourseDialog({ name, courseId }: EditCourseDialogProps) {
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateCourseInput>({
    resolver: zodResolver(updateCourseInputSchema),
  });

  const courseContext = api.useContext().course;
  const knowledgePointContext = api.useContext().knowledgePoint;
  const updateCourse = api.course.updateCourse.useMutation({
    onSuccess: async () => {
      toast.success('课程信息修改成功');
      await courseContext.invalidate();
      await knowledgePointContext.invalidate();
      reset();
      setOpenDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  const deleteCourse = api.course.deleteCourse.useMutation({
    onSuccess: async () => {
      toast.success('课程已删除');
      await courseContext.invalidate();
      await knowledgePointContext.invalidate();
      reset();
      setOpenDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function onUpdateCourse(input: Omit<UpdateCourseInput, 'id'>) {
    await updateCourse.mutateAsync({
      ...input,
      id: courseId,
    });
  }

  async function onDeleteCourse() {
    await deleteCourse.mutateAsync({
      id: courseId,
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='subtle' className='text-base' size='lg' onClick={() => setOpenDialog(true)}>
          {name}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <form onSubmit={handleSubmit(onUpdateCourse)}>
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

            {error ? <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{error}</div> : null}
            <DialogFooter>
              <Button type='submit'>提交</Button>
            </DialogFooter>
          </DialogHeader>
        </form>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>删除该课程</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>你确定要删除该课程吗？</AlertDialogTitle>
              <AlertDialogDescription>该操作不可逆，请谨慎决定是否要进行删除操作</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteCourse}>确定</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
