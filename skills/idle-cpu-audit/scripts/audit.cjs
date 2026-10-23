// Inventory of everything that can keep a page busy at rest, and whether each runs off screen.
//
//   node audit.cjs <url> [--selector "<css>"] [--width 1440] [--seconds 8] [--settle 6000]
//
// Page mode (no --selector): measures rest at the top and at the bottom of the page, lists every
// infinite CSS/Web Animation, autoplay video, video iframe, canvas, Lottie and known animation
// library, and flags the ones still running while off screen.
// Block mode (--selector): the same inventory limited to that block, and rest measured twice —
// with the block centred on screen and with it three screens away. The difference is what the
// block costs; any load left while it is away is load it should not cause.
const { args, launch, measure, open } = require('./_lib.cjs');
const a = args(process.argv.slice(2));
const url = a._[0];
if (!url) { console.error('usage: node audit.cjs <url> [--selector css]'); process.exit(1); }
const SECONDS = Number(a.seconds || 8);

function inventory(sel) {
  const root = sel ? document.querySelector(sel) : document.documentElement;
  if (!root) return { error: 'selector not found: ' + sel };
  const inside = (el) => !!el && (root === document.documentElement || root.contains(el));
  const desc = (el) => {
    if (!el || !el.tagName) return String(el);
    const r = el.getBoundingClientRect();
    const cls = [...el.classList].slice(0, 3).join('.');
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls ? '.' + cls : ''} y=${Math.round(r.top + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}`;
  };
  const onScreen = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const CHEAP = new Set(['transform', 'opacity', 'translate', 'rotate', 'scale']);
  const anims = document.getAnimations().filter((x) => {
    const t = x.effect && x.effect.target; const it = x.effect && x.effect.getTiming().iterations;
    return t && inside(t) && it === Infinity;
  }).map((x) => {
    const t = x.effect.target;
    const props = [...new Set(x.effect.getKeyframes().flatMap((k) => Object.keys(k)).filter((p) => !['offset', 'easing', 'composite', 'computedOffset'].includes(p)))];
    return { kind: x.constructor.name, name: x.animationName || x.id || '', pseudo: x.effect.pseudoElement || '', props,
      compositorOnly: props.every((p) => CHEAP.has(p)), state: x.playState, onScreen: onScreen(t), el: desc(t) };
  });
  const videos = [...document.querySelectorAll('video')].filter(inside).map((v) => ({
    autoplay: v.autoplay, loop: v.loop, playing: !v.paused, onScreen: onScreen(v), src: (v.currentSrc || '').split('/').pop().slice(0, 60), el: desc(v) }));
  const iframes = [...document.querySelectorAll('iframe')].filter(inside).map((f) => {
    const s = f.getAttribute('src') || ''; const d = f.getAttribute('data-src') || '';
    const u = s || d; const host = (u.match(/\/\/([^/]+)/) || [])[1] || '';
    return { host, loaded: !!s, selfPlaying: /[?&](autoplay|background)=1/.test(u), onScreen: onScreen(f), el: desc(f) };
  }).filter((f) => /vimeo|youtube|spline|lottie|wistia|loom/.test(f.host) || f.selfPlaying);
  const canvases = [...document.querySelectorAll('canvas')].filter(inside).filter((c) => c.width * c.height > 0).map((c) => ({ size: c.width + 'x' + c.height, onScreen: onScreen(c), el: desc(c), parent: desc(c.parentElement) }));
  let lottie = [];
  const L = window.lottie || window.bodymovin;
  if (L && L.getRegisteredAnimations) lottie = L.getRegisteredAnimations().filter((x) => inside(x.wrapper)).map((x) => ({ loop: x.loop, paused: x.isPaused, frames: Math.round(x.totalFrames || 0), onScreen: x.wrapper ? onScreen(x.wrapper) : null, el: desc(x.wrapper) }));
  const lottieTags = [...document.querySelectorAll('lottie-player, dotlottie-player, dotlottie-wc')].filter(inside).map((e) => ({ tag: e.tagName.toLowerCase(), loop: e.hasAttribute('loop'), autoplay: e.hasAttribute('autoplay'), onScreen: onScreen(e), el: desc(e) }));
  const libs = {};
  try { if (window.Webflow && Webflow.require && Webflow.require('ix2')) libs.webflowIx2 = true; } catch (e) { /* none */ }
  if (document.querySelector('[data-animation-type="lottie"]')) libs.webflowLottie = document.querySelectorAll('[data-animation-type="lottie"]').length;
  if (window.gsap) {
    libs.gsap = { tickerListeners: (gsap.ticker._listeners || []).length, lagSmoothing: true };
    try { libs.gsap.infiniteTweens = gsap.globalTimeline.getChildren(true, true, false).filter((t) => t.repeat() === -1).length; } catch (e) { /* old gsap */ }
    if (window.ScrollTrigger) libs.gsap.scrollTriggers = ScrollTrigger.getAll().length;
  }
  if (window.lenis || window.Lenis || document.documentElement.classList.contains('lenis')) libs.lenis = true;
  if (window.locomotiveScroll || document.querySelector('[data-scroll-container]')) libs.locomotive = true;
  const swipers = [...document.querySelectorAll('.swiper, .swiper-container')].filter((e) => e.swiper && inside(e));
  if (swipers.length) libs.swiper = swipers.map((e) => ({ autoplay: !!(e.swiper.autoplay && e.swiper.autoplay.running), delay: e.swiper.params.autoplay && e.swiper.params.autoplay.delay, onScreen: onScreen(e), el: desc(e) }));
  if (window.Splide || document.querySelector('.splide')) libs.splide = document.querySelectorAll('.splide').length;
  if (window.THREE) libs.three = true;
  if (document.querySelector('spline-viewer') || [...document.scripts].some((s) => /spline/.test(s.src))) libs.spline = true;
  if (window.PIXI) libs.pixi = true;
  if (window.anime) libs.anime = true;
  if (window.Motion || window.motion) libs.motion = true;
  return { anims, videos, iframes, canvases, lottie, lottieTags, libs };
}

// What is still moving while off screen, in the current scroll position.
function offscreenRunning(sel) {
  const root = sel ? document.querySelector(sel) : document.documentElement;
  const inside = (el) => !!el && (root === document.documentElement || root.contains(el));
  const off = (el) => { const r = el.getBoundingClientRect(); return r.bottom < -50 || r.top > innerHeight + 50 || r.width === 0; };
  const name = (el) => el.tagName.toLowerCase() + (el.classList[0] ? '.' + el.classList[0] : '');
  const out = [];
  document.getAnimations().forEach((x) => { const t = x.effect && x.effect.target; if (t && inside(t) && x.effect.getTiming().iterations === Infinity && x.playState === 'running' && off(t)) out.push('css/wa ' + (x.animationName || x.id || '?') + ' on ' + name(t)); });
  document.querySelectorAll('video').forEach((v) => { if (inside(v) && !v.paused && off(v)) out.push('video ' + name(v)); });
  const L = window.lottie || window.bodymovin;
  if (L && L.getRegisteredAnimations) L.getRegisteredAnimations().forEach((x) => { if (x.wrapper && inside(x.wrapper) && !x.isPaused && off(x.wrapper)) out.push('lottie ' + name(x.wrapper)); });
  return out;
}

(async () => {
  const { browser, page, cdp, errors } = await launch({ width: a.width });
  await open(page, url);
  await page.mouse.move(-10, -10).catch(() => {});
  await page.waitForTimeout(Number(a.settle || 6000));
  const sel = a.selector || null;
  const report = { url, width: Number(a.width || 1440), selector: sel };
  if (!sel) {
    report.top = await measure(page, cdp, SECONDS);
    report.inventory = await page.evaluate(inventory, null);
    report.offscreenAtTop = await page.evaluate(offscreenRunning, null);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(300); }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(4000);
    report.bottom = await measure(page, cdp, SECONDS);
    report.offscreenAtBottom = await page.evaluate(offscreenRunning, null);
  } else {
    const found = await page.evaluate((s) => { const el = document.querySelector(s); if (!el) return false; el.scrollIntoView({ block: 'center' }); return true; }, sel);
    if (!found) { console.log(JSON.stringify({ error: 'selector not found: ' + sel })); await browser.close(); return; }
    await page.waitForTimeout(3000);
    report.inventory = await page.evaluate(inventory, sel);
    report.blockOnScreen = await measure(page, cdp, SECONDS);
    await page.evaluate((s) => { const el = document.querySelector(s); const y = el.getBoundingClientRect().top + scrollY; const far = innerHeight * 3; window.scrollTo(0, y > far + innerHeight ? y - far : y + far); }, sel);
    await page.waitForTimeout(4000);
    report.blockAway = await measure(page, cdp, SECONDS);
    report.stillRunningWhileAway = await page.evaluate(offscreenRunning, sel);
  }
  report.errors = errors.slice(0, 3);
  console.log(JSON.stringify(report, null, 1));
  await browser.close();
})();
