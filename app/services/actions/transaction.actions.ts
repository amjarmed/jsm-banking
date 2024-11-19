'use server';

import {createAdminClient} from '@/app/api/appwriter';
import {parseStringify} from '@/lib/utils';
import {ID, Query} from 'node-appwrite';
const {
  APPWRITER_DATABASE_ID: DATABASE_ID,
  APPWRITER_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

/**
 * Creates a new transaction document in the Appwrite database.
 * @param {CreateTransactionProps} transaction - The transaction to create.
 * @returns {Promise<string>} - The newly created transaction document as a JSON string.
 */
export const createTransaction = async (
  transaction: CreateTransactionProps
) => {
  try {
    const {database} = await createAdminClient();

    const newTransaction = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      {
        channel: 'online',
        category: 'Transfer',
        ...transaction,
      }
    );

    return parseStringify(newTransaction);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Retrieves all transactions associated with a given bank ID.
 * The transactions include both sender and receiver transactions
 * where the bank ID is involved.
 *
 * @param {Object} getTransactionsByBankIdProps - The properties for retrieving transactions.
 * @param {string} getTransactionsByBankIdProps.bankId - The bank ID to filter transactions by.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing the total number of transactions
 * and an array of transaction documents.
 *
 * @throws Will log an error message if the operation fails.
 */

export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {
  try {
    const {database} = await createAdminClient();

    const senderTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('senderBankId', bankId)]
    );

    const receiverTransactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal('receiverBankId', bankId)]
    );
    // 5-16
    const transactions = {
      total: senderTransactions.total + receiverTransactions.total,
      documents: [
        ...senderTransactions.documents,
        ...receiverTransactions.documents,
      ],
    };
    console.log('transactions:', transactions);

    return parseStringify(transactions);
  } catch (error) {
    console.log(' getTransactionsByBankId Failed:', error);
  }
};
