import {signOut} from '@/app/services/actions/user.auth';
import Image from 'next/image';
import {useRouter} from 'next/navigation';

const Footer = ({user, type = 'desktop'}: FooterProps) => {
  const router = useRouter();

  const handleLogOut = async () => {
    const loggedOut = await signOut();

    if (loggedOut) router.push('/sign-in');
  };

  return (
    <footer className="footer  flex-col text-center">
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className="text-xl font-bold text-gray-700">{user?.firstName[0]}</p>
      </div>

      <div
        className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}
      >
        <h1 className="text-14 truncate text-gray-700 font-semibold">
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-14 truncate font-normal text-gray-600">
          {user?.email}
        </p>
      </div>

      <div className="footer_image" onClick={handleLogOut}>
        <Image src="icons/logout.svg" fill alt="jsm" />
      </div>
    </footer>
  );
};

export default Footer;
