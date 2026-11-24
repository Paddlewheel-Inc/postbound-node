import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

const rules = [
  { name: 'ts-suppression', pattern: /@ts-(ignore|nocheck|expect-error)/ },
  { name: 'biome-suppression', pattern: /biome-ignore/ },
  { name: 'debugger statement', pattern: /\bdebugger\b/ },
  { name: 'TODO marker', pattern: /\b(TODO|FIXME|HACK|XXX)\b/ },
  {
    name: 'hardcoded credential',
    pattern: /\b(pb_[A-Za-z0-9]{16,}|whsec_[A-Za-z0-9+/=]{16,})/,
  },
];

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

function findComments(source) {
  const lines = new Set();
  let line = 1;
  let index = 0;

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (char === '\n') {
      line += 1;
      index += 1;
    } else if (char === '/' && next === '/') {
      lines.add(line);
      while (index < source.length && source[index] !== '\n') {
        index += 1;
      }
    } else if (char === '/' && next === '*') {
      lines.add(line);
      index += 2;
      while (
        index < source.length &&
        !(source[index] === '*' && source[index + 1] === '/')
      ) {
        if (source[index] === '\n') {
          line += 1;
        }
        index += 1;
      }
      index += 2;
    } else if (char === '"' || char === "'" || char === '`') {
      index += 1;
      while (index < source.length && source[index] !== char) {
        if (source[index] === '\\') {
          index += 1;
        }
        if (source[index] === '\n') {
          line += 1;
        }
        index += 1;
      }
      index += 1;
    } else {
      index += 1;
    }
  }

  return [...lines];
}

const failures = [];

for (const path of listFiles(join(root, 'src'))) {
  const file = relative(root, path);
  const source = readFileSync(path, 'utf8');

  if (/\.(spec|test)\.[cm]?[jt]sx?$/.test(file)) {
    failures.push(`${file}: test files are not allowed in this package`);
  }

  for (const line of findComments(source)) {
    failures.push(`${file}:${line}: comments are not allowed`);
  }

  source.split('\n').forEach((text, offset) => {
    for (const rule of rules) {
      if (rule.pattern.test(text)) {
        failures.push(`${file}:${offset + 1}: ${rule.name}`);
      }
    }
  });
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join('\n')}\n`);
  process.exit(1);
}

process.stdout.write('Source checks passed\n');
