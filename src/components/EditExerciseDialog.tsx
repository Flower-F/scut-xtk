import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DifficultyType, ExerciseType } from '@prisma/client';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { type z } from 'zod';

import { createExerciseInputSchema, type CreateExerciseInput } from '~/components/CreateExerciseDialog';
import { Button } from '~/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/Dialog';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { ScrollArea } from '~/components/ui/ScrollArea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { Textarea } from '~/components/ui/Textarea';
import { difficultyWithoutAllMapping, exerciseTypeWithoutAllMapping } from '~/constants/mapping';
import { api } from '~/utils/api';

export const updateExerciseInputSchema = createExerciseInputSchema;

export type UpdateExerciseInput = z.TypeOf<typeof updateExerciseInputSchema>;

interface EditExerciseDialogProps extends CreateExerciseInput {
  exerciseId: string;
}

export function EditExerciseDialog({
  exerciseId,
  answer,
  analysis,
  question,
  type,
  difficulty,
  options,
}: EditExerciseDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateExerciseInput>({
    resolver: zodResolver(createExerciseInputSchema),
    defaultValues: {
      options,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const watchExerciseType = watch('type');

  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const exerciseContext = api.useContext().exercise;
  const updateExercise = api.exercise.updateExercise.useMutation({
    onSuccess: async () => {
      toast.success('题目创建成功');
      await exerciseContext.invalidate();
      reset();
      setOpenDialog(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function onUpdateExercise(input: Omit<UpdateExerciseInput, 'knowledgePointId'>) {
    await updateExercise.mutateAsync({
      ...input,
      exerciseId,
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild onClick={() => setOpenDialog(true)}>
        <Button>修改习题信息</Button>
      </DialogTrigger>

      <DialogContent className='max-w-sm py-10'>
        <ScrollArea className='max-h-[80vh]'>
          <form onSubmit={handleSubmit(onUpdateExercise)}>
            <DialogHeader>
              <DialogTitle>编辑习题信息</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='type'>题目类型</Label>
                <Controller
                  name='type'
                  control={control}
                  defaultValue={type}
                  render={({ field: { name, value, onChange } }) => (
                    <Select onValueChange={onChange} value={value} name={name}>
                      <SelectTrigger id='type'>
                        <SelectValue placeholder='请选择题目类型' />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ExerciseType) as Array<keyof typeof ExerciseType>).map((key) => (
                          <SelectItem key={key} value={ExerciseType[key]}>
                            {exerciseTypeWithoutAllMapping[ExerciseType[key]]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.type.message}</div>
                ) : null}
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='difficulty'>题目难度</Label>
                <Controller
                  name='difficulty'
                  control={control}
                  defaultValue={difficulty}
                  render={({ field: { name, value, onChange } }) => (
                    <Select onValueChange={onChange} value={value} name={name}>
                      <SelectTrigger id='difficulty'>
                        <SelectValue placeholder='请选择题目难度' />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(DifficultyType) as Array<keyof typeof DifficultyType>).map((key) => (
                          <SelectItem key={key} value={DifficultyType[key]}>
                            {difficultyWithoutAllMapping[DifficultyType[key]]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                    {errors.difficulty.message}
                  </div>
                ) : null}
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='question'>题目内容</Label>
                <Controller
                  name='question'
                  control={control}
                  defaultValue={question}
                  render={({ field }) => <Textarea id='question' placeholder='请输入题目内容' {...field} />}
                />
                {errors.question ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.question.message}</div>
                ) : null}
              </div>

              {watchExerciseType === 'CHOICE_QUESTION' ? (
                <div className='grid w-full items-center gap-1.5'>
                  <Label htmlFor='option'>选择题选项</Label>
                  {fields.map((field, index) => (
                    <div key={field.id} className='grid w-full items-center gap-1.5'>
                      <Controller
                        name={`options.${index}.content`}
                        control={control}
                        // defaultValue=''
                        render={({ field }) => {
                          return (
                            <div className='flex items-center space-x-3'>
                              <Input
                                type='text'
                                placeholder={`请输入题目选项 ${String.fromCharCode(
                                  String(index + 1).charCodeAt(0) + 16
                                )}`}
                                {...field}
                              />
                              <Button className='shrink-0' onClick={() => remove(index)}>
                                删除
                              </Button>
                            </div>
                          );
                        }}
                      />
                      {errors.options?.[index]?.content?.message ? (
                        <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                          {errors.options?.[index]?.content?.message}
                        </div>
                      ) : null}
                    </div>
                  ))}

                  <div className='w-full text-right'>
                    <Button
                      onClick={() => {
                        append({ content: '' });
                      }}
                    >
                      添加选择题选项
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='answer'>题目答案</Label>
                <Controller
                  name='answer'
                  control={control}
                  defaultValue={answer}
                  render={({ field }) => <Textarea id='answer' placeholder='请输入题目答案' {...field} />}
                />
                {errors.answer ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.answer.message}</div>
                ) : null}
              </div>

              <div className='grid w-full items-center gap-1.5'>
                <Label htmlFor='analysis'>题目解析（选填）</Label>
                <Controller
                  name='analysis'
                  control={control}
                  defaultValue={analysis}
                  render={({ field }) => <Textarea id='analysis' placeholder='请输入题目解析' {...field} />}
                />
                {errors.analysis ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.analysis.message}</div>
                ) : null}
              </div>
            </div>

            {error ? <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{error}</div> : null}

            <DialogFooter>
              <Button type='submit'>提交</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
