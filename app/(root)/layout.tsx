import MobileSidebar from '@/components/navigations/mobileNavBar';
import SideBar from '@/components/navigations/sideBar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // login info
  const loggedIn = {
    firstName: 'Mohamed ',
    lastName: 'Alaa',
  };
  return (
    <main className='flex h-screen w-full font-inter '>
      {/* sidebar */}
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
