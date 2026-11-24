import { readFileSync } from 'node:fs';

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

const exactVersion = /^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;
const failures = [];

for (const field of ['dependencies', 'devDependencies']) {
  for (const [name, version] of Object.entries(pkg[field] ?? {})) {
    if (!exactVersion.test(version)) {
      failures.push(
        `${field}: ${name} is not pinned to an exact version (${version})`,
      );
    }
  }
}

if (failures.length > 0) {
  process.stderr.write(`${failures.join('\n')}\n`);
  process.exit(1);
}

process.stdout.write('All dependencies are pinned\n');
