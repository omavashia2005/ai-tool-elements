# ai-tool-elements

Typed, vendor-neutral React cards for tools and connectors.

## Install

```sh
npm install ai-tool-elements
```

```tsx
import {
  Exa,
  Gmail,
  Notion,
  Slack,
  ToolCard,
  toolCatalog,
} from "ai-tool-elements";
import "ai-tool-elements/styles.css";

export function Tools() {
  return toolCatalog.map((tool) => (
    <ToolCard key={tool.id} tool={tool} />
  ));
}
```

`ToolCard` composes shadcn's `Card`, `CardHeader`, `CardTitle`,
`CardDescription`, `CardContent`, `CardAction`, and `CardFooter`. Custom tools
only need an `id` and `name`; `description`, `image`, and typed
required/optional `fields` are optional.

Every catalog item is also a typed named export, so individual tools can be
imported directly (`Slack`, `Gmail`, `Notion`, `Exa`, and the rest).

The v0 catalog includes 1000 integrations with available logos.

Available logos use tree-shakeable imports from
[`@thesvg/icons`](https://www.npmjs.com/package/@thesvg/icons). Importing a
named tool includes its matched icon; importing `toolCatalog` includes the
matched icons for the whole catalog. A tool can omit `image` when no suitable
logo exists.

The cards and their field definitions are backend-agnostic and require no
connector service. Product names and logos are trademarks of their respective
owners.

## Add a tool

Add a typed named constant to `src/tool-catalog.ts`, then include it in
`toolCatalog`:

```ts
import { svg as exampleIcon } from "@thesvg/icons/example";

export const Example: ToolCatalogItem = {
  id: "example",
  name: "Example",
  image: { type: "svg", content: exampleIcon },
};

export const toolCatalog: readonly ToolCatalogItem[] = [
  // existing tools
  Example,
];
```

`image` is optional. Import the exact theSVG icon subpath when it has a matching
brand; otherwise leave `image` out. URL images use
`{ type: "url", src: "https://example.com/logo.svg" }`.

## Editable example

Run the Next.js showcase:

```sh
npm run example
```

Then edit `examples/basic/app/page.tsx`. Create a static production build with
`npm run example:build`.

## Roadmap
[] Adding more ShadCN components 
[] Unified UI for major tool API providers like Composio, ScaleKit, etc. 
[] Agent skills
