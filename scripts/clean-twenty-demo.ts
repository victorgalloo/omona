/** Elimina oportunidades default de Twenty y restos de debug para screenshots limpios */
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const BASE = process.env.TWENTY_BASE_URL!;
const KEY = process.env.TWENTY_API_KEY!;
const H = { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' };

async function main() {
  const res = await fetch(`${BASE}/rest/opportunities?limit=100`, { headers: H });
  const data = await res.json();
  const opps = data?.data?.opportunities ?? [];

  const JUNK = /Platform Migration|AI Model Training|Workspace Expansion|API Integration Deal|Enterprise Plan Upgrade|Design Partnership|Escuela Demo SA/i;

  for (const o of opps) {
    if (JUNK.test(String(o.name))) {
      const del = await fetch(`${BASE}/rest/opportunities/${o.id}`, { method: 'DELETE', headers: H });
      console.log(`🗑 ${o.name} -> ${del.status}`);
    }
  }
  console.log('done');
}
main();
