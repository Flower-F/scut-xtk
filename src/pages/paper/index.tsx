import { type ReactElement } from 'react';

import { MainLayout } from '~/layouts/MainLayout';
import { CreateAndUpdateRuleForm } from '~/components/CreateAndUpdateRuleForm';

export default function PaperPage() {
  return (
    <div>
      <div>
        <CreateAndUpdateRuleForm />
      </div>
    </div>
  );
}

PaperPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
