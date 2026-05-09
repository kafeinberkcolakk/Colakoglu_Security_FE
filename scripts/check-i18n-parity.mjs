#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const MESSAGES_DIR = join(SCRIPT_DIR, "..", "messages");
const UTF8_BOM_CHAR_CODE = 0xfe_ff;

function flatten(obj, prefix = "") {
  const out = new Map();
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix === "" ? key : `${prefix}.${key}`;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      for (const [k, v] of flatten(value, path)) {
        out.set(k, v);
      }
    } else {
      out.set(path, typeof value);
    }
  }
  return out;
}

function loadLocale(file) {
  const raw = readFileSync(join(MESSAGES_DIR, file), "utf8");
  if (raw.charCodeAt(0) === UTF8_BOM_CHAR_CODE) {
    throw new Error(`${file} contains a UTF-8 BOM. Save as UTF-8 without BOM.`);
  }
  return flatten(JSON.parse(raw));
}

function diff(reference, candidate, refName, candName) {
  const missing = [];
  const extra = [];
  const typeMismatch = [];
  for (const [key, type] of reference) {
    if (!candidate.has(key)) {
      missing.push(key);
    } else if (candidate.get(key) !== type) {
      typeMismatch.push(
        `${key} (${refName}: ${type}, ${candName}: ${candidate.get(key)})`,
      );
    }
  }
  for (const key of candidate.keys()) {
    if (!reference.has(key)) {
      extra.push(key);
    }
  }
  return { extra, missing, typeMismatch };
}

const files = readdirSync(MESSAGES_DIR).filter((f) => f.endsWith(".json"));
if (files.length < 2) {
  console.info(`✓ Only ${files.length} locale file(s) — nothing to compare.`);
  process.exit(0);
}

const [referenceFile, ...others] = files;
const referenceMap = loadLocale(referenceFile);
let driftCount = 0;

for (const file of others) {
  const candidateMap = loadLocale(file);
  const { missing, extra, typeMismatch } = diff(
    referenceMap,
    candidateMap,
    referenceFile,
    file,
  );
  if (missing.length === 0 && extra.length === 0 && typeMismatch.length === 0) {
    console.info(
      `✓ ${file} — in sync with ${referenceFile} (${referenceMap.size} keys).`,
    );
    continue;
  }
  driftCount += missing.length + extra.length + typeMismatch.length;
  console.error(`\n✗ ${file} differs from ${referenceFile}:`);
  if (missing.length > 0) {
    console.error(`  ${missing.length} missing key(s) in ${file}:`);
    for (const k of missing) {
      console.error(`    - ${k}`);
    }
  }
  if (extra.length > 0) {
    console.error(
      `  ${extra.length} extra key(s) in ${file} (not in ${referenceFile}):`,
    );
    for (const k of extra) {
      console.error(`    + ${k}`);
    }
  }
  if (typeMismatch.length > 0) {
    console.error(`  ${typeMismatch.length} type mismatch(es):`);
    for (const k of typeMismatch) {
      console.error(`    ! ${k}`);
    }
  }
}

if (driftCount > 0) {
  console.error(`\nLocale parity check failed (${driftCount} drift entries).`);
  process.exit(1);
}
console.info("\nAll locales in sync.");
