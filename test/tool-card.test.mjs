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
        image: {
          type: "url",
          src: "https://example.com/weather.svg",
        },
        fields: [{ name: "apiKey", label: "API key", required: true }],
      },
    }),
  );

  assert.equal(html.includes("https://example.com/weather.svg"), true);
  assert.match(html, /data-slot="card"/);
  assert.match(html, /API key/);
  assert.match(html, /Required/);
});

test("ships 200 unique tools with imported SVG images when available", () => {
  assert.equal(toolCatalog.length, 200);
  assert.equal(new Set(toolCatalog.map(({ id }) => id)).size, toolCatalog.length);

  for (const { image } of toolCatalog) {
    if (!image) continue;

    assert.equal(image.type, "svg");
    assert.equal(image.content.includes("<svg"), true);
  }
});

test("exports common tools as typed named imports", () => {
  assert.deepEqual(
    [Slack, Gmail, Notion, Exa].map(({ id }) => id),
    ["slack", "gmail", "notion", "exa"],
  );

  for (const tool of [Slack, Gmail, Notion, Exa]) {
    assert.equal(tool.image?.type, "svg");
    assert.equal(tool.image.content.includes("<svg"), true);
  }

  const html = renderToStaticMarkup(createElement(ToolCard, { tool: Slack }));
  assert.equal(html.includes("data:image/svg+xml"), true);
});
