import { useSession } from 'next-auth/react';

import { MainLayout } from '~/layouts/MainLayout';

export default function UserPage() {
  const { data: sessionData } = useSession();

  return <MainLayout>a</MainLayout>;
}
