# AppwriteException: User (role: guests) missing scope (account) when setting up Next.js user session with Appwrite

I'm setting up authentication in my Next.js app using Appwrite and encountering the following error when trying to retrieve the logged-in user session:

> **`AppwriteException: User (role: guests) missing scope (account)`**

```bash
session:  appwrite-session / 6725570dcc3bd5913973
get logged error : AppwriteException: User (role: guests) missing scope (account)

{
  code: 401,
  type: 'general_unauthorized_scope',
  response: {
    message: 'User (role: guests) missing scope (account)',
    code: 401,
    type: 'general_unauthorized_scope',
    version: '1.6.0'
  }
}
```

### **System Information:**

- **Node Version**: `v23.1.0`
- **Appwrite SDK Version**: `"node-appwrite": "^14.1.0"`
- **Next.js Version**: `"next": "15.0.1"`
- **React Version**: `"react": "19.0.0-rc-69d4b800-20241021"`

### **Relevant Files:**

---

**1. Environment Variables (.env)**

```env
# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=xxx
APPWRITE_DATABASE_ID=xxxx
APPWRITE_USER_COLLECTION_ID=xxx
APPWRITE_BANK_COLLECTION_ID=xxxx
APPWRITE_TRANSACTION_COLLECTION_ID=xxx
NEXT_APPWRITE_KEY=xxxx
```

---

**2. `app/api/appwrite.ts`** – Appwrite Client Setup

```typescript
'use server';

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const cookieStore = await cookies();
  const session = cookieStore.get('appwrite-session');

  if (!session || !session.value) {
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
    .setKey(process.env.APPWRITE_API_KEY!);

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
```

---

**3. `app/services/actions/user.actions.ts`** – User Authentication Actions

```typescript
// imports...

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
    (await cookies()).set('appwrite-session', session.userId, {
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

export const signIn = async ({ email, password }: LoginUser) => {
  try {
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);

    return parseStringify(response);
  } catch (error) {
    console.log(error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    return parseStringify(user);
  } catch (error) {
    console.log('get logged error :', error);
  }
}
```

---

**4. `app/components/auth/authForm.tsx`** – Component for User Authentication Form

```typescript
// ...other code

try {
  // Sign Up
  if (type === 'sign-up') {
    const newUser = await signUp(values);
    setLoggedInUser(newUser);
  }

  // Sign In
  if (type === 'sign-in') {
    const response = await signIn({
      email: values.email,
      password: values.password,
    });

    //  if (response) router.push('/');
  }
} catch (error) {
  console.log(error);
} finally {
  setIsLoading(false);
}

// ...other code
```

---

**5. `app/(root)/page.tsx`** – User Data Fetch Attempt

```tsx
// This is where the issue starts
const user = await getLoggedInUser();
```

### **Question**

How can I correctly configure user sessions in Next.js with Appwrite to avoid this `401 Unauthorized` error? Am I handling session cookies or roles/scopes correctly, or is there another issue causing this?

Any insights on resolving this would be much appreciated!

---

### **What I’ve Tried**

1. **Setting Cookies**: Used `cookies()` to set an HTTP-only `appwrite-session` cookie.
2. **Environment Variables**: Confirmed environment variables are set correctly in `.env`.
3. **Appwrite Permissions**: Verified user roles and permissions, but the scope error persists.
4. **Custom Clients**: I created separate createSessionClient and createAdminClient functions to handle session-based and key-based access, respectively. The session client retrieves the cookie and sets it as the current session on the Appwrite client.

### **What I Expected:**

I expected the session to persist via the appwrite-session cookie, allowing the createSessionClient function to authenticate and retrieve the user data without encountering the 401 Unauthorized error. Specifically, I anticipated that once the session is created, calling `account.get()` with the session client would retrieve the logged-in user’s details, indicating that the session cookie was correctly set and recognized by Appwrite.

---

Stack Overflow: Use tags like next.js, appwrite, cookies, authentication, typescript.
Reddit: Post to subreddits like r/nextjs, r/webdev, or r/learnprogramming and check that Markdown renders as expected.
