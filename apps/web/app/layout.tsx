import { Navbar } from '@/components/navbar';
import { Providers } from '@/components/providers';
import { InlineLink } from '@/components/ui/link';
import { Toaster } from '@/components/ui/sonner';
import { WalletConnect } from '@/components/wallet-connect';
import { paths } from '@/lib/paths';
import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Assembly',
  description: 'An otom-based item crafter',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-mono)] antialiased`}
      >
        <div className="mx-auto grid min-h-screen max-w-7xl grid-rows-[auto_1fr] gap-4">
          <Providers>
            <header className="flex items-center justify-between p-5">
              <div className="relative">
                <h1 className="text-primary text-2xl font-semibold tracking-wide uppercase">
                  <Link href={paths.home}>Assembly</Link>
                </h1>
                <span className="text-muted-foreground/50 absolute -bottom-8 left-0 text-sm whitespace-nowrap sm:-bottom-5">
                  An otom-based item crafter
                </span>
              </div>

              <div className="flex items-center gap-2">
                <InlineLink
                  href={paths.otom}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden px-3 sm:block"
                >
                  otom.xyz
                </InlineLink>

                <WalletConnect />
              </div>
            </header>

            {children}
            <Navbar />
            <Toaster />
          </Providers>
        </div>
      </body>
    </html>
  );
}
