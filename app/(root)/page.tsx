import HeaderBox from '@/components/headerBox';
import RightSideBar from '@/components/navigations/rightSideBar';
import TotalBalanceBox from '@/components/totalBalanceBox';
import { getLoggedInUser } from '../services/actions/user.actions';

export default async function Home() {
  const loggedIn = await getLoggedInUser();

  //if (!user) redirect('/sign-in');
  return (
    <section id='home' className='home '>
      <div className='home-content'>
        <header className='home-header'>
          {/* welcome message  */}
          <HeaderBox
            type='greeting'
            title='Welcome'
            user={loggedIn?.name || 'Guest'}
            subtext='Access and manage your account and transactions efficiently.'
          />

          {/*  balance in account  */}
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1411.5}
          />
        </header>
        {/* main content : Transactions and Accounts */}
        Transactions and Accounts
      </div>
      {/* right sidebar : Personalization */}
      <RightSideBar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 5113.25 }, { currentBalance: 1345.4558 }]}
      />
    </section>
  );
}
