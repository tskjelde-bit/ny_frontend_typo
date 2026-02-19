import { SanitySiteConfig } from '@/lib/sanity/types';
import { useSanityQuery } from './useSanityQuery';
import { SITE_CONFIG_QUERY } from '@/lib/sanity/queries';
import { FALLBACK_SITE_CONFIG } from '@/lib/fallbacks';

export function useSiteConfig(): SanitySiteConfig {
  return useSanityQuery<SanitySiteConfig>(SITE_CONFIG_QUERY, FALLBACK_SITE_CONFIG);
}
