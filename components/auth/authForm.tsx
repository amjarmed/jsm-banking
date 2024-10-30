'use client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AuthFormSchema } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Logo from '../navigations/logo';
import CustomInput from './customInput';

// the AuthForm component for sing-in and sing-up
const AuthForm = ({ type }: { type: string }) => {
  const formSchema = AuthFormSchema(type);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  //  useFormProps<z.infer<typeof formSchema>>
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    try {
      // console.log(values);
      // sign Up with Appwrite & create plain link token
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='auth-form '>
      <header className='flex flex-col gap-5 md:gap-8'>
        {/* logo */}
        <Logo
          isTitle={false}
          imageSize={34}
          styleTitle='text-26 font-imb-plex-serif font-bold text-black-1'
          isCenter
        />
        <div className='flex flex-col gap-1 md:gap-3 '>
          <h1 className='text-24  lg:text-36 font-semibold text-gray-900'>
            {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className='text-16 font-normal to-gray-600'>
            {user
              ? 'Link your account to get started'
              : 'Please enter your details'}
          </p>
        </div>
      </header>
      {/* check for user  */}
      {user ? (
        <div className='flex flex-col gap-4'>{/* PlaidLink */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              {/* input for signup */}
              {type === 'sign-up' && (
                <>
                  <div className='flex gap-4'>
                    <CustomInput
                      control={form.control}
                      name='firstName'
                      placeholder='ex:john'
                      label='First Name'
                    />
                    <CustomInput
                      control={form.control}
                      name='lastName'
                      placeholder='ex: Doe'
                      label='Last Name'
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name='address1'
                    placeholder='enter your specific address'
                    label='Address'
                  />
                  <div className='flex gap-4'>
                    <CustomInput
                      control={form.control}
                      name='state'
                      placeholder='ex: NY'
                      label='State'
                    />
                    <CustomInput
                      control={form.control}
                      name='postalCode'
                      placeholder='ex: 1234'
                      label='Postal Code'
                    />
                  </div>
                  <div className='flex gap-4'>
                    <CustomInput
                      control={form.control}
                      name='dateOfBirth'
                      placeholder='yyyy-mm-dd'
                      label='Date of Birth'
                    />
                    <CustomInput
                      control={form.control}
                      name='ssn'
                      placeholder='ex: 123-45-6789'
                      label='SSN'
                    />
                  </div>
                </>
              )}
              {/* input for signin */}
              <CustomInput
                control={form.control}
                name='email'
                placeholder='Email'
                label='Email'
              />
              <CustomInput
                control={form.control}
                name='password'
                placeholder='Password'
                label='Password'
              />
              <div className='flex flex-col gap-4'>
                <Button type='submit' className='form-btn' disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className='animate-spin' />
                      &nbsp; Loading...
                    </>
                  ) : type === 'sign-in' ? (
                    'Sign In'
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className='flex justify-center gap-1'>
            <p className='text-14 font-normal text-gray-600'>
              {type === 'sign-in'
                ? 'Don’t have an account?'
                : 'Already have an account?'}
            </p>
            <Link
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
              className='form-link'
            >
              {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
            {/*   <p className='text-14 font-normal text-gray-600'>
              Forgot Password?
            </p> */}
          </footer>
        </>
      )}
    </section>
  );
};
export default AuthForm;
