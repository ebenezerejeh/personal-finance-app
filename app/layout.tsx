import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/src/contexts/AuthContext';
import './globals.css';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Finance App',
  description: 'Personal finance management dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={publicSans.variable}>
      <body className="antialiased font-sans bg-beige-100 text-grey-900">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
