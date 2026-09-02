/**
 * Config de Remotion para los loops de producto de Omona.
 * Nota: al usar las APIs de Node.js este archivo no aplica; ahí las
 * opciones se pasan directo (ver scripts/render-all.mjs).
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
