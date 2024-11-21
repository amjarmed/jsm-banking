'use client';

import {Button} from '@/components/ui/button';
import {redirect} from 'next/navigation';

export default function NotFound() {
  const redirectHome = () => {
    redirect('/');
  };
  return (
    <div className="flex-center flex-col space-y-4 size-full min-h-screen">
      <h1 className="heading-1 h1 font-semibold"> 404 - Page Not Found</h1>
      <p className="truncate">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button onClick={redirectHome} variant="destructive">
        Go back home
      </Button>
    </div>
  );
}
