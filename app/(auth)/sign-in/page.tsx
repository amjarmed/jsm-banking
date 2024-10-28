import { Button } from '@/components/ui/button';

export default function SignIn() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2 space-y-4'>
      <h1 className='text-5xl font-bold text-center uppercase'> SignIn</h1>
      <Button variant='outline'> Get started</Button>
    </div>
  );
}
