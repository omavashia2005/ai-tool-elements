# Contributing

Thanks for helping improve `ai-tool-elements`.

## Get started

Follow [SETUP.md](./SETUP.md) to install dependencies, run the example, and
learn how connectors and logos are registered.

Create a focused branch from `dev`, make the smallest change that solves the
problem, and run:

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

Open development pull requests against `dev`. Explain what changed and why.
Keep unrelated formatting, generated catalog updates, and dependency changes
out of the pull request.

## Releases

### One-time setup

1. In the npm settings for `ai-tool-elements`, add a GitHub Actions trusted
   publisher with:
   - Organization or user: `omavashia2005`
   - Repository: `ai-tool-elements`
   - Workflow filename: `publish.yml`
   - Environment: leave blank
   - Allowed action: `npm publish`
2. Create `dev` from the current `main`, push it, and make it the repository's
   default branch:

   ```sh
   git switch main
   git pull --ff-only
   git switch -c dev
   git push -u origin dev
   ```

3. In the `main` ruleset, require pull requests and the `Test` status check.

### Publish a release

Choose the next stable version, then branch from `dev`:

```sh
VERSION=0.1.1
git switch dev
git pull --ff-only
git switch -c "release/v$VERSION"
npm version "$VERSION" --no-git-tag-version
npm test
git add package.json package-lock.json
git commit -m "release: v$VERSION"
git push -u origin "release/v$VERSION"
```

Open a pull request from `release/v$VERSION` to `main`. After `Test` passes,
merge it without squashing. In GitHub Releases, create `v$VERSION`, target
`main`, and publish it. The `Publish` workflow verifies the tag and publishes
to npm without an npm token.

Finally, fast-forward `dev` to the released commit:

```sh
git switch dev
git pull --ff-only
git merge --ff-only origin/main
git push
```

By contributing, you agree that your contribution is licensed under the
[MIT License](./LICENSE).
