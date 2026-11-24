<div align="left">
  <img src="https://cdn.paddlewheel.org/paddlewheel/paddlewheelfullbrand.svg" height="25px" alt="Postbound" />
</div>

# postbound-node

> [!NOTE]
> This is a **public repository** maintained by **Paddlewheel Inc.** The code is open source under the [MIT License](LICENSE).

Node.js and TypeScript SDK for [Postbound](https://postbound.app). Use it to send, schedule, and receive email, and to manage domains, API keys, audiences, contacts, and webhooks through the Postbound API. It mirrors [resend-node](https://github.com/resend/resend-node), so moving from Resend is mostly a rename.

This package sends requests with your API key to the Postbound API and handles your email content. Never put a real API key in code, tests, logs, issues, or screenshots.

## Contributing

Issues and pull requests are welcome. For a bug, include the SDK version, your Node.js version, and the `request_id` from the error response if you have one. For a larger change, open an issue first so we can agree on the approach before you write the code.

Pull requests are reviewed by the Postbound team, and a change is only released after a maintainer approves and merges it. CI and CodeQL must pass before a pull request can be merged. See [CONTRIBUTING.md](CONTRIBUTING.md) for the code rules and the pull request process.

Report security problems privately through [GitHub private vulnerability reporting](https://github.com/Paddlewheel-Inc/postbound-node/security/advisories/new) instead of opening a public issue. See [SECURITY.md](SECURITY.md).

## License and trademarks

The source code is released under the [MIT License](LICENSE), Copyright (c) 2026 Paddlewheel Inc.

The **Postbound** name, logo, and associated branding are the property of Paddlewheel Inc. and are protected by applicable trademark, copyright, and intellectual property laws. The MIT License covers the code, not the branding. Unauthorised use, reproduction, modification, or representation of Postbound branding is not permitted without prior written consent from Paddlewheel Inc.

## Tech stack

- **Language:** [TypeScript](https://www.typescriptlang.org) `^7`
- **Runtime:** [Node.js](https://nodejs.org) 20+, using the built-in `fetch`
- **Webhook signatures:** [Standard Webhooks](https://www.standardwebhooks.com) `^1.1`, the only runtime dependency
- **Email templates:** [React Email](https://react.email) via `@react-email/render`, an optional peer dependency
- **Build:** [tsdown](https://tsdown.dev) `^0.23`, which emits ESM, CommonJS, and type declarations
- **Linting and formatting:** [Biome](https://biomejs.dev) `^2`
- **Package manager:** [pnpm](https://pnpm.io)

## Getting started

You need Node.js 22.13+ and pnpm 11 to work on the SDK. Using the SDK only needs Node.js 20+.

```bash
git clone https://github.com/Paddlewheel-Inc/postbound-node.git
cd postbound-node
pnpm install
pnpm build
```

To try your changes against the API, create an API key in the Postbound portal and run a script against `src`:

```ts
import { Postbound } from './src';

const postbound = new Postbound(process.env.POSTBOUND_API_KEY);

console.log(await postbound.domains.list());
```

Use a key from a test account where you can, and a `sending_access` key if you only need to send.

## Environment variables

The SDK reads these variables when the matching constructor option is not set. Do not commit `.env` files, API keys, or webhook signing secrets.

| Variable               | Purpose                                             | Default                     |
| ---------------------- | --------------------------------------------------- | --------------------------- |
| `POSTBOUND_API_KEY`    | API key used when none is passed to the constructor | none, required              |
| `POSTBOUND_BASE_URL`   | API base URL                                        | `https://api.postbound.app` |
| `POSTBOUND_USER_AGENT` | `User-Agent` header                                 | `postbound-node:<version>`  |
| `POSTBOUND_DEBUG`      | Set to `true` to log every API error to stderr      | off                         |

Explicit constructor options win over environment variables, and empty variables are ignored.

If a key or secret is committed by accident, treat it as compromised, and revoke it in the Postbound portal immediately. Deleting the file from git is not enough, because it stays in the history.

## Scripts

Scripts are defined in `package.json` and should be invoked through pnpm.

| Command              | What it does                                                      |
| -------------------- | ----------------------------------------------------------------- |
| `pnpm install`       | Install dependencies                                              |
| `pnpm build`         | Bundle ESM, CommonJS, and type declarations into `dist`           |
| `pnpm lint`          | Run Biome checks                                                  |
| `pnpm lint:fix`      | Apply Biome fixes                                                 |
| `pnpm typecheck`     | Run TypeScript without emitting                                   |
| `pnpm check:pinned`  | Require exact dependency versions                                 |
| `pnpm check:source`  | Reject comments, suppressions, TODOs, and hardcoded keys in `src` |
| `pnpm check:package` | Verify the built package exports and type resolution              |
| `pnpm check`         | Run every check above, the same as CI                             |
## Usage

### Installation

```bash
pnpm add postbound
```

```bash
npm install postbound
```

Node.js 20 or later is required.

### Quickstart

1. Add and verify a sending domain in the Postbound portal, or with [`domains.create`](#domains).
2. Create an API key and expose it as `POSTBOUND_API_KEY`.
3. Send your first email.

```ts
import { Postbound } from 'postbound';

const postbound = new Postbound(process.env.POSTBOUND_API_KEY);

const { data, error } = await postbound.emails.send({
  from: 'Acme <hello@acme.com>',
  to: 'ada@example.org',
  subject: 'Welcome to Acme',
  html: '<h1>Welcome, Ada</h1><p>Your account is ready.</p>',
});

if (error) {
  console.error(error.name, error.message);
} else {
  console.log('Queued', data.id);
}
```

The `from` address must belong to a domain that is verified and has sending enabled. Otherwise the API rejects the request with a `validation_error` and a `403` status.

### What it covers

| Client                       | What you can do                                                  |
| ---------------------------- | ---------------------------------------------------------------- |
| `postbound.emails`           | Send, schedule, reschedule, cancel, retrieve, and list emails    |
| `postbound.batch`            | Send up to 100 emails in one request                             |
| `postbound.emails.receiving` | Read inbound mail and its attachments                            |
| `postbound.domains`          | Add, verify, configure, and remove sending and receiving domains |
| `postbound.apiKeys`          | Create, list, and delete API keys                                |
| `postbound.audiences`        | Manage mailing lists                                             |
| `postbound.contacts`         | Manage the contacts in an audience                               |
| `postbound.webhooks`         | Manage webhooks, send test deliveries, and verify signatures     |

Billing, workspaces, members, sign-in, and usage metrics are portal endpoints and are not part of the SDK.

### Handling responses

No method throws on an API or network error. Each one resolves to an object with three fields:

| Field     | Type                                  | Meaning                                                |
| --------- | ------------------------------------- | ------------------------------------------------------ |
| `data`    | the resource, or `null`               | Set when the request succeeded                         |
| `error`   | [`ErrorResponse`](#errors), or `null` | Set when the request failed                            |
| `headers` | `Record<string, string>`, or `null`   | Response headers. `null` when no response was received |

Exactly one of `data` and `error` is set, and TypeScript narrows both:

```ts
const { data, error } = await postbound.domains.get('domain-id');

if (error) {
  throw new Error(`${error.name}: ${error.message}`);
}

console.log(data.status);
```

The only thing that rejects is a request you cancel with an `AbortSignal`, which rejects with the abort reason. Methods that return no body, such as `apiKeys.remove`, resolve with `data: {}`.

### Emails

`emails.send` and `emails.create` are the same method.

```ts
const { data, error } = await postbound.emails.send({
  from: 'Acme <hello@acme.com>',
  to: ['ada@example.org', 'grace@example.org'],
  cc: 'team@acme.com',
  bcc: ['archive@acme.com'],
  replyTo: 'support@acme.com',
  subject: 'Your March invoice',
  html: '<p>Your invoice is attached.</p>',
  text: 'Your invoice is attached.',
  headers: { 'X-Entity-Ref-ID': 'inv_123' },
  tags: [{ name: 'category', value: 'invoice' }],
});
```

| Option        | Type                                | Notes                                                           |
| ------------- | ----------------------------------- | --------------------------------------------------------------- |
| `from`        | `string`                            | Required. `email@acme.com` or `Name <email@acme.com>`           |
| `to`          | `string \| string[]`                | Required                                                        |
| `subject`     | `string`                            | Required                                                        |
| `html`        | `string`                            | At least one of `html`, `text`, or `react` is required          |
| `text`        | `string`                            | Plain text version                                              |
| `react`       | `React.ReactNode`                   | Rendered to `html`. See [React Email](#react-email)             |
| `cc`          | `string \| string[]`                |                                                                 |
| `bcc`         | `string \| string[]`                |                                                                 |
| `replyTo`     | `string \| string[]`                | Sent as the `Reply-To` header                                   |
| `headers`     | `Record<string, string>`            | Custom headers. Reserved headers such as `Subject` are rejected |
| `tags`        | `{ name: string; value: string }[]` | Returned in webhooks and when you retrieve the email            |
| `attachments` | [`Attachment[]`](#attachments)      |                                                                 |
| `scheduledAt` | `string`                            | See [Scheduling](#scheduling)                                   |

The response is `{ id: string }`. The email is queued, not delivered. Follow delivery with [webhooks](#webhooks) or [`emails.get`](#retrieving-and-listing).

#### Attachments

Give each attachment either `content` or `path`, never both.

```ts
import { readFile } from 'node:fs/promises';

await postbound.emails.send({
  from: 'Acme <hello@acme.com>',
  to: 'ada@example.org',
  subject: 'Your invoice',
  html: '<p>See attached.</p><img src="cid:logo" />',
  attachments: [
    {
      filename: 'invoice.pdf',
      content: await readFile('invoice.pdf'),
    },
    {
      filename: 'logo.png',
      content: await readFile('logo.png'),
      contentType: 'image/png',
      contentId: 'logo',
    },
    {
      filename: 'terms.pdf',
      path: 'https://acme.com/legal/terms.pdf',
    },
  ],
});
```

| Field         | Type                                                      | Notes                                                                          |
| ------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `content`     | `Buffer`, `Uint8Array`, `ArrayBuffer`, or base64 `string` | Binary values are base64 encoded for you                                       |
| `path`        | `string`                                                  | An `http` or `https` URL that Postbound fetches                                |
| `filename`    | `string`                                                  | Required with `content`. Optional with `path` when the URL ends in a file name |
| `contentType` | `string`                                                  | Inferred from the file name when omitted                                       |
| `contentId`   | `string`                                                  | Makes the attachment inline. Reference it with `cid:` in your HTML             |

#### React Email

Install [`@react-email/render`](https://www.npmjs.com/package/@react-email/render), an optional peer dependency, and pass a component as `react`.

```tsx
import { Postbound } from 'postbound';
import { WelcomeEmail } from './emails/welcome';

const postbound = new Postbound();

await postbound.emails.send({
  from: 'Acme <hello@acme.com>',
  to: 'ada@example.org',
  subject: 'Welcome to Acme',
  react: <WelcomeEmail name="Ada" />,
});
```

When `react` is set, its rendered output replaces `html`. If the package is missing, the call throws an error that names what to install.

#### Scheduling

`scheduledAt` takes an ISO 8601 timestamp or a relative expression such as `in 30 minutes`, `in 1 hour`, or `in 3 days`.

```ts
await postbound.emails.send({
  from: 'Acme <hello@acme.com>',
  to: 'ada@example.org',
  subject: 'Your trial ends tomorrow',
  text: 'Upgrade to keep your data.',
  scheduledAt: 'in 2 hours',
});

await postbound.emails.update({
  id: 'email-id',
  scheduledAt: '2026-11-14T09:00:00Z',
});

await postbound.emails.cancel('email-id');
```

A time in the past sends the email immediately, and by default emails can be scheduled up to 30 days ahead. `update` and `cancel` return `{ object: 'email', id }`, and fail with `invalid_state` once the email has been sent.

#### Idempotency

Pass an `idempotencyKey` to make a send safe to retry. Postbound stores the response for the key, 24 hours by default, and replays it for an identical request instead of sending again.

```ts
await postbound.emails.send(
  {
    from: 'Acme <hello@acme.com>',
    to: 'ada@example.org',
    subject: 'Your receipt',
    text: 'Thanks for your order.',
  },
  { idempotencyKey: `receipt-${order.id}` },
);
```

- A replayed response has the header `Idempotent-Replayed: true`, available as `idempotent-replayed` in `headers`.
- Reusing a key with a different body fails with `invalid_idempotent_request`.
- Reusing a key while the first request is still running fails with `concurrent_idempotent_requests`.
- Keys can be up to 256 characters.

The API only deduplicates `emails.send`, `emails.create`, `batch.send`, and `batch.create`.

#### Batch sending

Send up to 100 emails in one request. If any email is invalid, none are sent, and the error message names the failing index, such as `emails[3]: Missing "subject" field.`

```ts
const { data, error } = await postbound.batch.send(
  [
    {
      from: 'Acme <hello@acme.com>',
      to: 'ada@example.org',
      subject: 'Hello Ada',
      html: '<p>Hi Ada</p>',
    },
    {
      from: 'Acme <hello@acme.com>',
      to: 'grace@example.org',
      subject: 'Hello Grace',
      react: <Greeting name="Grace" />,
    },
  ],
  { idempotencyKey: 'welcome-batch-42' },
);

if (!error) {
  console.log(data.data.map((email) => email.id));
}
```

Each item accepts the same options as `emails.send`, except `attachments` and `scheduledAt`. `data.data` lists the IDs in the order you sent them. `batch.create` is an alias of `batch.send`.

#### Retrieving and listing

```ts
const { data: email } = await postbound.emails.get('email-id');

console.log(email?.last_event);
console.log(email?.events);

const { data: page } = await postbound.emails.list({
  limit: 50,
  status: 'bounced',
  q: 'invoice',
});
```

`emails.get` returns the email plus its delivery timeline in `events`, each with a `type`, `occurred_at`, and `metadata`. Event types are `queued`, `scheduled`, `sent`, `delivered`, `delivery_delayed`, `bounced`, `complained`, `opened`, `clicked`, `failed`, and `canceled`.

| List option                | Type         | Notes                                |
| -------------------------- | ------------ | ------------------------------------ |
| `status`                   | `EmailEvent` | Only emails whose last event matches |
| `q`                        | `string`     | Search text, up to 200 characters    |
| `limit`, `after`, `before` |              | See [Pagination](#pagination)        |

List items leave out `html`, `text`, `tags`, and `events`. Call `emails.get` for those.

### Receiving email

Postbound receives mail for your domains and exposes it through the API. Receiving uses a full-access API key.

1. Turn on receiving for a verified domain:

   ```ts
   await postbound.domains.update({
     id: 'domain-id',
     capabilities: { receiving: 'enabled' },
   });
   ```

2. Publish the `Receiving` MX record that now appears in the domain's `records`, then verify:

   ```ts
   const { data: domain } = await postbound.domains.get('domain-id');

   console.log(domain?.records.filter((record) => record.record === 'Receiving'));

   await postbound.domains.verify('domain-id');
   ```

3. Read what arrives:

   ```ts
   const { data: inbox } = await postbound.emails.receiving.list({ limit: 20 });

   const { data: email } = await postbound.emails.receiving.get('received-id');

   console.log(email?.from, email?.subject, email?.text);
   console.log(email?.authentication);
   ```

`email.authentication` reports `spf`, `dkim`, and `dmarc`, each one of `pass`, `fail`, `gray`, `processing_failed`, or `unknown`.

By default, `cid:` references in `html` are replaced with `data:` URIs when the inline parts total 2 MB or less. Ask for the original references with `html_format`, and each one then matches the `content_id` of an attachment. The `html_format` on the response says which format you received.

```ts
const { data } = await postbound.emails.receiving.get('received-id', {
  html_format: 'cid',
});
```

Attachments and the raw message are returned as signed download URLs:

```ts
const { data: attachments } = await postbound.emails.receiving.attachments.list(
  {
    emailId: 'received-id',
  },
);

const { data: attachment } = await postbound.emails.receiving.attachments.get({
  emailId: 'received-id',
  id: 'attachment-id',
});

const response = await fetch(attachment!.download_url);
const bytes = Buffer.from(await response.arrayBuffer());
```

`download_url` and `raw.download_url` are valid for one hour and need no `Authorization` header, so you can hand them to a browser or another service. Ask for a fresh one when it expires. To react to inbound mail as it arrives, subscribe a webhook to [`email.received`](#events).

### Domains

```ts
const { data: domain } = await postbound.domains.create({
  name: 'acme.com',
  region: 'us-east-1',
  customReturnPath: 'send',
});

for (const record of domain?.records ?? []) {
  console.log(record.record, record.type, record.name, record.value);
}
```

`create` returns the DNS records to publish:

| Record      | Type        | Purpose                                                          |
| ----------- | ----------- | ---------------------------------------------------------------- |
| `Ownership` | `TXT`       | Proves you control the domain. Verification waits on this record |
| `DKIM`      | `TXT`       | Signs outgoing mail                                              |
| `SPF`       | `MX`, `TXT` | Authorizes Postbound to send for the return path                 |
| `Receiving` | `MX`        | Only listed when receiving is enabled                            |

A domain is `not_started`, `pending`, `verified`, or `failed`. After you publish the records, ask Postbound to check again:

```ts
await postbound.domains.verify('domain-id');
```

`verify` returns `{ object: 'domain', id }` straight away. Read `status` with `domains.get`, or subscribe to the `domain.verified` and `domain.failed` [events](#events).

```ts
await postbound.domains.update({
  id: 'domain-id',
  openTracking: true,
  clickTracking: true,
  tls: 'enforced',
  capabilities: { sending: 'enabled', receiving: 'enabled' },
});

const { data: domains } = await postbound.domains.list();

await postbound.domains.remove('domain-id');
```

| Update option   | Type                                                       |
| --------------- | ---------------------------------------------------------- |
| `openTracking`  | `boolean`                                                  |
| `clickTracking` | `boolean`                                                  |
| `tls`           | `'opportunistic' \| 'enforced'`                            |
| `capabilities`  | `{ sending?, receiving? }`, each `'enabled' \| 'disabled'` |

Only the fields you pass are changed. At least one of sending and receiving must stay enabled.

### API keys

```ts
const { data, error } = await postbound.apiKeys.create({
  name: 'Production',
  permission: 'sending_access',
  domainId: 'domain-id',
});

if (!error) {
  console.log(data.token);
}

const { data: keys } = await postbound.apiKeys.list();

await postbound.apiKeys.remove('key-id');
```

> [!IMPORTANT]
> The `token` is returned only once, when the key is created. Store it in your secrets manager straight away. Later reads only expose `token_prefix`.

| Permission       | Can do                                              |
| ---------------- | --------------------------------------------------- |
| `full_access`    | Everything in this SDK. The default                 |
| `sending_access` | Send email with `emails.send` and `batch.send` only |

A `sending_access` key can be locked to one domain with `domainId`, and sending from any other domain fails. Any other call with a sending key fails with `restricted_api_key`. Use sending keys in application servers and keep full-access keys for management tasks.

### Audiences and contacts

```ts
const { data: audience } = await postbound.audiences.create({
  name: 'Newsletter',
});

const { data: contact } = await postbound.contacts.create({
  audienceId: audience!.id,
  email: 'ada@example.org',
  firstName: 'Ada',
  lastName: 'Lovelace',
  unsubscribed: false,
});

await postbound.audiences.get('audience-id');
await postbound.audiences.list();
await postbound.audiences.remove('audience-id');
```

Look contacts up by `id` or by `email`, not both:

```ts
await postbound.contacts.get({
  audienceId: 'audience-id',
  email: 'ada@example.org',
});

await postbound.contacts.update({
  audienceId: 'audience-id',
  id: 'contact-id',
  unsubscribed: true,
});

await postbound.contacts.remove({
  audienceId: 'audience-id',
  email: 'ada@example.org',
});

const { data: contacts } = await postbound.contacts.list({
  audienceId: 'audience-id',
  limit: 100,
});
```

Passing neither `id` nor `email` resolves with a `missing_required_field` error and sends no request. Creating a contact that already exists in the audience fails with `contact_already_exists`.

### Webhooks

Webhooks push delivery, inbound mail, and domain events to your server.

```ts
const { data, error } = await postbound.webhooks.create({
  url: 'https://acme.com/hooks/postbound',
  events: ['email.delivered', 'email.bounced', 'email.received'],
});

if (!error) {
  console.log(data.id);
  console.log(data.signing_secret);
}
```

| Option    | Type                             | Notes                                            |
| --------- | -------------------------------- | ------------------------------------------------ |
| `url`     | `string`                         | Required. Must be `https` and publicly reachable |
| `events`  | `WebhookEvent[]`                 | Required. At least one                           |
| `type`    | `'http' \| 'discord' \| 'teams'` | Defaults to `http`                               |
| `enabled` | `boolean`                        | Defaults to `true`                               |

An account can have up to 20 webhooks. `http` webhooks send signed JSON and have a `signing_secret` that starts with `whsec_`, returned by `create` and `get`. `discord` and `teams` webhooks post a formatted chat message instead, so they have no signing secret. `type` cannot be changed after creation.

```ts
await postbound.webhooks.create({
  type: 'discord',
  url: 'https://discord.com/api/webhooks/123456789/abcdef',
  events: ['email.bounced', 'email.complained', 'domain.failed'],
});

await postbound.webhooks.get('webhook-id');
await postbound.webhooks.list();
await postbound.webhooks.update('webhook-id', { enabled: false });
await postbound.webhooks.remove('webhook-id');

const { data: test } = await postbound.webhooks.test('webhook-id');

console.log(test?.success, test?.status_code, test?.error);
```

Each webhook reports `last_delivery_status`, which is `success`, `failed`, or `null` when nothing has been delivered. Failed deliveries are retried with backoff.

#### Events

| Event                    | Fired when                                               |
| ------------------------ | -------------------------------------------------------- |
| `email.sent`             | The email left Postbound for the recipient's mail server |
| `email.delivered`        | The recipient's mail server accepted it                  |
| `email.delivery_delayed` | Delivery hit a temporary problem and will be retried     |
| `email.bounced`          | The recipient's mail server rejected it permanently      |
| `email.complained`       | The recipient marked it as spam                          |
| `email.opened`           | The recipient opened it                                  |
| `email.clicked`          | The recipient clicked a link                             |
| `email.failed`           | Postbound gave up sending it                             |
| `email.received`         | A message arrived on one of your receiving domains       |
| `domain.verified`        | A domain finished verification                           |
| `domain.failed`          | Domain verification failed or expired                    |

#### Verifying deliveries

Always verify a delivery before you trust it. `webhooks.verify` checks the signature and timestamp, then returns the parsed event. It throws if the signature is missing, invalid, or too old. Verify against the **raw** request body, because a parsed and re-serialized body will not match the signature.

```ts
import express from 'express';
import { Postbound } from 'postbound';

const postbound = new Postbound();
const app = express();

app.post(
  '/hooks/postbound',
  express.text({ type: 'application/json' }),
  (req, res) => {
    let event;

    try {
      event = postbound.webhooks.verify({
        payload: req.body,
        headers: {
          id: req.header('webhook-id') ?? '',
          timestamp: req.header('webhook-timestamp') ?? '',
          signature: req.header('webhook-signature') ?? '',
        },
        webhookSecret: process.env.POSTBOUND_WEBHOOK_SECRET ?? '',
      });
    } catch {
      res.sendStatus(400);
      return;
    }

    switch (event.type) {
      case 'email.bounced':
        console.log('Bounced', event.data.email_id, event.data.metadata);
        break;
      case 'email.received':
        console.log('Inbound', event.data.email_id, event.data.subject);
        break;
      case 'domain.verified':
        console.log('Verified', event.data.name);
        break;
    }

    res.sendStatus(200);
  },
);
```

Respond with a `2xx` status quickly and do slow work afterwards. Any other status counts as a failed delivery and is retried. A retry carries the same `webhook-id`, so use it to ignore duplicates.

With Next.js route handlers, read the payload with `await request.text()`:

```ts
import { Postbound } from 'postbound';

const postbound = new Postbound();

export async function POST(request: Request) {
  const payload = await request.text();

  try {
    const event = postbound.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get('webhook-id') ?? '',
        timestamp: request.headers.get('webhook-timestamp') ?? '',
        signature: request.headers.get('webhook-signature') ?? '',
      },
      webhookSecret: process.env.POSTBOUND_WEBHOOK_SECRET ?? '',
    });

    console.log(event.type);
    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
```

#### Event payloads

Every delivery has a `type`, a `created_at`, and a `data` object. The `type` field narrows `data` in TypeScript.

`email.*` events:

```json
{
  "type": "email.bounced",
  "created_at": "2026-11-12T10:00:02Z",
  "data": {
    "email_id": "0198f2a4-5b1c-7d3e-9a10-2f4c8b6d1e07",
    "from": "Acme <hello@acme.com>",
    "to": ["ada@example.org"],
    "subject": "Welcome to Acme",
    "tags": [{ "name": "category", "value": "welcome" }],
    "created_at": "2026-11-12T10:00:00Z",
    "metadata": { "reason": "mailbox full" }
  }
}
```

`metadata` is present when the event carries extra detail, such as a bounce reason.

`email.received`:

```json
{
  "type": "email.received",
  "created_at": "2026-11-12T10:00:01Z",
  "data": {
    "email_id": "0198f2a4-9c20-7a11-8b3d-5e7f0a1c2d44",
    "created_at": "2026-11-12T10:00:00Z",
    "from": "Ada <ada@example.org>",
    "to": ["support@acme.com"],
    "cc": [],
    "bcc": [],
    "received_for": ["support@acme.com"],
    "message_id": "<abc@example.org>",
    "subject": "Hello",
    "attachments": [
      {
        "id": "0198f2a4-9c21-7b02-a4c6-1d3e5f7a9b20",
        "filename": "invoice.pdf",
        "content_type": "application/pdf",
        "content_disposition": "attachment",
        "content_id": null
      }
    ]
  }
}
```

The payload never includes message bodies or attachment content. Fetch them with [`emails.receiving.get`](#receiving-email).

`domain.verified` and `domain.failed`:

```json
{
  "type": "domain.verified",
  "created_at": "2026-11-12T10:05:00Z",
  "data": {
    "domain_id": "0198f2a3-0a4e-7c55-92d1-6b8e4f0a3c19",
    "name": "acme.com",
    "status": "verified",
    "region": "us-east-1"
  }
}
```

`webhook.test`, sent by `webhooks.test`:

```json
{
  "type": "webhook.test",
  "created_at": "2026-11-12T10:10:00Z",
  "data": {
    "message": "This is a test message from Postbound. Your webhook is configured correctly."
  }
}
```

### Pagination

Every list method uses cursor pagination and returns `{ object: 'list', has_more, data }`.

| Option   | Type     | Notes                                                        |
| -------- | -------- | ------------------------------------------------------------ |
| `limit`  | `number` | 1 to 100. Defaults to 20                                     |
| `after`  | `string` | Return items after this ID. Cannot be combined with `before` |
| `before` | `string` | Return items before this ID. Cannot be combined with `after` |

TypeScript stops you from passing both `after` and `before`. To walk every page:

```ts
async function* allDomains() {
  let after: string | undefined;

  while (true) {
    const { data, error } = await postbound.domains.list({ limit: 100, after });

    if (error) {
      throw new Error(error.message);
    }

    yield* data.data;

    if (!data.has_more) {
      return;
    }

    after = data.data.at(-1)?.id;
  }
}

for await (const domain of allDomains()) {
  console.log(domain.name);
}
```

Contacts and received-email attachments also need their parent ID: `contacts.list({ audienceId })` and `emails.receiving.attachments.list({ emailId })`.

### Request options

The last argument of every method sets per-request options.

```ts
await postbound.emails.get('email-id', {
  headers: { 'X-Trace-Id': 'trace-123' },
  signal: AbortSignal.timeout(5_000),
});
```

| Option           | Type          | Available on        | Notes                                  |
| ---------------- | ------------- | ------------------- | -------------------------------------- |
| `headers`        | `HeadersInit` | every method        | Merged over the defaults               |
| `signal`         | `AbortSignal` | every method        | Aborting rejects with the abort reason |
| `idempotencyKey` | `string`      | methods that `POST` | Sent as the `Idempotency-Key` header   |

The client sends `Authorization: Bearer <key>`, `Content-Type: application/json`, and a `User-Agent`. Custom headers can override any of them.

### Errors

A failed call returns an `ErrorResponse`:

```ts
{
  name: ErrorCode;
  message: string;
  statusCode: number | null;
  request_id?: string;
}
```

`statusCode` is `null` when no response was received. Include `request_id` when you contact support.

| `name`                            | Status         | Meaning                                                                                   |
| --------------------------------- | -------------- | ----------------------------------------------------------------------------------------- |
| `missing_api_key`                 | 401            | No `Authorization` header was sent                                                        |
| `invalid_api_key`                 | 403            | The key is malformed or does not exist                                                    |
| `restricted_api_key`              | 401            | A `sending_access` key was used for something other than sending                          |
| `validation_error`                | 422, 403, 413  | A field is invalid, the sender domain is unverified or disabled, or the body is too large |
| `missing_required_field`          | 422            | A required field is missing                                                               |
| `invalid_parameter`               | 422            | A field has the wrong value or format                                                     |
| `invalid_from_address`            | 422            | `from` is not a valid address                                                             |
| `invalid_scheduled_date`          | 422            | `scheduledAt` is malformed or too far ahead                                               |
| `invalid_attachment`              | 422            | An attachment is malformed, too large, or blocked                                         |
| `invalid_json`                    | 400            | The request body is not valid JSON                                                        |
| `forbidden`                       | 403            | You are not allowed to do this                                                            |
| `not_found`                       | 404            | The resource does not exist or belongs to another account                                 |
| `method_not_allowed`              | 405            | The endpoint does not support that method                                                 |
| `invalid_state`                   | 409            | The resource is not in a state that allows this, such as cancelling a sent email          |
| `domain_already_exists`           | 409            | The domain is already registered                                                          |
| `contact_already_exists`          | 409            | The contact is already in the audience                                                    |
| `verification_conflict`           | 409            | A verification for the domain is already in progress                                      |
| `invalid_idempotent_request`      | 409            | The idempotency key was used with a different payload                                     |
| `concurrent_idempotent_requests`  | 409            | A request with the same idempotency key is still running                                  |
| `invalid_download_link`           | 403            | A signed download URL is invalid or expired                                               |
| `rate_limit_exceeded`             | 429            | Too many requests. See [Rate limits](#rate-limits)                                        |
| `internal_server_error`           | 500            | Something went wrong on our side                                                          |
| `domain_verification_unavailable` | 502            | Domain verification is temporarily unavailable. Try again later                           |
| `application_error`               | any, or `null` | The SDK could not reach the API or could not read its response                            |

### Rate limits

Requests are rate limited per account, so every API key on an account shares one budget. Every response carries `RateLimit-Limit` (the burst size), `RateLimit-Remaining`, and `RateLimit-Reset` headers. When you go over, the call fails with `rate_limit_exceeded`, and `Retry-After` says how many seconds to wait.

```ts
import type { CreateEmailOptions } from 'postbound';

async function sendWithRetry(
  payload: CreateEmailOptions,
  key: string,
  attempts = 3,
) {
  for (let attempt = 1; ; attempt++) {
    const result = await postbound.emails.send(payload, {
      idempotencyKey: key,
    });

    if (result.error?.name !== 'rate_limit_exceeded' || attempt === attempts) {
      return result;
    }

    const wait = Number(result.headers?.['retry-after'] ?? 1);
    await new Promise((resolve) => setTimeout(resolve, wait * 1000));
  }
}
```

Header names are lower-cased in `headers`, and reusing the idempotency key makes each retry safe.

### Limits

| Limit                                                 | Value                                              |
| ----------------------------------------------------- | -------------------------------------------------- |
| Recipients per email (`to`, `cc`, and `bcc` combined) | 50                                                 |
| Emails per batch                                      | 100                                                |
| Subject length                                        | 998 characters                                     |
| Attachment content per email                          | 40 MB                                              |
| Custom headers per email                              | 50                                                 |
| Tags per email                                        | 20                                                 |
| Tag name and value                                    | 256 characters of `A-Z a-z 0-9 _ -`                |
| Scheduling horizon                                    | 30 days by default                                 |
| Idempotency key                                       | 256 characters, remembered for 24 hours by default |
| Webhooks per account                                  | 20                                                 |
| Domain name                                           | 253 characters                                     |
| Request body, sending                                 | 64 MB                                              |
| Request body, everything else                         | 2 MB                                               |
| Signed download URLs                                  | Valid for 1 hour                                   |

Some values are configurable on the server and can differ between deployments.

### TypeScript

The package ships its own declarations, and every option and response type is exported from the root.

```ts
import type {
  CreateEmailOptions,
  CreateEmailResponseSuccess,
  Domain,
  EmailEvent,
  ErrorResponse,
  Response,
  WebhookEvent,
  WebhookEventPayload,
} from 'postbound';
```

Type names follow one pattern per method: `CreateEmailOptions` is what you pass in, `CreateEmailResponseSuccess` is the `data` you get back, and `CreateEmailResponse` is `Response<CreateEmailResponseSuccess>`, the full `{ data, error, headers }`. Discriminate webhook events by `type`:

```ts
import type { WebhookEventPayload } from 'postbound';

function handle(event: WebhookEventPayload) {
  if (event.type === 'email.received') {
    return event.data.attachments.length;
  }

  if (event.type === 'domain.failed') {
    return event.data.name;
  }
}
```

### Migrating from Resend

Postbound's API follows Resend's request and error shapes, so most code needs only a rename.

```diff
- import { Resend } from 'resend';
- const resend = new Resend(process.env.RESEND_API_KEY);
+ import { Postbound } from 'postbound';
+ const postbound = new Postbound(process.env.POSTBOUND_API_KEY);

- await resend.emails.send({ ... });
+ await postbound.emails.send({ ... });
```

What stays the same:

- The `{ data, error, headers }` response envelope and the `ErrorResponse` shape
- `emails`, `batch`, `domains`, `apiKeys`, `webhooks`, `emails.receiving`, and `emails.receiving.attachments`
- `audiences` and `contacts`, including looking up a contact by `id` or `email`
- Options such as `replyTo`, `scheduledAt`, `tags`, `attachments`, `react`, and `idempotencyKey`
- `webhooks.verify` with `payload`, `headers`, and `webhookSecret`
- Cursor pagination with `limit`, `after`, and `before`

What differs:

| Resend                                                                                                               | Postbound                                                                            |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `RESEND_API_KEY`, `re_` keys                                                                                         | `POSTBOUND_API_KEY`, `pb_` keys                                                      |
| `RESEND_BASE_URL`                                                                                                    | `POSTBOUND_BASE_URL`                                                                 |
| `segments`, `topics`, `broadcasts`, `templates`, `automations`, `events`, `logs`, `inboxes`, `suppressions`, `usage` | Not available                                                                        |
| `contacts` without an audience                                                                                       | Contacts always belong to an audience, so pass `audienceId`                          |
| `emails.attachments`, `emails.share`, `emails.metrics`, `emails.receiving.forward`                                   | Not available                                                                        |
| `batch.send(payload, { batchValidation })`                                                                           | Batches are always validated strictly, and any invalid email rejects the whole batch |
| `webhooks.rotateSigningSecret`, `webhooks.events`                                                                    | Not available. Use `webhooks.test` to check an endpoint                              |
| `topicId`, `template` on `emails.send`                                                                               | Not available                                                                        |
| Webhook event `tags` as an object                                                                                    | `tags` is a `{ name, value }[]` array                                                |
| Domain `records[].record` values                                                                                     | `Ownership`, `DKIM`, `SPF`, and `Receiving`                                          |

## Notes

- Each resource lives in its own folder under `src/` with a class and an `interfaces.ts`. Shared types and helpers live in `src/common/`.
- Request options use camelCase and are mapped to the API's snake_case inside the resource classes. Response types stay snake_case, exactly as the API returns them.
- Methods never throw on API errors. They return `{ data, error, headers }` through the client in `src/postbound.ts`. Do not add code that throws for a failed response.
- The SDK follows the shapes of the Postbound API. If an endpoint, field, or error name changes there, update the types and resource here to match.
- Do not add comments to source files. Prefer clear names and small functions.
- If you add a resource, export its types from `src/index.ts` and document it under Usage.
- Run `pnpm check` before opening a pull request. It runs the same checks as CI.

## Committing changes

Please use https://www.conventionalcommits.org/en/v1.0.0/ when commiting any changes.

```bash
git add .
git commit -m "your message"
git push
```
