import './globals.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export const metadata = {
  title: 'Delhi Tourism | Explore the Heart of India',
  description: 'Discover Delhi\'s magnificent heritage, spiritual traditions, vibrant culture, and iconic landmarks. Your complete guide to the capital of India.',
  keywords: 'Delhi tourism, India travel, Red Fort, Qutb Minar, Jama Masjid, Delhi heritage, Delhi culture',
  authors: [{ name: 'Delhi Tourism Platform' }],
  openGraph: {
    title: 'Delhi Tourism | Explore the Heart of India',
    description: 'Discover Delhi\'s magnificent heritage, spiritual traditions, vibrant culture, and iconic landmarks.',
    url: 'https://delhitourism.com',
    siteName: 'Delhi Tourism',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delhi Tourism | Explore the Heart of India',
    description: 'Discover Delhi\'s magnificent heritage, spiritual traditions, vibrant culture, and iconic landmarks.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#faf8f5] text-stone-900 flex flex-col min-h-screen selection:bg-amber-100 selection:text-amber-900">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}