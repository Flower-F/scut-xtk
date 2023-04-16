import { type ReactElement } from 'react';

import { MainLayout } from '~/layouts/MainLayout';

export default function PaperPreviewPage() {
  return <div>PaperPreviewPage</div>;
}

PaperPreviewPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
