// Idle CPU of one page: load, settle, then measure with no input. Use it for before/after
// numbers and, with --block / --css / --pause, to attribute load to one source (ablation).
//
//   node idle-cpu.cjs <url> [--seconds 15] [--settle 6000] [--width 1440] [--runs 1]
//        [--scroll-through]          scroll the whole page first, rest near the bottom
//        [--block <regex>]           abort requests matching it (a library, a widget, Vimeo...)
//        [--css "<css>"]             inject CSS, e.g. "*{animation-play-state:paused!important}"
//        [--pause <regex>]           pause running CSS/Web Animations whose name matches
//        [--label <text>]
//
// Output: JSON per run — mainThreadBusy % (CDP TaskDuration / wall time, the number DevTools and
// QA call "main thread busy"), script/style/layout %, rAF calls per second by source file,
// interval and timeout ticks per second by source. Compare runs at the same width and settle.
const { args, launch, measure, open } = require('./_lib.cjs');
const a = args(process.argv.slice(2));
const url = a._[0];
if (!url) { console.error('usage: node idle-cpu.cjs <url> [options]'); process.exit(1); }

(async () => {
  for (let run = 0; run < Number(a.runs || 1); run++) {
    const { browser, page, cdp, errors } = await launch({ width: a.width, block: a.block, css: a.css });
    await open(page, url);
    await page.mouse.move(-10, -10).catch(() => {});
    if (a['scroll-through']) {
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(350); }
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight - innerHeight * 2));
    }
    await page.waitForTimeout(Number(a.settle || 6000));
    if (a.pause) await page.evaluate((re) => document.getAnimations().forEach((x) => { if (new RegExp(re).test(x.animationName || x.id || '')) x.pause(); }), a.pause);
    const r = await measure(page, cdp, Number(a.seconds || 15));
    console.log(JSON.stringify({ label: a.label || '', url, width: Number(a.width || 1440), run: run + 1, ...r, errors: errors.slice(0, 3) }, null, 1));
    await browser.close();
  }
})();
