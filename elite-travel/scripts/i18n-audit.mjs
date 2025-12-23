import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const srcDir = path.join(projectRoot, 'src');
const localesDir = path.join(projectRoot, 'public', 'locales');

const languages = fs
  .readdirSync(localesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

function flatten(obj, prefix = '', out = new Set()) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      flatten(v, p, out);
    }
    return out;
  }
  out.add(prefix);
  return out;
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function walkFiles(dir, exts) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(p, exts));
    } else if (exts.has(path.extname(entry.name))) {
      results.push(p);
    }
  }
  return results;
}

function extractKeysFromSource(code) {
  // Matches: t('a.b.c') or t("a.b.c")
  // Avoids template literals and non-literal calls.
  const re = /\bt\(\s*['"]([^'"\n]+?)['"]/g;
  const keys = [];
  let m;
  while ((m = re.exec(code))) {
    const key = m[1].trim();
    if (!key) continue;
    // Skip obviously non-i18n patterns
    if (key.startsWith('http')) continue;
    keys.push(key);
  }
  return keys;
}

// Load locale keysets: languages -> ns -> Set(keys)
const localeKeysets = new Map();

for (const lng of languages) {
  const lngDir = path.join(localesDir, lng);
  const nsFiles = fs
    .readdirSync(lngDir, { withFileTypes: true })
    .filter((f) => f.isFile() && f.name.endsWith('.json'))
    .map((f) => f.name);

  const nsMap = new Map();
  for (const file of nsFiles) {
    const ns = path.basename(file, '.json');
    const json = readJson(path.join(lngDir, file));
    nsMap.set(ns, flatten(json));
  }
  localeKeysets.set(lng, nsMap);
}

// Scan source for t('...') keys
const sourceFiles = walkFiles(srcDir, new Set(['.js', '.jsx', '.ts', '.tsx']));
const allKeys = new Set();

for (const file of sourceFiles) {
  const code = fs.readFileSync(file, 'utf8');
  for (const k of extractKeysFromSource(code)) allKeys.add(k);
}

function keyExistsForLang(lng, key) {
  const nsMap = localeKeysets.get(lng);
  if (!nsMap) return false;

  // Explicit ns form: ns:key
  const nsSepIdx = key.indexOf(':');
  if (nsSepIdx > 0) {
    const ns = key.slice(0, nsSepIdx);
    const realKey = key.slice(nsSepIdx + 1);
    return nsMap.get(ns)?.has(realKey) ?? false;
  }

  // Otherwise, try all namespaces available for that language.
  for (const keys of nsMap.values()) {
    if (keys.has(key)) return true;
  }
  return false;
}

const missingByLang = new Map();
for (const lng of languages) missingByLang.set(lng, []);

for (const key of [...allKeys].sort()) {
  for (const lng of languages) {
    if (!keyExistsForLang(lng, key)) missingByLang.get(lng).push(key);
  }
}

let hasMissing = false;
for (const [lng, missing] of missingByLang.entries()) {
  if (missing.length === 0) continue;
  hasMissing = true;
  console.log(`\n[${lng}] Missing keys (${missing.length}):`);
  for (const k of missing) console.log(`- ${k}`);
}

if (!hasMissing) {
  console.log('✅ No missing i18n keys found for any language.');
}
