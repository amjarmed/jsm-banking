import { signOut } from '@/app/services/actions/user.auth';
import { LogOutIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

const SideBarFooter = ({ user, type = 'desktop' }: FooterProps) => {
  const handleLogout = async () => {
    const loggedOut = await signOut();

    if (loggedOut) {
      // redirect to home
      redirect('/sign-in');
    }
  };
  return (
    <footer className='footer'>
      <div
        className={` ${
          type === 'mobile' ? 'footer_name-mobile' : 'footer_name'
        } `}
      >
        <p className='text-xl font-bold text-gray-700'>{user.name[0]}</p>
      </div>
      <div
        className={` ${
          type === 'mobile' ? 'footer_email-mobile' : 'footer_email'
        } `}
      >
        <h1 className='text-14 font-semibold truncate text-gray-700'>
          {user.name}
        </h1>
        <p className='text-14 font-normal text-gray-600 truncate '>
          {user.email}
        </p>
      </div>
      <div
        className={`${
          type === 'mobile' ? 'footer_image-mobile' : 'footer_image'
        } `}
        onClick={() => handleLogout()}
      >
        <LogOutIcon className='text-gray-600' />
      </div>
    </footer>
  );
};
export default SideBarFooter;
