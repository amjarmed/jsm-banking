'use client';

import * as Sentry from '@sentry/nextjs';
import {useEffect} from 'react';

export default function ErrorPage({error}: {error: Error & {digest?: string}}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex-center size-full">
      <h2 className="header-2">Something went wrong!</h2>
    </div>
  );
}
