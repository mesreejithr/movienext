'use client';

import { useEffect, useState } from 'react';
import { tmdbApi } from '@/utils/tmdb';
import ContentGrid from '@/components/ContentGrid';
import LanguageFilter from '@/components/LanguageFilter';

interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  media_type?: 'movie' | 'tv';
  original_language: string;
  release_date?: string;
  first_air_date?: string;
  ['watch/providers']?: {
    results: {
      IN?: {
        flatrate?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
        }>;
      };
    };
  };
}

export default function Home() {
  const [ottMovies, setOttMovies] = useState<ContentItem[]>([]);
  const [ottShows, setOttShows] = useState<ContentItem[]>([]);
  const [theatreReleases, setTheatreReleases] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const fetchContent = async (language?: string) => {
    try {
      setIsLoading(true);
      const [ottMoviesData, ottShowsData, theatreData] = await Promise.all([
        language === 'all'
          ? tmdbApi.getLatestOTTReleases('movie')
          : tmdbApi.getContentByLanguage('movie', language || 'hi'),
        language === 'all'
          ? tmdbApi.getLatestOTTReleases('tv')
          : tmdbApi.getContentByLanguage('tv', language || 'hi'),
        language === 'all'
          ? tmdbApi.getLatestTheatreReleases()
          : tmdbApi.getLatestTheatreReleases(),
      ]);

      setOttMovies(ottMoviesData.results || []);
      setOttShows(ottShowsData.results || []);
      setTheatreReleases(theatreData.results || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(selectedLanguage);
  }, [selectedLanguage]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  if (isLoading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading content...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-6">
      <LanguageFilter onLanguageChange={handleLanguageChange} />
      
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest OTT Releases</h2>
          <div className="flex space-x-4">
            <button className="text-primary hover:underline">View All</button>
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Movies</h3>
            <ContentGrid items={ottMovies} />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">TV Shows & Web Series</h3>
            <ContentGrid items={ottShows} />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Theatre Releases</h2>
          <div className="flex space-x-4">
            <button className="text-primary hover:underline">View All</button>
          </div>
        </div>
        <ContentGrid items={theatreReleases} />
      </section>
    </main>
  );
}
