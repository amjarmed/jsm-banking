import AuthForm from '@/components/auth/authForm';

const SignUp = async () => {
  return (
    <div className='flex-center size-full mx-sm:px-6'>
      <AuthForm type='sign-up' />
    </div>
  );
};
export default SignUp;
