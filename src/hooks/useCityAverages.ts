import { SanityCityAverages } from '@/lib/sanity/types';
import { useSanityQuery } from './useSanityQuery';
import { CITY_AVERAGES_QUERY } from '@/lib/sanity/queries';
import { FALLBACK_CITY_AVERAGE } from '@/lib/fallbacks';

export function useCityAverages(): SanityCityAverages {
  return useSanityQuery<SanityCityAverages>(CITY_AVERAGES_QUERY, FALLBACK_CITY_AVERAGE);
}
