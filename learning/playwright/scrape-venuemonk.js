const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.venuemonk.com';
const API_URL = 'https://prod-api.vmnk.in';
const CDN_URL = 'https://cdn.venuemonk.com';

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Origin': BASE_URL,
    'Referer': BASE_URL
};

async function getCities() {
    const { data } = await axios.get(`${API_URL}/core-service/v1/cities/citylist`, { headers: HEADERS });
    return data.data.cities.map(c => c.name.toLowerCase().replace(/\s+/g, '-'));
}

async function getVenuesByCity(city, page = 1) {
    const url = `${BASE_URL}/api/search/venues/${city}/wedding-venues/list?page=${page}`;
    const { data } = await axios.get(url, { headers: HEADERS });
    return data.data;
}

function normalizeVenue(raw, city) {
    const images = [
        ...(raw.images || []).map(i => `https://cdn.venuemonk.com${i}`),
        ...(raw.new_primary_images || []).map(i => `https://cdn.venuemonk.com${i}`)
    ];

    return {
        venue_name: raw.name || '',
        slug: raw.vm_id || '',
        description: raw.description || raw.approachDesc || '',
        address: raw.address || '',
        pin_code: '',
        city: city,
        state: '',
        country: 'India',
        latitude: '',
        longitude: '',
        capacity_min: 0,
        capacity_max: raw.cap_max || 0,
        cost_per_day: 0,
        cost_per_plate_veg: raw.veg_show || 0,
        cost_per_plate_nonveg: raw.nonveg_show || 0,
        venue_type: raw.propertyType || [],
        amenities: raw.amenities || [],
        policies: [],
        images: [...new Set(images)],
        videos: [],
        rating: raw.vmrating || raw.oldrating || 0,
        reviews_count: raw.reviewCount || 0,
        source: 'VenueMonk',
        source_url: `https://www.venuemonk.com/${city}/${raw.vm_id}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

(async () => {
    console.log('Fetching cities...');
    const cities = await getCities();
    console.log(`Found ${cities.length} cities: ${cities.slice(0, 10).join(', ')}...`);

    const allVenues = [];

    for (const city of cities) {
        let page = 1;
        let total = 0;

        console.log(`\n--- ${city} ---`);

        while (true) {
            try {
                const data = await getVenuesByCity(city, page);
                total = data.searchlink.count || 0;

                if (!data.venues || data.venues.length === 0) break;

                for (const raw of data.venues) {
                    const normalized = normalizeVenue(raw, city);
                    if (normalized.venue_name) {
                        allVenues.push(normalized);
                    }
                }

                console.log(`  Page ${page}: ${data.venues.length} venues (total: ${total})`);

                if (data.venues.length < 30) break;
                page++;

                // Be polite
                await new Promise(r => setTimeout(r, 500));
            } catch (err) {
                console.log(`  Error on page ${page}: ${err.message}`);
                break;
            }
        }
    }

    console.log(`\nTotal venues scraped: ${allVenues.length}`);

    const outputPath = 'learning/output/venues-venuemonk.json';
    fs.writeFileSync(outputPath, JSON.stringify(allVenues, null, 2));
    console.log(`Saved to ${outputPath}`);

    // Summary stats
    const citiesCount = {};
    allVenues.forEach(v => {
        citiesCount[v.city] = (citiesCount[v.city] || 0) + 1;
    });
    console.log('\nVenues per city:');
    for (const [c, count] of Object.entries(citiesCount).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${c}: ${count}`);
    }
})();
