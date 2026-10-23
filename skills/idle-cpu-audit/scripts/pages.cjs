// Groups a site's pages into page types, so a whole-site audit measures one or two pages of each
// type instead of every page. Reads a sitemap (URL or local file; sitemap indexes are followed)
// or, with --dir, a folder of built .html files.
//
//   node pages.cjs <sitemap.xml URL | file>     node pages.cjs --dir _site
//
// Groups by the first path segment, and splits a group further when its pages carry different
// templates (Webflow data-wf-page, or the <body> class list) — checked on up to 3 pages per group.
const fs = require('fs');
const path = require('path');
const { args } = require('./_lib.cjs');
const a = args(process.argv.slice(2));

const get = async (u) => (/^https?:/.test(u) ? (await fetch(u)).text() : fs.readFileSync(u, 'utf8'));
async function fromSitemap(u, seen = new Set()) {
  if (seen.has(u)) return []; seen.add(u);
  const xml = await get(u);
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (/<sitemapindex/.test(xml)) return (await Promise.all(locs.map((l) => fromSitemap(l, seen)))).flat();
  return locs;
}
function fromDir(dir) {
  const out = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) out.push('/' + path.relative(dir, p).split(path.sep).join('/').replace(/(^|\/)index\.html$/, '$1'));
  });
  walk(dir); return out;
}
const template = (html) => (html.match(/data-wf-page="([^"]+)"/) || html.match(/<body[^>]*class="([^"]*)"/) || [, '?'])[1];

(async () => {
  const urls = a.dir ? fromDir(a.dir) : await fromSitemap(a._[0]);
  const groups = new Map();
  for (const u of urls) {
    const p = u.replace(/^https?:\/\/[^/]+/, '');
    const seg = p.split('/').filter(Boolean);
    const key = seg.length <= 1 ? '(single pages)' : '/' + seg[0] + '/…';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(u);
  }
  const rows = [];
  for (const [k, list] of groups) {
    const tpl = new Set();
    if (k !== '(single pages)') {
      for (const u of list.slice(0, 3)) {
        try {
          const html = a.dir ? fs.readFileSync(path.join(a.dir, u.replace(/\/$/, '/index.html')), 'utf8') : await get(u);
          tpl.add(template(html));
        } catch (e) { /* skip */ }
      }
    }
    rows.push({ type: k, pages: list.length, templates: tpl.size || '-', examples: list.slice(0, 3) });
  }
  rows.sort((x, y) => y.pages - x.pages);
  rows.forEach((r) => console.log(`${String(r.pages).padStart(5)}  ${r.type.padEnd(28)} templates:${r.templates}  ${r.examples.join('  ')}`));
  console.log('total', urls.length);
})();
