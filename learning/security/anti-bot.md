# Anti-Bot Handling

## Detection Methods Used By Sites

| Protection              | Used |
|------------------------|------|
| Cloudflare             | Likely |
| Rate limits            | Yes  |
| Headless detection     | Yes  |
| Browser fingerprinting | Yes  |

## Recommended Solution

### Use stealth

Install:

```bash
npm install playwright-extra
npm install puppeteer-extra-plugin-stealth
```

Stealth Setup:

```js
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();

chromium.use(stealth);
```

### Use rotating proxies

Providers:
- BrightData
- SmartProxy
- Oxylabs

### Randomize behavior

```js
await page.mouse.move(
    Math.random() * 500,
    Math.random() * 500
);
```

### Human delays

```js
await page.waitForTimeout(
    2000 + Math.random() * 3000
);
```
