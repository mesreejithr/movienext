'use client';

import { useEffect, useState } from 'react';
import { tmdbApi } from '@/utils/tmdb';
import ContentGrid from '@/components/ContentGrid';
import LanguageFilter from '@/components/LanguageFilter';
import TrendingSection from '@/components/TrendingSection';

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
  release_details?: {
    release_dates: Array<{
      type: number;
      release_date: string;
    }>;
  };
  watch_providers?: {
    flatrate?: Array<{
      provider_id: number;
      provider_name: string;
      logo_path: string;
    }>;
    rent?: Array<{
      provider_id: number;
      provider_name: string;
      logo_path: string;
    }>;
    buy?: Array<{
      provider_id: number;
      provider_name: string;
      logo_path: string;
    }>;
  };
}

export default function Home() {
  const [ottReleases, setOttReleases] = useState<ContentItem[]>([]);
  const [theatricalReleases, setTheatricalReleases] = useState<ContentItem[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [allOttContent, setAllOttContent] = useState<ContentItem[]>([]);
  const [allTheatricalContent, setAllTheatricalContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        
        const [theatricalData, ottMoviesData, ottSeriesData] = await Promise.all([
          tmdbApi.getTheatricalReleases(),
          tmdbApi.getLatestOTTReleases(60),
          tmdbApi.getLatestTVSeries(60)
        ]);

        // Store all content
        setAllTheatricalContent(theatricalData.results || []);
        
        // Combine and sort OTT content
        const combinedOttContent = [
          ...(ottMoviesData.results || []),
          ...(ottSeriesData.results || [])
        ].sort((a, b) => {
          const dateA = new Date(a.digital_release_date || a.release_date || a.first_air_date || '');
          const dateB = new Date(b.digital_release_date || b.release_date || b.first_air_date || '');
          return dateB.getTime() - dateA.getTime();
        });

        setAllOttContent(combinedOttContent);
        
        // Initialize with all content
        setOttReleases(combinedOttContent);
        setTheatricalReleases(theatricalData.results || []);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    // Filter content when language changes
    const filterContent = () => {
      const filterByLanguage = (content: ContentItem[]) => {
        if (selectedLanguage === 'all') return content;
        return content.filter(item => item.original_language === selectedLanguage);
      };

      setOttReleases(filterByLanguage(allOttContent));
      setTheatricalReleases(filterByLanguage(allTheatricalContent));
    };

    filterContent();
  }, [selectedLanguage, allOttContent, allTheatricalContent]);

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
    <main className="space-y-8">
      <div className="sticky top-0 z-10 bg-white dark:bg-secondary py-4 shadow-md">
        <LanguageFilter
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>

      <TrendingSection selectedLanguage={selectedLanguage} />

      <section className="pt-8">
        <div className="relative inline-block">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide drop-shadow-lg">
            Latest on OTT Platforms 📺
          </h2>
          <div className="absolute -bottom-4 left-0 w-1/3 h-1 bg-gradient-to-r from-red-600 to-transparent rounded-full"></div>
        </div>
        <div className="mt-8">
          {ottReleases.length > 0 ? (
            <ContentGrid items={ottReleases} showStatusBadge={false} />
          ) : (
            <div className="text-center py-8 text-gray-300">
              No content available for selected language
            </div>
          )}
        </div>
      </section>

      {theatricalReleases.length > 0 && (
        <section className="pt-8">
          <div className="relative inline-block">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide drop-shadow-lg">
              Now in Theaters 🎬
            </h2>
            <div className="absolute -bottom-4 left-0 w-1/3 h-1 bg-gradient-to-r from-red-600 to-transparent rounded-full"></div>
          </div>
          <div className="mt-8">
            <ContentGrid items={theatricalReleases} showStatusBadge={false} />
          </div>
        </section>
      )}
    </main>
  );
}
