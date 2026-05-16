import type {Metadata} from 'next';
import {Bebas_Neue, Barlow} from 'next/font/google';

import {AdminChrome} from './AdminChrome';
import '../globals.css';

const barlow = Barlow({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700']
});

const bebasNeue = Bebas_Neue({
  variable: '--font-heading',
  subsets: ['latin', 'latin-ext'],
  weight: '400'
});

export const metadata: Metadata = {
  title: 'Yönetim Paneli',
  robots: {index: false, follow: false}
};

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${barlow.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-brand-surface">
        <AdminChrome>{children}</AdminChrome>
      </body>
    </html>
  );
}
