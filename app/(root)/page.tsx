import {getAccount, getAccounts} from '@/app/services/actions/bank.actions';
import {getLoggedInUser} from '@/app/services/actions/user.auth';
import RecentTransactions from '@/components/banks/recentTransactions';
import HeaderBox from '@/components/headerBox';
import RightSideBar from '@/components/navigations/rightSideBar';
import TotalBalanceBox from '@/components/totalBalanceBox';
import {Suspense} from 'react';

export default async function Home({searchParams}: SearchParamProps) {
  const {id, page} = await searchParams;
  const currentPage = Number(page as string) || 1;

  const loggedIn = await getLoggedInUser();
  if (!loggedIn) return;
  const accounts = await getAccounts({
    userId: loggedIn.$id,
  });

  if (!accounts) return;

  const accountsData = accounts?.data;

  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  console.log({appwriteItemId});

  if (!appwriteItemId) return;
  const account = await getAccount({appwriteItemId});

  return (
    <section id="home" className="home ">
      <div className="home-content ">
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
        <Suspense fallback={<div>Loading...</div>}>
          <RecentTransactions
            accounts={accountsData}
            transactions={account?.transactions}
            appwriteItemId={appwriteItemId}
            page={currentPage}
          />
        </Suspense>
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
