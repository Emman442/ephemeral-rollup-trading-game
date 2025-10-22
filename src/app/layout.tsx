import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';

import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import AppWalletProvider from '@/components/providers/AppWalletProvider';
import { GameProvider } from '../../context/gameContext';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeading = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'TradeArena',
  description: 'Compete. Trade. Win. Real-time trading battles on Solana.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <AppWalletProvider>
          <GameProvider>
            {children}
            <Toaster />
          </GameProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
