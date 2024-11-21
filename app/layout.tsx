export const dynamic = 'force-dynamic';
import type {Metadata} from 'next';
import {IBM_Plex_Serif, Inter} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const imbPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif',
});

//  metadata

export const metadata: Metadata = {
  title: {
    default: 'Horizon Bank',
    template: '%s | Horizon Bank',
  },
  description: 'Horizon is a modern banking platform for everyone.',
  icons: {
    icon: '/icons/logo.svg',
  },
  // metadataBase: new URL('<https://jsm-banking-sand.vercel.app/>'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-w-[320px] min-h-screen">
      <body
        className={`${inter.variable} ${imbPlexSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
