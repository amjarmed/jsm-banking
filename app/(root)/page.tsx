import HeaderBox from '@/components/headerBox';
import TotalBalanceBox from '@/components/totalBalanceBox';

export default function Home() {
  const loggedIn = {
    firstName: 'Mohamed ',
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
      </div>
    </section>
  );
}
