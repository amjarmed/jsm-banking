export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=''>
      {/* sidebar */}
      SideBar
      {children}
    </main>
  );
}
