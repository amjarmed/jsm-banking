import HeaderBox from '@/components/headerBox';
import RightSideBar from '@/components/navigations/rightSideBar';
import TotalBalanceBox from '@/components/totalBalanceBox';

export default function Home() {
  const loggedIn: User = {
    $id: '632e75c2e6f7e45f90a7',
    email: 'test@gmail.com',
    userId: '632e75c2e6f7e45f90a7',
    dwollaCustomerUrl:
      'https://api-sandbox.dwolla.com/customers/632e75c2e6f7e45f90a7',
    dwollaCustomerId: '632e75c2e6f7e45f90a7',
    firstName: 'Mohamed',
    lastName: 'Amjar',
    address1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    dateOfBirth: '1990-01-01',
    ssn: '123-45-6789',
  };

  return (
    <section id='home' className='home '>
      <div className='home-content'>
        <header className='home-header'>
          {/* welcome message  */}
          <HeaderBox
            type='greeting'
            title='Welcome'
            user={loggedIn?.firstName || 'Guest'}
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
