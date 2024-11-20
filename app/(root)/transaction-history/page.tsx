import {getAccount, getAccounts} from '@/app/services/actions/bank.actions';
import {getLoggedInUser} from '@/app/services/actions/user.auth';
import {Pagination} from '@/components/banks/pagination';
import TransactionsTable from '@/components/banks/transactionsTable';
import HeaderBox from '@/components/headerBox';
import {formatAmount} from '@/lib/utils';

const TransactionHistory = async (props: SearchParamProps) => {
  const searchParams = await props.searchParams;

  const {id, page} = searchParams;

  const currentPage = Number(page as string) || 1;

  const loggedIn = await getLoggedInUser();

  const accounts = await getAccounts({
    userId: loggedIn.$id,
  });

  if (!accounts) return;

  const accountsData = accounts?.data;

  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({appwriteItemId});

  const rowsPerPage = 10;
  const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransaction = account?.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transactions History"
          subtext="See your bank details and transactions."
        />
      </div>
      {/* acount details  */}
      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data.name || 'Account Name'}
            </h2>
            <p>{account?.data.officialName || 'Bank Name'}</p>
            {/* last 3 numbers  */}
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              •••• •••• ••••
              <span className="text-16">{account?.data.mask || '123'}</span>
            </p>
          </div>
          {/*TODO: transaction  */}
          <div className="transactions-account-balance">
            <p className="text-14">Current balance</p>
            <p className="text-24 text-center font-bold">
              {formatAmount(account?.data.currentBalance || 0)}
            </p>
          </div>
        </div>
        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={currentTransaction || []} />

          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination page={currentPage} totalPages={totalPages} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
export default TransactionHistory;
