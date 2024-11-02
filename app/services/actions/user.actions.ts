'use server';
import { createAdminClient, createSessionClient } from '@/app/api/appwriter';
import { parseStringify } from '@/lib/utils';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';

//================== sign up user =================
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

//==================== sign in user =================
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
    console.log(parseStringify(response));

    return parseStringify(response);
  } catch (error) {
    console.log('login error: ', error);
  }
};

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    console.log('user: ', parseStringify(user));
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
}

//  SING OUT USER

export async function signOut() {
  try {
    const { account } = await createSessionClient();

    (await cookies()).delete('appwrite-session');
    await account.deleteSession('current');
  } catch (error) {
    null;
  }
}
