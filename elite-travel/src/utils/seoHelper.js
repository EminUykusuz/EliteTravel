// src/utils/seoHelper.js
// Comprehensive SEO system - Meta tags, Structured Data, Social Sharing

const SITE_NAME = 'Elite Travel';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://elitetravel.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`; // 1200x630px default OG image

/**
 * Set page title
 */
export const setPageTitle = (title, suffix = true) => {
  const fullTitle = suffix ? `${title} | ${SITE_NAME}` : title;
  document.title = fullTitle;
  
  // Update OG title
  updateMetaTag('og:title', fullTitle);
  updateMetaTag('twitter:title', fullTitle);
};

/**
 * Set meta description
 */
export const setMetaDescription = (description) => {
  updateMetaTag('description', description, 'name');
  updateMetaTag('og:description', description);
  updateMetaTag('twitter:description', description);
};

/**
 * Set meta keywords
 */
export const setMetaKeywords = (keywords) => {
  updateMetaTag('keywords', keywords, 'name');
};

/**
 * Set canonical URL
 */
export const setCanonicalUrl = (url) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
  
  // Update OG URL
  updateMetaTag('og:url', url);
};

/**
 * Set Open Graph image
 */
export const setOGImage = (imageUrl, width = 1200, height = 630) => {
  const fullImageUrl = imageUrl?.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;
  updateMetaTag('og:image', fullImageUrl);
  updateMetaTag('og:image:width', width.toString());
  updateMetaTag('og:image:height', height.toString());
  updateMetaTag('twitter:image', fullImageUrl);
};

/**
 * Set hreflang alternates
 */
export const setHreflangAlternates = (path, languages = ['tr', 'en', 'de', 'nl']) => {
  // Remove existing hreflang links
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
  
  languages.forEach(lang => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = `${SITE_URL}/${lang}${path}`;
    document.head.appendChild(link);
  });
  
  // Add x-default
  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = `${SITE_URL}${path}`;
  document.head.appendChild(defaultLink);
};

/**
 * Update meta tag (name or property)
 */
function updateMetaTag(key, value, attribute = 'property') {
  let meta = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = value;
}

/**
 * Generate structured data (JSON-LD)
 */
export const setStructuredData = (data) => {
  // Remove existing structured data
  document.querySelectorAll('script[type="application/ld+json"]').forEach(el => {
    if (el.id !== 'organization-schema') el.remove();
  });
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Generate Tour structured data
 */
export const generateTourSchema = (tour) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.description,
    "url": `${SITE_URL}/tours/${tour.slug}`,
    "image": tour.mainImage?.startsWith('http') ? tour.mainImage : `${SITE_URL}${tour.mainImage}`,
    "touristType": "Tourist",
    "availableLanguage": ["Turkish", "English", "German", "Dutch"],
    "provider": {
      "@type": "TravelAgency",
      "name": SITE_NAME,
      "url": SITE_URL
    }
  };

  // Add offers
  if (tour.price) {
    schema.offers = {
      "@type": "Offer",
      "price": tour.price,
      "priceCurrency": tour.currency || "EUR",
      "availability": "https://schema.org/InStock",
      "url": `${SITE_URL}/tours/${tour.slug}`,
      "validFrom": new Date().toISOString().split('T')[0]
    };
  }

  // Add itinerary
  if (tour.itinerary && tour.itinerary.length > 0) {
    schema.itinerary = {
      "@type": "ItemList",
      "itemListElement": tour.itinerary.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.title,
        "description": item.description
      }))
    };
    
    // Add duration (ISO 8601 format)
    schema.duration = `P${tour.itinerary.length}D`;
  }

  // Add images
  if (tour.galleryPhotos && tour.galleryPhotos.length > 0) {
    schema.image = tour.galleryPhotos.map(url => 
      url?.startsWith('http') ? url : `${SITE_URL}${url}`
    );
  }

  // Add departure city
  if (tour.departureCity) {
    schema.departureLocation = {
      "@type": "Place",
      "name": tour.departureCity
    };
  }

  return schema;
};

/**
 * Generate Organization structured data
 */
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-XXX-XXX-XXXX",
      "contactType": "Customer Service",
      "availableLanguage": ["Turkish", "English", "German", "Dutch"]
    },
    "sameAs": [
      "https://www.facebook.com/elitetravel",
      "https://www.instagram.com/elitetravel",
      "https://twitter.com/elitetravel"
    ]
  };
};

/**
 * Generate BreadcrumbList structured data
 */
export const generateBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.path}`
    }))
  };
};

/**
 * Complete SEO setup for a page
 */
export const setupPageSEO = ({
  title,
  description,
  keywords,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  structuredData = null
}) => {
  setPageTitle(title);
  setMetaDescription(description);
  setMetaKeywords(keywords);
  setCanonicalUrl(`${SITE_URL}${path}`);
  setOGImage(image);
  setHreflangAlternates(path);
  
  // OG type
  updateMetaTag('og:type', type);
  updateMetaTag('twitter:card', 'summary_large_image');
  
  // Structured data
  if (structuredData) {
    setStructuredData(structuredData);
  }
  
  // Set HTML lang attribute
  const currentLang = path.split('/')[1] || 'tr';
  document.documentElement.lang = currentLang;
};

// Legacy support (backward compatible)
export const SEO = {
  setPageMeta: (title, description, image) => {
    setupPageSEO({
      title,
      description,
      image,
      path: window.location.pathname
    });
  },
  setOgTag: updateMetaTag,
  setTwitterTag: (name, content) => updateMetaTag(name, content, 'name')
};

