import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Exa,
  Gmail,
  Notion,
  Slack,
  ToolCard,
  toolCatalog,
} from "../dist/index.js";

test("renders a logo and generic required fields", () => {
  const html = renderToStaticMarkup(
    createElement(ToolCard, {
      tool: {
        id: "weather",
        name: "Weather",
        image: "https://thesvg.org/icons/weather/default.svg",
        fields: [{ name: "apiKey", label: "API key", required: true }],
      },
    }),
  );

  assert.equal(
    html.includes("https://thesvg.org/icons/weather/default.svg"),
    true,
  );
  assert.match(html, /data-slot="card"/);
  assert.match(html, /API key/);
  assert.match(html, /Required/);
});

test("ships 200 unique tools with CDN-backed images when available", () => {
  assert.equal(toolCatalog.length, 200);
  assert.equal(new Set(toolCatalog.map(({ id }) => id)).size, toolCatalog.length);

  for (const { image } of toolCatalog) {
    if (!image) continue;

    const url = new URL(image);
    assert.equal(url.origin, "https://thesvg.org");
    assert.equal(url.pathname.startsWith("/icons/"), true);
    assert.equal(url.pathname.endsWith("/default.svg"), true);
  }
});

test("exports common tools as typed named imports", () => {
  assert.deepEqual(
    [Slack, Gmail, Notion, Exa].map(({ id }) => id),
    ["slack", "gmail", "notion", "exa"],
  );

  for (const tool of [Slack, Gmail, Notion, Exa]) {
    assert.equal(typeof tool.image, "string");
    assert.equal(tool.image.startsWith("https://thesvg.org/icons/"), true);
  }
});
