'use client';

import { useState } from 'react';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <html lang="en" className={isDarkMode ? 'dark' : ''}>
      <body className={inter.className}>
        <div className="min-h-screen">
          <div className="flex">
            <Sidebar />
            <div className="flex-1">
              <Navbar toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
              <div className="container mx-auto px-4 py-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
