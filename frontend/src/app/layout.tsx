import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Kotobalize',
  description: 'Verbalization app for developers',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        <NextTopLoader
          color="#0606b0"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <Header />
        <main className="container min-h-[calc(100vh-168px)] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-12 lg:py-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
