const { chromium } = require('playwright');
const fs = require('fs');

const TARGETS = [
    'https://www.weddingbazaar.com/wedding-venues',
    'https://www.weddingbazaar.com/wedding-venues/ahmedabad',
    'https://www.weddingbazaar.com/wedding-venues/delhi',
    'https://www.mandap.com/ahmedabad/wedding-venues',
    'https://www.mandap.com/delhi/wedding-venues',
    'https://www.wedmegood.com/wedding-venues/ahmedabad',
    'https://www.venuemonk.com/ahmedabad/wedding-venues'
];

const discovered = [];

async function discoverEndpoints(url) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const endpoints = new Set();

    page.on('response', async (response) => {
        const u = response.url();
        if (
            (u.includes('api') || u.includes('graphql') || u.includes('json') || u.includes('algolia')) &&
            !u.includes('google') && !u.includes('facebook') && !u.includes('analytics')
        ) {
            endpoints.add(u);
        }
    });

    try {
        console.log(`\n--- Visiting: ${url} ---`);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(5000);

        // Try scrolling to trigger lazy-loaded API calls
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(3000);

        console.log(`Discovered ${endpoints.size} endpoints:`);
        for (const ep of endpoints) {
            console.log(`  ${ep}`);
            discovered.push({ url, endpoint: ep });
        }
    } catch (err) {
        console.log(`  Error: ${err.message}`);
    }

    await browser.close();
}

(async () => {
    for (const target of TARGETS) {
        await discoverEndpoints(target);
    }

    fs.writeFileSync('learning/discovery/discovered-endpoints.json', JSON.stringify(discovered, null, 2));
    console.log(`\nTotal discovered endpoints: ${discovered.length}`);
    console.log('Saved to learning/discovery/discovered-endpoints.json');
})();
