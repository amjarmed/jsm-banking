'use client';

import * as Sentry from '@sentry/nextjs';
import {Frown} from 'lucide-react';
import {useEffect} from 'react';
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex-center flex-col size-full min-h-screen space-y-4">
      <Frown size={64} className="text-red-500" />

      <h2 className="header-2 text-neutral-600">Something went wrong!</h2>

      <button onClick={reset}>Try Again</button>
    </div>
  );
}
