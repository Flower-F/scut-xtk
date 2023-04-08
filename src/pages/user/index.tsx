import { useSession } from 'next-auth/react';

import { MainLayout } from '~/layouts/MainLayout';
import { AdminUserTable } from '~/components/AdminUserTable';

export default function UserPage() {
  const { data: sessionData } = useSession();

  return <MainLayout>{sessionData?.user.role === 'ADMIN' ? <AdminUserTable /> : <div>用户收藏夹</div>}</MainLayout>;
}
