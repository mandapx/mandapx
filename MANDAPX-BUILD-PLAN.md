# MandapX — Complete Build Plan

---

## 1. INVENTORY — What We Already Have

### Scraped Data (Ready to Import)

| Dataset | Venues | Source |
|---------|--------|--------|
| Mandap.com + WeddingBazaar | 50,676 | Open REST API |
| VenueMonk | 1,215 | Open REST API |
| **Combined (deduped)** | **51,891** | Ready for PostgreSQL |

### Data Quality
- 97.6% with images
- 99.4% with capacity
- 42.3% with pricing (veg per plate)
- 700+ Indian cities covered
- Top cities: Bangalore (2.5K), Lucknow (2.2K), Mumbai (2.1K), Chennai (1.9K), Hyderabad (1.8K)

### Files Available
- `learning/output/venues-combined.json` (41.7 MB)
- `learning/database/venues-combined.sql` (45.6 MB — MySQL format)
- `learning/database/schema.sql` — basic table definitions
- `learning/schema/venue-schema.json` — unified venue schema
- `learning/playwright/scrape-mandap.js` — Mandap API scraper
- `learning/playwright/scrape-venuemonk.js` — VenueMonk API scraper
- `learning/discovery/discover-endpoints.js` — API discovery tool
- `learning/discovery/discover-stealth.js` — stealth-mode discovery

### Reference Repo (Naynesh-Patel-mandap)
- Flutter project (basic scaffold)
- `lib/`: splash.dart, home.dart, register.dart, vasan_page.dart
- `assets/images/`, `assets/font/`
- Only UI prototypes — NOT a production backend
- Useful for: Flutter UI reference, domain naming, color scheme

---

## 2. ARCHITECTURE DECISIONS

### Recommended Stack (from PRD)

```
Frontend Web:    Next.js 15 + Tailwind CSS + shadcn/ui
Mobile App:      Flutter (Phase 3)
Backend API:     NestJS (TypeScript)
Database:        PostgreSQL + PostGIS
Search:          OpenSearch (Elasticsearch compatible)
Storage:         AWS S3 / Cloudflare R2
Auth:            JWT + OTP (mobile/email) + Google OAuth
Maps:            Google Maps API
Notifications:   Firebase + WhatsApp API + SMS + Email
Hosting:         Vercel (FE) + AWS ECS (BE) + RDS (DB)
CDN:             Cloudflare
```

### Architecture Type: Modular Monolith (microservice-ready)

```
┌─────────────────────────────────────────────────┐
│                   Next.js Frontend               │
│  (Venue Portal / Owner Panel / Admin Panel)      │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS/REST
┌──────────────────────▼──────────────────────────┐
│              API Gateway (NestJS)                │
├─────────┬─────────┬──────────┬────────┬─────────┤
│ Venue   │ Booking │ Vendor   │ Media  │ Notif   │
│ Service │ Service │ Service  │ Service│ Service │
├─────────┴─────────┴──────────┴────────┴─────────┤
│                PostgreSQL + PostGIS              │
│                OpenSearch                        │
│                S3/R2 (Images/Videos)             │
└─────────────────────────────────────────────────┘
```

---

## 3. DATABASE SCHEMA — Mapped to MandapX

### Venues Table (extends scraped schema)

```sql
CREATE TABLE venues (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        UUID REFERENCES users(id),
    
    -- Basic Info
    venue_name      VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) UNIQUE NOT NULL,
    description     TEXT,
    venue_type      VARCHAR(50)[],  -- ['Banquet Hall','Lawn','Hotel','Resort','Farmhouse']
    
    -- Location
    address         TEXT,
    pin_code        VARCHAR(20),
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100) DEFAULT 'India',
    location        GEOGRAPHY(Point, 4326),  -- PostGIS for nearby search
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    
    -- Capacity
    seating_capacity    INT,
    floating_capacity   INT,
    
    -- Pricing (from scraped data)
    cost_per_plate_veg     DECIMAL(10,2),
    cost_per_plate_nonveg  DECIMAL(10,2),
    cost_per_day           DECIMAL(10,2),
    
    -- Space Details
    indoor_area     BOOLEAN DEFAULT false,
    outdoor_area    BOOLEAN DEFAULT false,
    lawn_area       BOOLEAN DEFAULT false,
    hall_area       BOOLEAN DEFAULT false,
    terrace_area    BOOLEAN DEFAULT false,
    
    -- Parking
    car_parking     INT DEFAULT 0,
    two_wheeler_parking INT DEFAULT 0,
    valet_parking   BOOLEAN DEFAULT false,
    
    -- Electrical
    connected_load_kva    DECIMAL(10,2),
    generator_capacity_kva DECIMAL(10,2),
    power_backup          BOOLEAN DEFAULT false,
    
    -- F&B
    kitchen_area_sqft   INT,
    gas_pipeline        BOOLEAN DEFAULT false,
    water_connection    BOOLEAN DEFAULT false,
    
    -- Media
    images          TEXT[],   -- Array of S3 URLs
    videos          TEXT[],
    drone_video_url TEXT,
    
    -- Ratings (from scraped data + platform)
    rating          DECIMAL(3,2) DEFAULT 0,
    reviews_count   INT DEFAULT 0,
    
    -- Meta
    source          VARCHAR(100),   -- 'Mandap', 'VenueMonk', 'MandapX'
    source_url      TEXT,
    is_verified     BOOLEAN DEFAULT false,
    is_featured     BOOLEAN DEFAULT false,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for search
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_location ON venues USING GIST(location);
CREATE INDEX idx_venues_type ON venues USING GIN(venue_type);
CREATE INDEX idx_venues_active ON venues(is_active) WHERE is_active = true;
```

### Users Table

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role            VARCHAR(20) NOT NULL,  -- 'public','owner','manager','contractor','vendor','admin'
    name            VARCHAR(255),
    email           VARCHAR(255) UNIQUE,
    mobile          VARCHAR(20) UNIQUE NOT NULL,
    whatsapp        VARCHAR(20),
    password_hash   VARCHAR(255),
    is_verified     BOOLEAN DEFAULT false,
    profile_pic     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Bookings Table

```sql
CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id),
    customer_id     UUID REFERENCES users(id),
    event_type      VARCHAR(50),  -- 'wedding','reception','engagement','corporate','birthday','garba','sangeet'
    status          VARCHAR(20) DEFAULT 'inquiry',  -- 'inquiry','tentative','confirmed','cancelled','completed'
    event_date      DATE NOT NULL,
    event_end_date  DATE,
    guest_count     INT,
    budget          DECIMAL(12,2),
    customer_name   VARCHAR(255),
    customer_mobile VARCHAR(20),
    customer_email  VARCHAR(255),
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Color coding for calendar:
-- Green  = confirmed
-- Yellow = tentative
-- Blue   = inquiry
-- Red    = blocked
```

### Vendors Table

```sql
CREATE TABLE vendors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_type     VARCHAR(50),  -- 'caterer','decorator','dj','lighting','tent','photographer','makeup'
    name            VARCHAR(255),
    email           VARCHAR(255),
    mobile          VARCHAR(20),
    whatsapp        VARCHAR(20),
    is_whatsapp_verified BOOLEAN DEFAULT false,
    is_monopoly     BOOLEAN DEFAULT false,  -- if true, only this vendor allowed at linked venues
    gst_number      VARCHAR(50),
    pricing         JSONB,
    portfolio       TEXT[],
    rating          DECIMAL(3,2) DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE venue_vendors (
    venue_id        UUID REFERENCES venues(id),
    vendor_id       UUID REFERENCES vendors(id),
    is_preferred    BOOLEAN DEFAULT false,
    PRIMARY KEY (venue_id, vendor_id)
);
```

### Reviews Table

```sql
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id),
    user_id         UUID REFERENCES users(id),
    booking_id      UUID REFERENCES bookings(id),
    rating          INT CHECK (rating >= 1 AND rating <= 5),
    title           VARCHAR(255),
    description     TEXT,
    images          TEXT[],
    categories      JSONB,  -- {"cleanliness":4,"staff":5,"parking":3,"decoration":4,"food":5}
    is_verified     BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. API DESIGN (NestJS Modules)

### Venue Module
```
GET    /api/venues                    — List/search venues (filters, nearby, pagination)
GET    /api/venues/:slug              — Venue detail
POST   /api/venues                    — Create venue (owner)
PUT    /api/venues/:id                — Update venue
DELETE /api/venues/:id                — Delete venue
GET    /api/venues/:id/images         — Get venue images
POST   /api/venues/:id/images         — Upload images
GET    /api/venues/:id/availability   — Check date availability
```

### Booking Module
```
GET    /api/bookings                  — List bookings (filter by venue/status/date)
POST   /api/bookings                  — Create inquiry/booking
PUT    /api/bookings/:id              — Update booking status
GET    /api/bookings/calendar         — Calendar view (color-coded)
DELETE /api/bookings/:id              — Cancel booking
```

### Vendor Module
```
GET    /api/vendors                   — List vendors
POST   /api/vendors                   — Register vendor
PUT    /api/vendors/:id               — Update vendor profile
POST   /api/vendors/verify-whatsapp   — WhatsApp OTP verification
GET    /api/vendors/:id/portfolio     — Get vendor portfolio
```

### Review Module
```
GET    /api/reviews?venue_id=         — List reviews for venue
POST   /api/reviews                   — Submit review
PUT    /api/reviews/:id               — Update review
```

### Search Module (OpenSearch)
```
GET    /api/search/venues?q=          — Full-text search
GET    /api/search/nearby?lat=&lng=   — Nearby venue search
```

### Auth Module
```
POST   /api/auth/send-otp             — Send OTP (mobile/email)
POST   /api/auth/verify-otp           — Verify OTP
POST   /api/auth/login                — JWT login
POST   /api/auth/google               — Google OAuth
POST   /api/auth/refresh              — Refresh token
```

### Media Module
```
POST   /api/media/upload              — Upload to S3/R2
DELETE /api/media/:id                 — Delete media
GET    /api/media/:id                 — Get signed URL
```

---

## 5. FRONTEND COMPONENT TREE (Next.js 15)

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    — Home (featured venues, search bar, cities)
│   │   ├── venues/
│   │   │   ├── page.tsx                — Venue listing (filters, grid/map view)
│   │   │   └── [slug]/
│   │   │       └── page.tsx            — Venue detail (gallery, map, amenities, reviews)
│   │   ├── cities/
│   │   │   └── [city]/
│   │   │       └── page.tsx            — City-level venue listing (SEO landing page)
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify-otp/page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── owner/
│   │   │   ├── venues/                 — My venues CRUD
│   │   │   ├── bookings/               — Booking calendar
│   │   │   ├── vendors/                — Vendor management
│   │   │   ├── reports/                — Analytics
│   │   │   └── settings/
│   │   ├── manager/                    — Booking status, calendar, maintenance
│   │   └── admin/                      — Approvals, users, analytics, revenue
│   │
│   └── api/                            — Next.js API routes (or proxy to NestJS)
│
├── components/
│   ├── ui/                             — shadcn/ui components (button, card, dialog, etc.)
│   ├── venue/
│   │   ├── VenueCard.tsx
│   │   ├── VenueGallery.tsx
│   │   ├── VenueMap.tsx
│   │   ├── AmenitiesList.tsx
│   │   ├── CapacityInfo.tsx
│   │   ├── PricingCard.tsx
│   │   ├── ReviewSection.tsx
│   │   └── InquiryForm.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   └── CitySelector.tsx
│   ├── booking/
│   │   ├── BookingCalendar.tsx
│   │   ├── BookingForm.tsx
│   │   └── DatePicker.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
│
├── lib/
│   ├── api-client.ts                   — Axios/fetch wrapper
│   ├── utils.ts
│   └── validators.ts
│
├── hooks/
│   ├── useVenues.ts
│   ├── useBookings.ts
│   ├── useAuth.ts
│   └── useSearch.ts
│
└── store/                              — Zustand or React Query
    ├── venue-store.ts
    ├── booking-store.ts
    └── auth-store.ts
```

---

## 6. PHASED IMPLEMENTATION PLAN

### Phase 1 — MVP (8-10 weeks)

**Goal:** Public venue portal with 51K imported venues + inquiry system

| Week | Task | Deliverable |
|------|------|-------------|
| 1 | Init project repos: `mandapx-api` (NestJS), `mandapx-web` (Next.js 15) | Empty projects, CI/CD setup |
| 1 | Set up PostgreSQL + PostGIS, import scraped data | `venues` table populated with 51,891 records |
| 2 | Build NestJS Venue Module (CRUD + search + filters + nearby) | `GET /api/venues` with full filtering |
| 2 | Build Auth Module (OTP send/verify, JWT) | `POST /api/auth/*` |
| 3 | Build Media Module (S3 upload, signed URLs) | Image upload/download |
| 3-4 | Build frontend: Home page, venue listing page, filters | Working venue browsing |
| 4-5 | Build frontend: Venue detail page (gallery, map, amenities, reviews) | Full venue detail view |
| 5 | Build Inquiry Module (form, WhatsApp integration) | `POST /api/bookings` (inquiry) |
| 6 | City landing pages (SEO — 700+ city pages) | Dynamic routes for all cities |
| 6-7 | Google Maps integration, nearby search | Map view with venue pins |
| 7-8 | Review system (submit, display, rating) | Reviews on venue pages |
| 8 | Admin panel: approve venues/manage users | Super admin dashboard |
| 8-10 | Testing, bug fixes, SEO optimization, deployment | **MVP LIVE** |

**Phase 1 Output:** Working venue discovery platform with 51K venues, search, filters, inquiries

---

### Phase 2 — Venue Management (6-8 weeks)

**Goal:** Venue owner/manager panels, booking calendar, vendor system

| Week | Task | Deliverable |
|------|------|-------------|
| 1 | Owner dashboard: venue profile management | CRUD for venue details, images, amenities |
| 2 | Booking module: confirm/tentative/inquiry status | `booking_status` workflow |
| 2-3 | Booking calendar with color coding | Green/Yellow/Blue/Red calendar |
| 3 | Date availability checker | Block dates on booking |
| 3-4 | Vendor registration + monopoly logic | Vendor profiles, venue-vendor linking |
| 4 | Vendor OTP verification via WhatsApp | Verified vendor badge |
| 5 | Manager/contractor role dashboards | Operational views |
| 5-6 | Lead/inquiry tracking dashboard | Lead list, status updates |
| 6-7 | Reports: booking stats, revenue, popular venues | Analytics dashboard |
| 7-8 | Testing, permissions hardening | **Phase 2 LIVE** |

---

### Phase 3 — Mobile App (6 weeks)

**Goal:** Flutter Android app (iOS later)

| Week | Task | Deliverable |
|------|------|-------------|
| 1 | Flutter project init, shared API client | Project structure, API integration |
| 1-2 | Venue listing, search, filters screens | Mobile venue browsing |
| 2-3 | Venue detail, gallery, map screens | Full venue view |
| 3-4 | Auth (OTP login), inquiry flow | User login, send inquiries |
| 4 | Booking calendar view | View bookings on mobile |
| 4-5 | Push notifications (Firebase) | Inquiry/booking alerts |
| 5-6 | Testing, Play Store deployment | **Android App LIVE** |

---

### Phase 4 — Advanced Features (Ongoing)

| Feature | Est. Time | Priority |
|---------|-----------|----------|
| AI venue recommendations | 3-4 weeks | Medium |
| AI decor suggestions | 2-3 weeks | Low |
| 360° virtual venue tour | 4-6 weeks | Low |
| QR check-in at venue | 2 weeks | Low |
| Vendor marketplace (public) | 4 weeks | Medium |
| Dynamic pricing engine | 3-4 weeks | Medium |
| Invoice & GST billing | 4 weeks | Low |
| ERP/CRM integration | 6-8 weeks | Low |

---

## 7. WEEK 1 — EXACT START COMMANDS

```bash
# 1. Create NestJS backend
nest new mandapx-api
cd mandapx-api
npm install @nestjs/typeorm typeorm pg @nestjs/config @nestjs/jwt @nestjs/passport
npm install @nestjs/serve-static bcrypt class-validator @nestjs/swagger
npm install @nestjs/bull bull redis   # for queues

# 2. Create Next.js frontend
npx create-next-app@latest mandapx-web --typescript --tailwind --eslint
cd mandapx-web
npx shadcn@latest init
npx shadcn@latest add button card dialog input form table
npm install zustand @tanstack/react-query axios

# 3. Convert MySQL SQL to PostgreSQL format
# Convert venues-combined.sql to PostgreSQL syntax
# Replace: BIGINT AUTO_INCREMENT → UUID, TIMESTAMP → TIMESTAMPTZ
# Remove: backtick quotes

# 4. Import scraped data
createdb mandapx
psql mandapx < learning/database/venues-combined-pg.sql
```

---

## 8. KEY DECISIONS & NOTES

### Why Build Fresh, Not Fork the Reference Repo
The reference Flutter repo is a basic UI prototype (splash, home, register pages). It provides zero backend, zero booking logic, zero SaaS architecture. Its value is:
- Flutter UI design patterns for wedding venue apps
- Color scheme and asset organization ideas
- Domain naming conventions

### Data Migration Plan
1. Convert MySQL SQL to PostgreSQL compatible format
2. Map `cost_per_plate` → `cost_per_plate_veg`
3. Add PostGIS `GEOGRAPHY` column for all venues (city-level centroids)
4. Add UUID primary keys
5. Create owner user records for venues that have contact info

### SEO Strategy
- Dynamic city landing pages: `/venues/{city}` for all 700+ cities
- Meta titles: "Best Wedding Venues in {City} | MandapX"
- Venue detail pages: `/venues/{city}/{slug}`
- Breadcrumb structured data
- Google Business Profile integration

### Cost Estimates (Monthly)
| Service | Est. Cost |
|---------|-----------|
| Vercel Pro (Frontend) | $20 |
| AWS ECS (Backend) | $30-50 |
| AWS RDS PostgreSQL | $30-50 |
| AWS S3 (Storage) | $5-10 |
| OpenSearch | $20-30 |
| Cloudflare CDN | $20 (Pro) |
| Google Maps API | $10-20 |
| Firebase (notifications) | Free tier |
| WhatsApp API | $0.005/msg |
| **Total** | **~$135-200/mo** |

### Team Recommendations
- 1 Full-stack dev (NestJS + Next.js) — critical
- 1 Frontend dev (Next.js + Tailwind) — Phase 1-2
- 1 Flutter dev — Phase 3
- 1 DevOps (part-time) — CI/CD, AWS setup
