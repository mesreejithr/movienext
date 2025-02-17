'use client';

import Link from 'next/link';
import { HomeIcon, FilmIcon, TvIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-secondary min-h-screen p-4 shadow-lg">
      <nav className="space-y-4">
        <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <HomeIcon className="h-6 w-6" />
          <span>Home</span>
        </Link>
        <Link href="/movies" className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <FilmIcon className="h-6 w-6" />
          <span>Movies</span>
        </Link>
        <Link href="/shows" className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <TvIcon className="h-6 w-6" />
          <span>TV Shows</span>
        </Link>
        <Link href="/watchlist" className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <HeartIcon className="h-6 w-6" />
          <span>Watchlist</span>
        </Link>
      </nav>
    </aside>
  );
} 