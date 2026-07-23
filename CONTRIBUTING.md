# Contributing

Thanks for helping improve `ai-tool-elements`.

## Get started

Follow [SETUP.md](./SETUP.md) to install dependencies, run the example, and
learn how connectors and logos are registered.

Create a focused branch, make the smallest change that solves the problem, and
run:

```sh
npm test
```

For visual changes, also run the showcase:

```sh
npm run example
```

## Project conventions

- Keep the public API vendor-neutral.
- Reuse the existing `Tool`, `ToolField`, and `ToolImage` types.
- Keep connector IDs stable and unique.
- Prefer a per-icon `@thesvg/icons/<slug>` import over a barrel import.
- Add dependencies only when the existing stack or platform cannot do the job.
- Include a small regression test for behavior changes.

## Catalog changes

See [Register a connector](./SETUP.md#register-a-connector) before editing
`src/tool-catalog.ts`. The catalog is capped at 200 entries, and
`npm run sync:catalog` rewrites the whole file.

Catalog-only changes should still pass `npm test`, which checks the catalog
size, unique IDs, named exports, and SVG content.

## Pull requests

Explain what changed and why. Keep unrelated formatting, generated catalog
updates, and dependency changes out of the pull request.

By contributing, you agree that your contribution is licensed under the
[MIT License](./LICENSE).
