'use server';
import { createAdminClient, createSessionClient } from '@/app/api/appwriter';
import { parseStringify } from '@/lib/utils';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';

/**
 * Signs up a new user, creates a session, and sets the session cookie
 *
 * @param userData - User data to sign up with
 * @returns The newly created user document
 */

export const signUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData;
  try {
    const { account } = await createAdminClient();
    // create user account
    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );
    // Create a session using Appwrite
    const session = await account.createEmailPasswordSession(email, password);

    // Use NextResponse to create a new response and set a secure, HTTP-only cookie
    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Signs in a user and creates a session, setting the session cookie
 *
 * @param data - Data to sign in with
 * @returns The newly created session document
 */
export const signIn = async ({ email, password }: LoginUser) => {
  try {
    // create user account
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);
    (await cookies()).set('appwrite-session', response.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    console.log(`logged in successfully !`);
    return parseStringify(response);
  } catch (error) {
    console.log('login error: ', error);
  }
};

/**
 * Retrieves the logged-in user document
 *
 * @returns The logged-in user document
 */

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Deletes the current user session and removes the session cookie
 *
 * @returns undefined
 */
export async function signOut() {
  try {
    const { account } = await createSessionClient();

    (await cookies()).delete('appwrite-session');
    await account.deleteSession('current');
  } catch (error) {
    null;
  }
}
