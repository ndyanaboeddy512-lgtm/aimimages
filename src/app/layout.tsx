import type { Metadata } from 'next';
import { Cinzel, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { FloatingWhatsApp } from '@/components/whatsapp-fab';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aim Images | Luxury Cinema & Creative Photography Studio',
  description: 'Aim Images HD is a world-class creative studio specializing in luxury wedding cinema, high-fashion editorial lookbooks, commercial advertising, and executive portraiture.',
  keywords: ['photography studio', 'cinematography', 'luxury wedding videography', 'editorial fashion', 'commercial brand films', 'aim images'],
  authors: [{ name: 'Aim Images HD Studio' }],
  icons: {
    icon: '/logo-emblem.png',
    apple: '/logo-emblem.png',
  },
  openGraph: {
    title: 'Aim Images | Luxury Cinema & Creative Photography Studio',
    description: 'Bespoke cinema, high-contrast editorial photography, and master-crafted visual storytelling.',
    url: 'https://aimimages.vercel.app',
    siteName: 'Aim Images Studio',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased bg-obsidian-950 text-cream-100 selection:bg-gold-500 selection:text-obsidian-950 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
