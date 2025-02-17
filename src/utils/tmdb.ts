const TMDB_API_KEY = '14f8ac39fa19f5ca9639b37b3923431b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Indian languages ISO 639-1 codes
const INDIAN_LANGUAGES = ['hi', 'ta', 'te', 'ml', 'bn', 'kn', 'pa', 'gu', 'mr', 'or'];

// Major Indian OTT Platform IDs in TMDB
const OTT_PROVIDERS = [
  119, // Amazon Prime Video
  122, // Hotstar
  237, // Netflix
  121, // Zee5
  220, // JioCinema
  121, // SonyLIV
  192, // Voot
  100, // MXPlayer
];

// Get current date in YYYY-MM-DD format
const getCurrentDate = () => new Date().toISOString().split('T')[0];

export const tmdbConfig = {
  apiKey: TMDB_API_KEY,
  baseUrl: TMDB_BASE_URL,
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  originalImage: (imgPath: string) => `https://image.tmdb.org/t/p/original${imgPath}`,
  w500Image: (imgPath: string) => `https://image.tmdb.org/t/p/w500${imgPath}`,
};

export const tmdbApi = {
  getLatestOTTReleases: async (type: 'movie' | 'tv', page = 1) => {
    const languages = INDIAN_LANGUAGES.join('|');
    const watchProviders = OTT_PROVIDERS.join('|');
    const currentDate = getCurrentDate();
    
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&` +
      `with_original_language=${languages}&` +
      `with_watch_providers=${watchProviders}&` +
      `watch_region=IN&` +
      `with_watch_monetization_types=flatrate&` +
      `region=IN&` +
      `with_origin_country=IN&` +
      `${type === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte'}=${currentDate}&` +
      `page=${page}&` +
      `sort_by=${type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc'}`
    );
    return response.json();
  },

  getLatestTheatreReleases: async (page = 1) => {
    const languages = INDIAN_LANGUAGES.join('|');
    const currentDate = getCurrentDate();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const fromDate = threeMonthsAgo.toISOString().split('T')[0];
    
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&` +
      `with_original_language=${languages}&` +
      `region=IN&` +
      `with_origin_country=IN&` +
      `primary_release_date.lte=${currentDate}&` +
      `primary_release_date.gte=${fromDate}&` +
      `with_release_type=3|2&` + // 3 for theatrical, 2 for limited theatrical
      `page=${page}&` +
      `sort_by=primary_release_date.desc`
    );
    return response.json();
  },

  getContentDetails: async (id: string, type: 'movie' | 'tv') => {
    const response = await fetch(
      `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&` +
      `append_to_response=videos,credits,images,watch/providers&` +
      `language=en-US`
    );
    return response.json();
  },

  // New method to search Indian content
  searchIndianContent: async (query: string, page = 1) => {
    const languages = INDIAN_LANGUAGES.join('|');
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&` +
      `query=${encodeURIComponent(query)}&` +
      `with_original_language=${languages}&` +
      `region=IN&` +
      `page=${page}`
    );
    return response.json();
  },

  // Get content by language
  getContentByLanguage: async (type: 'movie' | 'tv', language: string, page = 1) => {
    const watchProviders = OTT_PROVIDERS.join('|');
    const currentDate = getCurrentDate();
    
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&` +
      `with_original_language=${language}&` +
      `with_watch_providers=${watchProviders}&` +
      `watch_region=IN&` +
      `with_watch_monetization_types=flatrate&` +
      `region=IN&` +
      `with_origin_country=IN&` +
      `${type === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte'}=${currentDate}&` +
      `page=${page}&` +
      `sort_by=${type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc'}`
    );
    return response.json();
  },
}; 