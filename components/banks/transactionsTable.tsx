import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatAmount,
  getTransactionStatus,
  removeSpecialCharacters,
} from '../../lib/utils';

function TransactionsTable({ transactions }: TransactionTableProps) {
  console.log(transactions);
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transactions</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2 max-md:hidden">Date</TableHead>
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => {
          const status = getTransactionStatus(new Date(t.date));
          const amount = formatAmount(t.amount);
          const isDebit = t.type === 'debit';
          const isCredit = t.type === 'credit';
             console.log("transaction name:",t.name)
          return (
            <TableRow key={t.id}>
              <TableCell>
                <div>
                  <h1>{removeSpecialCharacters(t.name)}</h1>
                </div>
              </TableCell>
     
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default TransactionsTable;
