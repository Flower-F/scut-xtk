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

const createKnowledgePointInputSchema = z.object({
  name: z.string().nonempty('知识点姓名不得为空'),
  label: z.string().optional(),
});

type CreateKnowledgePointInput = z.TypeOf<typeof createKnowledgePointInputSchema>;

interface CreateKnowledgePointDialogProps {
  courseId: string;
}

export function CreateKnowledgePointDialog({ courseId }: CreateKnowledgePointDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateKnowledgePointInput>({
    resolver: zodResolver(createKnowledgePointInputSchema),
  });
  const [error, setError] = useState('');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const knowledgePointContext = api.useContext().knowledgePoint;
  const createKnowledgePoint = api.knowledgePoint.createKnowledgePoint.useMutation({
    onSuccess: async () => {
      toast.success('知识点创建成功');
      await knowledgePointContext.invalidate();
      reset();
      setOpenCreateDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function onSubmitCreateKnowledgePoint(
    input: Omit<CreateKnowledgePointInput, 'courseId'>,
    { courseId }: { courseId: string }
  ) {
    console.log('test');
    await createKnowledgePoint.mutateAsync({
      ...input,
      courseId,
    });
  }

  return (
    <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
      <DialogTrigger asChild onClick={() => setOpenCreateDialog(true)}>
        <Button className='w-full' variant='subtle'>
          添加知识点
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <form onSubmit={handleSubmit((data) => onSubmitCreateKnowledgePoint(data, { courseId }))}>
          <DialogHeader>
            <DialogTitle>新增知识点</DialogTitle>
          </DialogHeader>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
