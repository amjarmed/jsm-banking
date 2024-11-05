'use server';
import { handleDwollaError } from '@/lib/utils';
import { Client } from 'dwolla-v2';

//========= Dowolla is a payment processor ==========

/**
 * Retrieves the current Dwolla environment setting.
 *
 * @returns {'production' | 'sandbox'} - The environment type, either 'production' or 'sandbox'.
 * @throws {Error} If the environment is not set to 'sandbox' or 'production'.
 */
const getEnvironment = (): 'production' | 'sandbox' => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case 'sandbox':
      return 'sandbox';
    case 'production':
      return 'production';
    default:
      throw new Error(
        'Dwolla environment should either be set to `sandbox` or `production`',
      );
  }
};
// Create a Dwolla Client
const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

/**
 * Creates a new Dwolla Funding Source using the provided Plaid Processor Token.
 *
 * @param {CreateFundingSourceOptions} options
 * @param {string} options.customerId - The Dwolla Customer ID.
 * @param {string} options.fundingSourceName - The Dwolla Funding Source name.
 * @param {string} options.plaidToken - The Plaid Processor Token.
 * @returns {Promise<string | null>} The Dwolla Funding Source URL, or null if the request fails.
 */
export const createFundingSource = async (
  options: CreateFundingSourceOptions,
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get('location'));
  } catch (err) {
    console.error('Creating a Funding Source Failed: ', err);
  }
};

/**
 * Creates a new Dwolla On Demand Authorization and returns the authorization URL.
 *
 * @returns {Promise<{[key: string]: string} | null>} The authorization URL, or null if the request fails.
 */
export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      'on-demand-authorizations',
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error('Creating an On Demand Authorization Failed: ', err);
  }
};

/**
 * Creates a new Dwolla Customer.
 *
 * @param {NewDwollaCustomerParams} newCustomer - The new Dwolla Customer parameters.
 * @returns {Promise<string | null>} The Dwolla Customer URL, or null if the request fails.
 */
export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams,
) => {
  try {
    return await dwollaClient
      .post('customers', newCustomer)
      .then((res) => res.headers.get('location'));
  } catch (error) {
    handleDwollaError(error);
  }
};

/**
 * Creates a new Dwolla Transfer using the provided source and destination Funding Source URLs and amount.
 *
 * @param {TransferParams} transferParams - The Dwolla Transfer parameters.
 * @param {string} transferParams.sourceFundingSourceUrl - The source Funding Source URL.
 * @param {string} transferParams.destinationFundingSourceUrl - The destination Funding Source URL.
 * @param {string} transferParams.amount - The amount to transfer.
 * @returns {Promise<string | null>} The Dwolla Transfer URL, or null if the request fails.
 */
export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: 'USD',
        value: amount,
      },
    };
    return await dwollaClient
      .post('transfers', requestBody)
      .then((res) => res.headers.get('location'));
  } catch (err) {
    console.error('Transfer fund failed: ', err);
  }
};

/**
 * Adds a new Funding Source to a Dwolla Customer using a Plaid processor token.
 *
 * @param {AddFundingSourceParams} addFundingSourceParams - The parameters to add a Funding Source.
 * @param {string} addFundingSourceParams.dwollaCustomerId - The Dwolla Customer ID.
 * @param {string} addFundingSourceParams.processorToken - The Plaid processor token.
 * @param {string} addFundingSourceParams.bankName - The name of the bank.
 * @returns {Promise<string | null>} The Dwolla Funding Source URL, or null if the request fails.
 */
export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error('Transfer fund failed: ', err);
  }
};
