import AuthForm from '@/components/auth/authForm';

export default function SignUp() {
  return (
    <div className='flex-center size-full mx-sm:px-6'>
      <AuthForm type='sign-up' />
    </div>
  );
}
