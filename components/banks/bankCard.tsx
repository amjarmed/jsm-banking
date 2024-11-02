import { formatAmount } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const BankCard = ({
  account,
  userName,
  showBalance = true,
}: CreditCardProps) => {
  return (
    <div className='flex flex-col'>
      <Link href='/bank ' className='bank-card'>
        <div className='bank-card-content'>
          <div>
            {/* show car name */}
            <h1 className='text-16 font-semibold text-white '>{userName}</h1>
            {/* show balance */}
            <p className='font-ibm-plex-serif font-black text-white'>
              {formatAmount(account.currentBalance || 0)}
            </p>
          </div>
          {/* show info */}
          <article className='flex flex-col gap-2'>
            {/* expiration time */}
            <div className='flex justify-between text-12  font-semibold text-white'>
              <h1 className=' '>{userName}</h1>
              <h1 className=' '> •• / ••</h1>
            </div>
            {/* last 3 numbers  */}
            <p className='text-14 font-semibold tracking-[1.1px] text-white'>
              •••• •••• ••••
              <span className='text-16'>{account.mask || '1234'}</span>
            </p>
          </article>
        </div>
        <div className='bank-card-icon '>
          <Image src='/icons/Paypass.svg' alt='pay' width={20} height={24} />
          <Image
            src='/icons/mastercard.svg'
            alt='pay'
            width={45}
            height={32}
            className='ml-5'
          />
        </div>
        <Image
          src='/icons/lines.svg'
          alt='lines'
          width={316}
          height={190}
          className='absolute top-0 left-0 '
        />
      </Link>
      {/* COPY THE CARD NUMBERS */}
    </div>
  );
};
export default BankCard;
