# ai-tool-elements

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

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

The v0 catalog includes 1000+ tools, with matched logos where available.

Available logos use tree-shakeable imports from
[`@thesvg/icons`](https://www.npmjs.com/package/@thesvg/icons). Importing a
named tool includes its matched icon; importing `toolCatalog` includes the
matched icons for the whole catalog. A tool can omit `image` when no suitable
logo exists.

The cards and their field definitions are backend-agnostic and require no
connector service. Product names and logos are trademarks of their respective
owners.

## Custom tools

Project-specific tools use the same public type without changing the package
catalog:

```ts
import type { Tool } from "ai-tool-elements";

export const Example = {
  id: "example",
  name: "Example",
  image: { type: "url", src: "https://example.com/logo.svg" },
} as const satisfies Tool;
```

`image` is optional.

## Tool calls

Pass the AI SDK state and input through while arguments stream or execution is
pending. Render successful output as React content:

```tsx
import { ToolCallCard } from "ai-tool-elements";

<ToolCallCard
  tool={Weather}
  state={part.state}
  input={part.input}
  output={
    part.state === "output-available"
      ? <WeatherResult result={part.output} />
      : undefined
  }
  errorText={
    part.state === "output-error" ? part.errorText : undefined
  }
  actions={approvalOrCancelButtons}
/>
```

Supported states are `input-streaming`, `input-available`,
`approval-requested`, `approval-responded`, `output-available`,
`output-error`, `output-denied`, and `output-cancelled`. The last state is a
library extension for calls cancelled before completion. Use `actions` for
approval or cancellation controls.

## Editable example

Run the Next.js showcase:

```sh
npm run example
```

Then edit `examples/basic/app/page.tsx`. Create a static production build with
`npm run example:build`.

## Roadmap

- [ ] Add more ShadCN components
- [ ] Unified UI for major tool API providers.
- [ ] Agent skills
