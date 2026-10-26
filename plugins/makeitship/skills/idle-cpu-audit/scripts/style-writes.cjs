// What the page keeps writing to the DOM while nobody touches it: attribute and text mutations
// per element over a few seconds of rest. Catches JS animations that write inline styles every
// frame (Webflow IX2, GSAP, Lottie SVG, counters, typewriters) and names the element.
//
//   node style-writes.cjs <url> [--seconds 3] [--settle 6000] [--width 1440] [--scroll <y>]
const { args, launch, open } = require('./_lib.cjs');
const a = args(process.argv.slice(2));
const url = a._[0];
if (!url) { console.error('usage: node style-writes.cjs <url>'); process.exit(1); }

(async () => {
  const { browser, page } = await launch({ width: a.width });
  await open(page, url);
  await page.mouse.move(-10, -10).catch(() => {});
  if (a.scroll) await page.evaluate((y) => window.scrollTo(0, y), Number(a.scroll));
  await page.waitForTimeout(Number(a.settle || 6000));
  const out = await page.evaluate((ms) => new Promise((resolve) => {
    const counts = new Map();
    const desc = (el) => { const r = el.getBoundingClientRect(); return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].slice(0, 3).join('.')} y=${Math.round(r.top + scrollY)}${r.bottom < 0 || r.top > innerHeight ? ' (off screen)' : ''}`; };
    const mo = new MutationObserver((list) => list.forEach((m) => {
      const t = m.target.nodeType === 1 ? m.target : m.target.parentElement; if (!t) return;
      const host = t.closest('svg') && t.closest('svg').parentElement ? t.closest('svg').parentElement : t;
      const k = desc(host) + ' :: ' + (m.attributeName || m.type);
      counts.set(k, (counts.get(k) || 0) + 1);
    }));
    mo.observe(document.documentElement, { attributes: true, subtree: true, characterData: true, childList: true });
    setTimeout(() => { mo.disconnect(); resolve([...counts].sort((x, y) => y[1] - x[1]).slice(0, 30).map(([k, n]) => `${(n / (ms / 1000)).toFixed(1)}/s  ${k}`)); }, ms);
  }), Number(a.seconds || 3) * 1000);
  console.log(out.length ? out.join('\n') : 'no DOM writes at rest');
  await browser.close();
})();
