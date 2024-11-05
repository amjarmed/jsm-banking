import {
  createLinkToken,
  exchangePublicToken,
} from '@/app/services/actions/user.plaid';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from 'react-plaid-link';
import { Button } from '../ui/button';
const PlaidLink = ({ user, variant, dwollaCustomerId }: PlaidLinkProps) => {
  const [token, setToken] = useState('');
  const router = useRouter();
  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data);
    };

    getLinkToken();
  }, [user]);
  // on success
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      await exchangePublicToken({ publicToken: public_token, user });

      // push to the page

      router.push('/');
    },
    [user],
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <>
      {variant === 'primary' ? (
        <Button
          className='plaidlink-primary'
          onClick={() => open()}
          disabled={!ready}
        >
          Connect Bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button>Connect Bank</Button>
      ) : (
        <Button>Connect Bank</Button>
      )}
    </>
  );
};
export default PlaidLink;
