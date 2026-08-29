/** Elimina oportunidades default de Twenty y restos de debug (JS puro, sin ts-node) */
const fs = require('fs');
const path = require('path');

const env = Object.fromEntries(
  fs.readFileSync('/Users/victorgallo/Projects/omona/.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const BASE = env.TWENTY_BASE_URL;
const KEY = env.TWENTY_API_KEY;
const H = { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' };

async function main() {
  const res = await fetch(`${BASE}/rest/opportunities?limit=100`, { headers: H });
  const data = await res.json();
  const opps = data?.data?.opportunities ?? [];

  const JUNK = /Platform Migration|AI Model Training|Workspace Expansion|API Integration Deal|Enterprise Plan Upgrade|Design Partnership|Escuela Demo SA/i;

  for (const o of opps) {
    if (JUNK.test(String(o.name))) {
      const del = await fetch(`${BASE}/rest/opportunities/${o.id}`, { method: 'DELETE', headers: H });
      console.log(`del ${o.name} -> ${del.status}`);
    }
  }
  console.log('done');
}
main();
