import { Plus } from 'lucide-react';
import Link from 'next/link';
import BankCard from '../banks/bankCard';

const RightSideBar = ({ user, transactions, banks }: RightSidebarProps) => {
  return (
    <aside className='right-sidebar'>
      {/* profile */}
      <section className='flex flex-col pb-8'>
        <div className='profile-banner'>
          <div className='profile '>
            <div className='profile-img'>
              <span className='text-5xl font-bold text-blue-500'>
                {user.firstName[0]}
              </span>
            </div>
            <div className='profile-details'>
              <h1 className='profile-name'>
                {user.firstName} {user.lastName}
              </h1>
              <p className='profile-email'>{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* all current banks */}
      <section className='banks'>
        <div className='flex w-full justify-between'>
          <h2 className='header-2'>My Banks </h2>
          <Link
            href='/banks'
            className='flex gap-2 text-14 font-semibold text-gray-600 capitalize'
          >
            <Plus size={20} />
            <h2 className='x'>add bank</h2>
          </Link>
        </div>
        {banks?.length > 0 && (
          <div className='relative flex flex-col flex-1 items-center justify-center gap-5 '>
            <div className='relative z-10'>
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className='absolute right-0 top-8 w-[90%] z-0'>
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
};
export default RightSideBar;
