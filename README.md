# Geography Arcade

Free geography quizzes: flags, capital cities, click-the-country maps, and provinces/states. Static HTML, 10 languages, no server code.

- **195 countries:** the 193 UN member states plus the two observer states (Vatican City, Palestine).
- **Provinces and states** (names, capitals, population, area, map) for the 100 largest countries by area, plus the smaller countries listed in `extraProvinceCountries` (site.config.js), such as Switzerland, the Netherlands and Belgium. Each continent page shows a stamp for every one of them.
- **Languages:** English (root), Chinese (`/zh/`), Hindi (`/hi/`), Spanish (`/es/`), Arabic (`/ar/`, right to left), French (`/fr/`), Bengali (`/bn/`), Portuguese (`/pt/`, Brazilian), Russian (`/ru/`), Urdu (`/ur/`, right to left; uses the Nastaliq font built into Android and iOS, no download). Every page exists in every language.

The site is **Geography Arcade** at https://geographyarcade.com (`siteName` and `domain` in `site.config.js`; `aliasDomains` lists hostnames such as www that 301-redirect to it).

## Commands

Download data (only when you want fresh data; results are cached in `data/cache/`, so a re-run is quick):

```bash
npm run fetch
```

Build every page into `dist/`:

```bash
npm run build
```

Audit `dist/` for SEO, hreflang, broken links, orphan pages and dashes in copy (exits with an error if it finds any):

```bash
npm run check
```

Preview at http://localhost:5520:

```bash
npm run serve
```

## Automatic monthly update

`.github/workflows/monthly-update.yml` runs on GitHub at 02:00 UTC on the 1st of every month, whenever a change to the site's code or settings is pushed to `main`, and on demand from the repository's Actions tab ("Run workflow"):

1. `npm run fetch`: fresh data from Wikidata, geoBoundaries, OpenStreetMap and Natural Earth.
2. `node scripts/stabilize.js <last month's data>`: Wikidata is edited by the public, so a name that comes back empty keeps last month's value, and a changed name (country, capital, province) is published only after the same new value has been fetched for at least 25 days (extra runs in between, such as after a code push, do not shorten the wait); bad edits are usually reverted by then. Held-back changes, with the date first seen, are listed in the run log and stored in `data/pending-names.json`.
3. `node scripts/guard.js <last month's data>`: stops the run, and nothing is published, if a country or a province list disappears, division counts jump, capitals or populations vanish, or a world-game list shrinks. GitHub emails the owner when a run fails; the log lists the problems.
4. `npm run build`, `npm run check`, `npm run zip`.
5. `node scripts/deploy.js`: publishes through the Hostinger API with the repository secret `HOSTINGER_API_TOKEN_GEOGRAPHY` (hPanel: Account > API).
6. `node scripts/indexnow.js`: tells Bing about the pages.
7. Commits the new `data/*.json` so next month compares against it.

Not in the repository (rebuilt each run): `dist/`, `data/geo/`, `data/cache/`, `node_modules/`. GitHub pauses scheduled workflows in repositories with no activity for 60 days; the monthly data commit counts as activity, but if the Actions tab ever shows the workflow as disabled, enable it again there.

## Deploy (Hostinger)

The site runs on Hostinger (account `u320645487`, website `geographyarcade.com`, files in `public_html`). A deploy is five steps, all automatic when Claude has the Hostinger connector:

1. `npm run build`: rebuild `dist/`.
2. `npm run zip`: pack `dist/` into `geographyarcade-site.zip`. It writes folder paths with `/`; a zip made with Windows' built-in tools uses `\`, and Hostinger then unpacks every page as a flat file named like `about\index.html`.
3. Hostinger API `hosting_files_generate-upload-url` (username, domain): returns a one-time upload URL and two keys.
4. `node scripts/upload.js <url> <auth_key> <rest_auth_key>`: uploads the zip into `public_html` (TUS, 8 MB chunks, retries).
5. Hostinger API `hosting_websites_deploy-static-site-archive` with `archive_path: geographyarcade-site.zip`: unpacks it over the site and removes the zip. Then `hosting_cache_clear-website` so visitors and the CDN get the new files.

By hand instead: in hPanel, open the File manager and go to public_html. Upload the zip, then Extract it. Because the folder name is required, double-click `..`, name the folder `public_html` and tick Overwrite.

## Launch checklist

1. **Domain:** set `domain` in `site.config.js`. Canonical URLs, hreflang, sitemaps, `robots.txt`, `llms.txt` and `llms-full.txt` are all built from it.
2. **Verification:** add the site to Google Search Console and Bing Webmaster Tools, choose the "HTML tag" method, and paste the codes into `googleVerification` and `bingVerification` in `site.config.js`.
3. **Build and audit:** run `npm run build`, then `npm run check` (SEO, hreflang, links, orphans, dashes, unfilled text) and `npm run keywords` (keyword map, see below).
4. **Upload** the **contents** of `dist/` to the web root (on Hostinger, `public_html`). `.htaccess` adds the 404 page, compression and caching.
5. **Submit the sitemap** `https://your-domain/sitemap.xml` in both Search Console and Bing Webmaster Tools.
6. **Ping Bing and Yandex:** run `npm run indexnow` once the upload is live (it checks the key file first).
7. **After 4 to 8 weeks:** export search queries from Search Console and Bing, add the monthly searches to `docs/keywords.csv`, and improve the pages behind the keywords that get impressions but few clicks.

Nothing on the site changes daily, so rebuild when the data changes (every few months is enough), then repeat steps 4 and 6.

## Keyword map

`npm run keywords` writes `docs/keywords.csv`: about 970 English keywords, each mapped to the one page built to rank for it, grouped into clusters (site, regions, countries, provinces and states, world games, country games, lists and rankings). The script also checks that every target page exists and mentions its keyword. The same pages exist in 10 more languages, which target the translated searches.

The CSV has empty `monthly_searches_google` and `monthly_searches_bing` columns: no search-volume data is built in, so fill them from Google Keyword Planner, Search Console or Bing Webmaster Tools.

### Competitor keyword import

`npm run keyword-import` reads a keyword export (Semrush/Ahrefs style CSV, UTF-16 or UTF-8) from `data/keywords/` and assigns every keyword to one page on this site, by language, country, continent, US state and topic (flags, capitals, maps, provinces, games). It writes:

- `docs/keyword-map.csv`: keyword, volume, language, status, cluster, target URL.
- `docs/keyword-gaps.csv`: keywords with no matching page yet, sorted by volume.

Statuses: `mapped` (a page exists), `gap` (no page yet), `other-language` (a language the site does not have, e.g. Polish or Dutch), `not-relevant`. Keywords go into titles, headings and page text only where they read naturally. The list is never pasted into pages: keyword stuffing gets pages demoted.

## Search

Every page has a search box in the header. The build writes `/search/<lang>.json` (title, URL and type of every page in that language), and `src/search.js` loads it only when someone clicks into the box, so it costs nothing on page load. Games and quizzes rank first, then hub pages, then country pages. Country pages also match the English country name in every language. Pressing Enter opens `/search/?q=...` with every result (that page is `noindex`).

## URLs

| Page | English | Other languages |
|---|---|---|
| Home | `/` | `/hi/`, `/ar/`… |
| Region hubs (home page cards) | `/world/`, `/africa/`, `/north-america/`, `/south-america/`, `/asia/`, `/oceania/`, `/europe/` | `/ur/africa/` |
| Country games | `/games/neighbours/`, `/games/currencies/`, `/games/languages/`, `/games/landlocked/`, `/games/hemispheres/` | `/fr/games/neighbours/` |
| Lists and rankings | `/lists/`, `/lists/largest-countries/`, `/lists/countries-using-euro/`… (18 lists) | `/ar/lists/` |
| Quiz hubs | `/flags/`, `/capitals/`, `/maps/` | `/es/flags/` |
| Quizzes | `/flags/africa/`, `/capitals/world/`, `/maps/europe/` | `/fr/maps/europe/` |
| All countries | `/countries/` | `/zh/countries/` |
| Country facts | `/countries/pakistan/` | `/bn/countries/pakistan/` |
| Province map quiz | `/countries/pakistan/map-quiz/` | `/hi/countries/pakistan/map-quiz/` |
| Province capitals quiz | `/countries/pakistan/capitals-quiz/` | |
| Provinces hub | `/provinces/` | |
| Sources | `/about/` | |

Scopes for the quizzes: `world`, `africa`, `asia`, `europe`, `north-america` (includes Central America and the Caribbean), `south-america`, `oceania`.

## SEO, AEO and GEO

**Search engines (SEO)**
- Every page is complete HTML. The quiz runs in the browser, but the full answer list (flags, countries, capitals) is written into the page, so search engines index real content.
- `hreflang` for all 10 languages plus `x-default`, one sitemap per language with alternates, unique titles and descriptions.
- Structured data: `Quiz`, `WebPage` about a `Country` (linked to Wikidata with `sameAs`), `FAQPage`, `BreadcrumbList`, `WebSite`, `AboutPage`.
- Every page is at most 3 clicks from the home page. `npm run check` fails on orphans.

**Local search:** every country and province page exists in all 10 languages, with the country's own names from Wikidata (so `/hi/countries/india/` uses भारत and Hindi province names). Province quizzes target searches like "Pakistan provinces quiz" or "Mexico states map".

**Answer engines (AEO):** each country page opens with a one-sentence answer ("The capital of Pakistan is Islamabad. Pakistan is in Asia.") and has 5 or 6 questions with direct answers: capital, continent, area rank, population with year, number of provinces, neighbours. Each list page opens with a computed answer ("The largest country by area is Russia (17,098,242 km²), followed by Canada and China.").

**Generative engines (GEO):** `llms.txt` describes the site, coverage and URL patterns; `llms-full.txt` gives one line of key facts per country (capital, continent, area, population, currency, languages, neighbours). `robots.txt` explicitly allows AI crawlers. `/about/` lists every data source and licence, and every figure on the site names its source and year.

**Topical authority and entities:** the site covers the topic as linked clusters: facts (country pages), rankings (`/lists/`), and games on the same facts, each linking to the others. Structured data names each country, its capital and its provinces with their Wikidata IDs (`sameAs`), and list pages carry `ItemList` markup.

## World games

`/world/` is a grid of 24 games, each with its own page under `/world/`:

- **Linked quizzes:** World countries, World capitals, World flags (the existing world quizzes).
- **Map games from Natural Earth** (public domain, names in all 10 languages): continents, oceans, seas, straits, lakes, islands, archipelagos, regions, mountain ranges, deserts, cities.
- **With Wikidata:** rivers (Natural Earth lines, Wikidata names), mountains (ranked by how many Wikipedias cover them), volcanoes.
- **Biomes:** RESOLVE Ecoregions 2017 (CC BY 4.0), merged into 14 biomes.
- **Diagrams drawn in SVG** (`src/diagrams.js`): layers of the Earth, layers of the atmosphere, the water cycle, climate change. Latitude and longitude is drawn on a Pacific-centred map (`src/maps.js`).
- **Solar system** (`src/planets.js`): click the planet on a diagram, plus a "Name the planet" picture quiz. Diameters from the NASA Planetary Fact Sheet.

Data: `npm run fetch` also runs `scripts/fetch-physical.js` and `scripts/fetch-planets.js`. Labels for diagrams, biomes and game names are in `src/terms.js`.

## Speed

- CSS is inlined. The heading font loads in the background, and only on Latin-script pages. The one script (`app.js`, about 5 KB compressed) is deferred.
- Map SVGs load only when a map quiz opens, and are kept under 70 KB each (about 20 KB compressed).
- Compressed HTML averages about 6 KB per page.

## Data

| What | Source | Licence |
|---|---|---|
| Country and province names in 11 languages, capitals, population, province area | Wikidata | CC0 |
| ISO codes, country area, borders, languages, currencies | world-countries | ODbL |
| Country boundaries | Natural Earth 1:50m via world-atlas | Public domain |
| Province boundaries | geoBoundaries gbOpen ADM1 | Per country, listed on `/about/` |
| Province boundaries for countries reorganised after the geoBoundaries release (Norway, Vietnam, Indonesia, Philippines, Algeria, Ethiopia, Oman, Ireland's counties, Malawi and Uganda districts, North Macedonia) | Wikidata (current divisions) + OpenStreetMap (shapes) | ODbL |
| Islands of Hawaii and Denmark | Natural Earth 1:10m via world-atlas, named from Wikidata | Public domain |
| Counties of England (48 ceremonial) | OpenStreetMap via Wikidata | ODbL |
| Country flags | flag-icons | MIT |
| State and province flags (US, Canada, Germany, Brazil, Japan) | Wikimedia Commons, via Wikidata "flag image" | Per image, credited on each flag quiz page |

Scripts: `fetch-subdivisions.js` (provinces), `fetch-extra-maps.js` (islands, counties of England), `fetch-division-flags.js` (state and province flags; it skips a country when Wikimedia rate-limits a download, so run it again later to pick that country up, e.g. Switzerland).

Manual fixes live in `data/`:
- `name-fixes.js`: country names Wikidata lacks in a language.
- `subdivision-overrides.js`: Wikidata matches or capitals for provinces the automatic join gets wrong; `source: 'osm'` for countries whose divisions changed after the geoBoundaries release, with `osm: { QID: relation }` where Wikidata's OpenStreetMap link is missing or stale.
- `division-terms.js`: whether a country's divisions are called states, provinces, regions, departments, governorates, counties, districts, cantons or municipalities.

Still skipped (neither geoBoundaries nor Wikidata has the new divisions yet): Kazakhstan, Angola, Mali, Burkina Faso, Madagascar, Central African Republic, Azerbaijan. Vietnam has a map quiz but no capitals quiz: since the 2025 reform its provincial seats are wards.

## Editing

- Interface text: `src/i18n.js`, one block per language. The build stops if a language is missing a key.
- Styles: `src/style.css`. Quiz engine: `src/app.js`. Map generation: `src/maps.js`.
