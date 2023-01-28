import type { ReactNode } from 'react';
import Head from 'next/head';
import { NavBar } from './NavBar';

export function AuthLayout({ children, title }: { children: ReactNode; title?: string; description?: string }) {
  return (
    <>
      <Head>
        <title>{`${title ? title : '华南理工大学习题库'}`}</title>
        <meta name='description' content='基于课程知识点的习题库' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <NavBar />
      <main className='mt-8 flex flex-col items-center justify-center'>{children}</main>
    </>
  );
}
