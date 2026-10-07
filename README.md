# ApiVanta V2

Free static API directory for `ApiVanta.de5.net`.

## Included

- Shareable hash routes and SPA fallback paths such as `#/api/seed-jikan` and `/api/seed-jikan` when the host supports rewrites
- API detail pages with status, response time, source, license, links, tags, and copy/share actions
- Client-side API tester for GET, POST, PUT, PATCH, and DELETE with query parameters, headers, JSON body, response metadata, and formatted output
- GitHub Issue-based API submissions with a form and a structured Issue template
- Conservative GitHub Action processing: URL and HTTPS validation, duplicate checks, normalization, and manual-review-safe failure behavior
- Adapter-based discovery under `scripts/sources/` for APIs.guru, Public APIs, and Public API Lists
- Community-directory scraping for public Markdown/HTML API lists, with source attribution and an explicit `unofficial` flag for community-listed entries
- Curated free-first providers for anime, music, movies, TV, and streaming metadata, including Jikan, AniList, Spotify, Last.fm, TMDB, and TVmaze
- Static health checks and up to 30 observations per API under `data/health/`
- Relevance search, category/auth/pricing/type/HTTPS filters, and sorting by name, response time, checked date, or added date
- Categories, public statistics, PWA manifest, offline service worker, `sitemap.xml`, and `robots.txt`
- Escaped imported metadata and allow-listed `http`/`https` links to reduce XSS, JavaScript URL, and unsafe redirect risks

## Run locally

Open `index.html` directly, or serve the folder with any static server:

```sh
python3 -m http.server 8080
```

The API tester runs directly in the browser. Provider CORS policy may prevent requests; ApiVanta never provides an unrestricted server-side proxy.

## Automation

GitHub Actions runs `scripts/import-all.mjs`, `scripts/verify.mjs`, and `scripts/health-history.mjs` every six hours. The submission workflow only appends validated, HTTPS, non-duplicate issues and labels processed items. Importers retain source URL, license, discovery method, and discovered date. Community-scraped entries are marked `unofficial` and remain unverified until health checks pass. Scraper sources are configured in `data/sources.json`; only add public pages whose terms and robots policy permit automated access. Netflix does not publish a current official public developer API, so Netflix-related entries are clearly labeled as unofficial or represented through licensed metadata alternatives such as TMDB. Catalog sources have their own licenses and terms; verify redistribution requirements before enabling a new source.

## Constraints

No database, accounts, reviews, tracking cookies, paid backend, or arbitrary API execution. ApiVanta catalogs third-party APIs and does not claim ownership of them.
