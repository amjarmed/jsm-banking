'use client';
import CountUp from 'react-countup';

function AnimatedCounter({ amount = 0 }: { amount: number }) {
  return (
    <div className='w-full'>
      {/* <CountUp end={formatAmount()} /> */}
      <CountUp
        start={0}
        end={amount}
        duration={2.75}
        prefix='$'
        separator=' '
        decimal=','
        decimals={4}
        suffix=' '
      />
    </div>
  );
}

export default AnimatedCounter;
