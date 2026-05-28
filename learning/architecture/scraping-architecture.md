# Scraping Architecture

## Recommended Stack

| Layer        | Technology       |
|-------------|------------------|
| Scraper     | Playwright       |
| Queue       | BullMQ           |
| Database    | MySQL            |
| Proxy       | BrightData / Oxylabs |
| CAPTCHA     | 2Captcha         |
| Storage     | AWS S3           |
| API         | Express.js       |
| Scheduler   | Cron             |

## Architecture

```
Scheduler
   ↓
Queue
   ↓
Playwright Workers
   ↓
Normalizer
   ↓
MySQL
   ↓
API Layer
```

## Pipeline

1. Discover listing pages
2. Extract venue URLs
3. Visit venue pages
4. Extract: name, city, pricing, capacity, images, amenities
5. Normalize
6. Store
