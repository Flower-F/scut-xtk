import type { ReactNode } from 'react';
import Head from 'next/head';
import { NavBar } from './NavBar';
import { SideBar } from './SideBar';

export function AdminLayout({ children, title }: { children: ReactNode; title?: string; description?: string }) {
  return (
    <>
      <Head>
        <title>{`${title ? title : '华南理工大学习题库'}`}</title>
        <meta name='description' content='基于课程知识点的习题库' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <NavBar />
      <SideBar>{children}</SideBar>
    </>
  );
}
