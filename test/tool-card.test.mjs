import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Exa,
  Gmail,
  Notion,
  Slack,
  ToolCallCard,
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

test("ships the complete source catalog independently of available logos", () => {
  assert.equal(toolCatalog.length > 1000, true);
  assert.equal(new Set(toolCatalog.map(({ id }) => id)).size, toolCatalog.length);

  const images = toolCatalog.flatMap(({ image }) => (image ? [image] : []));
  assert.equal(images.length, 332);

  for (const image of images) {
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

test("renders every tool call state, including streaming and cancellation", () => {
  const states = {
    "input-streaming": "Pending",
    "input-available": "Running",
    "approval-requested": "Awaiting approval",
    "approval-responded": "Responded",
    "output-available": "Completed",
    "output-error": "The tool call failed.",
    "output-denied": "The tool call was denied.",
    "output-cancelled": "The tool call was cancelled.",
  };

  for (const [state, text] of Object.entries(states)) {
    const html = renderToStaticMarkup(
      createElement(ToolCallCard, {
        tool: { id: "weather", name: "Weather" },
        state,
        input: { city: "Phoenix" },
        output: createElement("strong", null, "42°"),
      }),
    );

    assert.equal(html.includes(`data-state="${state}"`), true);
    assert.equal(html.includes("Phoenix"), true);
    assert.equal(html.includes(text), true);
    if (state === "output-available") {
      assert.equal(html.includes("<strong>42°</strong>"), true);
    }
  }
});
