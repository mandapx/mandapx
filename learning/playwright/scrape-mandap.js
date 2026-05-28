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

async function getVenuesByCity(cityId, cityName, page = 1) {
    const url = `${API_BASE}/vendors?status=1&page=${page}&limit=24&city_id=${cityId}&category_id=1`;
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 10000 });
    return data.data || [];
}

function normalizeVenue(raw, cityName) {
    const attrs = raw.attributes || {};
    const capMax = parseInt(attrs.hall_capacity) || 0;
    const capMin = parseInt(attrs.hall_capacity_min) || 0;
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
        capacity_min: capMin,
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
    console.log('Fetching cities...');
    const allCities = await getCities();
    console.log(`Total cities available: ${allCities.length}`);

    // Filter: only Indian cities (skip international) and venues category
    const indianCities = allCities.filter(c => {
        const international = ['algiers', 'bridgetown', 'buenos aires', 'california', 'chicago',
            'doha', 'gliwice', 'juuka', 'ligatne', 'new-york', 'california', 'dubai', 'singapore', 'sri lanka'];
        const name = c.city.toLowerCase();
        return !international.some(i => name.includes(i));
    });
    console.log(`Indian cities: ${indianCities.length}`);

    const allVenues = [];
    let processedCities = 0;

    for (const city of indianCities) {
        let page = 1;
        let venuesOnPage = [];
        let cityVenues = 0;

        while (true) {
            try {
                venuesOnPage = await getVenuesByCity(city.id, city.city, page);
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

        processedCities++;
        if (cityVenues > 0) {
            console.log(`${city.city}: ${cityVenues} venues (${processedCities}/${indianCities.length})`);
        }

        // Save checkpoint every 50 cities
        if (processedCities % 50 === 0) {
            fs.writeFileSync(CHECKPOINT, JSON.stringify({ processed: processedCities, count: allVenues.length, cities: `${city.city}` }));
            fs.writeFileSync(OUTPUT, JSON.stringify(allVenues, null, 2));
            console.log(`  Checkpoint saved: ${allVenues.length} venues`);
        }
    }

    fs.writeFileSync(OUTPUT, JSON.stringify(allVenues, null, 2));
    console.log(`\nFinal - Total venues: ${allVenues.length}`);

    const cityCounts = {};
    allVenues.forEach(v => { cityCounts[v.city] = (cityCounts[v.city] || 0) + 1; });
    const sorted = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 20);
    console.log('Top 20 cities:');
    for (const [c, count] of sorted) {
        console.log(`  ${c}: ${count}`);
    }
})();
