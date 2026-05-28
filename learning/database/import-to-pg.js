const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'output', 'venues-combined.json');
const outputFile = path.join(__dirname, 'venues-import.sql');
const batchSize = 500;

function escape(val) {
  if (val === null || val === undefined || val === '') return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function toPgArray(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return 'NULL';
  const items = arr.map(v => `"${String(v).replace(/"/g, '\\"')}"`);
  return `ARRAY[${items.join(', ')}]`;
}

const venues = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
console.log(`Loaded ${venues.length} venues`);

let sql = `-- MandapX Venue Import Script
-- Generated from venues-combined.json
-- Total venues: ${venues.length}

BEGIN;

`;

let count = 0;
let batchCount = 0;

for (let i = 0; i < venues.length; i += batchSize) {
  const batch = venues.slice(i, i + batchSize);
  const values = batch.map(v => {
    count++;
    return `(
      ${escape(v.venue_name)},
      ${escape(v.slug)},
      ${escape(v.description)},
      ${escape(v.address)},
      ${escape(v.pin_code)},
      ${escape(v.city ? v.city.toLowerCase() : '')},
      ${escape(v.state)},
      ${escape(v.country || 'India')},
      ${v.capacity_max != null && v.capacity_max !== '' ? v.capacity_max : 'NULL'},
      ${v.cost_per_plate_veg != null && v.cost_per_plate_veg !== '' ? v.cost_per_plate_veg : 'NULL'},
      ${v.cost_per_plate_nonveg != null && v.cost_per_plate_nonveg !== '' ? v.cost_per_plate_nonveg : 'NULL'},
      ${toPgArray(v.venue_type)},
      ${toPgArray(v.amenities)},
      ${toPgArray(v.images)},
      ${v.rating != null && v.rating !== '' ? v.rating : 'NULL'},
      ${v.reviews_count != null && v.reviews_count !== '' ? v.reviews_count : 'NULL'},
      ${escape(v.source)},
      ${escape(v.source_url)}
    )`;
  });

  sql += `INSERT INTO venues (venue_name, slug, description, address, pin_code, city, state, country, capacity_max, cost_per_plate_veg, cost_per_plate_nonveg, venue_type, amenities, images, rating, reviews_count, source, source_url) VALUES\n${values.join(',\n')};\n\n`;
  batchCount++;
  console.log(`Processed batch ${batchCount}: ${i + batch.length}/${venues.length}`);
}

sql += `COMMIT;\n`;
fs.writeFileSync(outputFile, sql, 'utf8');
console.log(`\nDone! Written ${count} venues to ${outputFile}`);

const fileSize = fs.statSync(outputFile).size;
console.log(`File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
