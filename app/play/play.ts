// 'use strict';

// // Import necessary modules
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import express, { NextFunction, Request, Response } from 'express';
// import moment from 'moment';
// import {
//   Configuration,
//   CraCheckReportProduct,
//   PlaidApi,
//   PlaidClient,
//   PlaidEnvironments,
//   Products,
// } from 'plaid';
// import util from 'util';
// import { v4 as uuidv4 } from 'uuid';
// import { ACCESS_TOKEN, APP_PORT, USER_TOKEN } from './config'; // Add your configuration imports

// // Load environment variables from .env file
// dotenv.config();

// // Define types for environment variables
// const APP_PORT: number = Number(process.env.APP_PORT) || 8000;
// const PLAID_CLIENT_ID: string | undefined = process.env.PLAID_CLIENT_ID;
// const PLAID_SECRET: string | undefined = process.env.PLAID_SECRET;
// const PLAID_ENV: string = process.env.PLAID_ENV || 'sandbox';

// // Sleep function with a delay in milliseconds
// const sleep = (ms: number): Promise<void> =>
//   new Promise((resolve) => setTimeout(resolve, ms));

// // PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// // Link. Note that this list must contain 'assets' in order for the app to be
// // able to create and retrieve asset reports.
// const PLAID_PRODUCTS: Products[] = (
//   process.env.PLAID_PRODUCTS || Products.Transactions
// ).split(',') as Products[];

// // Import necessary modules

// // PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// // will be able to select institutions from.
// const PLAID_COUNTRY_CODES: string[] = (
//   process.env.PLAID_COUNTRY_CODES || 'US'
// ).split(',');

// // Parameters used for the OAuth redirect Link flow.
// // Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// // The OAuth redirect flow requires an endpoint on the developer's website
// // that the bank website should redirect to. You will need to configure
// // this redirect URI for your client ID through the Plaid developer dashboard
// // at https://dashboard.plaid.com/team/api.
// const PLAID_REDIRECT_URI: string = process.env.PLAID_REDIRECT_URI || '';

// // Parameter used for OAuth in Android. This should be the package name of your app,
// // e.g. com.plaid.linksample
// const PLAID_ANDROID_PACKAGE_NAME: string =
//   process.env.PLAID_ANDROID_PACKAGE_NAME || '';

// // We store the access_token in memory - in production, store it in a secure
// // persistent data store
// let ACCESS_TOKEN: string | null = null;
// let USER_TOKEN: string | null = null;
// let PUBLIC_TOKEN: string | null = null;
// let ITEM_ID: string | null = null;
// const ACCOUNT_ID: string | null = null;
// // The payment_id is only relevant for the UK/EU Payment Initiation product.
// // We store the payment_id in memory - in production, store it in a secure
// // persistent data store along with the Payment metadata, such as userId.
// let PAYMENT_ID: string | null = null;
// // The transfer_id and authorization_id are only relevant for Transfer ACH product.
// // We store the transfer_id in memory - in production, store it in a secure
// // persistent data store
// const AUTHORIZATION_ID: string | null = null;
// const TRANSFER_ID: string | null = null;

// // Initialize the Plaid client
// // Find your API keys in the Dashboard (https://dashboard.plaid.com/account/keys)

// const configuration = new Configuration({
//   basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
//   baseOptions: {
//     headers: {
//       'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
//       'PLAID-SECRET': process.env.PLAID_SECRET || '',
//       'Plaid-Version': '2020-09-14',
//     },
//   },
// });

// const client = new PlaidApi(configuration);
// const app = express();
// app.use(
//   bodyParser.urlencoded({
//     extended: false,
//   }),
// );
// app.use(bodyParser.json());
// app.use(cors());

// app.post('/api/info', async function (request, response) {
//   try {
//     response.json({
//       item_id: ITEM_ID,
//       access_token: ACCESS_TOKEN,
//       products: PLAID_PRODUCTS,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // Create a link token with configs which we can then use to initialize Plaid Link client-side.
// app.post('/api/create_link_token', async function (request, response, next) {
//   try {
//     const configs = {
//       user: {
//         client_user_id: 'user-id',
//       },
//       client_name: 'Plaid Quickstart',
//       products: PLAID_PRODUCTS,
//       country_codes: PLAID_COUNTRY_CODES,
//       language: 'en',
//     };

//     if (PLAID_REDIRECT_URI !== '') {
//       configs.redirect_uri = PLAID_REDIRECT_URI;
//     }

//     if (PLAID_ANDROID_PACKAGE_NAME !== '') {
//       configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
//     }

//     if (PLAID_PRODUCTS.includes(Products.Statements)) {
//       configs.statements = {
//         end_date: moment().format('YYYY-MM-DD'),
//         start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
//       };
//     }

//     const craEnumValues = Object.values(CraCheckReportProduct);
//     if (PLAID_PRODUCTS.some((product) => craEnumValues.includes(product))) {
//       configs.user_token = USER_TOKEN;
//       configs.cra_options = { days_requested: 60 };
//       configs.consumer_report_permissible_purpose = 'ACCOUNT_REVIEW_CREDIT';
//     }

//     const createTokenResponse = await client.linkTokenCreate(configs);
//     prettyPrintResponse(createTokenResponse);
//     response.json(createTokenResponse.data);
//   } catch (error) {
//     next(error);
//   }
// });

// // Create a user token which can be used for Plaid Check, Income, or Multi-Item link flows
// app.post('/api/create_user_token', async function (request, response, next) {
//   try {
//     const request = {
//       client_user_id: 'user_' + uuidv4(),
//     };

//     const craEnumValues = Object.values(CraCheckReportProduct);
//     if (PLAID_PRODUCTS.some((product) => craEnumValues.includes(product))) {
//       request.consumer_report_user_identity = {
//         first_name: 'Harry',
//         last_name: 'Potter',
//         phone_numbers: ['+16174567890'],
//         emails: ['harrypotter@example.com'],
//         primary_address: {
//           city: 'New York',
//           region: 'NY',
//           street: '4 Privet Drive',
//           postal_code: '11111',
//           country: 'US',
//         },
//       };
//     }

//     const user = await client.userCreate(request);
//     USER_TOKEN = user.data.user_token;
//     response.json(user.data);
//   } catch (error) {
//     next(error);
//   }
// });

// // Create a link token with configs which we can then use to initialize Plaid Link client-side for a 'payment-initiation' flow.
// app.post(
//   '/api/create_link_token_for_payment',
//   async function (request, response, next) {
//     try {
//       const createRecipientResponse =
//         await client.paymentInitiationRecipientCreate({
//           name: 'Harry Potter',
//           iban: 'GB33BUKB20201555555555',
//           address: {
//             street: ['4 Privet Drive'],
//             city: 'Little Whinging',
//             postal_code: '11111',
//             country: 'GB',
//           },
//         });

//       const recipientId = createRecipientResponse.data.recipient_id;
//       prettyPrintResponse(createRecipientResponse);

//       const createPaymentResponse = await client.paymentInitiationPaymentCreate(
//         {
//           recipient_id: recipientId,
//           reference: 'paymentRef',
//           amount: {
//             value: 1.23,
//             currency: 'GBP',
//           },
//         },
//       );

//       prettyPrintResponse(createPaymentResponse);
//       const paymentId = createPaymentResponse.data.payment_id;
//       PAYMENT_ID = paymentId;

//       const configs = {
//         client_name: 'Plaid Quickstart',
//         user: {
//           client_user_id: uuidv4(),
//         },
//         country_codes: PLAID_COUNTRY_CODES,
//         language: 'en',
//         products: [Products.PaymentInitiation],
//         payment_initiation: {
//           payment_id: paymentId,
//         },
//       };

//       if (PLAID_REDIRECT_URI !== '') {
//         configs.redirect_uri = PLAID_REDIRECT_URI;
//       }

//       const createTokenResponse = await client.linkTokenCreate(configs);
//       prettyPrintResponse(createTokenResponse);
//       response.json(createTokenResponse.data);
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// // Exchange token flow - exchange a Link public_token for an API access_token
// app.post('/api/set_access_token', async function (request, response, next) {
//   try {
//     PUBLIC_TOKEN = request.body.public_token;
//     const tokenResponse = await client.itemPublicTokenExchange({
//       public_token: PUBLIC_TOKEN,
//     });

//     prettyPrintResponse(tokenResponse);
//     ACCESS_TOKEN = tokenResponse.data.access_token;
//     ITEM_ID = tokenResponse.data.item_id;

//     response.json({
//       access_token: ACCESS_TOKEN,
//       item_id: ITEM_ID,
//       error: null,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve ACH or ETF Auth data for an Item's accounts
// app.get('/api/auth', async function (request, response, next) {
//   try {
//     const authResponse = await client.authGet({
//       access_token: ACCESS_TOKEN,
//     });

//     prettyPrintResponse(authResponse);
//     response.json(authResponse.data);
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve Transactions for an Item
// app.get('/api/transactions', async function (request, response, next) {
//   try {
//     let cursor = null;
//     let added = [];
//     let modified = [];
//     let removed = [];
//     let hasMore = true;

//     while (hasMore) {
//       const request = {
//         access_token: ACCESS_TOKEN,
//         cursor: cursor,
//       };

//       const res = await client.transactionsSync(request);
//       const data = res.data;

//       cursor = data.next_cursor;
//       if (cursor === '') {
//         await sleep(2000);
//         continue;
//       }

//       added = added.concat(data.added);
//       modified = modified.concat(data.modified);
//       removed = removed.concat(data.removed);
//       hasMore = data.has_more;

//       prettyPrintResponse(res);
//     }

//     const compareTxnsByDateAscending = (a, b) =>
//       (a.date > b.date) - (a.date < b.date);
//     const recently_added = [...added]
//       .sort(compareTxnsByDateAscending)
//       .slice(-8);

//     response.json({ latest_transactions: recently_added });
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve Investment Transactions for an Item
// app.get(
//   '/api/investments_transactions',
//   async function (request, response, next) {
//     try {
//       const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
//       const endDate = moment().format('YYYY-MM-DD');
//       const configs = {
//         access_token: ACCESS_TOKEN,
//         start_date: startDate,
//         end_date: endDate,
//       };

//       const investmentTransactionsResponse =
//         await client.investmentsTransactionsGet(configs);
//       prettyPrintResponse(investmentTransactionsResponse);
//       response.json({
//         error: null,
//         investments_transactions: investmentTransactionsResponse.data,
//       });
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// // Retrieve Identity for an Item
// app.get('/api/identity', async function (request, response, next) {
//   try {
//     const identityResponse = await client.identityGet({
//       access_token: ACCESS_TOKEN,
//     });

//     prettyPrintResponse(identityResponse);
//     response.json({ identity: identityResponse.data.accounts });
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve real-time Balances for each of an Item's accounts
// app.get('/api/balance', async function (request, response, next) {
//   try {
//     const balanceResponse = await client.accountsBalanceGet({
//       access_token: ACCESS_TOKEN,
//     });

//     prettyPrintResponse(balanceResponse);
//     response.json(balanceResponse.data);
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve Holdings for an Item
// app.get('/api/holdings', async function (request, response, next) {
//   try {
//     const holdingsResponse = await client.investmentsHoldingsGet({
//       access_token: ACCESS_TOKEN,
//     });

//     prettyPrintResponse(holdingsResponse);
//     response.json({ error: null, holdings: holdingsResponse.data });
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve Liabilities for an Item
// app.get('/api/liabilities', async function (request, response, next) {
//   try {
//     const liabilitiesResponse = await client.liabilitiesGet({
//       access_token: ACCESS_TOKEN,
//     });

//     prettyPrintResponse(liabilitiesResponse);
//     response.json({ error: null, liabilities: liabilitiesResponse.data });
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve information about an Item
// app.get('/api/item', async function (request, response, next) {
//   try {
//     const itemResponse = await client.itemGet({
//       access_token: ACCESS_TOKEN,
//     });
//     // Continue with the institution fetch
//   } catch (error) {
//     next(error);
//   }
// });
// const app = express();
// app.use(
//   bodyParser.urlencoded({
//     extended: false,
//   }),
// );
// app.use(bodyParser.json());
// app.use(cors());

// app.post('/api/info', async function (request, response) {
//   try {
//     response.json({
//       item_id: ITEM_ID,
//       access_token: ACCESS_TOKEN,
//       products: PLAID_PRODUCTS,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // Create a link token with configs which we can then use to initialize Plaid Link client-side.
// app.post('/api/create_link_token', async function (request, response, next) {
//   try {
//     const configs = {
//       user: {
//         client_user_id: 'user-id',
//       },
//       client_name: 'Plaid Quickstart',
//       products: PLAID_PRODUCTS,
//       country_codes: PLAID_COUNTRY_CODES,
//       language: 'en',
//     };

//     if (PLAID_REDIRECT_URI !== '') {
//       configs.redirect_uri = PLAID_REDIRECT_URI;
//     }

//     if (PLAID_ANDROID_PACKAGE_NAME !== '') {
//       configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
//     }

//     if (PLAID_PRODUCTS.includes(Products.Statements)) {
//       configs.statements = {
//         end_date: moment().format('YYYY-MM-DD'),
//         start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
//       };
//     }

//     const craEnumValues = Object.values(CraCheckReportProduct);
//     if (PLAID_PRODUCTS.some((product) => craEnumValues.includes(product))) {
//       configs.user_token = USER_TOKEN;
//       configs.cra_options = { days_requested: 60 };
//       configs.consumer_report_permissible_purpose = 'ACCOUNT_REVIEW_CREDIT';
//     }

//     const createTokenResponse = await client.linkTokenCreate(configs);
//     prettyPrintResponse(createTokenResponse);
//     response.json(createTokenResponse.data);
//   } catch (error) {
//     next(error);
//   }
// });

// // Create a user token which can be used for Plaid Check, Income, or Multi-Item link flows
// app.post('/api/create_user_token', async function (request, response, next) {
//   try {
//     const request = {
//       client_user_id: 'user_' + uuidv4(),
//     };

//     const craEnumValues = Object.values(CraCheckReportProduct);
//     if (PLAID_PRODUCTS.some((product) => craEnumValues.includes(product))) {
//       request.consumer_report_user_identity = {
//         first_name: 'Harry',
//         last_name: 'Potter',
//         phone_numbers: ['+16174567890'],
//         emails: ['harrypotter@example.com'],
//         primary_address: {
//           city: 'New York',
//           region: 'NY',
//           street: '4 Privet Drive',
//           postal_code: '11111',
//           country: 'US',
//         },
//       };
//     }

//     const user = await client.userCreate(request);
//     USER_TOKEN = user.data.user_token;
//     response.json(user.data);
//   } catch (error) {
//     next(error);
//   }
// });

// // Create a link token with configs which we can then use to initialize Plaid Link client-side for a 'payment-initiation' flow.
// app.post(
//   '/api/create_link_token_for_payment',
//   async function (request, response, next) {
//     try {
//       const createRecipientResponse =
//         await client.paymentInitiationRecipientCreate({
//           name: 'Harry Potter',
//           iban: 'GB33BUKB20201555555555',
//           address: {
//             street: ['4 Privet Drive'],
//             city: 'Little Whinging',
//             postal_code: '11111',
//             country: 'GB',
//           },
//         });

//       const recipientId = createRecipientResponse.data.recipient_id;
//       prettyPrintResponse(createRecipientResponse);

//       const createPaymentResponse = await client.paymentInitiationPaymentCreate(
//         {
//           recipient_id: recipientId,
//           reference: 'paymentRef',
//           amount: {
//             value: 1.23,
//             currency: 'GBP',
//           },
//         },
//       );

//       prettyPrintResponse(createPaymentResponse);
//       const paymentId = createPaymentResponse.data.payment_id;
//       PAYMENT_ID = paymentId;

//       const configs = {
//         client_name: 'Plaid Quickstart',
//         user: {
//           client_user_id: uuidv4(),
//         },
//         country_codes: PLAID_COUNTRY_CODES,
//         language: 'en',
//         products: [Products.PaymentInitiation],
//         payment_initiation: {
//           payment_id: paymentId,
//         },
//       };

//       if (PLAID_REDIRECT_URI !== '') {
//         configs.redirect_uri = PLAID_REDIRECT_URI;
//       }

//       const createTokenResponse = await client.linkTokenCreate(configs);
//       prettyPrintResponse(createTokenResponse);
//       response.json(createTokenResponse.data);
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// // Exchange token flow - exchange a Link public_token for an API access_token
// app.post('/api/set_access_token', async function (request, response, next) {
//   try {
//     PUBLIC_TOKEN = request.body.public_token;
//     const tokenResponse = await client.itemPublicTokenExchange({
//       public_token: PUBLIC_TOKEN,
//     });

//     prettyPrintResponse(tokenResponse);
//     ACCESS_TOKEN = tokenResponse.data.access_token;
//     ITEM_ID = tokenResponse.data.item_id;

//     response.json({
//       access_token: ACCESS_TOKEN,
//       item_id: ITEM_ID,
//       error: null,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve ACH or ETF Auth data for an Item's accounts
// app.get('/api/auth', async function (request, response, next) {
//   try {
//     const authResponse = await client.authGet({
//       access_token: ACCESS_TOKEN,
//     });

//     prettyPrintResponse(authResponse);
//     response.json(authResponse.data);
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve Transactions for an Item
// app.get('/api/transactions', async function (request, response, next) {
//   try {
//     let cursor = null;
//     let added = [];
//     let modified = [];
//     let removed = [];
//     let hasMore = true;

//     while (hasMore) {
//       const request = {
//         access_token: ACCESS_TOKEN,
//         cursor: cursor,
//       };

//       const res = await client.transactionsSync(request);
//       const data = res.data;

//       cursor = data.next_cursor;
//       if (cursor === '') {
//         await sleep(2000);
//         continue;
//       }

//       added = added.concat(data.added);
//       modified = modified.concat(data.modified);
//       removed = removed.concat(data.removed);
//       hasMore = data.has_more;

//       prettyPrintResponse(res);
//     }

//     const compareTxnsByDateAscending = (a, b) =>
//       (a.date > b.date) - (a.date < b.date);
//     const recently_added = [...added]
//       .sort(compareTxnsByDateAscending)
//       .slice(-8);

//     response.json({ latest_transactions: recently_added });
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve Investment Transactions for an Item
// app.get(
//   '/api/investments_transactions',
//   async function (request, response, next) {
//     try {
//       const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
//       const endDate = moment().format('YYYY-MM-DD');
//       const configs = {
//         access_token: ACCESS_TOKEN,
//         start_date: startDate,
//         end_date: endDate,
//       };

//       const investmentTransactionsResponse =
//         await client.investmentsTransactionsGet(configs);
//       prettyPrintResponse(investmentTransactionsResponse);
//       response.json({
//         error: null,
//         investments_transactions: investmentTransactionsResponse.data,
//       });
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// // Retrieve Identity for an Item
// app.get('/api/identity', async function (request, response, next) {
//   try {
//     const identityResponse = await client.identityGet({
//       access_token: ACCESS_TOKEN,
//     });

//     prettyPrintResponse(identityResponse);
//     response.json({ identity: identityResponse.data.accounts });
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve real-time Balances for each of an Item's accounts
// app.get('/api/balance', async function (request, response, next) {
//   try {
//     const balanceResponse = await client.accountsBalanceGet({
//       access_token: ACCESS_TOKEN,
//     });

//     prettyPrintResponse(balanceResponse);
//     response.json(balanceResponse.data);
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve Holdings for an Item
// app.get('/api/holdings', async function (request, response, next) {
//   try {
//     const holdingsResponse = await client.investmentsHoldingsGet({
//       access_token: ACCESS_TOKEN,
//     });

//     prettyPrintResponse(holdingsResponse);
//     response.json({ error: null, holdings: holdingsResponse.data });
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve Liabilities for an Item
// app.get('/api/liabilities', async function (request, response, next) {
//   try {
//     const liabilitiesResponse = await client.liabilitiesGet({
//       access_token: ACCESS_TOKEN,
//     });

//     prettyPrintResponse(liabilitiesResponse);
//     response.json({ error: null, liabilities: liabilitiesResponse.data });
//   } catch (error) {
//     next(error);
//   }
// });

// // Retrieve information about an Item
// app.get('/api/item', async function (request, response, next) {
//   try {
//     const itemResponse = await client.itemGet({
//       access_token: ACCESS_TOKEN,
//     });
//     // Continue with the institution fetch
//   } catch (error) {
//     next(error);
//   }
// });

// const app = express();

// const prettyPrintResponse = (response: any): void => {
//   console.log(util.inspect(response.data, { colors: true, depth: 4 }));
// };

// app.get(
//   '/api/income/verification/paystubs',
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const paystubsGetResponse = await client.incomeVerificationPaystubsGet({
//         access_token: ACCESS_TOKEN,
//       });
//       prettyPrintResponse(paystubsGetResponse);
//       res.json({ error: null, paystubs: paystubsGetResponse.data });
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// const server = app.listen(APP_PORT, () => {
//   console.log('plaid-quickstart server listening on port ' + APP_PORT);
// });

// const getAssetReportWithRetries = async (
//   plaidClient: PlaidClient,
//   asset_report_token: string,
//   ms: number = 1000,
//   retriesLeft: number = 20,
// ): Promise<any> => {
//   const request = { asset_report_token };

//   return await pollWithRetries(
//     async () => await plaidClient.assetReportGet(request),
//     ms,
//     retriesLeft,
//   );
// };

// const formatError = (error: any): { error: any } => {
//   return {
//     error: { ...error.data, status_code: error.status },
//   };
// };

// app.get(
//   '/api/transfer_authorize',
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const accountsResponse = await client.accountsGet({
//         access_token: ACCESS_TOKEN,
//       });
//       const accountId = accountsResponse.data.accounts[0].account_id;

//       const transferAuthorizationCreateResponse =
//         await client.transferAuthorizationCreate({
//           access_token: ACCESS_TOKEN,
//           account_id: accountId,
//           type: 'debit',
//           network: 'ach',
//           amount: '1.00',
//           ach_class: 'ppd',
//           user: {
//             legal_name: 'FirstName LastName',
//             email_address: 'foobar@email.com',
//             address: {
//               street: '123 Main St.',
//               city: 'San Francisco',
//               region: 'CA',
//               postal_code: '94053',
//               country: 'US',
//             },
//           },
//         });

//       prettyPrintResponse(transferAuthorizationCreateResponse);
//       const authorizationId =
//         transferAuthorizationCreateResponse.data.authorization.id;
//       res.json(transferAuthorizationCreateResponse.data);
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// app.get(
//   '/api/transfer_create',
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const transferCreateResponse = await client.transferCreate({
//         access_token: ACCESS_TOKEN,
//         account_id: 'ACCOUNT_ID', // replace with the correct account ID
//         authorization_id: 'AUTHORIZATION_ID', // replace with the correct authorization ID
//         description: 'Debit',
//       });

//       prettyPrintResponse(transferCreateResponse);
//       const transferId = transferCreateResponse.data.transfer.id;
//       res.json({
//         error: null,
//         transfer: transferCreateResponse.data.transfer,
//       });
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// app.get(
//   '/api/signal_evaluate',
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const accountsResponse = await client.accountsGet({
//         access_token: ACCESS_TOKEN,
//       });
//       const accountId = accountsResponse.data.accounts[0].account_id;

//       const signalEvaluateResponse = await client.signalEvaluate({
//         access_token: ACCESS_TOKEN,
//         account_id: accountId,
//         client_transaction_id: 'txn1234',
//         amount: 100.0,
//       });

//       prettyPrintResponse(signalEvaluateResponse);
//       res.json(signalEvaluateResponse.data);
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// app.get(
//   '/api/cra/get_base_report',
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const getResponse = await getCraBaseReportWithRetries(client, USER_TOKEN);
//       prettyPrintResponse(getResponse);

//       const pdfResponse = await client.craCheckReportPdfGet(
//         { user_token: USER_TOKEN },
//         { responseType: 'arraybuffer' },
//       );

//       res.json({
//         report: getResponse.data.report,
//         pdf: pdfResponse.data.toString('base64'),
//       });
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// const getCraBaseReportWithRetries = async (
//   plaidClient: PlaidClient,
//   userToken: string,
// ): Promise<any> => {
//   return await pollWithRetries(
//     async () =>
//       await plaidClient.craCheckReportBaseReportGet({ user_token: userToken }),
//   );
// };

// app.get(
//   '/api/cra/get_income_insights',
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const getResponse = await getCheckInsightsWithRetries(client, USER_TOKEN);
//       prettyPrintResponse(getResponse);

//       const pdfResponse = await client.craCheckReportPdfGet(
//         { user_token: USER_TOKEN, add_ons: ['cra_income_insights'] },
//         { responseType: 'arraybuffer' },
//       );

//       res.json({
//         report: getResponse.data.report,
//         pdf: pdfResponse.data.toString('base64'),
//       });
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// const getCheckInsightsWithRetries = async (
//   plaidClient: PlaidClient,
//   userToken: string,
// ): Promise<any> => {
//   return await pollWithRetries(
//     async () =>
//       await plaidClient.craCheckReportIncomeInsightsGet({
//         user_token: userToken,
//       }),
//   );
// };

// app.get(
//   '/api/cra/get_partner_insights',
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const response = await getCheckParnterInsightsWithRetries(
//         client,
//         USER_TOKEN,
//       );
//       prettyPrintResponse(response);

//       res.json(response.data);
//     } catch (error) {
//       next(error);
//     }
//   },
// );

// const getCheckParnterInsightsWithRetries = async (
//   plaidClient: PlaidClient,
//   userToken: string,
// ): Promise<any> => {
//   return await pollWithRetries(
//     async () =>
//       await plaidClient.craCheckReportPartnerInsightsGet({
//         user_token: userToken,
//       }),
//   );
// };

// const pollWithRetries = async (
//   requestCallback: Function,
//   ms: number = 1000,
//   retriesLeft: number = 20,
// ): Promise<any> => {
//   try {
//     return await requestCallback();
//   } catch (error) {
//     if (retriesLeft === 1) {
//       throw new Error('Ran out of retries while polling');
//     }
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         pollWithRetries(requestCallback, ms, retriesLeft - 1)
//           .then(resolve)
//           .catch(reject);
//       }, ms);
//     });
//   }
// };

// app.use(
//   '/api',
//   (error: any, req: Request, res: Response, next: NextFunction): void => {
//     console.log(error);
//     prettyPrintResponse(error.response);
//     res.json(formatError(error.response));
//   },
// );

// export { app, server };
