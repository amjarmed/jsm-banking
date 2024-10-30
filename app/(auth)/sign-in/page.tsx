import AuthForm from '@/components/auth/authForm';

export default function SignIn() {
  return (
    <div className='flex-center size-full mx-sm:px-6'>
      <AuthForm type='sign-in' />
    </div>
  );
}
