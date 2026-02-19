import { SanityBlogPost } from '@/lib/sanity/types';
import { useSanityQuery } from './useSanityQuery';
import { BLOG_POSTS_QUERY } from '@/lib/sanity/queries';
import { FALLBACK_BLOG_POSTS } from '@/lib/fallbacks';

export function useBlogPosts(): SanityBlogPost[] {
  return useSanityQuery<SanityBlogPost[]>(BLOG_POSTS_QUERY, FALLBACK_BLOG_POSTS);
}
