import { DistrictInfo } from '@/types';
import { useSanityQuery } from './useSanityQuery';
import { DISTRICTS_QUERY } from '@/lib/sanity/queries';
import { FALLBACK_DISTRICTS } from '@/lib/fallbacks';

export function useDistricts(): DistrictInfo[] {
  return useSanityQuery<DistrictInfo[]>(DISTRICTS_QUERY, FALLBACK_DISTRICTS);
}
