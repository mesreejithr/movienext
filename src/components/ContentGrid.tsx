import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { tmdbConfig } from '@/utils/tmdb';
import StreamingInfo from './StreamingInfo';

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

const LANGUAGE_NAMES: { [key: string]: string } = {
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  ml: 'Malayalam',
  bn: 'Bengali',
  kn: 'Kannada',
  pa: 'Punjabi',
  gu: 'Gujarati',
  mr: 'Marathi',
  or: 'Odia',
};

interface ContentGridProps {
  items: ContentItem[];
}

export default function ContentGrid({ items }: ContentGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No content available</p>
      </div>
    );
  }

  const getReleaseDate = (item: ContentItem) => {
    const date = item.release_date || item.first_air_date;
    return date ? format(new Date(date), 'MMM d, yyyy') : 'Release date unknown';
  };

  const getLanguageName = (languageCode: string) => {
    return LANGUAGE_NAMES[languageCode] || languageCode.toUpperCase();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 7.5) return 'text-green-500';
    if (rating >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/${item.media_type || 'movie'}/${item.id}`}
          className="relative group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="aspect-[2/3] relative overflow-hidden">
            {item.poster_path ? (
              <Image
                src={tmdbConfig.w500Image(item.poster_path)}
                alt={item.title || item.name || 'Content poster'}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded-md">
              <span className={`text-sm font-bold ${getRatingColor(item.vote_average)}`}>
                ★ {item.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold truncate text-lg">
              {item.title || item.name}
            </h3>
            <div className="space-y-1 mt-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {getLanguageName(item.original_language)}
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {getReleaseDate(item)}
              </div>
              <StreamingInfo providers={item['watch/providers']?.results} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 