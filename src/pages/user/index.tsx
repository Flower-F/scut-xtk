import { useSession } from 'next-auth/react';

import { MainLayout } from '~/layouts/MainLayout';
import { AdminUserTable } from '~/components/AdminUserTable';

export default function UserPage() {
  const { data: sessionData } = useSession();

  return (
    <MainLayout>
      <AdminUserTable />
    </MainLayout>
  );
}
