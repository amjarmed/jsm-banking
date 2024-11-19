import AnimatedCounter from './animatedCounter';
import DoughnutChart from './DoughnutChart';

function TotalBalanceBox({
  accounts = [],
  totalBanks = 0,
  totalCurrentBalance = 0,
}: TotalBalanceBoxProps) {
  return (
    <section className="total-balance">
      <div className="total-balance-char ">
        {/* doughnut char */}
        <DoughnutChart accounts={accounts} />
      </div>

      {/* total balance summary */}
      <div className="flex flex-col gap-6">
        <h2 className="header-2"> Bank Accounts : {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Current Balance</p>
          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TotalBalanceBox;
