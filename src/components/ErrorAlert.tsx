import { XCircleIcon } from '@heroicons/react/24/solid';

export function ErrorAlert({ error }: { error?: { message?: string } | null | string }) {
  if (!error) {
    return null;
  }

  if (typeof error === 'string') {
    return <ErrorWrapper message={error} />;
  }

  return error.message ? <ErrorWrapper message={error.message} /> : null;
}

function ErrorWrapper({ message }: { message: string }) {
  return (
    <div className='alert alert-error items-start shadow-lg'>
      <div>
        <XCircleIcon className='h-6 w-6' />
        <span>{message}</span>
      </div>
    </div>
  );
}
