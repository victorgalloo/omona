#!/usr/bin/env node
/**
 * Verifica el contraste WCAG de cada par fondo/texto que el sistema de color
 * declara en src/app/globals.css, y sale con código 1 si alguno no llega.
 *
 * Existe porque la paleta es fosforescente: los neones tienen una luminancia
 * altísima y es facilísimo escribir `text-[var(--neon-lime)]` sobre hueso y
 * dejar texto con 1.03:1, invisible pero sin error de compilación. Este script
 * es lo que convierte esa regla de diseño en algo que el CI puede exigir.
 *
 *   node scripts/check-contrast.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const cssPath = resolve(here, '../src/app/globals.css');
const css = readFileSync(cssPath, 'utf8');

/** Extrae los tokens de un bloque de selector concreto. */
function tokensOf(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`No encontré el bloque ${selector} en globals.css`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('\n  }', open);
  const body = css.slice(open, close);
  const out = {};
  for (const [, name, value] of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    out[name] = value.trim();
  }
  return out;
}

const marca = tokensOf("[data-theme='dark'] {\n    /* Constantes de marca");
const claro = tokensOf("[data-theme='light'] {\n    --background");
const oscuro = tokensOf("[data-theme='dark'] {\n    --background");

const srgb = (c) => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

function luminance(hex) {
  const h = hex.replace('#', '').trim();
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}

function ratio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const INK = marca['--ink'];
const BONE = marca['--bone'];

/** [etiqueta, fondo, texto, mínimo] */
const pares = [
  // Bases
  ['base clara · texto', BONE, claro['--foreground'], 4.5],
  ['base clara · texto atenuado', BONE, claro['--muted'], 4.5],
  ['base oscura · texto', INK, oscuro['--foreground'], 4.5],
  ['base oscura · texto atenuado', INK, oscuro['--muted'], 4.5],
  ['superficie clara · texto', claro['--surface'], claro['--foreground'], 4.5],
  ['superficie oscura · texto', oscuro['--surface'], oscuro['--foreground'], 4.5],

  // Bandas fosforescentes: siempre con texto negro
  ['banda lima · texto negro', marca['--neon-lime'], INK, 4.5],
  ['banda amarillo · texto negro', marca['--neon-yellow'], INK, 4.5],
  ['banda cyan · texto negro', marca['--neon-cyan'], INK, 4.5],
  ['banda magenta · texto negro', marca['--neon-magenta'], INK, 4.5],
  ['banda naranja · texto negro', marca['--neon-orange'], INK, 4.5],
  ['banda azul · texto blanco', marca['--electric-blue'], '#FFFFFF', 4.5],

  // Acentos usados COMO TEXTO: aquí es donde se rompe todo si nadie mira
  ['acento verde sobre base clara', BONE, claro['--accent-green'], 4.5],
  ['acento lima sobre base oscura', INK, oscuro['--accent-green'], 4.5],
  ['enlace sobre base clara', BONE, claro['--accent-link'], 4.5],
  ['enlace sobre base oscura', INK, oscuro['--accent-link'], 4.5],
  ['error sobre base clara', BONE, claro['--error'], 4.5],
  ['error sobre base oscura', INK, oscuro['--error'], 4.5],
  ['aviso sobre base clara', BONE, claro['--warning'], 4.5],
  ['aviso sobre base oscura', INK, oscuro['--warning'], 4.5],
];

// Cada token vive en hex (legible, y lo que se puntúa arriba) y en canales
// sueltos (lo que Tailwind necesita para el modificador de opacidad). Si se
// desincronizan, medimos un color y pintamos otro — así que se comprueba.
let fallos = 0;
const canales = { ...marca, ...claro, ...oscuro };
for (const [name, hex] of Object.entries({ ...marca, ...claro, ...oscuro })) {
  const rgbName = `${name}-rgb`;
  if (!(rgbName in canales)) continue;
  const lum = luminance(hex);
  if (lum === null) continue;
  const esperado = hex.replace('#', '').match(/../g).map((h) => parseInt(h, 16)).join(' ');
  const declarado = canales[rgbName].trim();
  if (declarado.startsWith('var(')) continue; // alias a otro token
  if (declarado !== esperado) {
    console.error(`✗ ${name}: el hex ${hex} no coincide con ${rgbName}: ${declarado} (esperaba ${esperado})`);
    fallos++;
  }
}
console.log(`\n${'par'.padEnd(34)} ${'ratio'.padStart(8)}  estado\n${'-'.repeat(60)}`);

for (const [label, bg, fg, min] of pares) {
  const r = ratio(bg, fg);
  if (r === null) {
    console.log(`${label.padEnd(34)} ${'—'.padStart(8)}  ⚠ no es hex sólido, se omite`);
    continue;
  }
  const ok = r >= min;
  if (!ok) fallos++;
  const nivel = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : 'FALLA';
  console.log(`${label.padEnd(34)} ${r.toFixed(2).padStart(7)}x  ${ok ? '✓' : '✗'} ${nivel}`);
}

console.log();
if (fallos > 0) {
  console.error(`${fallos} par(es) por debajo del mínimo. La paleta puede ser excéntrica, no ilegible.\n`);
  process.exit(1);
}
console.log('Todos los pares pasan WCAG AA.\n');
