import md5 from 'md5';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeIcon, LockClosedIcon, UserIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import type { RegisterInput } from '../schemas/user';
import { registerInputSchema } from '../schemas/user';
import { api } from '../utils/api';
import { AuthLayout } from '../layouts/AuthLayout';
import { ErrorAlert } from '../components/ErrorAlert';

const RegisterPage: NextPageWithLayout = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
  });

  const { mutateAsync, error } = api.user.register.useMutation({
    onSuccess: () => {
      router.push('/login');
    },
  });

  function onSubmit(values: RegisterInput) {
    mutateAsync({
      ...values,
      password: md5(values.password),
      password2: md5(values.password2),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-2'>
        <ErrorAlert error={error} />
        <ErrorAlert error={errors.name} />
      </div>

      <div className='grid gap-4 md:grid-cols-2 md:gap-6'>
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>邮箱</span>
          </label>
          <label className='input-group'>
            <span>
              <EnvelopeIcon className='h-6 w-6' />
            </span>
            <input type='email' placeholder='请输入您的邮箱' className='input-bordered input' {...register('email')} />
          </label>
        </div>

        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>姓名</span>
          </label>
          <label className='input-group'>
            <span>
              <UserIcon className='h-6 w-6' />
            </span>
            <input type='text' placeholder='请输入您的姓名' className='input-bordered input' {...register('name')} />
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

        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>确认密码</span>
          </label>
          <label className='input-group'>
            <span>
              <LockClosedIcon className='h-6 w-6' />
              <sub className='mt-0.5'>*</sub>
            </span>
            <input
              type='password'
              placeholder='请再次输入密码确认'
              className='input-bordered input'
              {...register('password2')}
            />
          </label>
        </div>
      </div>

      <div className='mt-6 justify-center text-center md:mt-8 md:text-right'>
        <button type='submit' className='btn-primary btn w-full md:w-[180px]'>
          注册
        </button>
      </div>
    </form>
  );
};

export default RegisterPage;

RegisterPage.getLayout = (page: ReactElement) => {
  return <AuthLayout title='注册界面'>{page}</AuthLayout>;
};
