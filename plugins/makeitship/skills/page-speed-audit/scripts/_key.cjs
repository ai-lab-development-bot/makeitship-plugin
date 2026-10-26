// Finds the Google API key for the PageSpeed Insights and CrUX APIs, without ever printing it.
// Order: --key-file <path>, the PSI_API_KEY environment variable, `.psi-api-key` in the current
// folder, then ~/.config/page-speed-audit/api-key. No key is not an error for PageSpeed (the API
// answers without one, on a small shared quota); CrUX requires one.
const fs = require('fs');
const path = require('path');
const os = require('os');

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

function readKey(a) {
  const files = [a['key-file'], path.join(process.cwd(), '.psi-api-key'), path.join(os.homedir(), '.config', 'page-speed-audit', 'api-key')].filter(Boolean);
  if (process.env.PSI_API_KEY) return { key: process.env.PSI_API_KEY.trim(), from: 'PSI_API_KEY' };
  for (const f of files) {
    if (fs.existsSync(f)) { const k = fs.readFileSync(f, 'utf8').trim(); if (k) return { key: k, from: f }; }
  }
  return { key: '', from: 'none' };
}

const median = (xs) => { const s = xs.filter((x) => typeof x === 'number').sort((p, q) => p - q); if (!s.length) return null; const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

module.exports = { args, readKey, median };
