# ai-tool-elements

Typed, vendor-neutral React cards for tools and connectors.

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

The v0 catalog is limited to 200 useful integrations. It keeps the source
directory's featured tools first, then ranks the remainder by available
actions and triggers; it does not depend on a connector vendor at runtime.

Available logos load on demand from [theSVG](https://thesvg.org). A tool can
omit `image` when no suitable logo exists.

The cards and their field definitions are backend-agnostic: they do not
require Composio or any other connector service. Product names and logos are
trademarks of their respective owners.

## Add a tool

Add a typed named constant to `src/tool-catalog.ts`, then include it in
`toolCatalog`:

```ts
export const Example: ToolCatalogItem = {
  id: "example",
  name: "Example",
  image: "https://thesvg.org/icons/example/default.svg",
};

export const toolCatalog: readonly ToolCatalogItem[] = [
  // existing tools
  Example,
];
```

`image` is optional. When theSVG has a matching brand, use its exact icon slug
in `https://thesvg.org/icons/{slug}/default.svg`; otherwise leave `image` out.

## Editable example

Run the Next.js showcase:

```sh
npm run example
```

Then edit `examples/basic/app/page.tsx`. Create a static production build with
`npm run example:build`.
