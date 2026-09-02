#!/usr/bin/env node
/**
 * Rinde cada loop en claro y oscuro, en webm (VP9) y mp4 (h264), más un
 * poster jpg que la landing usa como `poster` del <video>: así el LCP no
 * espera al video y `prefers-reduced-motion` tiene algo estático que mostrar.
 *
 * Salida: apps/dashboard/public/video/
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const videoRoot = resolve(here, "..");
const outDir = resolve(videoRoot, "../dashboard/public/video");

/** `poster` es el frame representativo: el loop empieza vacío, así que no sirve el 0. */
const LOOPS = [
  { id: "ChatRespondiendo", slug: "chat-respondiendo", poster: 270 },
  { id: "CrmSeLlenaSolo", slug: "crm-se-llena-solo", poster: 240 },
  { id: "CitaAgendada", slug: "cita-agendada", poster: 232 },
  { id: "NotaDeVoz", slug: "nota-de-voz", poster: 214 },
  { id: "Handoff", slug: "handoff", poster: 178 },
  { id: "SeguimientoAutomatico", slug: "seguimiento-automatico", poster: 186 },
  { id: "AntesDespues", slug: "antes-despues", poster: 170 },
  { id: "PipelineReal", slug: "pipeline-real", poster: 200 },
  { id: "InboxReal", slug: "inbox-real", poster: 200 },
  { id: "TareasReal", slug: "tareas-real", poster: 205 },
];

const THEMES = ["light", "dark"];

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const loops = only.length ? LOOPS.filter((l) => only.includes(l.id) || only.includes(l.slug)) : LOOPS;

if (!loops.length) {
  console.error(`No coincide nada con: ${only.join(", ")}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

function run(args) {
  const res = spawnSync("npx", ["remotion", ...args], {
    cwd: videoRoot,
    stdio: ["ignore", "inherit", "inherit"],
    env: process.env,
  });
  if (res.status !== 0) {
    throw new Error(`falló: remotion ${args.slice(0, 3).join(" ")}`);
  }
}

function kb(file) {
  return existsSync(file) ? `${Math.round(statSync(file).size / 1024)} KB` : "—";
}

const hechos = [];

for (const loop of loops) {
  for (const theme of THEMES) {
    const props = JSON.stringify({ theme });
    const base = `${loop.slug}-${theme}`;

    // webm/VP9: el formato que sirve la mayoría de navegadores modernos
    run([
      "render", loop.id, join(outDir, `${base}.webm`),
      "--codec=vp9", "--crf=34", "--muted", `--props=${props}`, "--log=error",
    ]);

    // mp4/h264: respaldo universal (Safari viejo)
    run([
      "render", loop.id, join(outDir, `${base}.mp4`),
      "--codec=h264", "--crf=26", "--pixel-format=yuv420p", "--muted", `--props=${props}`, "--log=error",
    ]);

    // poster
    run([
      "still", loop.id, join(outDir, `${base}.jpg`),
      `--frame=${loop.poster}`, "--image-format=jpeg", "--jpeg-quality=82",
      `--props=${props}`, "--log=error",
    ]);

    hechos.push({ base });
    console.log(`✓ ${base}`);
  }
}

console.log("\nresultado en apps/dashboard/public/video/\n");
for (const { base } of hechos) {
  console.log(
    `  ${base.padEnd(32)} webm ${kb(join(outDir, `${base}.webm`)).padStart(8)}` +
      `   mp4 ${kb(join(outDir, `${base}.mp4`)).padStart(8)}` +
      `   jpg ${kb(join(outDir, `${base}.jpg`)).padStart(8)}`,
  );
}
