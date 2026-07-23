# ai-tool-elements

Typed, vendor-neutral React cards for tools and connectors.

```tsx
import { ToolCard, toolCatalog } from "ai-tool-elements";
import "ai-tool-elements/styles.css";
import { Card } from "@/components/ui/card";

export function Tools() {
  return toolCatalog.map((tool) => (
    <ToolCard key={tool.id} tool={tool} as={Card} />
  ));
}
```

`ToolCard` accepts any component that supports `className` and `children`, so
shadcn cards work without an adapter. Custom tools only need an `id` and `name`;
`description`, `image`, and generic required/optional `fields` are optional.

Copy `node_modules/ai-tool-elements/public/artifacts` into your app's `public`
directory to use the starter catalog's local SVG logos.
