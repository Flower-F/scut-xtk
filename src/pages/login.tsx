import { type GetServerSideProps, type InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { MainLayout } from '~/layouts/MainLayout';
import { Button } from '~/components/ui/Button';
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';

export const loginInputSchema = z.object({
  email: z.string().email('请输入正确的邮箱格式'),
  password: z.string().min(8, '密码长度最少为8位'),
});

type LoginInput = z.TypeOf<typeof loginInputSchema>;

export default function LoginPage({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
  });

  const { data: sessionData } = useSession();
  const router = useRouter();

  if (sessionData) {
    void router.push('/');
  }

  async function onSubmit(input: LoginInput) {
    await signIn('credentials', {
      ...input,
      callbackUrl: '/',
    });
  }

  const searchParams = useSearchParams();
  const loginError = searchParams.get('error');

  return (
    <>
      <Head>
        <title>登录</title>
        <meta name='description' content='习题库登录界面' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainLayout>
        <div className='flex flex-col items-center justify-center gap-4 py-8'>
          <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>登录</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex min-w-[350px] max-w-sm flex-col items-center justify-center gap-4 rounded-lg border px-4 py-10 md:px-10 lg:px-12'
          >
            <input name='csrfToken' type='hidden' defaultValue={csrfToken} />

            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='email'>邮箱</Label>
              <Controller
                name='email'
                control={control}
                render={({ field }) => <Input type='email' id='email' placeholder='请输入您的邮箱' {...field} />}
              />
              {errors.email ? (
                <div className='text-sm font-semibold text-red-500 dark:text-red-700'>{errors.email.message}</div>
              ) : null}
            </div>

            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='password'>密码</Label>
              <Controller
                name='password'
                control={control}
                render={({ field }) => <Input type='password' id='password' placeholder='请输入您的密码' {...field} />}
              />
            </div>

            {loginError ? (
              <div className='w-full text-sm font-semibold text-red-500 dark:text-red-700'>
                登录信息有误，请重新登录
              </div>
            ) : null}

            <div className='flex w-full flex-col text-right'>
              <Button type='submit'>登录</Button>
              <Button variant='link'>
                <Link href='/register'>切换到注册界面</Link>
              </Button>
            </div>
          </form>
        </div>
      </MainLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{ csrfToken: string | undefined }> = async (ctx) => {
  return {
    props: {
      csrfToken: await getCsrfToken(ctx),
    },
  };
};
