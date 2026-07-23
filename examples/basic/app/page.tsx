import {
  Exa,
  GitHub,
  Gmail,
  Linear,
  Notion,
  Slack,
  Stripe,
  ToolCard,
  Vercel,
  type Tool,
} from "ai-tool-elements";
import type { JSX } from "react";

const featuredTools = [
  Slack,
  Gmail,
  Notion,
  Exa,
  GitHub,
  Linear,
  Vercel,
  Stripe,
] as const satisfies readonly Tool[];

const customTool = {
  id: "weather-api",
  name: "Weather API",
  description: "A project-defined connector using the same Tool shape.",
  fields: [
    {
      name: "apiKey",
      label: "API key",
      description: "Secret used to authenticate requests.",
      required: true,
    },
    {
      name: "units",
      label: "Units",
      description: "Preferred temperature units.",
      required: false,
    },
  ],
} as const satisfies Tool;

export default function Page(): JSX.Element {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Next.js example</p>
        <h1>Tool cards without the hand-rolled connector UI.</h1>
        <p className="lede">
          Import any catalog entry by name, or pass your own typed tool to the
          same shadcn card component.
        </p>
        <pre aria-label="Import example">
          <code>{`import {
  Slack, Gmail, Notion, Exa
} from "ai-tool-elements";`}</code>
        </pre>
      </section>

      <section aria-labelledby="catalog-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Named exports</p>
            <h2 id="catalog-heading">Pick only the tools you need</h2>
          </div>
          <p>{featuredTools.length} examples from the complete catalog</p>
        </div>

        <div className="tool-grid">
          {featuredTools.map((tool) => (
            <ToolCard className="showcase-card" key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section aria-labelledby="custom-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your own data</p>
            <h2 id="custom-heading">One predictable Tool type</h2>
          </div>
          <p>Required and optional fields render automatically.</p>
        </div>

        <div className="custom-example">
          <ToolCard
            className="showcase-card"
            tool={customTool}
            footer={<span>Defined inside this example</span>}
          />
          <pre aria-label="Custom tool example">
            <code>{`const weather = {
  id: "weather-api",
  name: "Weather API",
  fields: [{
    name: "apiKey",
    label: "API key",
    required: true
  }]
} satisfies Tool;`}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}
