import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '~/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/Dialog';
import { Label } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { api } from '~/utils/api';

export const addNewKnowledgePointInputSchema = z.object({
  knowledgePointId: z.string().nonempty('请选择知识点'),
});

export type AddNewKnowledgePointInput = z.TypeOf<typeof addNewKnowledgePointInputSchema>;

interface AddNewKnowledgePointDialogProps {
  exerciseId: string;
  oldKnowledgePointIds: string[];
}

export function AddNewKnowledgePointDialog({ exerciseId, oldKnowledgePointIds }: AddNewKnowledgePointDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddNewKnowledgePointInput>({
    resolver: zodResolver(addNewKnowledgePointInputSchema),
  });
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const exerciseContext = api.useContext().exercise;
  const addNewKnowledgePoint = api.exercise.addNewKnowledgePoint.useMutation({
    onSuccess: async () => {
      toast.success('习题已关联新知识点');
      await exerciseContext.getExercise.invalidate();
      reset();
      setOpenDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  const knowledgePointList =
    api.knowledgePoint.getKnowledgePointListInOneCourse.useQuery({
      knowledgePointId: oldKnowledgePointIds[0],
    }).data?.knowledgePoints || [];

  async function onAddNewKnowledgePoint(input: AddNewKnowledgePointInput) {
    await addNewKnowledgePoint.mutateAsync({
      ...input,
      exerciseId,
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild onClick={() => setOpenDialog(true)}>
        <Button className='shrink-0' variant='subtle'>
          添加知识点
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm'>
        <form onSubmit={handleSubmit(onAddNewKnowledgePoint)}>
          <DialogHeader>
            <DialogTitle>选择要关联的知识点</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='type'>知识点</Label>
              <Controller
                name='knowledgePointId'
                control={control}
                defaultValue=''
                render={({ field: { name, value, onChange } }) => (
                  <Select onValueChange={onChange} value={value} name={name}>
                    <SelectTrigger id='type'>
                      <SelectValue placeholder='请选择知识点' />
                    </SelectTrigger>
                    <SelectContent>
                      {knowledgePointList.map((knowledgePoint) => (
                        <SelectItem
                          key={knowledgePoint.id}
                          value={knowledgePoint.id}
                          disabled={oldKnowledgePointIds.includes(knowledgePoint.id)}
                        >
                          {knowledgePoint.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.knowledgePointId ? (
                <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                  {errors.knowledgePointId.message}
                </div>
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
