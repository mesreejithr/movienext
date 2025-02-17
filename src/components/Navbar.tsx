'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  toggleDarkMode: () => void;
}

export default function Navbar({ toggleDarkMode }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <nav className="bg-white dark:bg-secondary p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Indian OTT
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies and shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
            />
            <button type="submit" className="absolute right-3 top-2.5">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </form>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <SunIcon className="h-6 w-6 hidden dark:block" />
          <MoonIcon className="h-6 w-6 block dark:hidden" />
        </button>
      </div>
    </nav>
  );
} 