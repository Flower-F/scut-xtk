import { useState } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { type z } from 'zod';

import { createKnowledgePointInputSchema } from '~/components/CreateKnowledgePointDialog';
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

const updateKnowledgePointInputSchema = createKnowledgePointInputSchema;
type UpdateKnowledgePointInput = z.TypeOf<typeof updateKnowledgePointInputSchema>;

interface EditKnowledgePointDialogProps {
  knowledgePointId: string;
}

export function EditKnowledgePointDialog({ knowledgePointId }: EditKnowledgePointDialogProps) {
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateKnowledgePointInput>({
    resolver: zodResolver(updateKnowledgePointInputSchema),
  });
  const router = useRouter();
  const slug = router.query.slug && typeof router.query.slug === 'string' ? router.query.slug : '';

  const knowledgePoint = api.knowledgePoint.getKnowledgePointById.useQuery(
    { knowledgePointId },
    {
      enabled: !!router.query.kid,
    }
  ).data;

  const knowledgePointContext = api.useContext().knowledgePoint;
  const updateKnowledgePoint = api.knowledgePoint.updateKnowledgePoint.useMutation({
    onSuccess: async () => {
      toast.success('知识点修改成功');
      await knowledgePointContext.invalidate();
      reset();
      setOpenDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  const deleteKnowledgePoint = api.knowledgePoint.deleteKnowledgePoint.useMutation({
    onSuccess: async () => {
      toast.success('知识点已删除');
      await knowledgePointContext.invalidate();
      reset();
      setOpenDialog(false);
      await router.push(`/college/${slug}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function onUpdateKnowledgePoint(input: Omit<UpdateKnowledgePointInput, 'id'>) {
    await updateKnowledgePoint.mutateAsync({
      ...input,
      knowledgePointId,
    });
  }

  async function onDeleteKnowledgePoint() {
    await deleteKnowledgePoint.mutateAsync({
      knowledgePointId,
    });
  }

  function initialDialog() {
    setOpenDialog(true);
    setValue('label', knowledgePoint?.label || '');
    setValue('name', knowledgePoint?.name || '');
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button onClick={initialDialog}>修改知识点</Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <form onSubmit={handleSubmit(onUpdateKnowledgePoint)}>
          <DialogHeader>
            <DialogTitle>编辑知识点</DialogTitle>
            <div className='grid gap-4 py-4'>
              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='name'>知识点名称</Label>
                <Controller
                  name='name'
                  control={control}
                  defaultValue=''
                  render={({ field }) => <Input type='text' id='name' placeholder='请输入知识点名称' {...field} />}
                />
                {errors.name ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.name.message}</div>
                ) : null}
              </div>
              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='label'>知识点标签（选填）</Label>
                <Controller
                  name='label'
                  control={control}
                  defaultValue=''
                  render={({ field }) => <Input type='text' id='label' placeholder='请输入知识点标签' {...field} />}
                />
                {errors.label ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.label.message}</div>
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
            <Button variant='destructive'>删除该知识点</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>你确定要删除该知识点吗？</AlertDialogTitle>
              <AlertDialogDescription>该操作不可逆，请谨慎决定是否要进行删除操作</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteKnowledgePoint}>确定</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
