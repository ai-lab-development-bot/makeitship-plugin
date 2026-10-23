// Shared helpers for the idle-CPU scripts: find Playwright, launch a headed Chrome off screen,
// instrument requestAnimationFrame and timers by source file, read main-thread busy time.
const fs = require('fs');
const path = require('path');
const os = require('os');

function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_CORE, 'playwright-core', 'playwright'].filter(Boolean);
  for (const t of tries) { try { return require(t); } catch (e) { /* next */ } }
  // Fallback: a playwright-core left in the npx cache by an earlier `npx playwright ...`.
  const cache = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), '.npm'), 'npm-cache', '_npx');
  const alt = path.join(os.homedir(), '.npm', '_npx');
  for (const dir of [cache, alt]) {
    if (!fs.existsSync(dir)) continue;
    for (const d of fs.readdirSync(dir)) {
      const p = path.join(dir, d, 'node_modules', 'playwright-core');
      if (fs.existsSync(p)) { try { return require(p); } catch (e) { /* next */ } }
    }
  }
  console.error('playwright-core not found. Run `npm install` once in ' + __dirname + ' (or set PLAYWRIGHT_CORE to an existing playwright-core folder).');
  process.exit(2);
}

function args(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2); const n = argv[i + 1];
      if (n === undefined || n.startsWith('--')) out[k] = true; else { out[k] = n; i++; }
    } else out._.push(a);
  }
  return out;
}

// Headed, off screen to the right: headless Chrome reports wrong frame rates and CPU.
// IDLE_CPU_WINDOW_POS moves the window (default "4000,0"); use a larger x if it still shows up on
// a wide multi-monitor desk. Uses the installed Google Chrome; without it, Playwright's own
// Chromium (`npx playwright-core install chromium` once).
async function launch(opts = {}) {
  const { chromium } = loadPlaywright();
  const pos = process.env.IDLE_CPU_WINDOW_POS || '4000,0';
  const launchArgs = ['--window-position=' + pos, '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding', '--disable-background-timer-throttling',
    '--autoplay-policy=no-user-gesture-required'];
  let browser;
  try { browser = await chromium.launch({ channel: 'chrome', headless: false, args: launchArgs }); }
  catch (e) {
    try { browser = await chromium.launch({ headless: false, args: launchArgs }); }
    catch (e2) { console.error('No browser: install Google Chrome, or run `npx playwright-core install chromium` once.'); process.exit(2); }
  }
  const context = await browser.newContext({ viewport: { width: Number(opts.width || 1440), height: Number(opts.height || 813) } });
  if (opts.block) await context.route(new RegExp(opts.block), (r) => r.abort());
  const page = await context.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(instrument);
  if (opts.css) await page.addInitScript((c) => document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = c; document.head.appendChild(s); }), opts.css);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');
  return { browser, context, page, cdp, errors };
}

// Runs in the page before any of its scripts. Counts rAF calls, setInterval ticks and
// re-armed setTimeouts per calling file (top three frames of the stack).
function instrument() {
  const src = () => {
    const files = new Error().stack.split('\n').slice(3)
      .map((l) => (l.match(/https?:\/\/[^/\s]+\/([^?#)\s:]+)/) || [])[1]).filter(Boolean);
    return files.length ? [...new Set(files.slice(0, 3))].join(' < ') : 'inline/unknown';
  };
  const bump = (bag, k) => { bag[k] = (bag[k] || 0) + 1; };
  window.__idle = { raf: {}, interval: {}, timeout: {} };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => { bump(window.__idle.raf, src()); return raf(cb); };
  const si = window.setInterval.bind(window);
  window.setInterval = (fn, ms, ...rest) => {
    const k = src() + ' @' + (ms || 0) + 'ms';
    return si(function () { bump(window.__idle.interval, k); return typeof fn === 'function' ? fn.apply(this, arguments) : undefined; }, ms, ...rest);
  };
  const st = window.setTimeout.bind(window);
  window.setTimeout = (fn, ms, ...rest) => {
    const k = src();
    return st(function () { bump(window.__idle.timeout, k); return typeof fn === 'function' ? fn.apply(this, arguments) : undefined; }, ms, ...rest);
  };
}

async function busy(cdp) {
  const { metrics } = await cdp.send('Performance.getMetrics');
  const g = (n) => (metrics.find((m) => m.name === n) || {}).value || 0;
  return { task: g('TaskDuration'), script: g('ScriptDuration'), style: g('RecalcStyleDuration'), layout: g('LayoutDuration') };
}

// Measure `seconds` of rest: main-thread busy %, rAF / interval / timeout calls per second by source.
async function measure(page, cdp, seconds) {
  await page.evaluate(() => { window.__idle = { raf: {}, interval: {}, timeout: {} }; });
  const m0 = await busy(cdp); const t0 = Date.now();
  await page.waitForTimeout(seconds * 1000);
  const m1 = await busy(cdp); const wall = (Date.now() - t0) / 1000;
  const bag = await page.evaluate(() => window.__idle);
  const perSec = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, +(v / wall).toFixed(1)]).filter(([, v]) => v >= 0.5).sort((a, b) => b[1] - a[1]));
  const pct = (v) => +((v / wall) * 100).toFixed(1);
  const raf = perSec(bag.raf);
  return {
    mainThreadBusy: pct(m1.task - m0.task), script: pct(m1.script - m0.script),
    style: pct(m1.style - m0.style), layout: pct(m1.layout - m0.layout),
    rafPerSec: Math.round(Object.values(raf).reduce((s, v) => s + v, 0)), raf,
    intervalsPerSec: perSec(bag.interval), timeoutsPerSec: perSec(bag.timeout),
  };
}

// Go to url and wait for load; a page whose load event never comes (a hanging embed, a slow
// third party) is measured anyway from DOMContentLoaded, with a note.
async function open(page, url) {
  try { await page.goto(url, { waitUntil: 'load', timeout: 45000 }); }
  catch (e) { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); console.error('note: load event did not fire in 45 s; measuring from DOMContentLoaded'); }
}

module.exports = { args, launch, measure, open };
