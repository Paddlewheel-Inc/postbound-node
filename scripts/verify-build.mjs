import { createRequire } from 'node:module';

const expected = {
  apiKeys: ['create', 'list', 'remove'],
  audiences: ['create', 'get', 'list', 'remove'],
  batch: ['send', 'create'],
  contacts: ['create', 'get', 'list', 'update', 'remove'],
  domains: ['create', 'get', 'list', 'update', 'verify', 'remove'],
  emails: ['send', 'create', 'get', 'list', 'update', 'cancel'],
  webhooks: ['create', 'get', 'list', 'update', 'remove', 'test', 'verify'],
};

const expectedReceiving = ['get', 'list'];
const expectedAttachments = ['get', 'list'];

function verify(label, Postbound) {
  if (typeof Postbound !== 'function') {
    throw new Error(`${label}: Postbound export is missing`);
  }

  const client = new Postbound('pb_verify');
  const missing = [];

  for (const [resource, methods] of Object.entries(expected)) {
    for (const method of methods) {
      if (typeof client[resource]?.[method] !== 'function') {
        missing.push(`${resource}.${method}`);
      }
    }
  }

  for (const method of expectedReceiving) {
    if (typeof client.emails.receiving?.[method] !== 'function') {
      missing.push(`emails.receiving.${method}`);
    }
  }

  for (const method of expectedAttachments) {
    if (typeof client.emails.receiving?.attachments?.[method] !== 'function') {
      missing.push(`emails.receiving.attachments.${method}`);
    }
  }

  if (missing.length > 0) {
    throw new Error(`${label}: missing ${missing.join(', ')}`);
  }

  process.stdout.write(`${label}: ok\n`);
}

const require = createRequire(import.meta.url);

verify('cjs', require('../dist/index.cjs').Postbound);
verify('esm', (await import('../dist/index.mjs')).Postbound);
