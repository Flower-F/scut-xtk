import md5 from 'md5';
import type { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import type { NextPageWithLayout } from './_app';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginInput, loginInputSchema } from '../schemas/user';
import { ErrorAlert } from '../components/ErrorAlert';

const LoginPage: NextPageWithLayout<{ csrfToken: string | undefined }> = ({ csrfToken }) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
  });

  async function onSubmit(values: LoginInput) {
    await signIn('credentials', {
      ...values,
      password: md5(values.password),
      callbackUrl: '/',
    });
  }

  return (
    <div>
      <div className='flex flex-col gap-2'>
        {Object.keys(errors).length > 0 ? (
          (Object.keys(errors) as Array<keyof typeof errors>).map((key) => <ErrorAlert error={errors[key]} />)
        ) : router.query.error && router.query.error === 'CredentialsSignin' ? (
          <ErrorAlert error='信息有误，请重新登录' />
        ) : null}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input name='csrfToken' type='hidden' defaultValue={csrfToken} />

        <div className='grid gap-4 md:grid-cols-2 md:gap-6'>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>邮箱</span>
            </label>
            <label className='input-group'>
              <span>
                <EnvelopeIcon className='h-6 w-6' />
              </span>
              <input
                type='email'
                placeholder='请输入您的邮箱'
                className='input-bordered input'
                {...register('email')}
              />
            </label>
          </div>

          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>密码</span>
            </label>
            <label className='input-group'>
              <span>
                <LockClosedIcon className='h-6 w-6' />
              </span>
              <input
                type='password'
                placeholder='请输入您的密码'
                className='input-bordered input'
                {...register('password')}
              />
            </label>
          </div>
        </div>

        <div className='mt-6 justify-center text-center md:mt-8 md:text-right'>
          <button type='submit' className='btn-primary btn w-full md:w-[180px]'>
            登录
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

LoginPage.getLayout = (page: ReactElement) => {
  return <AuthLayout title='登录'>{page}</AuthLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      csrfToken: await getCsrfToken(ctx),
    },
  };
};
