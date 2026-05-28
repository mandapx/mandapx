const { chromium } = require('playwright');
const fs = require('fs');

(async () => {

    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(
        'https://www.weddingbazaar.com/wedding-venues/ahmedabad',
        {
            waitUntil: 'networkidle'
        }
    );

    const venues = await page.$$eval(
        '.vendor-card',
        cards => {
            return cards.map(card => {

                return {
                    venue_name:
                        card.querySelector('h2')?.innerText || '',

                    address:
                        card.querySelector('.address')?.innerText || '',

                    price:
                        card.querySelector('.price')?.innerText || '',

                    capacity:
                        card.querySelector('.capacity')?.innerText || ''
                };
            });
        }
    );

    fs.writeFileSync(
        'venues.json',
        JSON.stringify(venues, null, 2)
    );

    console.log(venues);

    await browser.close();

})();
