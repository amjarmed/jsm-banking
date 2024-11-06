'use server';
// import { Databases } from 'appwrite';
import { cookies } from 'next/headers';
import { Account, Client, Databases, Users } from 'node-appwrite';

const {
  NEXT_PUBLIC_APPWRITE_ENDPOINT: APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: APPWRITE_PROJECT_ID,
  NEXT_APPWRITE_KEY: APPWRITE_KEY,
} = process.env;

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT!)
    .setProject(APPWRITE_PROJECT_ID!);

  const cookieStore = await cookies();
  const session = cookieStore.get('appwrite-session');

  if (!session || !session?.value) {
    throw new Error('No session found');
  }

  client.setSession(session.value);
  return {
    get account() {
      return new Account(client);
    },
  };
}

/**
 * Creates an Appwrite client for the admin role. This client is used to perform
 * operations that require admin privileges, such as creating a user or database.
 *
 * @returns An object with three properties: `account`, `user`, and `database`.
 * Each property is an instance of the corresponding Appwrite service class.
 * @throws If the `NEXT_APPWRITE_KEY` environment variable is not set.
 */
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT!)
    .setProject(APPWRITE_PROJECT_ID!)
    .setKey(APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get user() {
      return new Users(client);
    },
    get database() {
      return new Databases(client);
    },
  };
}
