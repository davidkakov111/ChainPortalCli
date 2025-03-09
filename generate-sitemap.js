import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Site pages
const pages = [
    '',
    'learn', 
    'profile/transaction-history', 
    'profile/transaction-history/:txId', 
    'terms-and-conditions', 
    'privacy-policy', 
    'disclaimer', 
    'terms-of-smart-contracts', 
    'faq',
    'token',
    'token/mint',
    'token/bridge', 
    'nft',
    'nft/mint',
    'nft/bridge'
];

// Base URL
const baseUrl = 'https://chainportal.app';

// Generate the XML structure
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages.map((page) => `
        <url>
        <loc>${baseUrl}/${page}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>${page === '' ? 1.0 : 0.8}</priority>
        </url>
    `).join('')}
</urlset>`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Save the sitemap in the `dist/browser` directory for SSR
const sitemapPath = join(__dirname, 'dist/chain-portal/browser/sitemap.xml');
writeFileSync(sitemapPath, sitemapContent);

console.log(`✅ Sitemap generated at: ${sitemapPath}`);
