import { type ReactElement } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { MainLayout } from '~/layouts/MainLayout';
import { buttonVariants } from '~/components/ui/Button';

export default function HomePage() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  if (sessionData?.user.id && sessionData.user.verified) {
    void router.push('/user');
  }

  return (
    <>
      <Head>
        <title>华南理工大学习题库</title>
        <meta name='description' content='基于知识点的习题库系统' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex flex-wrap gap-6 pb-8 pt-6 md:py-10'>
        <div className='flex flex-col gap-4'>
          <div className='flex max-w-[980px] flex-col items-start gap-2'>
            <h1 className='text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl lg:leading-[1.1]'>
              华南理工大学 <br className='hidden sm:inline' />
              基于课程知识点的习题库
            </h1>
            <p className='max-w-[750px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl'>
              根据“学院-课程-知识点-习题”结构分层的高性能习题管理系统
            </p>
          </div>
          <div className='flex gap-4'>
            <Link href='/register' className={buttonVariants({ size: 'lg' })}>
              注册
            </Link>
            <Link href='/login' className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              登录
            </Link>
          </div>
          <div>
            <p className='text-sm text-slate-500 dark:text-slate-400'>
              欢迎关注项目
              <Link href='https://github.com/flower-f/scut-xtk' className='font-medium underline underline-offset-4'>
                Github
              </Link>
              源码地址
            </p>
          </div>
        </div>

        <div className='flex flex-wrap items-center justify-center gap-4'>
          <div className='relative h-[170px] w-[320px] rounded-md border-2 border-slate-200 md:h-[250px] md:w-[480px] lg:block xl:h-[320px] xl:w-[600px]'>
            <Image src='/landing-1.png' alt='效果展示图' className='rounded-md' fill />
          </div>
          <div className='relative h-[170px] w-[320px] rounded-md border-2 border-slate-200 md:h-[250px] md:w-[480px] lg:block xl:h-[320px] xl:w-[600px]'>
            <Image src='/landing-2.png' alt='效果展示图' className='rounded-md' fill />
          </div>
        </div>
      </div>
    </>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className='flex flex-col items-center justify-center gap-4'>
//       <p className='text-center text-2xl text-white'>
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? 'Sign out' : 'Sign in'}
//       </button>
//     </div>
//   );
// };
