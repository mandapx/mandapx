const fs = require('fs');

const vmnk = JSON.parse(fs.readFileSync('learning/output/venues-venuemonk.json', 'utf8'));
const mandap = JSON.parse(fs.readFileSync('learning/output/venues-mandap.json', 'utf8'));

console.log('=== Dataset Overview ===');
console.log(`VenueMonk: ${vmnk.length} venues`);
console.log(`Mandap:    ${mandap.length} venues`);
console.log(`Combined:  ${vmnk.length + mandap.length} venues`);

// Check for overlapping venues (by name + city)
const vmnkSet = new Set(vmnk.map(v => `${v.venue_name}|${v.city}`.toLowerCase()));
const overlap = mandap.filter(v => vmnkSet.has(`${v.venue_name}|${v.city}`.toLowerCase()));
console.log(`\nOverlapping venues (same name+city): ${overlap.length}`);

// Mark source on each
vmnk.forEach(v => v.source = 'VenueMonk');
mandap.forEach(v => v.source = 'Mandap');

// Normalize both to same schema for combined output
function normalizeForOutput(v) {
    return {
        venue_name: v.venue_name,
        slug: v.slug,
        description: v.description || '',
        address: v.address || '',
        pin_code: v.pin_code || '',
        city: v.city || '',
        state: v.state || '',
        country: v.country || 'India',
        capacity_max: v.capacity_max || 0,
        cost_per_plate_veg: v.cost_per_plate_veg || 0,
        cost_per_plate_nonveg: v.cost_per_plate_nonveg || 0,
        venue_type: v.venue_type || [],
        amenities: v.amenities || [],
        images: (v.images || []).slice(0, 5),
        rating: v.rating || 0,
        reviews_count: v.reviews_count || 0,
        source: v.source,
        source_url: v.source_url || ''
    };
}

const combined = [...vmnk.map(normalizeForOutput), ...mandap.map(normalizeForOutput)];

// De-duplicate by source_url (most reliable unique key)
const seen = new Map();
const deduped = [];
for (const v of combined) {
    const key = v.source_url || `${v.source}|${v.venue_name}|${v.city}`;
    if (!seen.has(key)) {
        seen.set(key, true);
        deduped.push(v);
    }
}

console.log(`After dedup by source_url: ${deduped.length}`);

// Write combined JSON
fs.writeFileSync('learning/output/venues-combined.json', JSON.stringify(deduped, null, 2));
console.log(`\nWritten: learning/output/venues-combined.json (${(fs.statSync('learning/output/venues-combined.json').size / 1024 / 1024).toFixed(1)} MB)`);

// Generate SQL
const esc = s => (s || '').replace(/'/g, "''");

let sql = `-- Combined Venue Data Export
-- Generated: ${new Date().toISOString()}
-- Sources: VenueMonk, Mandap
-- Total Venues: ${deduped.length}

TRUNCATE venue_amenities;
TRUNCATE venue_images;
TRUNCATE amenities;
TRUNCATE venues;

INSERT INTO venues (venue_name, slug, description, address, pin_code, city, state, country, capacity_min, capacity_max, cost_per_day, cost_per_plate, rating, reviews_count, source, source_url) VALUES\n`;

const batchSize = 500;
const amenityMap = new Map();
let aid = 1;

// First pass: collect all amenities
for (const v of deduped) {
    for (const a of (v.amenities || [])) {
        if (a && !amenityMap.has(a)) {
            amenityMap.set(a, aid++);
        }
    }
}

// Write venues in batches
for (let i = 0; i < deduped.length; i += batchSize) {
    const batch = deduped.slice(i, i + batchSize);
    const rows = batch.map(v => {
        const cost = v.cost_per_plate_veg || v.cost_per_plate_nonveg || 0;
        return `('${esc(v.venue_name)}', '${esc(v.slug)}', '${esc(v.description)}', '${esc(v.address)}', '${esc(v.pin_code)}', '${esc(v.city)}', '${esc(v.state)}', '${esc(v.country)}', ${v.capacity_min || 0}, ${v.capacity_max || 0}, ${v.cost_per_day || 0}, ${cost}, ${v.rating || 0}, ${v.reviews_count || 0}, '${esc(v.source)}', '${esc(v.source_url)}')`;
    });

    if (i === 0) {
        sql += rows.join(',\n') + ';\n\n';
    } else {
        sql += `INSERT INTO venues (venue_name, slug, description, address, pin_code, city, state, country, capacity_min, capacity_max, cost_per_day, cost_per_plate, rating, reviews_count, source, source_url) VALUES\n`;
        sql += rows.join(',\n') + ';\n\n';
    }
}

// Amenities
sql += '-- Amenities\nINSERT INTO amenities (id, amenity_name) VALUES\n';
sql += Array.from(amenityMap.entries()).map(([name, id]) => `(${id}, '${esc(name)}')`).join(',\n');
sql += ';\n\n';

// Venue images
sql += '-- Venue Images\n';
let imgCount = 0;
for (const v of deduped) {
    const slug = esc(v.slug);
    if (v.images && v.images.length > 0) {
        for (const img of v.images.slice(0, 3)) {
            sql += `INSERT INTO venue_images (venue_id, image_url) SELECT id, '${esc(img)}' FROM venues WHERE slug = '${slug}' LIMIT 1;\n`;
            imgCount++;
        }
    }
}
console.log(`Image records: ${imgCount}`);

// Venue amenities
sql += '\n-- Venue Amenities\n';
let amCount = 0;
for (const v of deduped) {
    const slug = esc(v.slug);
    if (v.amenities && v.amenities.length > 0) {
        for (const a of v.amenities) {
            const amId = amenityMap.get(a);
            if (amId) {
                sql += `INSERT INTO venue_amenities (venue_id, amenity_id) SELECT id, ${amId} FROM venues WHERE slug = '${slug}' LIMIT 1;\n`;
                amCount++;
            }
        }
    }
}
console.log(`Venue-amenity records: ${amCount}`);

fs.writeFileSync('learning/database/venues-combined.sql', sql);
console.log(`\nSQL file: ${(sql.length / 1024 / 1024).toFixed(1)} MB`);
console.log('Written: learning/database/venues-combined.sql');

// Summary
const cityCounts = {};
deduped.forEach(v => {
    const c = v.city || 'unknown';
    cityCounts[c] = (cityCounts[c] || 0) + 1;
});
const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 20);
console.log('\n=== Top 20 Cities ===');
for (const [city, count] of sortedCities) {
    console.log(`  ${city}: ${count}`);
}

const sourceCounts = {};
deduped.forEach(v => {
    sourceCounts[v.source] = (sourceCounts[v.source] || 0) + 1;
});
console.log('\n=== By Source ===');
for (const [src, count] of Object.entries(sourceCounts)) {
    console.log(`  ${src}: ${count}`);
}

const withImages = deduped.filter(v => v.images && v.images.length > 0).length;
const withPricing = deduped.filter(v => v.cost_per_plate_veg > 0 || v.cost_per_plate_nonveg > 0).length;
const withCapacity = deduped.filter(v => v.capacity_max > 0).length;
console.log('\n=== Data Quality ===');
console.log(`  With images:  ${withImages} (${(withImages/deduped.length*100).toFixed(1)}%)`);
console.log(`  With pricing: ${withPricing} (${(withPricing/deduped.length*100).toFixed(1)}%)`);
console.log(`  With capacity: ${withCapacity} (${(withCapacity/deduped.length*100).toFixed(1)}%)`);
