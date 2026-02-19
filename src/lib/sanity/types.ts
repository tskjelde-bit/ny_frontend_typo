import { DistrictInfo } from '@/types';

export type SanityDistrict = DistrictInfo;

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  featured: boolean;
  imageUrl?: string;
}

export interface SanityCityAverages {
  priceTrend: number;
  daysOnMarket: number;
  medianPrice: number;
  avgSqmPrice: number;
}

export interface SanityNavLink {
  name: string;
  href: string;
  active?: boolean;
  hasDropdown?: boolean;
}

export interface SanitySiteConfig {
  navLinks: SanityNavLink[];
  ctaText: string;
  ctaUrl?: string;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
}
