# Venue Data Scraping Summary

## Results

| Metric | Value |
|--------|-------|
| Total venues scraped | **51,891** (after dedup) |
| VenueMonk | 1,215 |
| Mandap (incl. WeddingBazaar) | 50,676 |
| Cities covered | 700+ |
| Image coverage | 97.6% |
| Pricing coverage | 42.3% |
| Capacity coverage | 99.4% |

## Hidden APIs Discovered

### VenueMonk
- `https://prod-api.vmnk.in/core-service/v1/cities/citylist`
- `https://prod-api.vmnk.in/core-service/search/venues/{city}/base-filters`
- `https://www.venuemonk.com/api/search/venues/{city}/wedding-venues/list?page=N`

### Mandap / WeddingBazaar (shared infra)
- `https://mandap-api.mandap.com/api/v1/locations/cities`
- `https://mandap-api.mandap.com/api/v1/locations/cities/{city}`
- `https://mandap-api.mandap.com/api/v1/vendors?status=1&page=N&limit=24&city_id={id}&category_id=1`

### Blocked (require stealth / visible browser)
- WedMeGood — Cloudflare protected
- WeddingBazaar frontend — Cloudflare protected (but API same as Mandap)

## Top Cities by Venue Count

1. Bangalore — 2,498
2. Lucknow — 2,219
3. Mumbai — 2,076
4. Chennai — 1,905
5. Hyderabad — 1,822
6. Delhi — 1,535
7. Jaipur — 1,434
8. Pune — 1,189
9. Kolkata — 1,094
10. Patna — 1,079

## Output Files

| File | Size |
|------|------|
| `learning/output/venues-venuemonk.json` | 2.5 MB |
| `learning/output/venues-mandap.json` | 53 MB |
| `learning/output/venues-combined.json` | 41.7 MB |
| `learning/database/venues-combined.sql` | 45.6 MB |
| `learning/schema/venue-schema.json` | Schema definition |
| `learning/database/schema.sql` | MySQL table definitions |

## Scrapers

| File | Purpose |
|------|---------|
| `learning/playwright/scrape-venuemonk.js` | VenueMonk API scraper |
| `learning/playwright/scrape-mandap.js` | Mandap.com API scraper |
| `learning/playwright/scrape-weddingbazaar.js` | Playwright frontend scraper (example) |

## Discovery Tools

| File | Purpose |
|------|---------|
| `learning/discovery/discover-endpoints.js` | Headless API discovery |
| `learning/discovery/discover-stealth.js` | Stealth-mode API discovery |
| `learning/discovery/discovered-endpoints.json` | Discovered endpoints log |
| `learning/discovery/stealth-endpoints.json` | Stealth discovery log |

## Recommended Next Steps

1. Load `venues-combined.sql` into MySQL
2. Cross-reference venues across platforms (more advanced dedup)
3. Scrape WedMeGood with residential proxies + stealth
4. Keep scrapers on a cron schedule for freshness
5. Build API layer (Express.js) on top of the MySQL database
