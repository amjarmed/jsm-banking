import {Pagination} from '@/components/banks/pagination';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import Link from 'next/link';
import BankInfo from './bankInfo';
import {BankTabItem} from './bankTabItem';
import TransactionsTable from './transactionsTable';

function RecentTransactions({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}: RecentTransactionsProps) {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransaction = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="header-2">Recent Transactions</h2>
        <Link
          href={`/transaction-history/?id=${appwriteItemId}`}
          className="view-all-btn"
        >
          View All
        </Link>
      </header>

      <Tabs defaultValue={appwriteItemId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account) => (
            <TabsTrigger key={account.id} value={account.appwriteItemId}>
              <BankTabItem
                account={account}
                key={account.id}
                appwriteItemId={appwriteItemId}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent
            key={account.id}
            value={account.appwriteItemId}
            className="space-y-4"
          >
            <BankInfo
              account={account}
              appwriteItemId={appwriteItemId}
              type="full"
            />
            <TransactionsTable transactions={currentTransaction} />
            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination page={page} totalPages={totalPages} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

export default RecentTransactions;
