'use server';

import {Client} from 'dwolla-v2';

const getEnvironment = (): 'production' | 'sandbox' => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case 'sandbox':
      return 'sandbox';
    case 'production':
      return 'production';
    default:
      throw new Error(
        'Dwolla environment should either be set to `sandbox` or `production`'
      );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_APP_KEY as string,
  secret: process.env.DWOLLA_APP_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
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

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      'on-demand-authorizations'
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error('Creating an On Demand Authorization Failed: ', err);
  }
};

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    return await dwollaClient
      .post('customers', newCustomer)
      .then((res) => res.headers.get('location'));
  } catch (err) {
    console.error('Creating a Dwolla Customer Failed: ', err);
  }
};

/**
 * Create a Dwolla transfer
 *
 * @param {TransferParams} params - Object with properties:
 * @param {string} params.sourceFundingSourceUrl - The URL of the Dwolla funding source to deduct from.
 * @param {string} params.destinationFundingSourceUrl - The URL of the Dwolla funding source to credit.
 * @param {string} params.amount - The amount to transfer in USD, formatted with two decimal places.
 *
 * @returns {Promise<string>} - The URL of the created Dwolla transfer, or undefined if the operation failed.
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
    if (err instanceof Error) {
      console.error('Creating a Dwolla Transfer Failed: ', err.message);
    } else {
      console.error('Creating a Dwolla Transfer Failed: ', err);
    }
  }
};

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
    console.error('add Funding Source failed: ', err);
  }
};
