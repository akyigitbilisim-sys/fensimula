import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'Sanal Fen Laboratuvarı | Deney Simülatörü',
  description: 'Öğrenciler için bilimsel deney senaryoları ve açıklamalar üreten sanal asistan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning className="font-inter">
        {children}
      </body>
    </html>
  );
}
