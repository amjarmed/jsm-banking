import BankCard from '../../../components/banks/bankCard';
import HeaderBox from '../../../components/headerBox';
import {getAccounts} from '../../services/actions/bank.actions';
import {getLoggedInUser} from '../../services/actions/user.auth';

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();

  const accounts = await getAccounts({
    userId: loggedIn.$id,
  });
  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Banks Accounts"
          subtext="Effortlessly manage your banking activities."
        />
        <div className="space-y-4">
          <h2 className="header-2">Your cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts?.data?.map((ac: Account) => (
              <BankCard
                key={ac.id}
                account={ac}
                userName={loggedIn?.firstName}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default MyBanks;
