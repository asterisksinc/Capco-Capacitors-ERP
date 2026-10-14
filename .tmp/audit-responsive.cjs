const fs = require('fs');
const { chromium } = require('C:/Users/Admin/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');
const slugs = [...fs.readFileSync('lib/publicProducts.ts', 'utf8').matchAll(/slug: "([^"]+)"/g)].map(m => m[1]);
const routes = ['/', '/about', '/products', ...slugs.map(s => '/products/' + s), '/solutions/oem', '/solutions/dealership', '/contact', '/privacy-policy', '/terms-and-conditions', '/cookie-policy', '/login'];
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/Admin/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  const results = [];
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const route of routes) {
    const widths = route.startsWith('/products/') && route !== '/products/zinc-aluminium-alloy-metalised-bopp-film' ? [320, 390] : [320, 390, 768, 1024];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle' });
      const result = await page.evaluate(() => {
        const viewport = innerWidth;
        const issues = [];
        const elements = document.querySelectorAll('h1,h2,h3,h4,p,a,button,label,input,select,textarea,summary,td,th');
        for (const el of elements) {
          const box = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          if (!box.width || !box.height || style.visibility === 'hidden' || style.display === 'none') continue;
          let ancestor = el.parentElement;
          let scroller = false;
          while (ancestor && ancestor !== document.body) {
            const s = getComputedStyle(ancestor);
            if (['auto', 'scroll'].includes(s.overflowX) && ancestor.scrollWidth > ancestor.clientWidth + 1) { scroller = true; break; }
            if (s.visibility === 'hidden' || s.display === 'none') { scroller = true; break; }
            ancestor = ancestor.parentElement;
          }
          if (scroller) continue;
          if (box.right > viewport + 2 || box.left < -2 || el.scrollWidth > el.clientWidth + 3 && style.overflowX === 'visible') {
            issues.push({ tag: el.tagName, text: (el.innerText || el.getAttribute('placeholder') || el.getAttribute('aria-label') || '').slice(0, 75), class: el.className, x: Math.round(box.x), width: Math.round(box.width), scrollWidth: el.scrollWidth });
          }
        }
        return { overflow: document.documentElement.scrollWidth > viewport, issues: issues.slice(0, 25) };
      });
      results.push({ route, width, ...result });
      if (result.issues.length || result.overflow) console.log(JSON.stringify({ route, width, ...result }));
      if (width === 390 && !route.startsWith('/products/')) await page.screenshot({ path: '.tmp/mobile-' + (route.replaceAll('/', '-') || 'home') + '.png' });
    }
  }
  fs.writeFileSync('.tmp/responsive-audit.json', JSON.stringify(results, null, 2));
  console.log('AUDIT COMPLETE', results.length, 'viewports;', results.filter(r => r.issues.length || r.overflow).length, 'with findings');
  await browser.close();
})();
