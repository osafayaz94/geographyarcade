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
  // How many of the largest countries get province/state data and quizzes.
  provinceCountries: 107,
  // Smaller countries that also get them (ISO3): popular map quizzes, and each continent's page.
  extraProvinceCountries: 'BEL BIH HRV CYP CZE DNK IRL LUX NLD SVK CHE ISR ALB LKA LBN KWT QAT RWA DOM CRI SLV LTU EST MKD'.split(' '),
  // IndexNow (Bing, Yandex, Seznam, Naver): the build publishes /<key>.txt; `npm run indexnow` submits the sitemap URLs.
  indexNowKey: 'c315177665dc17b8e70a82fbe201f7d4',
  // Paste the codes from Google Search Console and Bing Webmaster Tools (HTML tag method) to verify the site.
  googleVerification: '',
  bingVerification: '',
  // Pinterest "Claim website" code (HTML tag method: the content="..." value only).
  pinterestVerification: '',
  // Google Analytics 4 Measurement ID (G-XXXXXXXXXX). Empty = no analytics script on the site.
  gaId: 'G-93E7396862',
};
