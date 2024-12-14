'use server';

import {plaidClient} from '@/app/api/plaid';
import {getTransactionsByBankId} from '@/app/services/actions/transaction.actions';
import {getBank, getBanks} from '@/app/services/actions/user.plaid';
import {parseStringify} from '@/lib/utils';
import {CountryCode} from 'plaid';

// Get multiple bank accounts
export const getAccounts = async ({userId}: getAccountsProps) => {
  try {
    // get banks from db
    const banks = await getBanks({userId});

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          sharableId: bank.sharableId,
        };

        return account;
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({data: accounts, totalBanks, totalCurrentBalance});
  } catch (error) {
    console.error('An error occurred while getting the accounts:', error);
  }
};

// Get one bank account
export const getAccount = async ({appwriteItemId}: getAccountProps) => {
  try {
    // get bank from db
    const bank = await getBank({documentId: appwriteItemId});

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id || '',
    });

    const transferTransactions = transferTransactionsData.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? 'debit' : 'credit',
      })
    );

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...transactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error('An error occurred while getting the account:', error);
  }
};

// Get bank info
export const getInstitution = async ({institutionId}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ['US'] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error('An error occurred while getting the accounts:', error);
  }
};

// Get transactions
export const getTransactions = async ({accessToken}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: TransactionHistoryProps[] = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = transactions.concat(
        response.data.added.map((transaction) => ({
          id: transaction.transaction_id || 'unknown-id',
          name: transaction.name || 'Unknown Name',
          paymentChannel: transaction.payment_channel || 'Unknown Channel',
          type: transaction.payment_channel || 'Unknown Type',
          accountId: transaction.account_id || 'unknown-account',
          amount: transaction.amount || 0,
          pending: transaction.pending || false,
          category: transaction.category
            ? transaction.category[0]
            : 'Uncategorized',
          date: transaction.date || new Date().toISOString(),
          image: transaction.logo_url || '',
        }))
      );
      hasMore = data.has_more;
    }

    if (transactions.length === 0) {
      return parseStringify([]);
    }
    return parseStringify(transactions);
  } catch (error) {
    console.error('An error occurred while getting the transactions:', error);
  }
};
