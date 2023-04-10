import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { type z } from 'zod';

import { createCollegeInputSchema, type CreateCollegeInput } from '~/components/CreateCollegeDialog';
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

const updateCollegeInputSchema = createCollegeInputSchema;
type UpdateCollegeInput = z.TypeOf<typeof updateCollegeInputSchema>;

interface EditCollegeDialogProps extends CreateCollegeInput {
  id: string;
}

export function EditCollegeDialog({ name, id, slug }: EditCollegeDialogProps) {
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
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
      setOpenDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  const deleteCollege = api.college.deleteCollege.useMutation({
    onSuccess: async () => {
      toast.success('学院已删除');
      await collegeContext.invalidate();
      reset();
      setOpenDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function onUpdateCollege(input: Omit<UpdateCollegeInput, 'id'>) {
    await updateCollege.mutateAsync({
      ...input,
      id,
    });
  }

  async function onDeleteCollege() {
    await deleteCollege.mutateAsync({
      id,
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='subtle' size='lg' className='w-full text-base' onClick={() => setOpenDialog(true)}>
          {name}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <form onSubmit={handleSubmit(onUpdateCollege)}>
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>删除该学院</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>你确定要删除该学院吗？</AlertDialogTitle>
              <AlertDialogDescription>该操作不可逆，请谨慎决定是否要进行删除操作</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteCollege}>确定</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
