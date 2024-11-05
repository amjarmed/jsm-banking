import MobileSidebar from '@/components/navigations/mobileNavBar';
import SideBar from '@/components/navigations/sideBar';
import { redirect } from 'next/navigation';
import { getLoggedInUser } from '../services/actions/user.auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // login info
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect('/sign-in');
  return (
    <main className=' flex h-screen w-full font-inter '>
      {/* left sidebar */}
      <SideBar user={loggedIn} />
      <div className='flex size-full flex-col'>
        {/* mobile sidebar */}
        <MobileSidebar user={loggedIn} />

        {/* main content */}
        {children}
      </div>
    </main>
  );
}
