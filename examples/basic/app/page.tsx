import { Gmail, Notion, Stripe, ToolCard, toolCatalog } from "ai-tool-elements";
import type { JSX } from "react";

import { CatalogSearch } from "./catalog-search";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";

const GITHUB_URL = "https://github.com/omavashia2005/ai-tool-elements";
const DOCS_URL = "https://mintlify.wiki/omavashia2005/ai-tool-elements/introduction";
const DEEPWIKI_URL = "https://deepwiki.com/omavashia2005/ai-tool-elements";

const INSTALL_COMMAND = "npm install ai-tool-elements";

// lucide dropped brand icons, so this one octocat path is inlined
function GithubIcon(): JSX.Element {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const withIcons = toolCatalog.filter((tool) => tool.image);

const IMPORT_SNIPPET = `import { Gmail, Notion, Stripe, ToolCard } from "ai-tool-elements";
import "ai-tool-elements/styles.css";

export function Connectors(): JSX.Element[] {
  return [Gmail, Notion, Stripe].map((tool) => (
    <ToolCard key={tool.id} tool={tool} />
  ));
}`;

const TYPE_SNIPPET = `type Tool = Readonly<{
  id: string;
  name: string;
  description?: string;
  image?: ToolImage;
  fields?: readonly ToolField[];
}>;

// your own tools type-check against the same shape
const weather = { id: "weather", name: "Weather API" } satisfies Tool;`;

const REGISTER_SNIPPET = `import { svg as acmeIcon } from "@thesvg/icons/acme";

export const Acme: ToolCatalogItem = {
  id: "acme",
  name: "Acme",
  image: { type: "svg", content: acmeIcon },
};

// add it to the toolCatalog array below, then anywhere:
<ToolCard tool={Acme} />`;

export default function Page(): JSX.Element {
  return (
    <>
      <header className="topbar">
        <span className="wordmark">ai-tool-elements</span>
        <nav className="nav-links">
          <a href={DOCS_URL}>Docs</a>
          <a href={DEEPWIKI_URL}>DeepWiki</a>
          <a className="github-link" href={GITHUB_URL} aria-label="GitHub repository">
            <GithubIcon />
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>A React component library for every tool your agent calls.</h1>
          <p className="lede">
            A provider-independent React library for showing the tools and
            connectors your product talks to — Stripe, Exa, Gmail, Notion, and
            1,000+ more. No vendor SDK, no lock-in: just typed data in,
            shadcn/ui cards out.
          </p>
          <div className="install" aria-label="Install command">
            <code>{INSTALL_COMMAND}</code>
            <CopyButton text={INSTALL_COMMAND} />
          </div>
        </section>

        <section aria-labelledby="usage-heading">
          <div className="section-heading">
            <div>
              <h2 id="usage-heading">Import, render, done</h2>
            </div>
            <p>
              Every catalog entry is a typed named export. Works in any
              TypeScript React app.
            </p>
          </div>

          <div className="split">
            <CodeBlock code={IMPORT_SNIPPET} filename="connectors.tsx" />
            <div className="split-cards">
              {[Gmail, Notion, Stripe].map((tool) => (
                <ToolCard className="showcase-card" key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="types-heading">
          <div className="section-heading">
            <div>
              <h2 id="types-heading">One type to learn</h2>
            </div>
            <p>
              <code className="inline-code">ToolCard</code> takes a{" "}
              <code className="inline-code">Tool</code>. That&rsquo;s the whole
              API — autocomplete and the compiler handle the rest.
            </p>
          </div>

          <CodeBlock code={TYPE_SNIPPET} filename="types.ts" lang="ts" />
        </section>

        <section aria-labelledby="shadcn-heading">
          <div className="section-heading">
            <div>
              <h2 id="shadcn-heading">Built using ShadcnUI</h2>
            </div>
            <p>
              <code className="inline-code">ToolCard</code> is shadcn&rsquo;s{" "}
              <code className="inline-code">Card</code> under the hood — so
              buttons, badges, dialogs, and any other shadcn component you add
              slot straight into its actions and footer to build richer
              connector UIs.
            </p>
          </div>
        </section>

        <section aria-labelledby="contribute-heading">
          <div className="section-heading">
            <div>
              <h2 id="contribute-heading">Adding a tool is one small diff</h2>
            </div>
            <p>
              1,000+ tools and counting — export a{" "}
              <code className="inline-code">ToolCatalogItem</code>, register
              it, and open a PR.
            </p>
          </div>

          <CodeBlock code={REGISTER_SNIPPET} filename="src/tool-catalog.ts" />
        </section>

        <section aria-labelledby="catalog-heading">
          <div className="section-heading">
            <div>
              <h2 id="catalog-heading">
                1,000+ tools, each one a named export
              </h2>
            </div>
            <p>
              Every tool with an official mark, rendered live by the library
              itself — search all {withIcons.length}.
            </p>
          </div>

          <CatalogSearch />
        </section>
      </main>

      <footer className="footer">
        <code>{INSTALL_COMMAND}</code>
        <span>MIT licensed</span>
        <nav className="nav-links">
          <a href={DOCS_URL}>Docs</a>
          <a href={DEEPWIKI_URL}>DeepWiki</a>
          <a className="github-link" href={GITHUB_URL} aria-label="GitHub repository">
            <GithubIcon />
          </a>
        </nav>
      </footer>
    </>
  );
}
