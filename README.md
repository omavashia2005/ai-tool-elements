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

Copy `node_modules/ai-tool-elements/public/artifacts` into your app's `public`
directory to use the complete catalog's local logos.

## Editable example

Run the Next.js showcase:

```sh
npm run example
```

Then edit `examples/basic/app/page.tsx`. Create a static production build with
`npm run example:build`.
