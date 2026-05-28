const fs = require('fs');
const path = require('path');

// Usage: DATABASE_URL=postgres://user:pass@host/db node learning/database/import-direct.js
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.log('DATABASE_URL environment variable required');
  console.log('Usage: DATABASE_URL=postgres://user:pass@host/db node learning/database/import-direct.js');
  process.exit(1);
}

async function main() {
  const { Client } = require('pg');
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log('Connected to database');
  console.log('Running schema...');

  const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema-pg.sql'), 'utf8');
  await client.query(schemaSQL);
  console.log('Schema created');

  const venues = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'output', 'venues-combined.json'), 'utf8')
  );
  console.log(`Loaded ${venues.length} venues`);

  // Check if already imported
  const { rows: countResult } = await client.query('SELECT COUNT(*) as count FROM venues');
  if (parseInt(countResult[0].count) > 0) {
    console.log(`Database already has ${countResult[0].count} venues. Skipping import.`);
    await client.end();
    return;
  }

  let inserted = 0;
  const batchSize = 500;

  for (let i = 0; i < venues.length; i += batchSize) {
    const batch = venues.slice(i, i + batchSize);

    const values = batch.map(v => {
      const venueName = v.venue_name ? v.venue_name.replace(/'/g, "''") : 'Unknown';
      const slug = v.slug || v.venue_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `venue-${Math.random().toString(36).slice(2)}`;
      const desc = v.description ? v.description.replace(/'/g, "''") : null;
      const address = v.address ? v.address.replace(/'/g, "''") : null;
      const city = v.city ? v.city.toLowerCase() : '';
      const country = v.country || 'India';

      const capacity = v.capacity_max != null && v.capacity_max !== '' ? v.capacity_max : null;
      const vegPrice = v.cost_per_plate_veg != null && v.cost_per_plate_veg !== '' ? v.cost_per_plate_veg : null;
      const nonvegPrice = v.cost_per_plate_nonveg != null && v.cost_per_plate_nonveg !== '' ? v.cost_per_plate_nonveg : null;

      const venueType = v.venue_type && Array.isArray(v.venue_type) && v.venue_type.length > 0
        ? `ARRAY[${v.venue_type.map(t => `"${t.replace(/"/g, '\\"')}"`).join(',')}]`
        : 'NULL';
      const amenities = v.amenities && Array.isArray(v.amenities) && v.amenities.length > 0
        ? `ARRAY[${v.amenities.map(a => `"${a.replace(/"/g, '\\"')}"`).join(',')}]`
        : 'NULL';
      const images = v.images && Array.isArray(v.images) && v.images.length > 0
        ? `ARRAY[${v.images.map(img => `"${img.replace(/"/g, '\\"')}"`).join(',')}]`
        : 'NULL';

      const rating = v.rating != null && v.rating !== '' ? v.rating : null;
      const reviews = v.reviews_count != null && v.reviews_count !== '' ? v.reviews_count : null;
      const source = v.source ? v.source.replace(/'/g, "''") : null;
      const sourceUrl = v.source_url ? v.source_url.replace(/'/g, "''") : null;

      return `(${[
        `'${venueName}'`, `'${slug}'`, desc ? `'${desc}'` : 'NULL',
        address ? `'${address}'` : 'NULL', 'NULL',
        `'${city}'`, 'NULL', `'${country}'`,
        capacity, vegPrice, nonvegPrice,
        venueType, amenities, images,
        rating, reviews,
        source ? `'${source}'` : 'NULL', sourceUrl ? `'${sourceUrl}'` : 'NULL'
      ].join(',')})`;
    });

    const sql = `INSERT INTO venues (venue_name, slug, description, address, pin_code, city, state, country, capacity_max, cost_per_plate_veg, cost_per_plate_nonveg, venue_type, amenities, images, rating, reviews_count, source, source_url) VALUES\n${values.join(',\n')}\nON CONFLICT (source_url) DO NOTHING;`;

    try {
      await client.query(sql);
      inserted += batch.length;
      const pct = ((i + batch.length) / venues.length * 100).toFixed(1);
      console.log(`Inserted ${i + batch.length}/${venues.length} (${pct}%)`);
    } catch (err) {
      console.error(`Batch failed at ${i}:`, err.message);
    }
  }

  console.log(`\nImport complete: ${inserted} venues inserted`);
  await client.end();
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
