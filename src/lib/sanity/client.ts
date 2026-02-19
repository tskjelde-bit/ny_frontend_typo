import { createClient, type SanityClient } from '@sanity/client';

export const sanityClient: SanityClient | null =
  import.meta.env.VITE_SANITY_PROJECT_ID
    ? createClient({
        projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
        dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
        apiVersion: '2024-01-01',
        useCdn: true,
      })
    : null;
