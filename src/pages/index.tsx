import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { api } from '~/utils/api';
import { BasicLayout } from '~/layouts/BasicLayout';
import { buttonVariants } from '~/components/ui/Button';

export default function Home() {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <BasicLayout>
        <section className='container grid items-center gap-6 pt-6 pb-8 md:py-10'>
          <div className='flex max-w-[980px] flex-col items-start gap-2'>
            <h1 className='text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl'>
              Beautifully designed components <br className='hidden sm:inline' />
              built with Radix UI and Tailwind CSS.
            </h1>
            <p className='max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl'>
              Accessible and customizable components that you can copy and paste into your apps. Free. Open Source. And
              Next.js 13 Ready.
            </p>
          </div>
          <div className='flex gap-4'>
            <Link
              href='https://ui.shadcn.com'
              target='_blank'
              rel='noreferrer'
              className={buttonVariants({ size: 'lg' })}
            >
              Documentation
            </Link>
            <Link
              target='_blank'
              rel='noreferrer'
              href='https://github.com/shadcn/ui'
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              GitHub
            </Link>
          </div>
        </section>
      </BasicLayout>
    </>
  );
}

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
