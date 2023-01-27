import { XCircleIcon } from '@heroicons/react/24/solid';

export function ErrorAlert({ error }: { error?: { message?: string } | null }) {
  return error ? (
    <div className='alert alert-error shadow-lg'>
      <div>
        <XCircleIcon className='h-6 w-6' />
        <span>{error.message}</span>
      </div>
    </div>
  ) : null;
}
