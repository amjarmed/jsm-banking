'use client';
import {signIn, signUp} from '@/app/services/actions/user.auth';
import {Button} from '@/components/ui/button';
import {Form} from '@/components/ui/form';
import {useToast} from '@/hooks/use-toast';
import {AuthFormSchema} from '@/lib/utils';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import PlaidLink from '../banks/plaid-link';
import Logo from '../navigations/logo';
import CustomInput from './customInput';

// the AuthForm component for sing-in and sing-up

/**
 * AuthForm component handles the authentication form for sign-in and sign-up.
 *
 * This component dynamically renders the appropriate form fields based on the
 * type of authentication ('sign-in' or 'sign-up'). It manages form submission
 * and state updates for loading and logged-in user status. The form uses a
 * schema for validation and displays toast notifications on successful sign-up and sign-in.
 *
 * Props:
 * @param type - A string indicating the type of authentication form ('sign-in' or 'sign-up').
 *
 * State:
 * @param isLoading - A boolean state indicating the loading status during form submission.
 * @param loggedInUser - A state to hold the logged-in user's information after successful sign-up/sign-in.
 *
 * Hooks:
 * Uses `useRouter` for navigation, `useToast` for showing toast notifications,
 * and `useForm` from react-hook-form for form handling and validation.
 */

const AuthForm = ({type}: {type: string}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const formSchema = AuthFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  /**
   * Handles form submission for authentication.
   *
   * Depending on the form type, either signs up a new user or signs in an existing user.
   * Updates the loading state during the process.
   * On successful sign-up, sets the logged-in user state and redirects to the home page.
   * On successful sign-in, redirects to the home page.
   * Logs any errors encountered during the process.
   *
   * @param values - The form values matching the authentication schema.
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      //============== sign Up ======
      if (type === 'sign-up') {
        const userData = {
          firstName: values.firstName!,
          lastName: values.lastName!,
          email: values.email,
          password: values.password,
          address1: values.address1!,
          city: values.city!,
          state: values.state!,
          postalCode: values.postalCode!,
          dateOfBirth: values.dateOfBirth!,
          ssn: values.ssn!,
        };
        const newUser = await signUp(userData);
        setLoggedInUser(newUser);
      }

      //================= sign In ======
      if (type === 'sign-in') {
        const response = await signIn({
          email: values.email,
          password: values.password,
        });

        if (response) router.push('/');
      }
    } catch (error) {
      console.log('AuthForm error: ', {error});
    } finally {
      setIsLoading(false);
    }
  };

  //====== Toasts usage =====

  useEffect(() => {
    if (loggedInUser) {
      toast({
        description: 'Sign Up  success ',
      });
    }
  }, []);

  return (
    <section className="auth-form ">
      <header className="flex flex-col gap-5 md:gap-8">
        {/* logo */}
        <Logo
          isTitle={false}
          imageSize={34}
          styleTitle="text-26 font-imb-plex-serif font-bold text-black-1"
          isCenter
        />
        <div className="flex flex-col gap-1 md:gap-3  text-center">
          <h1 className="text-24  lg:text-36 font-semibold text-gray-900 ">
            {loggedInUser
              ? 'link Account'
              : type === 'sign-in'
                ? 'Sign In'
                : 'Sign Up'}
          </h1>
          <p className="text-16 font-normal to-gray-600">
            {loggedInUser
              ? 'Link your account to get started'
              : 'Please enter your details'}
          </p>
        </div>
      </header>
      {/* check for user  */}
      {loggedInUser ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={loggedInUser} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* input for signup */}
              {type === 'sign-up' && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      placeholder="ex:john"
                      label="First Name"
                      inputType="text"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      placeholder="ex: Doe"
                      label="Last Name"
                      inputType="text"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="city"
                    placeholder="ex: New York"
                    label="City"
                    inputType="text"
                  />

                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      placeholder="ex: NY"
                      label="State"
                      inputType="text"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      placeholder="ex: 1234"
                      label="Postal Code"
                      inputType="number"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address1"
                    placeholder="enter your specific address"
                    label="Address"
                    inputType="text"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      placeholder="yyyy-mm-dd"
                      label="Date of Birth"
                      inputType="text"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      placeholder="ex: 123-45-6789"
                      label="SSN"
                      inputType="number"
                    />
                  </div>
                </>
              )}
              {/* input for signin */}
              <CustomInput
                control={form.control}
                name="email"
                placeholder="Email"
                label="Email"
                inputType="email"
              />
              <CustomInput
                control={form.control}
                name="password"
                placeholder="Password"
                label="Password"
                inputType="password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
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
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === 'sign-in'
                ? 'Don’t have an account?'
                : 'Already have an account?'}
            </p>
            <Link
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
              className="form-link"
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
