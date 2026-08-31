#!/usr/bin/env bash
# Rellena los 3 secretos de .env.production sin abrir un editor.
# Las llaves se leen en silencio: no se muestran ni quedan en el historial.
set -euo pipefail
F="${1:-.env.production}"
[ -f "$F" ] || { echo "✗ no existe $F"; exit 1; }

echo "Supabase → Project Settings → API"
printf "  Project URL (https://xxxx.supabase.co): "
read -r SB_URL
printf "  service_role key (no se mostrará al pegar): "
read -rs SB_KEY; echo
echo
echo "platform.openai.com → API keys"
printf "  API key (no se mostrará al pegar): "
read -rs OAI_KEY; echo

SB_URL="$SB_URL" SB_KEY="$SB_KEY" OAI_KEY="$OAI_KEY" F="$F" python3 - <<'PY'
import os, re, pathlib
f = pathlib.Path(os.environ['F'])
lines = f.read_text().splitlines()
vals = {
    'SUPABASE_URL': os.environ['SB_URL'].strip().rstrip('/'),
    'SUPABASE_SERVICE_KEY': os.environ['SB_KEY'].strip(),
    'AI_API_KEY': os.environ['OAI_KEY'].strip(),
}
seen = set()
out = []
for ln in lines:
    m = re.match(r'^([A-Z_]+)=', ln)
    if m and m.group(1) in vals:
        out.append(f"{m.group(1)}={vals[m.group(1)]}")
        seen.add(m.group(1))
    else:
        out.append(ln)
f.write_text("\n".join(out) + "\n")
missing = set(vals) - seen
print("✓ escritas: " + ", ".join(sorted(seen)) + (f"  ⚠ no encontradas: {missing}" if missing else ""))
PY
chmod 600 "$F"
