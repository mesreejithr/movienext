/* eslint-disable @typescript-eslint/no-explicit-any */
// This is temporarily disabled because the TMDB API response types are complex
// TODO: Replace with proper types when time permits

const TMDB_API_KEY = '14f8ac39fa19f5ca9639b37b3923431b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const PAGES_TO_FETCH = 5; // Increased from 3 to 5
const DAYS_TO_LOOK_BACK = 180; // Increased from 120 to 180 days (6 months)
const ITEMS_PER_LANGUAGE = 20; // Minimum items we want per language

// Add OTT providers in India
const INDIAN_OTT_PROVIDERS = [
  119, // Amazon Prime Video
  337, // Disney+ Hotstar
  237, // Netflix
  121, // Zee5
  220, // Jio Cinema
  192, // SonyLIV
  122, // Voot
];

interface TMDBResponse<T> {
  results: T[];
  total_results: number;
  total_pages: number;
}

interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  media_type?: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  original_language?: string;
  origin_country?: string[];
}

export const tmdbConfig = {
  apiKey: TMDB_API_KEY,
  baseUrl: TMDB_BASE_URL,
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  originalImage: (path: string) => `https://image.tmdb.org/t/p/original${path}`,
  w500Image: (path: string) => `https://image.tmdb.org/t/p/w500${path}`,
};

export const tmdbApi = {
  getIndianContent: async (type: 'movie' | 'tv', page = 1): Promise<TMDBResponse<ContentItem>> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&` +
      `with_original_language=hi|ta|te|ml|bn|kn&` +
      `region=IN&` +
      `with_origin_country=IN&` +
      `with_watch_providers=${INDIAN_OTT_PROVIDERS.join('|')}&` +
      `watch_region=IN&` +
      `sort_by=release_date.desc&` +
      `page=${page}&` +
      `include_adult=false`
    );
    const data = await response.json();
    
    // Fetch watch providers for each item
    const results = await Promise.all(
      data.results.map(async (item: any) => {
        const details = await tmdbApi.getContentDetails(item.id.toString(), type);
        return {
          ...item,
          watch_providers: details['watch/providers']?.results?.IN
        };
      })
    );
    
    return { ...data, results };
  },
  
  getTrending: async (timeWindow: 'day' | 'week' = 'week', numberOfItems = 7) => {
    try {
      // First get trending movies with Indian languages filter
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&` +
        `with_original_language=hi|ta|te|ml|bn|kn&` +
        `region=IN&` +
        `with_origin_country=IN&` +
        `sort_by=popularity.desc&` +
        `primary_release_date.gte=${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&` +
        `include_adult=false`
      );
      const data = await response.json();
      
      // Fetch additional details for each movie
      const results = await Promise.all(
        data.results.slice(0, numberOfItems * 2).map(async (item: any) => {
          const details = await tmdbApi.getContentDetails(item.id.toString(), 'movie');
          const watchProviders = details['watch/providers']?.results?.IN;
          
          // Get Indian release dates
          const indianReleases = details.release_dates?.results?.find(
            (r: any) => r.iso_3166_1 === 'IN'
          );

          // Find theatrical and digital release dates
          const theatricalRelease = indianReleases?.release_dates?.find(
            (d: any) => d.type === 3
          );
          const digitalRelease = indianReleases?.release_dates?.find(
            (d: any) => d.type === 4
          );

          return {
            ...item,
            watch_providers: watchProviders,
            theatrical_release_date: theatricalRelease?.release_date || item.release_date,
            digital_release_date: digitalRelease?.release_date,
            in_theaters: !!theatricalRelease,
            media_type: 'movie'
          };
        })
      );

      // Filter for movies that are either in theaters or available on OTT
      const validResults = results.filter(item => 
        (item.in_theaters || item.watch_providers?.flatrate) && 
        item.original_language?.match(/^(hi|ta|te|ml|bn|kn)$/)
      );

      // Sort by most recent release date (either theatrical or digital)
      const sortedResults = validResults
        .sort((a, b) => {
          const dateA = new Date(a.theatrical_release_date || a.digital_release_date || a.release_date);
          const dateB = new Date(b.theatrical_release_date || b.digital_release_date || b.release_date);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, numberOfItems);

      return {
        results: sortedResults,
        total_results: sortedResults.length
      };
    } catch (error) {
      console.error('Error fetching trending:', error);
      return { results: [], total_results: 0 };
    }
  },

  getContentByLanguage: async (language: string, type: 'movie' | 'tv', page = 1) => {
    // Get language-specific content with OTT availability
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&` +
      `with_original_language=${language}&` +
      `region=IN&` +
      `with_origin_country=IN&` +
      `with_watch_providers=${INDIAN_OTT_PROVIDERS.join('|')}&` +
      `watch_region=IN&` +
      `sort_by=release_date.desc&` +
      `page=${page}&` +
      `include_adult=false`
    );
    const data = await response.json();
    return data;
  },

  getNewReleases: async (type: 'movie' | 'tv', page = 1) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
    
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&` +
      `with_original_language=hi|ta|te|ml|bn|kn&` +
      `region=IN&` +
      `with_origin_country=IN&` +
      `with_watch_providers=${INDIAN_OTT_PROVIDERS.join('|')}&` +
      `watch_region=IN&` +
      `primary_release_date.gte=${fromDate}&` +
      `sort_by=release_date.desc&` +
      `page=${page}&` +
      `include_adult=false`
    );
    const data = await response.json();
    
    // Fetch watch providers for each item
    const results = await Promise.all(
      data.results.map(async (item: any) => {
        const details = await tmdbApi.getContentDetails(item.id.toString(), type);
        return {
          ...item,
          watch_providers: details['watch/providers']?.results?.IN
        };
      })
    );
    
    return { ...data, results };
  },

  getContentDetails: async (id: string, type: 'movie' | 'tv') => {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&` +
      `append_to_response=videos,credits,images,watch/providers,release_dates&` +
      `language=en-US`
    );
    return response.json();
  },

  searchIndianContent: async (query: string): Promise<TMDBResponse<ContentItem>> => {
    try {
      // First get the multi-search results
      const response = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&` +
        `query=${encodeURIComponent(query)}&` +
        `region=IN&` +
        `page=1&` +
        `include_adult=false`
      );
      const data = await response.json();
      
      // Filter for Indian content and fetch additional details
      const filteredResults = await Promise.all(
        data.results
          .filter((item: any) => 
            // Filter for Indian languages
            item.original_language?.match(/^(hi|ta|te|ml|bn|kn)$/) ||
            // Or Indian production
            item.origin_country?.includes('IN')
          )
          .slice(0, 10) // Limit to top 10 results for performance
          .map(async (item: any) => {
            try {
              const details = await tmdbApi.getContentDetails(
                item.id.toString(),
                item.media_type || 'movie'
              );
              
              return {
                ...item,
                watch_providers: details['watch/providers']?.results?.IN,
                // Add release dates for movies
                ...(item.media_type === 'movie' && {
                  theatrical_release_date: details.release_dates?.results?.find(
                    (r: any) => r.iso_3166_1 === 'IN'
                  )?.release_dates?.find(
                    (d: any) => d.type === 3
                  )?.release_date,
                })
              };
            } catch (error) {
              console.error('Error fetching details for item:', error);
              return item;
            }
          })
      );

      // Sort results: items with posters first, then by date
      const sortedResults = filteredResults
        .filter(item => item) // Remove any failed items
        .sort((a, b) => {
          // Prioritize items with posters
          if (a.poster_path && !b.poster_path) return -1;
          if (!a.poster_path && b.poster_path) return 1;
          
          // Then sort by date
          const dateA = new Date(a.release_date || a.first_air_date || '');
          const dateB = new Date(b.release_date || b.first_air_date || '');
          return dateB.getTime() - dateA.getTime();
        });

      return {
        ...data,
        results: sortedResults
      };
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  },

  getTheatricalReleases: async () => {
    const thirtyDaysAgo = new Date();
    const today = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 45); // Extended to 45 days for more theatrical releases
    
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];

    // Fetch multiple pages for theatrical releases
    const pagePromises = Array.from({ length: PAGES_TO_FETCH }, (_, i) =>
      fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&` +
        `with_original_language=hi|ta|te|ml|bn|kn&` +
        `region=IN&` +
        `with_origin_country=IN&` +
        `primary_release_date.gte=${fromDate}&` +
        `primary_release_date.lte=${toDate}&` +
        `with_release_type=3|2&` +
        `sort_by=primary_release_date.desc&` +
        `page=${i + 1}&` +
        `include_adult=false`
      ).then(res => res.json())
    );

    const pages = await Promise.all(pagePromises);
    const allResults = pages.flatMap(page => page.results || []);

    // Fetch release dates and watch provider details
    const results = await Promise.all(
      allResults.map(async (item: any) => {
        const details = await tmdbApi.getContentDetails(item.id.toString(), 'movie');
        const indianReleases = details.release_dates?.results?.find((r: any) => r.iso_3166_1 === 'IN');
        const theatricalRelease = indianReleases?.release_dates?.find((d: any) => 
          d.type === 3 && // Theatrical release
          new Date(d.release_date) <= today && 
          new Date(d.release_date) >= thirtyDaysAgo
        );
        
        return {
          ...item,
          in_theaters: !!theatricalRelease,
          theatrical_release_date: theatricalRelease?.release_date || item.release_date,
          release_details: indianReleases,
          watch_providers: details['watch/providers']?.results?.IN
        };
      })
    );

    // Filter and sort by theatrical release date
    const theatricalReleases = results
      .filter(item => item.in_theaters)
      .sort((a, b) => {
        const dateA = new Date(a.theatrical_release_date || '');
        const dateB = new Date(b.theatrical_release_date || '');
        return dateB.getTime() - dateA.getTime();
      });
    
    return { ...pages[0], results: theatricalReleases };
  },

  getLatestOTTReleases: async (numberOfItems = 40) => {
    const lookBackDate = new Date();
    lookBackDate.setDate(lookBackDate.getDate() - DAYS_TO_LOOK_BACK);
    const fromDate = lookBackDate.toISOString().split('T')[0];

    try {
      const pagePromises = Array.from({ length: PAGES_TO_FETCH }, (_, i) =>
        fetch(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&` +
          `with_original_language=hi|ta|te|ml|bn|kn&` +
          `region=IN&` +
          `with_origin_country=IN&` +
          `with_watch_providers=${INDIAN_OTT_PROVIDERS.join('|')}&` +
          `watch_region=IN&` +
          `primary_release_date.gte=${fromDate}&` +
          `sort_by=release_date.desc&` +
          `page=${i + 1}&` +
          `include_adult=false&` +
          `vote_count.gte=0`
        ).then(res => res.json())
      );

      const pages = await Promise.all(pagePromises);
      const allResults = pages.flatMap(page => page.results || []);

      // Fetch detailed release dates and watch providers
      const resultsWithProviders = await Promise.all(
        allResults.map(async (item: any) => {
          const details = await tmdbApi.getContentDetails(item.id.toString(), 'movie');
          const watchProviders = details['watch/providers']?.results?.IN;
          
          return {
            ...item,
            watch_providers: watchProviders,
            media_type: 'movie'
          };
        })
      );

      // Filter and sort by release date
      const filteredResults = resultsWithProviders
        .filter(item => item.watch_providers?.flatrate)
        .sort((a, b) => {
          const dateA = new Date(a.release_date || '');
          const dateB = new Date(b.release_date || '');
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, numberOfItems);

      return {
        results: filteredResults,
        total_results: filteredResults.length
      };
    } catch (error) {
      console.error('Error fetching OTT releases:', error);
      return { results: [], total_results: 0 };
    }
  },

  getLatestTVSeries: async (numberOfItems = 40) => {
    const lookBackDate = new Date();
    lookBackDate.setDate(lookBackDate.getDate() - DAYS_TO_LOOK_BACK);
    const fromDate = lookBackDate.toISOString().split('T')[0];

    try {
      const pagePromises = Array.from({ length: PAGES_TO_FETCH }, (_, i) =>
        fetch(
          `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&` +
          `with_original_language=hi|ta|te|ml|bn|kn&` +
          `region=IN&` +
          `with_origin_country=IN&` +
          `with_watch_providers=${INDIAN_OTT_PROVIDERS.join('|')}&` +
          `watch_region=IN&` +
          `first_air_date.gte=${fromDate}&` +
          `sort_by=first_air_date.desc&` +
          `page=${i + 1}&` +
          `include_adult=false&` +
          `vote_count.gte=0`
        ).then(res => res.json())
      );

      const pages = await Promise.all(pagePromises);
      const allResults = pages.flatMap(page => page.results || []);

      // Fetch watch providers for each show
      const resultsWithProviders = await Promise.all(
        allResults.map(async (item: any) => {
          const details = await tmdbApi.getContentDetails(item.id.toString(), 'tv');
          const watchProviders = details['watch/providers']?.results?.IN;
          
          return {
            ...item,
            watch_providers: watchProviders,
            media_type: 'tv'
          };
        })
      );

      // Filter and sort by release date
      const filteredResults = resultsWithProviders
        .filter(item => item.watch_providers?.flatrate)
        .sort((a, b) => {
          const dateA = new Date(a.first_air_date || '');
          const dateB = new Date(b.first_air_date || '');
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, numberOfItems);

      return {
        results: filteredResults,
        total_results: filteredResults.length
      };
    } catch (error) {
      console.error('Error fetching TV series:', error);
      return { results: [], total_results: 0 };
    }
  }
};