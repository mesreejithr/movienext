'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { tmdbApi } from '@/utils/tmdb';
import ContentGrid from '@/components/ContentGrid';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      try {
        const data = await tmdbApi.searchIndianContent(query);
        setResults(data.results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Search Results for "{query}"
      </h1>
      {results.length > 0 ? (
        <ContentGrid items={results} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
} 