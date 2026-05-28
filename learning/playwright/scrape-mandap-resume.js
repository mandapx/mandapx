const axios = require('axios');
const fs = require('fs');

const API_BASE = 'https://mandap-api.mandap.com/api/v1';
const OUTPUT = 'learning/output/venues-mandap.json';
const CHECKPOINT = 'learning/output/venues-mandap-checkpoint.json';

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Origin': 'https://www.mandap.com',
    'Referer': 'https://www.mandap.com/'
};

async function getCities() {
    const { data } = await axios.get(`${API_BASE}/locations/cities`, { headers: HEADERS, timeout: 10000 });
    return data.data;
}

async function getVenuesByCity(cityId, page = 1) {
    const url = `${API_BASE}/vendors?status=1&page=${page}&limit=24&city_id=${cityId}&category_id=1`;
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 10000 });
    return data.data || [];
}

function normalizeVenue(raw, cityName) {
    const attrs = raw.attributes || {};
    const capMax = parseInt(attrs.hall_capacity) || 0;
    const costPerPlate = raw.pricingMin || raw.pricingMax || 0;
    const amenities = [];
    if (attrs.other_facilities) {
        amenities.push(...attrs.other_facilities.split(',').map(s => s.trim()).filter(Boolean));
    }
    if (attrs.valet_parking === 'Yes') amenities.push('Valet Parking');
    if (attrs.is_room_available === 'Yes' || parseInt(attrs.room_count) > 0) amenities.push('Rooms Available');
    const images = [];
    if (raw.profilePicUrl) {
        const img = raw.profilePicUrl.startsWith('//') ? 'https:' + raw.profilePicUrl : raw.profilePicUrl;
        images.push(img);
    }
    const venueTypes = [];
    if (attrs.property_type) {
        venueTypes.push(...attrs.property_type.split(',').map(s => s.trim()).filter(Boolean));
    }
    const policies = [];
    if (attrs.decoration) policies.push(`Decoration: ${attrs.decoration}`);
    if (attrs.dj) policies.push(`DJ: ${attrs.dj}`);
    if (attrs.food) policies.push(`Food: ${attrs.food}`);
    if (attrs.alcohol_policy) policies.push(`Alcohol: ${attrs.alcohol_policy}`);
    if (attrs.allowed_cuisine) policies.push(`Cuisine: ${attrs.allowed_cuisine}`);
    return {
        venue_name: raw.name || '',
        slug: raw.slug || '',
        description: '',
        address: raw.address || '',
        pin_code: raw.pincode || '',
        city: (raw.cityName || cityName || '').toLowerCase(),
        state: '',
        country: 'India',
        latitude: '',
        longitude: '',
        capacity_min: 0,
        capacity_max: capMax,
        cost_per_day: 0,
        cost_per_plate_veg: costPerPlate,
        cost_per_plate_nonveg: 0,
        venue_type: venueTypes,
        amenities: amenities,
        policies: policies,
        images: images,
        videos: [],
        rating: raw.ratingAvg || 0,
        reviews_count: raw.ratingCount || 0,
        source: 'Mandap',
        source_url: `https://www.mandap.com/${raw.citySlug || cityName}/wedding-venues/${raw.slug}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
}

(async () => {
    // Load existing data
    const existing = JSON.parse(fs.readFileSync(OUTPUT, 'utf8'));
    const existingCities = new Set(existing.map(v => v.city));
    console.log(`Loaded ${existing.length} existing venues from ${existingCities.size} cities`);

    const allCities = await getCities();
    const international = ['algiers', 'bridgetown', 'buenos aires', 'california', 'chicago',
        'doha', 'gliwice', 'juuka', 'ligatne', 'new-york', 'dubai', 'singapore', 'sri lanka'];
    const indianCities = allCities.filter(c => {
        const name = c.city.toLowerCase();
        return !international.some(i => name.includes(i));
    });

    const remaining = indianCities.filter(c => !existingCities.has(c.city.toLowerCase()));
    console.log(`Remaining cities to scrape: ${remaining.length}`);

    const allVenues = [...existing];
    let processed = 0;

    for (const city of remaining) {
        let page = 1;
        let cityVenues = 0;

        while (true) {
            try {
                const venuesOnPage = await getVenuesByCity(city.id, page);
                if (!venuesOnPage || venuesOnPage.length === 0) break;

                for (const raw of venuesOnPage) {
                    const normalized = normalizeVenue(raw, city.city);
                    if (normalized.venue_name) {
                        allVenues.push(normalized);
                        cityVenues++;
                    }
                }

                if (venuesOnPage.length < 24) break;
                page++;
                await new Promise(r => setTimeout(r, 200));
            } catch (err) {
                break;
            }
        }

        processed++;
        console.log(`${city.city}: ${cityVenues} venues (${processed}/${remaining.length})`);

        // Save every 10 cities
        if (processed % 10 === 0) {
            fs.writeFileSync(OUTPUT, JSON.stringify(allVenues, null, 2));
            console.log(`  Saved: ${allVenues.length} total venues`);
        }
    }

    fs.writeFileSync(OUTPUT, JSON.stringify(allVenues, null, 2));
    console.log(`\nFinal: ${allVenues.length} venues from Mandap`);
})();
