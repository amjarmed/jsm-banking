import SideBar from '@/components/sections/sideBar';

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
      {/* main content */}
      {children}
    </main>
  );
}
