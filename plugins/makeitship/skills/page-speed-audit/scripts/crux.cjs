// Field data — what real Chrome visitors experienced over the last 28 days — from the Chrome UX
// Report (CrUX) API. This, not the PageSpeed lab score, is what Google Search uses for Core Web
// Vitals. Requires an API key with the Chrome UX Report API enabled.
//
//   node crux.cjs <url> [--origin] [--key-file <path>]
//
// Queries the page and its origin, for phones and desktops. Output: p75 of LCP, INP, CLS, FCP and
// TTFB, and the share of visits rated good / needs improvement / poor for each. A page or origin
// with too few visits has no record (reported as "not enough data").
const { args, readKey } = require('./_key.cjs');
const a = args(process.argv.slice(2));
const url = a._[0];
if (!url) { console.error('usage: node crux.cjs <url>'); process.exit(1); }
const { key } = readKey(a);
if (!key) { console.error('CrUX needs an API key (see references/pagespeed-api.md).'); process.exit(2); }
const METRICS = ['largest_contentful_paint', 'interaction_to_next_paint', 'cumulative_layout_shift', 'first_contentful_paint', 'experimental_time_to_first_byte'];

async function query(body) {
  const res = await fetch('https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=' + encodeURIComponent(key), {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...body, metrics: METRICS }),
  });
  if (res.status === 404) return { noData: 'not enough data' };
  if (!res.ok) return { error: `HTTP ${res.status}: ${(await res.text()).slice(0, 200)}` };
  const { record } = await res.json();
  return Object.fromEntries(Object.entries(record.metrics).map(([m, v]) => [m, {
    p75: v.percentiles && v.percentiles.p75,
    good_ni_poor: (v.histogram || []).map((h) => Math.round((h.density || 0) * 100) + '%').join(' / '),
  }]));
}

(async () => {
  const origin = new URL(url).origin;
  const out = { url, collectionPeriod: '28 days' };
  for (const formFactor of ['PHONE', 'DESKTOP']) {
    out[formFactor] = { page: a.origin ? undefined : await query({ url, formFactor }), origin: await query({ origin, formFactor }) };
  }
  console.log(JSON.stringify(out, null, 1));
})();
