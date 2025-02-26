'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MagnifyingGlassIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { tmdbApi, tmdbConfig } from '@/utils/tmdb';
import Image from 'next/image';

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  media_type?: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
}

const Logo = () => (
  <div className="flex items-center">
    <Link href="/" className="flex items-center">
      <span className="text-2xl tracking-tight" style={{ fontFamily: 'Arial', fontWeight: 800 }}>
        <span className="text-white">Movie</span>
        <span className="text-red-600 relative">
          Next
          <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600/80 to-transparent"></div>
        </span>
      </span>
    </Link>
  </div>
);

export default function Navbar({ toggleDarkMode, isDarkMode }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const data = await tmdbApi.searchIndianContent(searchQuery);
          setSearchResults(data.results);
        } catch (error) {
          console.error('Error searching:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce delay of 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-secondary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />

        <div className="flex-1 max-w-xl mx-4 relative">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies and shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              {searchResults.map((item: SearchResult) => (
                <Link
                  key={item.id}
                  href={`/${item.media_type || 'movie'}/${item.id}`}
                  className="flex items-center p-3 hover:bg-gray-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setSearchResults([]);
                    setSearchQuery('');
                  }}
                >
                  {item.poster_path ? (
                    <Image
                      src={tmdbConfig.w500Image(item.poster_path)}
                      alt={item.title || item.name}
                      width={40}
                      height={60}
                      className="rounded"
                    />
                  ) : (
                    <div className="w-[40px] h-[60px] bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-white font-medium">{item.title || item.name}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(item.release_date || item.first_air_date).getFullYear()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-700 text-white"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <SunIcon className="h-6 w-6 block dark:hidden" />
          <MoonIcon className="h-6 w-6 hidden dark:block" />
        </button>
      </div>
    </nav>
  );
} 