"use client";

import { ToolCard, toolCatalog } from "ai-tool-elements";
import { Search } from "lucide-react";
import { useState } from "react";
import type { JSX } from "react";

const withIcons = toolCatalog.filter((tool) => tool.image);

// ponytail: cap the default grid; the full 1000 only render when a search asks for them
const DEFAULT_LIMIT = 100;

export function CatalogSearch(): JSX.Element {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = q
    ? withIcons.filter((tool) => tool.name.toLowerCase().includes(q))
    : withIcons.slice(0, DEFAULT_LIMIT);

  return (
    <>
      <div className="catalog-controls">
        <div className="search-wrap">
          <Search className="search-icon" size={18} aria-hidden />
          <input
            className="catalog-search"
            type="text"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search tools"
            placeholder={`Search ${withIcons.length} tools…`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <p className="catalog-hint" aria-live="polite">
          {q
            ? `${matches.length} of ${withIcons.length}`
            : `Showing ${DEFAULT_LIMIT} of ${withIcons.length}`}
        </p>
      </div>

      {matches.length ? (
        <div className="tool-grid">
          {matches.map((tool) => (
            <ToolCard className="showcase-card" key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="catalog-empty">
          No tool named &ldquo;{query.trim()}&rdquo; yet. Try another name, or
          add it — PRs welcome.
        </p>
      )}
    </>
  );
}
