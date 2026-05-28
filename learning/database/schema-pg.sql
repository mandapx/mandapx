CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Venues table (maps directly to scraped JSON structure)
CREATE TABLE venues (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_name          VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    description         TEXT,
    address             TEXT,
    pin_code            VARCHAR(20),
    city                VARCHAR(100),
    state               VARCHAR(100),
    country             VARCHAR(100) DEFAULT 'India',
    location            GEOGRAPHY(Point, 4326),
    latitude            DECIMAL(10,8),
    longitude           DECIMAL(11,8),
    capacity_min        INT,
    capacity_max        INT,
    cost_per_plate_veg  DECIMAL(10,2),
    cost_per_plate_nonveg DECIMAL(10,2),
    cost_per_day        DECIMAL(10,2),
    venue_type          TEXT[],
    amenities           TEXT[],
    images              TEXT[],
    rating              DECIMAL(3,2) DEFAULT 0,
    reviews_count       INT DEFAULT 0,
    source              VARCHAR(100),
    source_url          TEXT UNIQUE,
    is_active           BOOLEAN DEFAULT true,
    is_verified         BOOLEAN DEFAULT false,
    is_featured         BOOLEAN DEFAULT false,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_venues_location ON venues USING GIST(location);
CREATE INDEX idx_venues_type ON venues USING GIN(venue_type);
CREATE INDEX idx_venues_source ON venues(source);
CREATE INDEX idx_venues_active ON venues(is_active) WHERE is_active = true;
CREATE INDEX idx_venues_featured ON venues(is_featured) WHERE is_featured = true;
