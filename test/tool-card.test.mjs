import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ToolCard } from "../dist/index.js";

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
  assert.match(html, /API key/);
  assert.match(html, /Required/);
});
