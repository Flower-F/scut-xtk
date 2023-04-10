import { type ReactElement } from 'react';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { MainLayout } from '~/layouts/MainLayout';
import { buttonVariants } from '~/components/ui/Button';
import { api } from '~/utils/api';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>华南理工大学习题库</title>
        <meta name='description' content='基于知识点的习题库系统' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>Landing Page</div>
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
