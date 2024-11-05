'use server';
import { createAdminClient, createSessionClient } from '@/app/api/appwriter';
import { extractCustomerIdFromUrl, parseStringify } from '@/lib/utils';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { createDwollaCustomer } from './dwolla.actions';
const {
  APPWRITER_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

/**
 * Creates a new user account in the database and logs them in using Appwrite sessions.
 * @param {SignUpParams} userData - User data to sign up with.
 * @returns {Promise<string>} - The newly created user document as a JSON string.
 */
export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;
  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();
    // Step 1: Create user account
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );
    if (!newUserAccount) throw Error('Error creating user account');

    // Step 2: Create Dwolla customer
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: 'personal',
    });
    if (!dwollaCustomerUrl) throw Error('Error creating Dwolla customer');
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    // Step 3: Add user to the database
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerUrl,
        dwollaCustomerId,
      },
    );
    if (!newUser) throw new Error('Error creating user document');

    // Step 4: Create a session using Appwrite
    const session = await account.createEmailPasswordSession(email, password);
    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
    console.log('sign up new account successfully!');
    return parseStringify(newUser);
  } catch (error) {
    // handleAppError(error);
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
    console.info(`logged in successfully !`);
    return parseStringify(response);
  } catch (error) {
    console.error(`Error occurred: ${error}`);
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
    console.error(` Error getting logged in user: ${error}`);
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
    console.error(`Error signing out: ${error}`);
    return null;
  }
}