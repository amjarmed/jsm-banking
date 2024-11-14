'use server';
import { createAdminClient } from '@/app/api/appwriter';
import { plaidClient } from '@/app/api/plaid';
import { encryptId, parseStringify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { ID, Query } from 'node-appwrite';
import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from 'plaid';
import { addFundingSource } from './dwolla.actions';
import { log } from 'console';
const {
  APPWRITER_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;
export const createLinkToken = async (user: User) => {
  console.log('Creating Link Token');

  try {
    // Create a link token PARAMS

    const tokenParams = {
      client_name: `${user.firstName} ${user.lastName}`,
      products: [Products.Auth],
      country_codes: [CountryCode.Us],
      language: 'en',
      user: {
        client_user_id: user.$id,
      },
    };
    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    return null;
  }
};

// This function exchanges a public token for an access token and item ID
export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const processorTokenResponse = await plaidClient.processorTokenCreate({
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: ProcessorTokenCreateRequestProcessorEnum.Dwolla,
    } as ProcessorTokenCreateRequest);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and sharable ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath('/');

    // Return a success message
    return parseStringify({
      publicTokenExchange: 'complete',
    });
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Exchanging Public Token Failed: ', error);
  }
};
export const createBankAccount = async ({
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
    console.log('Create Bank Account Failed:', error);
  }
};

// get banks

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', userId)],
    );

    return parseStringify(banks.documents);
  } catch (error) {
    console.log('Get Banks Failed:', error);
  }
};

// get  bank

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', documentId)],
    );
    console.log('bank info', bank);

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log('Get Bank Failed:', error);
  }
};
