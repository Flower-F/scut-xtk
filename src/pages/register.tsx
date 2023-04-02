import Link from 'next/link';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import md5 from 'md5';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { MainLayout } from '~/layouts/MainLayout';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/Select';
import { api } from '~/utils/api';

const registerInputSchema = z.object({
  email: z.string().email('请输入正确的邮箱'),
  name: z.string().min(1, '请输入您的姓名'),
  password: z.string().min(8, '密码长度最少为8位'),
  password2: z.string().min(8, '确认密码长度最少为8位'),
  collegeId: z.string().min(1, '请输入您的学院'),
});

type RegisterInput = z.TypeOf<typeof registerInputSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      password2: '',
      collegeId: 'banana',
    },
  });

  const signup = api.user.register.useMutation({
    onSuccess: async () => {
      await router.push('/login');
    },
  });

  async function onSubmit(input: RegisterInput) {
    console.log('input: ', input);
    await signup.mutateAsync({
      ...input,
      password: md5(input.password),
      password2: md5(input.password2),
    });
  }

  return (
    <MainLayout>
      <div className='flex flex-col items-center justify-center py-8'>
        <h2 className='scroll-m-20 border-b border-b-slate-200 pb-2 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700'>
          登录
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex min-w-[350px] max-w-sm flex-col items-center justify-center gap-4 rounded-lg border p-10'
        >
          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='email'>邮箱</Label>
            <Controller
              name='email'
              control={control}
              render={({ field }) => <Input type='email' id='email' placeholder='请输入您的邮箱' {...field} />}
            />
            {errors.email ? <div>{errors.email.message}</div> : null}
          </div>

          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='name'>姓名</Label>
            <Controller
              name='name'
              control={control}
              render={({ field }) => <Input type='text' id='name' placeholder='请输入您的姓名' {...field} />}
            />
            {errors.name ? <div>{errors.name.message}</div> : null}
          </div>

          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='collegeId'>学院</Label>
            <Controller
              name='collegeId'
              control={control}
              render={({ field: { name, value, onChange } }) => (
                <Select onValueChange={onChange} value={value} name={name}>
                  <SelectTrigger id='college'>
                    <SelectValue placeholder='选择您的学院' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='apple'>软件学院</SelectItem>
                    <SelectItem value='banana'>计算机学院</SelectItem>
                    <SelectItem value='blueberry'>数学学院</SelectItem>
                    <SelectItem value='grapes'>法学院</SelectItem>
                    <SelectItem value='pineapple'>机械与汽车工程学院</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.collegeId ? <div>{errors.collegeId.message}</div> : null}
          </div>

          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='password'>密码</Label>
            <Controller
              name='password'
              control={control}
              render={({ field }) => <Input type='password' id='password' placeholder='请输入您的密码' {...field} />}
            />
            {errors.password ? <div>{errors.password.message}</div> : null}
          </div>

          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='password2'>确认密码</Label>
            <Controller
              name='password2'
              control={control}
              render={({ field }) => (
                <Input type='password' id='password2' placeholder='请再次输入您的密码' {...field} />
              )}
            />
            {errors.password2 ? <div>{errors.password2.message}</div> : null}
          </div>

          <div className='flex w-full flex-col text-right'>
            <Button type='submit'>注册</Button>
            <Button variant='link'>
              <Link href='/login'>切换到登录界面</Link>
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
