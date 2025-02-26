import Image from 'next/image';
import Link from 'next/link';
import { tmdbConfig } from '@/utils/tmdb';

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  link?: string;
}

interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  media_type?: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  watch_providers?: {
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
  };
  in_theaters?: boolean;
  theatrical_release_date?: string;
  digital_release_date?: string;
  original_language?: string;
}

interface ContentGridProps {
  items: ContentItem[];
  showTheaterBadge?: boolean;
  showStatusBadge?: boolean;
  isTrending?: boolean;
}

// Add this helper function at the top of the file
const isNewRelease = (date?: string) => {
  if (!date) return false;
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  return new Date(date) >= twoWeeksAgo;
};

// Update the StatusBadge component
const StatusBadge = ({ item }: { item: ContentItem }) => {
  if (item.in_theaters) {
    return (
      <div className="bg-red-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
        In Theaters
      </div>
    );
  } else if (item.watch_providers?.flatrate) {
    return (
      <div className="bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
        On OTT
      </div>
    );
  }
  return null;
};

export default function ContentGrid({ items, showTheaterBadge, showStatusBadge, isTrending }: ContentGridProps) {
  // Filter out items without poster images
  const itemsWithPosters = items.filter(item => item.poster_path);

  if (!itemsWithPosters || itemsWithPosters.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No content available</p>
      </div>
    );
  }

  const getProviderLogos = (providers?: Provider[], watchLink?: string) => {
    if (!providers) return null;
    return providers.slice(0, 3).map((provider) => (
      <a
        key={provider.provider_id}
        href={watchLink}
        target="_blank"
        rel="noopener noreferrer"
        className="transform transition-transform hover:scale-110"
        title={`Watch on ${provider.provider_name}`}
      >
        <div 
          className="relative bg-white rounded-full p-0.5 shadow-md hover:shadow-lg transition-shadow"
        >
          <Image
            src={tmdbConfig.w500Image(provider.logo_path)}
            alt={provider.provider_name}
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
      </a>
    ));
  };

  const formatDate = (item: ContentItem) => {
    if (!item) return '';
    
    // Only show theatrical release dates
    if (showTheaterBadge && item.theatrical_release_date) {
      return `In Theaters: ${new Date(item.theatrical_release_date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })}`;
    }
    
    return ''; // Don't show any date for OTT content
  };

  const RatingBadge = ({ rating }: { rating: number }) => (
    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-20">
      <span>⭐</span>
      <span>{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
      {itemsWithPosters.map((item) => (
        <div key={item.id} className="relative group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl rounded-lg">
          {/* Movie Poster and Details */}
          <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]">
            <RatingBadge rating={item.vote_average} />
            
            {/* NEW tag */}
            {!isTrending && isNewRelease(item.release_date || item.first_air_date) && (
              <div className="absolute top-2 left-2 bg-emerald-500/90 text-white px-2 py-0.5 rounded-md text-xs font-medium z-20 shadow-sm backdrop-blur-sm">
                NEW
              </div>
            )}
            
            <Link
              href={`/${item.media_type || 'movie'}/${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <Image
                src={tmdbConfig.w500Image(item.poster_path)}
                alt={item.title || item.name || 'Content poster'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110 z-10"
              />
            </Link>
          </div>
          
          {/* Watch Provider Links - Outside of the movie link */}
          {item.watch_providers?.flatrate && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/50 to-transparent z-20">
              <div className="flex items-center gap-2">
                <div className="flex gap-2 items-center">
                  {getProviderLogos(
                    item.watch_providers?.flatrate,
                    item.watch_providers?.link
                  )}
                </div>
                {item.watch_providers.flatrate.length > 3 && (
                  <span className="text-white text-xs">
                    +{item.watch_providers.flatrate.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 