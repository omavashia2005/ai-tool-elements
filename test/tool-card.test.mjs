import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { join } from "node:path";
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
        image: "/artifacts/tool-logos/weather.svg",
        fields: [{ name: "apiKey", label: "API key", required: true }],
      },
    }),
  );

  assert.match(html, /weather\.svg/);
  assert.match(html, /data-slot="card"/);
  assert.match(html, /API key/);
  assert.match(html, /Required/);
});

test("ships the complete catalog with unique ids and local images", async () => {
  assert.equal(toolCatalog.length, 1_403);
  assert.equal(new Set(toolCatalog.map(({ id }) => id)).size, toolCatalog.length);

  await Promise.all(
    toolCatalog.map(({ image }) =>
      access(join(process.cwd(), "public", image)),
    ),
  );
});

test("exports common tools as typed named imports", () => {
  assert.deepEqual(
    [Slack, Gmail, Notion, Exa].map(({ id }) => id),
    ["slack", "gmail", "notion", "exa"],
  );
});
