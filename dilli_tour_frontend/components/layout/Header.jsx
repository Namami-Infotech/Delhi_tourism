'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_ITEMS } from '../../lib/constants';
import GlobalSearchModal from '../search/GlobalSearchModal';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/80'
            : 'bg-white/80 backdrop-blur-sm border-b border-stone-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <span className="text-xl">🕌</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-xl tracking-tight text-stone-900 group-hover:text-primary-600 transition-colors">
                  DELHI <span className="text-primary-600">TOURISM</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">
                  दिल वालों की दिल्ली
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary-700 bg-amber-50/80 font-semibold'
                        : 'text-stone-700 hover:text-primary-600 hover:bg-stone-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* Search button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-500 bg-stone-100/80 hover:bg-stone-100 rounded-lg border border-stone-200/80 hover:border-stone-300 transition-colors"
                aria-label="Open search"
              >
                <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search...</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-stone-200 text-stone-400">
                  ⌘K
                </kbd>
              </button>

              {/* Admin login button */}
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Admin</span>
              </Link>
            </div>

            {/* Mobile menu and search buttons */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-stone-600 hover:text-stone-900 rounded-lg"
                aria-label="Open search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-600 hover:text-stone-900 rounded-lg"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'text-primary-700 bg-amber-50 font-semibold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
              <Link
                href="/admin/login"
                className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 px-4 py-2 rounded-lg"
              >
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
