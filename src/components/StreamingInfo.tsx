'use client';

interface StreamingPlatform {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface StreamingInfoProps {
  providers?: {
    IN?: {
      flatrate?: StreamingPlatform[];
    };
  };
}

export default function StreamingInfo({ providers }: StreamingInfoProps) {
  const streamingPlatforms = providers?.IN?.flatrate || [];

  if (streamingPlatforms.length === 0) {
    return (
      <div className="text-gray-500 text-xs">
        No streaming info available
      </div>
    );
  }

  return (
    <div className="mt-1">
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
        Available on:
      </div>
      <div className="flex flex-wrap gap-1">
        {streamingPlatforms.map((platform) => (
          <div
            key={platform.provider_id}
            className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5"
            title={platform.provider_name}
          >
            <img
              src={`https://image.tmdb.org/t/p/original${platform.logo_path}`}
              alt={platform.provider_name}
              className="w-3 h-3 rounded-full mr-1"
            />
            <span className="text-xs truncate max-w-[80px]">
              {platform.provider_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 