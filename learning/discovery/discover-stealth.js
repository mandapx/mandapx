const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');

chromium.use(stealth);

const TARGETS = [
    { name: 'WeddingBazaar', url: 'https://www.weddingbazaar.com/wedding-venues/ahmedabad' },
    { name: 'Mandap', url: 'https://www.mandap.com/ahmedabad/wedding-venues' },
    { name: 'WedMeGood', url: 'https://www.wedmegood.com/wedding-venues/ahmedabad' }
];

const discovered = [];

function getEndpointType(url) {
    try {
        const u = new URL(url);
        if (u.pathname.includes('/api/')) return 'REST API';
        if (u.pathname.includes('graphql')) return 'GraphQL';
        if (u.pathname.includes('algolia') || u.hostname.includes('algolia')) return 'Algolia';
        if (u.pathname.includes('/_next/data/')) return 'Next.js JSON';
        if (url.includes('.json')) return 'JSON';
        return 'Other';
    } catch { return 'Unknown'; }
}

(async () => {
    for (const target of TARGETS) {
        console.log(`\n=== ${target.name} ===`);
        console.log(`URL: ${target.url}`);

        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        });

        await page.setViewportSize({ width: 1920, height: 1080 });

        const endpoints = new Map();

        page.on('response', async (response) => {
            const url = response.url();
            const type = getEndpointType(url);

            if (
                (url.includes('api') || url.includes('graphql') || url.includes('json') || url.includes('algolia')) &&
                !url.includes('google') && !url.includes('facebook') && !url.includes('analytics') &&
                !url.includes('doubleclick') && !url.includes('gstatic')
            ) {
                if (!endpoints.has(url)) {
                    endpoints.set(url, type);
                }
            }
        });

        try {
            await page.goto(target.url, { waitUntil: 'networkidle', timeout: 45000 });
            await page.waitForTimeout(5000);

            // Scroll to trigger lazy loads
            await page.evaluate(async () => {
                for (let i = 0; i < 3; i++) {
                    window.scrollTo(0, document.body.scrollHeight);
                    await new Promise(r => setTimeout(r, 2000));
                }
            });

            await page.waitForTimeout(3000);

            if (endpoints.size === 0) {
                console.log('  No API endpoints found.');
                // Try to get page content for debugging
                const title = await page.title();
                console.log(`  Page title: ${title}`);
                const content = await page.content();
                console.log(`  Page size: ${content.length} chars`);
                if (content.includes('cloudflare') || content.includes('Cloudflare')) {
                    console.log('  ⚠ Blocked by Cloudflare');
                }
            } else {
                console.log(`  Found ${endpoints.size} endpoint(s):`);
                for (const [url, type] of endpoints) {
                    console.log(`  [${type}] ${url}`);
                    discovered.push({ source: target.name, url: target.url, endpoint: url, type });
                }
            }
        } catch (err) {
            console.log(`  Error: ${err.message}`);
        }

        await browser.close();
    }

    fs.writeFileSync('learning/discovery/stealth-endpoints.json', JSON.stringify(discovered, null, 2));
    console.log(`\nTotal discovered endpoints: ${discovered.length}`);
    console.log('Saved to learning/discovery/stealth-endpoints.json');
})();
