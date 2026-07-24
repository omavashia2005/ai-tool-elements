import { ToolCard, type Tool } from "ai-tool-elements";
import type { JSX } from "react";

import { CatalogSearch } from "./catalog-search";
import { CodeBlock } from "./code-block";
import { ComponentViewer } from "./component-viewer";
import { CopyButton } from "./copy-button";
import { Example } from "./example";
import { LiveToolCall } from "./live-tool-call";
import { INSTALL_COMMAND, SiteFooter, TopBar } from "./site-chrome";
import {
  CATALOG_SNIPPET,
  CUSTOM_TOOL_SNIPPET,
  TOOL_CALL_SNIPPET,
} from "./snippets";

const acmeTool = {
  id: "acme",
  name: "Acme",
  description: "A project-defined connector.",
  fields: [{ name: "apiKey", label: "API key", required: true }],
} as const satisfies Tool;

export default function Page(): JSX.Element {
  return (
    <>
      <TopBar />

      <main>
        <section className="hero">
          <h1>Render your agent&rsquo;s tool calls, from pending to done.</h1>
          <p className="lede">
            <code className="inline-code">ToolCallCard</code> shows every state
            of a tool call — streaming input, awaiting approval, output,
            errors — as a branded shadcn/ui card for Stripe, Exa, Gmail,
            Notion, and 1000+ tools. Provider-independent, typed, no lock-in.
          </p>
          <div className="install" aria-label="Install command">
            <code>{INSTALL_COMMAND}</code>
            <CopyButton text={INSTALL_COMMAND} />
          </div>
        </section>

        <ComponentViewer
          views={{
            "tool-call-card": (
              <section aria-labelledby="states-heading">
                <div className="section-heading">
                  <div>
                    <h2 id="states-heading">Every state, one prop</h2>
                  </div>
                  <p>
                    The states match AI SDK tool parts one-to-one, so{" "}
                    <code className="inline-code">part.state</code> passes
                    straight through — no mapping layer, no status enums of
                    your own.
                  </p>
                </div>

                <LiveToolCall
                  code={
                    <CodeBlock code={TOOL_CALL_SNIPPET} filename="chat.tsx" />
                  }
                />
              </section>
            ),
            "tool-card": (
              <>
                <section aria-labelledby="toolcard-heading">
                  <div className="section-heading">
                    <div>
                      <h2 id="toolcard-heading">
                        Static cards for everything else
                      </h2>
                    </div>
                    <p>
                      <code className="inline-code">ToolCard</code> covers the
                      rest of your surface — settings pages, integration
                      pickers, connector galleries. All 1000+ catalog entries
                      are typed named exports; search them below.
                    </p>
                  </div>

                  <Example
                    title="integrations — localhost:3000"
                    code={
                      <CodeBlock
                        code={CATALOG_SNIPPET}
                        filename="integrations.tsx"
                      />
                    }
                  >
                    <CatalogSearch />
                  </Example>
                </section>
              </>
            ),
            custom: (
              <section aria-labelledby="own-heading">
                <div className="section-heading">
                  <div>
                    <h2 id="own-heading">Your own tools use the same type</h2>
                  </div>
                  <p>
                    Anything that satisfies{" "}
                    <code className="inline-code">Tool</code> renders with the
                    same cards — no registry required. Both cards are
                    shadcn&rsquo;s <code className="inline-code">Card</code>{" "}
                    under the hood, so buttons, badges, and dialogs slot
                    straight into their actions and footers.
                  </p>
                </div>

                <Example
                  title="settings — localhost:3000"
                  code={
                    <CodeBlock code={CUSTOM_TOOL_SNIPPET} filename="tools.ts" />
                  }
                >
                  <ToolCard className="showcase-card" tool={acmeTool} />
                </Example>
              </section>
            ),
          }}
        />
      </main>

      <SiteFooter />
    </>
  );
}
