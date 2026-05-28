const fs = require('fs');

const venues = require('../output/venues-venuemonk.json');

let sql = `-- VenueMonk Scraped Data Export
-- Generated: ${new Date().toISOString()}
-- Total Venues: ${venues.length}

-- Clear existing data
TRUNCATE venue_amenities;
TRUNCATE venue_images;
TRUNCATE amenities;
TRUNCATE venues;

-- Insert venues
INSERT INTO venues (venue_name, slug, description, address, pin_code, city, state, country, latitude, longitude, capacity_min, capacity_max, cost_per_day, cost_per_plate, rating, reviews_count, source, source_url) VALUES\n`;

const venueRows = [];
const amenitySet = new Map();
const venueAmenityRows = [];
const imageRows = [];
let amenityIdCounter = 1;

for (const v of venues) {
    const esc = s => (s || '').replace(/'/g, "''");
    const costPerPlate = v.cost_per_plate_veg || v.cost_per_plate_nonveg || 0;

    venueRows.push(`('${esc(v.venue_name)}', '${esc(v.slug)}', '${esc(v.description)}', '${esc(v.address)}', '${esc(v.pin_code)}', '${esc(v.city)}', '${esc(v.state)}', '${esc(v.country)}', ${v.latitude || 'NULL'}, ${v.longitude || 'NULL'}, ${v.capacity_min || 0}, ${v.capacity_max || 0}, ${v.cost_per_day || 0}, ${costPerPlate}, ${v.rating || 0}, ${v.reviews_count || 0}, '${esc(v.source)}', '${esc(v.source_url)}')`);

    // Track amenity references
    const venueIdx = venueRows.length;
    for (const a of (v.amenities || [])) {
        if (!amenitySet.has(a)) {
            amenitySet.set(a, amenityIdCounter++);
        }
    }
}

sql += venueRows.join(',\n') + ';\n\n';

// Insert amenities
sql += '-- Insert amenities\nINSERT INTO amenities (id, amenity_name) VALUES\n';
sql += Array.from(amenitySet.entries())
    .map(([name, id]) => `(${id}, '${name.replace(/'/g, "''")}')`)
    .join(',\n');
sql += ';\n\n';

// Insert venue_images and venue_amenities using venue ID subqueries
sql += '-- Insert venue images\n';
for (const v of venues) {
    if (v.images && v.images.length > 0) {
        const slug = v.slug.replace(/'/g, "''");
        for (const img of v.images.slice(0, 5)) { // max 5 images
            sql += `INSERT INTO venue_images (venue_id, image_url) SELECT id, '${img.replace(/'/g, "''")}' FROM venues WHERE slug = '${slug}';\n`;
        }
    }
}

sql += '\n-- Insert venue-amenity mappings\n';
for (const v of venues) {
    if (v.amenities && v.amenities.length > 0) {
        const slug = v.slug.replace(/'/g, "''");
        for (const a of v.amenities) {
            const amenityId = amenitySet.get(a);
            sql += `INSERT INTO venue_amenities (venue_id, amenity_id) SELECT id, ${amenityId} FROM venues WHERE slug = '${slug}';\n`;
        }
    }
}

fs.writeFileSync('learning/database/venues-data.sql', sql);
console.log(`SQL export written: ${(sql.length / 1024).toFixed(1)} KB`);
console.log(`Venues: ${venues.length}`);
console.log(`Amenities: ${amenitySet.size}`);
