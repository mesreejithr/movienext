import { useState } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Head>
        <title>Indian OTT Platform</title>
        <meta name="description" content="Indian movies and shows across OTT platforms" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Navbar toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 