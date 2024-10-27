import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 space-y-4'>
      <h1 className='text-5xl font-bold text-center uppercase'>
        {' '}
        start jsm Banking system
      </h1>
      <Button variant='default'> Get started</Button>
    </div>
  );
}
