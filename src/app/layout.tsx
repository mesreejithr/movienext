'use client';

import { useState } from 'react';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <html lang="en" className={isDarkMode ? 'dark' : ''}>
      <body className={`${inter.className} bg-white dark:bg-secondary text-gray-900 dark:text-gray-100`}>
        <div className="min-h-screen">
          <Navbar 
            isDarkMode={isDarkMode} 
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
