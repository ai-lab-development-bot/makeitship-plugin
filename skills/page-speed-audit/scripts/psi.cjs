// Lab measurement through the PageSpeed Insights API: Lighthouse run on Google's servers, the same
// environment PageSpeed and Googlebot see (no GPU, throttled). The URL must be public.
//
//   node psi.cjs <url> [--strategy mobile|desktop|both] [--runs 3] [--key-file <path>] [--raw <file>]
//   node psi.cjs --lighthouse <report.json> [<report.json> …]   summarise local Lighthouse runs
//
// Output: JSON — per strategy the median performance score and metrics over the runs (spread
// shown as min–max), the LCP element, and the audits that fail with what they would save
// (metricSavings), sorted by saving. --raw writes the last full Lighthouse result per strategy.
// Needs Node 18+. Without a key the API answers on a small shared quota and often returns 429.
const fs = require('fs');
const { args, readKey, median } = require('./_key.cjs');
const a = args(process.argv.slice(2));
const url = a._[0];
function localMain() {
  // Local Lighthouse JSON reports (the fallback when the page is not public): the same summary.
  const files = [a.lighthouse, ...a._];
  const runs = files.map((f) => summarise(JSON.parse(fs.readFileSync(f, 'utf8'))));
  console.log(JSON.stringify({ source: 'local lighthouse', runs: runs.length, score: median(runs.map((r) => r.score)),
    metrics: Object.fromEntries(Object.keys(METRICS).map((k) => [k, median(runs.map((r) => r.metrics[k]))])),
    lcpElement: runs[runs.length - 1].lcpElement, failing: runs[runs.length - 1].failing.slice(0, 15) }, null, 1));
}
if (!url && !a.lighthouse) { console.error('usage: node psi.cjs <url> [--strategy both] [--runs 3]'); process.exit(1); }
const { key, from } = readKey(a);
const strategies = (a.strategy && a.strategy !== 'both') ? [a.strategy] : ['mobile', 'desktop'];
const RUNS = Number(a.runs || 3);
const METRICS = { LCP: 'largest-contentful-paint', FCP: 'first-contentful-paint', TBT: 'total-blocking-time', CLS: 'cumulative-layout-shift', SI: 'speed-index' };
if (a.lighthouse) return void localMain();

async function run(strategy) {
  const q = new URLSearchParams({ url, strategy, category: 'performance' });
  if (key) q.set('key', key);
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' + q);
    if (res.ok) return res.json();
    const body = await res.text();
    if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 15000 * (attempt + 1))); continue; }
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  throw new Error(key ? 'still failing after retries (quota or server)' : 'quota exceeded without an API key (429) — a key gives the agent its own quota');
}

function nodes(details, out = []) {
  if (!details || typeof details !== 'object') return out;
  if (details.type === 'node' && (details.selector || details.snippet)) out.push({ selector: details.selector, snippet: (details.snippet || '').slice(0, 160) });
  for (const v of Object.values(details)) if (v && typeof v === 'object') nodes(v, out);
  return out;
}

function summarise(lr) {
  const au = lr.audits;
  const metrics = Object.fromEntries(Object.entries(METRICS).map(([k, id]) => [k, au[id] ? (k === 'CLS' ? +au[id].numericValue.toFixed(3) : Math.round(au[id].numericValue)) : null]));
  const lcpAudit = au['largest-contentful-paint-element'] || au['lcp-breakdown-insight'] || au['lcp-discovery-insight'];
  const failing = Object.values(au)
    .filter((x) => x.score !== null && x.score < 0.9 && !['notApplicable', 'informative', 'manual'].includes(x.scoreDisplayMode) && !Object.values(METRICS).includes(x.id))
    .map((x) => ({ id: x.id, title: x.title, display: x.displayValue || '', savings: x.metricSavings || {} }))
    .sort((p, q) => (Object.values(q.savings).reduce((s, v) => s + v, 0)) - (Object.values(p.savings).reduce((s, v) => s + v, 0)));
  return { score: Math.round((lr.categories.performance.score || 0) * 100), metrics, lcpElement: lcpAudit ? nodes(lcpAudit.details).slice(0, 1) : [], failing, lighthouse: lr.lighthouseVersion, warnings: lr.runWarnings || [] };
}

(async () => {
  const out = { url, key: key ? 'from ' + from : 'none', runs: RUNS };
  for (const s of strategies) {
    const runs = [];
    let last;
    for (let i = 0; i < RUNS; i++) {
      try { last = await run(s); runs.push(summarise(last.lighthouseResult)); }
      catch (e) { out[s] = { error: e.message, completedRuns: runs.length }; break; }
    }
    if (!runs.length) continue;
    const spread = (f) => { const v = runs.map(f).filter((x) => typeof x === 'number'); return v.length ? [Math.min(...v), Math.max(...v)] : null; };
    out[s] = {
      score: median(runs.map((r) => r.score)), scoreSpread: spread((r) => r.score),
      metrics: Object.fromEntries(Object.keys(METRICS).map((k) => [k, median(runs.map((r) => r.metrics[k]))])),
      lcpElement: runs[runs.length - 1].lcpElement, failing: runs[runs.length - 1].failing.slice(0, 15),
      lighthouse: runs[0].lighthouse, warnings: runs[runs.length - 1].warnings, completedRuns: runs.length,
    };
    if (a.raw && last) fs.writeFileSync(a.raw.replace(/(\.json)?$/, `.${s}.json`), JSON.stringify(last.lighthouseResult));
  }
  console.log(JSON.stringify(out, null, 1));
})();
