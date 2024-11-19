import HeaderBox from '@/components/headerBox';
import RightSideBar from '@/components/navigations/rightSideBar';
import TotalBalanceBox from '@/components/totalBalanceBox';
import {redirect} from 'next/navigation';
import {getLoggedInUser} from '../services/actions/user.auth';
import {getAccount, getAccounts} from '../services/actions/bank.actions';
import RecentTransactions from '@/components/banks/recentTransactions';

export default async function Home(props: SearchParamProps) {
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

  return (
    <section id="home" className="home ">
      <div className="home-content">
        <header className="home-header">
          {/* welcome message  */}
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          {/*  balance in account  */}
          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        {/* main content : Transactions and Accounts */}
        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      {/* right sidebar : Personalization */}
      <RightSideBar
        user={loggedIn}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  );
}
