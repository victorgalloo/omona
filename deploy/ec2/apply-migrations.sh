#!/usr/bin/env bash
# Aplica supabase/migrations/*.sql en orden contra un Postgres, usando psql
# dentro de un contenedor (no requiere instalar nada). Se detiene al primer error.
#
#   ./deploy/ec2/apply-migrations.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

docker info >/dev/null 2>&1 || { echo "✗ Docker no está corriendo. Arráncalo con: colima start"; exit 1; }

cat <<'HELP'
Necesitas la cadena de conexión de Supabase:
  Project Settings → Database → Connection string → pestaña "URI"
  Reemplaza [YOUR-PASSWORD] por la contraseña real de la base.
  Debe verse así:
    postgresql://postgres:LACONTRASEÑA@db.xxxx.supabase.co:5432/postgres

HELP
printf 'Cadena de conexión (no se mostrará): '
read -rs CONN; echo
[ -n "$CONN" ] || { echo "✗ vacía"; exit 1; }
case "$CONN" in
  *"[YOUR-PASSWORD]"*|*"[TU-CONTRASEÑA]"*) echo "✗ no reemplazaste el placeholder de la contraseña"; exit 1 ;;
  postgresql://*|postgres://*) ;;
  *) echo "✗ no parece una cadena postgresql://"; exit 1 ;;
esac
# Supabase exige TLS
case "$CONN" in *sslmode=*) ;; *\?*) CONN="${CONN}&sslmode=require" ;; *) CONN="${CONN}?sslmode=require" ;; esac

echo "── Probando conexión ──"
if ! printf '%s' "$CONN" | docker run --rm -i -e PGCONN_STDIN=1 postgres:16 sh -c 'read -r C; psql "$C" -tAc "select current_database()"' 2>/tmp/.pgerr; then
  echo "✗ no se pudo conectar:"; sed 's/^/    /' /tmp/.pgerr | head -5; rm -f /tmp/.pgerr; exit 1
fi
rm -f /tmp/.pgerr
echo

for f in supabase/migrations/*.sql; do
  printf '  %-32s ' "$(basename "$f")"
  if OUT=$( { printf '%s\n' "$CONN"; cat "$f"; } | docker run --rm -i postgres:16 sh -c 'read -r C; psql "$C" -v ON_ERROR_STOP=1 -q -f -' 2>&1 ); then
    echo "✓"
  else
    echo "✗"
    echo "$OUT" | sed 's/^/      /' | head -12
    echo
    echo "Detenido en $(basename "$f"). Las anteriores sí se aplicaron."
    exit 1
  fi
done

echo
echo "── Tablas creadas ──"
printf '%s' "$CONN" | docker run --rm -i postgres:16 sh -c 'read -r C; psql "$C" -tAc "select tablename from pg_tables where schemaname='"'"'public'"'"' order by 1"' | sed 's/^/  /'
unset CONN
echo
echo "✓ Migraciones aplicadas."
