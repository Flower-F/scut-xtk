import { type ReactElement } from 'react';

import { MainLayout } from '~/layouts/MainLayout';

export default function PaperPage() {
  return <div>PaperPage</div>;
}

PaperPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
