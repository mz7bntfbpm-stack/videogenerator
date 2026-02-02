'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  label: string;
  href: string;
}

interface TopNavProps {
  brand?: string;
  onLogin?: () => void;
  onSignUp?: () => void;
  onLogOut?: () => void;
  user?: { displayName?: string } | null;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'My Videos', href: '/my-videos' },
  { label: 'Templates', href: '/templates' },
  { label: 'Usage', href: '/usage' },
  { label: 'Account', href: '/account' },
];

export function TopNav({
  brand = 'VideoGenerator',
  onLogin,
  onSignUp,
  onLogOut,
  user,
}: TopNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-x-8">
            <Link href="/" className="flex items-center gap-x-2">
              <svg
                className="h-8 w-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
              <span className="text-xl font-bold text-slate-900">{brand}</span>
            </Link>
            <div className="hidden lg:flex lg:gap-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-150 ${
                    pathname === link.href
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            {user ? (
              <div className="flex items-center gap-x-4">
                <span className="text-sm text-slate-600">
                  {user.displayName || 'User'}
                </span>
                <button
                  onClick={onLogOut}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={onSignUp}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-600"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <Link
                href="/"
                className="flex items-center gap-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
                <span className="text-lg font-bold text-slate-900">{brand}</span>
              </Link>
              <button
                type="button"
                className="rounded-md p-2.5 text-slate-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-200 pt-6">
                {user ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">
                      Signed in as <span className="font-medium">{user.displayName}</span>
                    </p>
                    <button
                      onClick={() => {
                        onLogOut?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onLogin?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        onSignUp?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
