'use client';

import { useEffect, useState } from 'react';
import { tmdbApi } from '@/utils/tmdb';
import ContentGrid from './ContentGrid';

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  media_type?: 'movie' | 'tv';
  original_language?: string;
  release_date?: string;
  first_air_date?: string;
  in_theaters?: boolean;
  theatrical_release_date?: string;
  digital_release_date?: string;
  watch_providers?: {
    flatrate?: Array<Provider>;
    link?: string;
  };
}

interface TrendingProps {
  className?: string;
  selectedLanguage: string;
}

export default function TrendingSection({ className, selectedLanguage }: TrendingProps) {
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [allTrendingContent, setAllTrendingContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setIsLoading(true);
        const data = await tmdbApi.getTrending('week', 7);
        setAllTrendingContent(data.results);
        setTrendingContent(data.results);
      } catch (error) {
        console.error('Error fetching trending content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (selectedLanguage === 'all') {
      setTrendingContent(allTrendingContent);
    } else {
      const filtered = allTrendingContent.filter(
        item => item.original_language === selectedLanguage
      );
      setTrendingContent(filtered);
    }
  }, [selectedLanguage, allTrendingContent]);

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>;
  }

  if (trendingContent.length === 0) {
    return null;
  }

  return (
    <section className={`pt-4 ${className}`}>
      <div className="relative inline-block">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide drop-shadow-lg">
          Trending Now 🔥
        </h2>
        <div className="absolute -bottom-4 left-0 w-1/3 h-1 bg-gradient-to-r from-red-600 to-transparent rounded-full"></div>
      </div>
      <div className="mt-8">
        <ContentGrid items={trendingContent} isTrending={true} />
      </div>
    </section>
  );
} 