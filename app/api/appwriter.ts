'use server';
// import { Databases } from 'appwrite';
import { cookies } from 'next/headers';
import { Account, Client, Databases, Users } from 'node-appwrite';

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

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

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  // check if session exists
  if (client) {
  }

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
