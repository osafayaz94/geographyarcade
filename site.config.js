// Set the real domain before deploying: canonical URLs, hreflang, sitemaps and llms.txt use it.
module.exports = {
  domain: 'https://geographyarcade.com',
  // Other hostnames that should land on the main domain; the build writes 301 redirects for them.
  aliasDomains: ['www.geographyarcade.com'],
  siteName: 'Geography Arcade',
  // Shown on the About page and in the Organization schema when set (e.g. 'hello@geographyarcade.com').
  contactEmail: 'team@geographyarcade.com',
  // Hostinger account that hosts the site (hPanel), used by scripts/deploy.js.
  hostingerUsername: 'u320645487',
  // How many of the largest countries get province/state data and quizzes (195 = all; owner's
  // request 2026-10-12: every country gets its first-level divisions, whatever they are called).
  provinceCountries: 195,
  // Smaller countries that also get them (ISO3): popular map quizzes, and each continent's page.
  extraProvinceCountries: 'BEL BIH HRV CYP CZE DNK IRL LUX NLD SVK CHE ISR ALB LKA LBN KWT QAT RWA DOM CRI SLV LTU EST MKD'.split(' '),
  // IndexNow (Bing, Yandex, Seznam, Naver): the build publishes /<key>.txt; `npm run indexnow` submits the sitemap URLs.
  indexNowKey: 'c315177665dc17b8e70a82fbe201f7d4',
  // Paste the codes from Google Search Console and Bing Webmaster Tools (HTML tag method) to verify the site.
  googleVerification: '',
  bingVerification: '',
  // Pinterest "Claim website" code (HTML tag method: the content="..." value only).
  // Official profiles of the site elsewhere: shown to search engines as sameAs in the
  // Organization schema. Add each new account here.
  socialProfiles: [
    'https://www.pinterest.com/geographyarcade/',
    'https://www.facebook.com/profile.php?id=61595367984247',
    'https://www.instagram.com/geography.arcade/',
  ],
  pinterestVerification: '33c38c16b6997245aa18ea3638392b16',
  // Google Analytics 4 Measurement ID (G-XXXXXXXXXX). Empty = no analytics script on the site.
  gaId: 'G-93E7396862',
};
