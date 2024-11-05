import { createAdminClient } from '@/app/api/appwriter';
import { plaidClient } from '@/app/api/plaid-api/plaid';
import { encryptId, parseStringify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { ID } from 'node-appwrite';
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from 'plaid';

const {
  APPWRITER_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

/**
 * Creates a Plaid link token for a given user.
 *
 * This function constructs the necessary parameters and calls the Plaid API
 * to generate a link token. The token is used to initialize the Plaid Link
 * module, allowing users to securely connect their bank accounts.
 *
 * @param user - The user object containing the user's id and name.
 * @returns A promise that resolves to the serialized response from the Plaid API.
 * @throws Will log an error message if the Plaid API call fails.
 */
export const createLinkToken = async (user: User): Promise<string | null> => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[],
      country_codes: ['US'] as CountryCode[],
      language: 'en',
    };
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify(response);
  } catch (error) {
    console.log('create link token error: ', error);
    return null;
  }
};

// creating a bank account as document in appwrite database
const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  sharableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();
    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        sharableId,
      },
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.log({ error }, 'create bank account error: ');
  }
};

/**
 * Exchanges a Plaid public token for an access token, creates a processor
 * token for Dwolla, and creates a funding source URL for the account.
 *
 * @param user - The user object containing the user's id and name.
 * @param publicToken - The Plaid public token to exchange.
 * @returns A promise that resolves to an object with a single property
 *          `publicTokenExchange` set to `'Complete'` if the exchange was
 *          successful, otherwise an error is logged to the console.
 */
export const exchangePublicToken = async ({
  user,
  publicToken,
}: exchangePublicTokenProps) => {
  try {
    // exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // get account information from plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];
    // create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    };
    // generate proccessor token
    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request,
    );
    const processorToken = processorTokenResponse.data.processor_token;
    // create a funding source url for the account using th Dwolla customer Id, processor token , and bank name
    const fundingSourceResponse = await addFundingSource({
      user,
      processorToken,
      bankName: accountData.name,
    });
    // if the funding source url not created, throw an error
    if (!fundingSourceResponse) throw Error;

    // create bank account using the user ID, item id, account id, access token, funding source url, and sharable ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });
    // revalidate the path to reflect the changes
    revalidatePath('/dashboard');
    return parseStringify({
      publicTokenExchange: 'Complete',
    });
  } catch (error) {
    console.log(
      { error },
      'an error occurred while creating exchanging  token ',
    );
  }
};
