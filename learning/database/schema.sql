CREATE TABLE venues (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    venue_name VARCHAR(255),

    slug VARCHAR(255),

    description TEXT,

    address TEXT,

    pin_code VARCHAR(20),

    city VARCHAR(100),

    state VARCHAR(100),

    country VARCHAR(100),

    latitude DECIMAL(10,8),

    longitude DECIMAL(11,8),

    capacity_min INT,

    capacity_max INT,

    cost_per_day DECIMAL(10,2),

    cost_per_plate DECIMAL(10,2),

    rating DECIMAL(3,2),

    reviews_count INT,

    source VARCHAR(100),

    source_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE venue_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    venue_id BIGINT,

    image_url TEXT,

    FOREIGN KEY (venue_id)
    REFERENCES venues(id)
);

CREATE TABLE amenities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    amenity_name VARCHAR(255)
);

CREATE TABLE venue_amenities (
    venue_id BIGINT,

    amenity_id BIGINT
);
