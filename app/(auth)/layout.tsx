export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=''>
      {/* no sidebar */}

      {children}
    </main>
  );
}
