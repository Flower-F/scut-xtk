import { type ReactElement } from 'react';
import { useRouter } from 'next/router';

import { SidebarLayout } from '~/layouts/SidebarLayout';

export default function ExerciseDetailPage() {
  const router = useRouter();
  const exerciseId = router.query.eid && typeof router.query.eid === 'string' ? router.query.eid : '';

  console.log('exerciseId: ', exerciseId);

  return <div>ExercisePage</div>;
}

ExerciseDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
