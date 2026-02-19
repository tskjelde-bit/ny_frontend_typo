import { useState, useEffect } from 'react';
import { sanityClient } from '@/lib/sanity/client';

export function useSanityQuery<T>(query: string, fallback: T): T {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    if (!sanityClient) return;

    sanityClient
      .fetch<T>(query)
      .then((result) => {
        if (result && (Array.isArray(result) ? result.length > 0 : true)) {
          setData(result);
        }
      })
      .catch(() => {
        // Silently keep fallback data
      });
  }, [query]);

  return data;
}
