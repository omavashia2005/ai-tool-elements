# Setup

## Requirements

- Node.js 22
- npm

Node 22 matches the current development environment and supports the Next.js
example workspace.

## Install and verify

```sh
git clone https://github.com/omavashia2005/ai-tool-elements.git
cd ai-tool-elements
npm ci
npm test
```

`npm test` builds the package, generates type declarations and CSS, then runs
the Node test suite.

Start the editable Next.js showcase with:

```sh
npm run example
```

Other useful commands:

```sh
npm run build
npm run example:build
npm run doctor
```

## Register a connector

### In an application

There is no required global registry for an application-defined connector.
Create an object that satisfies `Tool` and pass it to `ToolCard`:

```tsx
import { ToolCard, type Tool } from "ai-tool-elements";

const acmeLogo = String.raw`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#6D5EF7"/>
    <path d="M7 16 12 6l5 10h-3l-2-4-2 4H7Z" fill="#fff"/>
  </svg>
`;

const Acme = {
  id: "acme",
  name: "Acme",
  description: "A project-defined connector.",
  image: { type: "svg", content: acmeLogo },
  fields: [
    {
      name: "apiKey",
      label: "API key",
      description: "Secret used to authenticate requests.",
      required: true,
    },
  ],
} as const satisfies Tool;

export function AcmeCard() {
  return <ToolCard tool={Acme} />;
}
```

SVG `content` must be the complete `<svg>...</svg>` markup, including a
`viewBox`. Use explicit colors because an SVG rendered through `<img>` does not
inherit the page's `currentColor`. Only include SVG markup you trust.

A hosted image also works:

```ts
const Acme = {
  id: "acme",
  name: "Acme",
  image: { type: "url", src: "https://example.com/acme.svg" },
} as const satisfies Tool;
```

### In the package catalog

Registering a connector in the package gives consumers a named import and adds
it to `toolCatalog`.

1. Find the brand slug at [thesvg.org](https://thesvg.org), then import its raw
   SVG by exact subpath in `src/tool-catalog.ts`:

   ```ts
   import { svg as _iconAcme } from "@thesvg/icons/acme";
   ```

2. Export one typed catalog item:

   ```ts
   export const Acme: ToolCatalogItem = {
     id: "acme",
     name: "Acme",
     description: "Connect to Acme.",
     image: { type: "svg", content: _iconAcme },
     fields: [
       { name: "apiKey", label: "API key", required: true },
     ],
   };
   ```

3. Add `Acme` once to the `toolCatalog` array in the same file. Nothing needs
   to be added to `src/index.ts`; it already re-exports the catalog.

4. Run `npm test`.

If `@thesvg/icons` has no suitable logo, define a trusted SVG string beside
the connector and use it as `content`, as in the application example. If a
stable hosted asset is preferable, use `{ type: "url", src: "https://..." }`.
Do not add a new icon dependency for one logo.

The catalog includes 1000 connectors, each with an available logo.

## Repository map

- `src/tool-card.tsx` — connector card rendering
- `src/types.ts` — public connector types
- `src/tool-catalog.ts` — named connector exports and catalog registration
- `examples/basic` — editable Next.js showcase
- `test` — package and rendering checks
