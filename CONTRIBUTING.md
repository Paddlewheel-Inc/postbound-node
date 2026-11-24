# Contributing

Thank you for contributing to the Postbound Node.js SDK.

## Before you start

- Bug fixes need an issue. Include the SDK version, your Node.js version, and the `request_id` from the error response if you have one.
- New features need an issue that a maintainer has agreed to before you write code.
- Report security problems privately. See [SECURITY.md](SECURITY.md).

## Setup

You need Node.js 20 or newer and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm check
```

`pnpm check` runs the same checks as CI: Biome, TypeScript, pinned dependencies, source rules, the build, and the package checks.

## Code rules

- No comments in the source. Make the code and names clear instead.
- No `any`, `@ts-ignore`, `biome-ignore`, `debugger`, or TODO markers.
- No test files in this package.
- Request options use camelCase and are mapped to snake_case inside the resource classes. Response types stay snake_case as the API returns them.
- Methods return `{ data, error, headers }` and do not throw, except when a request is aborted.
- Every dependency in `package.json` is pinned to an exact version.
- Never put a real API key, signing secret, or email content in code, issues, or screenshots.

## Pull requests

- Use a conventional commit title such as `fix(emails): handle empty reply_to`. The message after the colon starts with a lowercase letter.
- Keep each pull request focused on one change.
- Fill in the pull request template.
- A maintainer must approve the pull request, and CI and CodeQL must pass before it can be merged.
- Pull requests that touch `src` get a preview build from [pkg.pr.new](https://pkg.pr.new) that you can install to try the change.

## AI-assisted contributions

You can use AI tools to explore the code and draft changes. You are still responsible for everything you submit, and you must understand and be able to explain it.

Do not mass-submit low-quality pull requests. We treat that as spam and may close the pull requests and block the account.

## Releases

Maintainers release by updating the version in `package.json` and pushing a matching `v*` tag. The release workflow checks the version, runs every check, and publishes to npm with provenance after the `npm` environment is approved.
