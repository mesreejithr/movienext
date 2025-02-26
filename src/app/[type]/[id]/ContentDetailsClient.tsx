'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { tmdbApi, tmdbConfig } from '@/utils/tmdb';

interface ContentDetailsClientProps {
  type: string;
  id: string;
}

interface TMDBResponse {
  results: Array<{
    id: number;
    title?: string;
    name?: string;
    // ... other properties
  }>;
  total_results: number;
}

interface ReleaseDate {
  type: number;
  release_date: string;
  iso_3166_1: string;
}

interface IndianReleases {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

interface MovieDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  genres: Array<{ id: number; name: string }>;
  credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
  release_dates?: {
    results: IndianReleases[];
  };
  'watch/providers'?: {
    results: {
      IN?: {
        flatrate?: Array<{
          provider_id: number;
          provider_name: string;
          logo_path: string;
        }>;
        link: string;
      };
    };
  };
}

export default function ContentDetailsClient({ type, id }: ContentDetailsClientProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const data = await tmdbApi.getContentDetails(id, type as 'movie' | 'tv');
        setDetails(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl text-gray-500">Content not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Backdrop Image */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={tmdbConfig.originalImage(details.backdrop_path)}
          alt={details.title || details.name || ''}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content Details */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-64 flex-shrink-0">
            <Image
              src={tmdbConfig.w500Image(details.poster_path)}
              alt={details.title || details.name || ''}
              width={256}
              height={384}
              className="rounded-lg shadow-xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-white">
            <h1 className="text-4xl font-bold mb-4">
              {details.title || details.name}
            </h1>

            {/* Release Date & Runtime */}
            <div className="mb-4 text-gray-300">
              <span>{new Date(details.release_date || details.first_air_date || '').getFullYear()}</span>
              {details.runtime && (
                <span> • {Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
              )}
            </div>

            {/* Genres */}
            <div className="flex gap-2 mb-6">
              {details.genres.map(genre => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-yellow-400">⭐</span>
              <span className="text-xl font-semibold">{details.vote_average.toFixed(1)}</span>
            </div>

            {/* Overview */}
            <p className="text-lg mb-8">{details.overview}</p>

            {/* Watch Providers */}
            {details['watch/providers']?.results?.IN?.flatrate && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Available on</h3>
                <div className="flex gap-4">
                  {details['watch/providers'].results.IN.flatrate.map(provider => (
                    <a
                      key={provider.provider_id}
                      href={details['watch/providers']?.results?.IN?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transform transition-transform hover:scale-110"
                      title={`Watch on ${provider.provider_name}`}
                    >
                      <div className="bg-white p-1 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                        <Image
                          src={tmdbConfig.w500Image(provider.logo_path)}
                          alt={provider.provider_name}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      </div>
                    </a>
                  ))}
                </div>
                <a
                  href={details['watch/providers']?.results?.IN?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View all watching options →
                </a>
              </div>
            )}

            {/* Cast */}
            {details.credits.cast.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Cast</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {details.credits.cast.slice(0, 10).map(actor => (
                    <div key={actor.id} className="flex-shrink-0 w-24 text-center">
                      <div className="w-24 h-24 mb-2 relative mx-auto">
                        {actor.profile_path ? (
                          <Image
                            src={tmdbConfig.w500Image(actor.profile_path)}
                            alt={actor.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                            <span className="text-2xl">👤</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium">{actor.name}</p>
                      <p className="text-xs text-gray-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 