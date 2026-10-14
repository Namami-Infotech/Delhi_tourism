import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const exploreLinks = [
    { name: 'All Categories', href: '/categories' },
    { name: 'Tourism Circuits', href: '/circuits' },
    { name: 'Destinations & Places', href: '/places' },
    { name: 'Curated Itineraries', href: '/itineraries' },
    { name: 'Upcoming Events', href: '/events' },
  ];

  const delhiLinks = [
    { name: 'About Delhi', href: '/about' },
    { name: 'Heritage of Delhi', href: '/circuits/the-heritage-of-delhi' },
    { name: 'Sacred Harmony', href: '/circuits/delhis-sacred-harmony' },
    { name: 'Living Culture', href: '/categories/cultural-experiences' },
  ];

  const supportLinks = [
    { name: 'Contact & Inquiries', href: '/contact' },
    { name: 'Accessibility Statement', href: '/accessibility' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Admin Portal', href: '/admin/login' },
  ];

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Top Banner with Cultural Accent */}
      <div className="h-1.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                <span className="text-xl">🕌</span>
              </div>
              <div>
                <span className="font-serif font-black text-xl text-white tracking-tight">
                  DELHI <span className="text-amber-500">TOURISM</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                  दिल वालों की दिल्ली
                </span>
              </div>
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Discover centuries of history, spiritual harmony, culinary traditions, and vibrant urban culture in the heart of India.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-colors text-stone-400"
                aria-label="Twitter / X"
              >
                𝕏
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-colors text-stone-400"
                aria-label="Instagram"
              >
                📸
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-colors text-stone-400"
                aria-label="Facebook"
              >
                📘
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-colors text-stone-400"
                aria-label="YouTube"
              >
                ▶️
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-serif font-semibold text-white text-base tracking-wide mb-4">
              Explore Delhi
            </h3>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-amber-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Delhi Heritage */}
          <div>
            <h3 className="font-serif font-semibold text-white text-base tracking-wide mb-4">
              Heritage & Stories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {delhiLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-amber-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-serif font-semibold text-white text-base tracking-wide mb-4">
              Visitor Info
            </h3>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-amber-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Delhi Tourism Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">Terms</Link>
            <Link href="/accessibility" className="hover:text-stone-300 transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
