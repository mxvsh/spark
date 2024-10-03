import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const font = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'spark - ai quiz',
  description: 'A local AI quiz app built with Next.js',
};

import Providers from '../providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
