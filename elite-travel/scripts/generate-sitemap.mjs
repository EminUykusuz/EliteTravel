import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API URL (production'da değiştir)
const API_URL = process.env.VITE_API_URL || 'http://localhost:5067/api';
const SITE_URL = process.env.VITE_SITE_URL || 'https://elitetravel.com';
const LANGUAGES = ['tr', 'en', 'de', 'nl'];

// Fetch tours from backend
async function fetchTours() {
  try {
    // Skip SSL verification for local development
    const https = await import('https');
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    
    const response = await fetch(`${API_URL}/Tours?pageSize=1000`, {
      agent: API_URL.startsWith('https:') ? agent : undefined
    });
    const data = await response.json();
    return data.items || data.Items || [];
  } catch (error) {
    console.warn('⚠️ Could not fetch tours from backend:', error.message);
    console.warn('📝 Generating sitemap with static pages only');
    return [];
  }
}

// Generate sitemap XML
async function generateSitemap() {
  console.log('🚀 Generating sitemap...');
  
  const tours = await fetchTours();
  console.log(`📦 Found ${tours.length} tours`);
  
  const now = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Static pages
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'tours', priority: '0.9', changefreq: 'daily' },
    { path: 'about', priority: '0.6', changefreq: 'monthly' },
    { path: 'contact', priority: '0.6', changefreq: 'monthly' },
  ];

  staticPages.forEach(page => {
    LANGUAGES.forEach(lang => {
      const url = `${SITE_URL}/${lang}/${page.path}`.replace(/\/$/, '');
      
      xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`;
      
      // Hreflang alternates
      LANGUAGES.forEach(altLang => {
        const altUrl = `${SITE_URL}/${altLang}/${page.path}`.replace(/\/$/, '');
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}"/>\n`;
      });
      
      xml += `  </url>\n`;
    });
  });

  // Tour pages
  tours.forEach(tour => {
    const slug = tour.slug || tour.Slug;
    if (!slug) return;

    LANGUAGES.forEach(lang => {
      const url = `${SITE_URL}/${lang}/tours/${slug}`;
      
      xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
`;
      
      // Hreflang alternates
      LANGUAGES.forEach(altLang => {
        const altUrl = `${SITE_URL}/${altLang}/tours/${slug}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}"/>\n`;
      });
      
      xml += `  </url>\n`;
    });
  });

  xml += `</urlset>`;

  // Save sitemap
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`✅ Sitemap generated: ${sitemapPath}`);
  console.log(`📊 Total URLs: ${staticPages.length * LANGUAGES.length + tours.length * LANGUAGES.length}`);
}

generateSitemap();
