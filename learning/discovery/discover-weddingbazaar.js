const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    const endpoints = new Set();

    page.on('response', async (response) => {
        const url = response.url();
        if (
            (url.includes('api') || url.includes('graphql') || url.includes('json') || url.includes('algolia')) &&
            !url.includes('google') && !url.includes('facebook') && !url.includes('analytics') &&
            !url.includes('doubleclick')
        ) {
            endpoints.add(url);
        }
    });

    console.log('Opening WeddingBazaar...');
    await page.goto('https://www.weddingbazaar.com/wedding-venues/ahmedabad', {
        waitUntil: 'networkidle',
        timeout: 60000
    });
    console.log('Page loaded. Title:', await page.title());

    // Scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(5000);

    console.log(`\nDiscovered ${endpoints.size} endpoints:`);
    for (const ep of endpoints) {
        console.log(`  ${ep}`);
    }

    fs.writeFileSync(
        'learning/discovery/weddingbazaar-endpoints.json',
        JSON.stringify([...endpoints], null, 2)
    );

    console.log('\nPress Enter to close browser...');
    await page.waitForTimeout(30000);
    await browser.close();
})();
