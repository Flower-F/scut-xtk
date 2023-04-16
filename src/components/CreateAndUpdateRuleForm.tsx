import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DifficultyType, ExerciseType } from '@prisma/client';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { difficultyTypeMapping, exerciseTypeMapping } from '~/constants/mapping';
import { api } from '~/utils/api';

export const createRuleInputSchema = z.object({
  rules: z.array(
    z.object({
      type: z.nativeEnum(ExerciseType, {
        invalid_type_error: '题目类型只能为填空、选择和大题',
      }),
      difficulty: z.nativeEnum(DifficultyType, {
        invalid_type_error: '题目难度只能为简单、中等和困难',
      }),
      knowledgePointId: z.string().nonempty('知识点不得为空'),
      amount: z.number().int('题目数量必须为整数').positive('题目数量必须为正数'),
    })
  ),
});

export type CreateRuleInput = z.TypeOf<typeof createRuleInputSchema>;

export function CreateAndUpdateRuleForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRuleInput>({
    resolver: zodResolver(createRuleInputSchema),
    defaultValues: {
      rules: [
        {
          knowledgePointId: '',
          amount: 1,
          type: 'ALL_QUESTION',
          difficulty: 'ANY',
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
  });

  const courseList = api.course.getCourseListOfUserCollege.useQuery().data;

  const [error, setError] = useState('');
  const [courseId, setCourseId] = useState<string | undefined>(undefined);

  const knowledgePointList = api.knowledgePoint.getKnowledgePointListByCourseId.useQuery({
    courseId,
  }).data;

  const paperContext = api.useContext().paper;
  const createRules = api.paper.createRules.useMutation({
    onSuccess: async () => {
      toast.success('配置保存成功');
      await paperContext.invalidate();
      reset();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function onCreateRules(input: CreateRuleInput) {
    await createRules.mutateAsync(input);
  }

  return (
    <div className='py-4'>
      <h3 className='scroll-m-20 py-6 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
        试卷题目配置
      </h3>
      <form className='grid gap-4 py-4' onSubmit={handleSubmit(onCreateRules)}>
        <div className='flex items-center space-x-2.5'>
          <Select onValueChange={setCourseId} value={courseId}>
            <SelectTrigger id='type' className='w-[210px]'>
              <SelectValue placeholder='请选择课程' />
            </SelectTrigger>
            <SelectContent>
              {courseList?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type='submit'>保存配置</Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            根据配置生成试卷
          </Button>

          <Button
            onClick={(e) => {
              e.preventDefault();
              append({ type: 'ALL_QUESTION', difficulty: 'ANY', amount: 1, knowledgePointId: '' });
            }}
          >
            添加新的配置
          </Button>
        </div>

        <div className='flex flex-wrap items-center gap-6'>
          {fields.map((field, index) => (
            <div key={field.id} className='grid w-full max-w-xs items-center gap-1.5 rounded-lg border-2 p-4'>
              <div>
                <Label>题目类型</Label>
                <Controller
                  name={`rules.${index}.type`}
                  control={control}
                  defaultValue='ALL_QUESTION'
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <Select onValueChange={onChange} value={value} name={name}>
                        <SelectTrigger id={`rules.${index}.type`}>
                          <SelectValue placeholder='请选择题目类型' />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(ExerciseType) as Array<keyof typeof ExerciseType>).map((key) => (
                            <SelectItem key={key} value={ExerciseType[key]}>
                              {exerciseTypeMapping[ExerciseType[key]]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>

              <div>
                <Label>题目难度</Label>
                <Controller
                  name={`rules.${index}.difficulty`}
                  control={control}
                  defaultValue='ANY'
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <Select onValueChange={onChange} value={value} name={name}>
                        <SelectTrigger id={`rules.${index}.difficulty`}>
                          <SelectValue placeholder='请选择题目难度' />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(DifficultyType) as Array<keyof typeof DifficultyType>).map((key) => (
                            <SelectItem key={key} value={DifficultyType[key]}>
                              {difficultyTypeMapping[DifficultyType[key]]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>

              <div>
                <Label>题目数量</Label>
                <Controller
                  name={`rules.${index}.amount`}
                  control={control}
                  defaultValue={1}
                  render={({ field }) => {
                    return (
                      <Input
                        min={1}
                        placeholder='请输入该类型题目的数量'
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value))
                        }
                      />
                    );
                  }}
                />
                {errors.rules?.[index]?.amount?.message ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                    {errors.rules?.[index]?.amount?.message}
                  </div>
                ) : null}
              </div>

              <div>
                <Label>关联知识点</Label>
                <Controller
                  name={`rules.${index}.knowledgePointId`}
                  control={control}
                  defaultValue=''
                  render={({ field: { onChange, value, name } }) => {
                    return (
                      <Select onValueChange={onChange} value={value} name={name}>
                        <SelectTrigger id={`rules.${index}.knowledgePointId`}>
                          <SelectValue placeholder='请选择课程相关知识点' />
                        </SelectTrigger>
                        <SelectContent>
                          {knowledgePointList?.map((knowledgePoint) => (
                            <SelectItem key={knowledgePoint.id} value={knowledgePoint.id}>
                              {knowledgePoint.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
                {errors.rules?.[index]?.knowledgePointId?.message ? (
                  <div className='text-sm font-semibold text-red-500 dark:text-red-700'>
                    {errors.rules?.[index]?.knowledgePointId?.message}
                  </div>
                ) : null}
              </div>

              <Button className='mt-2 w-full' onClick={() => remove(index)}>
                删除该条配置
              </Button>
            </div>
          ))}
        </div>
      </form>

      {error ? <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{error}</div> : null}
    </div>
  );
}
