const fs = require('fs');
const path = require('path');

const distFolder = path.join(__dirname, '../dist/daruim-renastere/browser');
const sitemapPath = path.join(distFolder, 'sitemap.xml');

const routes = [
  '/',
  '/despre-noi',
  '/contact',
  '/daruim-renastere',
  '/darul-animalelor',
  '/evenimente-inregistrate',
  '/testimoniale',
  '/contact',
  '/inscrie-te'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>https://daruimrenastere.ro${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('')}
</urlset>`;

fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('✅ sitemap.xml generat cu succes în dist!');