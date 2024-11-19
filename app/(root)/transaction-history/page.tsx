import TransactionsTable from '../../../components/banks/transactionsTable';
import HeaderBox from '../../../components/headerBox';
import {formatAmount} from '../../../lib/utils';
import {getAccounts, getAccount} from '../../services/actions/bank.actions';
import {getLoggedInUser} from '../../services/actions/user.auth';

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
  console.log('account: ');

  console.log(account);

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
          <TransactionsTable transactions={account?.transactions || []} />
        </section>
      </div>
    </div>
  );
};
export default TransactionHistory;
