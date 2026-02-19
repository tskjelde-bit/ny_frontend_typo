export const DISTRICTS_QUERY = `*[_type == "district"] | order(name asc) {
  "id": districtId,
  name,
  priceChange,
  avgDaysOnMarket,
  pricePerSqm,
  medianPrice,
  description,
  lat,
  lng
}`;

export const BLOG_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) [0...10] {
  _id,
  title,
  "slug": slug.current,
  category,
  publishedAt,
  featured,
  "imageUrl": image.asset->url
}`;

export const CITY_AVERAGES_QUERY = `*[_type == "cityAverages" && _id == "cityAverages"][0] {
  priceTrend,
  daysOnMarket,
  medianPrice,
  avgSqmPrice
}`;

export const SITE_CONFIG_QUERY = `*[_type == "siteConfig" && _id == "siteConfig"][0] {
  navLinks[] {
    name,
    href,
    active,
    hasDropdown
  },
  ctaText,
  ctaUrl,
  newsletterTitle,
  newsletterSubtitle
}`;
