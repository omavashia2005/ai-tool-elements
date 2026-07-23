import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

import { load } from "cheerio";
import type { IconModule } from "@thesvg/icons";

const DOCS_URL = "https://docs.composio.dev/toolkits";
const PARSE_URL =
  "https://api.parse.bot/scraper/8e464fbd-d473-428f-996d-174a82b024a8/list_toolkits";
const ICON_URL = "https://thesvg.org/icons";
const CATALOG_FILE = "src/tool-catalog.ts";
const CATALOG_LIMIT = 200;
const FEATURED_TOOLKIT_COUNT = 9;
const REQUIRED_TOOLKITS = new Set(["exa", "linear", "stripe", "vercel"]);
const ICON_OVERRIDES: Readonly<Record<string, string>> = {
  help_scout: "help-scout",
};
const RESERVED_EXPORTS = new Set([
  "Await",
  "Break",
  "Case",
  "Catch",
  "Class",
  "Const",
  "Continue",
  "Debugger",
  "Default",
  "Delete",
  "Do",
  "Else",
  "Enum",
  "Export",
  "Extends",
  "False",
  "Finally",
  "For",
  "Function",
  "If",
  "Import",
  "In",
  "Instanceof",
  "Let",
  "New",
  "Null",
  "Return",
  "Static",
  "Super",
  "Switch",
  "This",
  "Throw",
  "True",
  "Try",
  "Typeof",
  "Var",
  "Void",
  "While",
  "With",
  "Yield",
]);

type ToolkitSummary = Readonly<{
  slug: string;
  name: string;
  key: string;
  logo_url: string;
  actions_count: number;
  triggers_count: number;
}>;

type ParseToolkitPage = Readonly<{
  status: "success";
  data: Readonly<{
    toolkits: readonly ToolkitSummary[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }>;
}>;

type SourceToolkit = Readonly<{
  id: string;
  name: string;
  actionsCount: number;
  triggersCount: number;
}>;

type CatalogToolkit = Readonly<{
  id: string;
  name: string;
  image?: string;
}>;

type IconIndex = ReadonlyMap<string, ReadonlySet<IconModule>>;

type IconMatch = Readonly<{
  icon?: IconModule;
  ambiguous: boolean;
}>;

function isToolkitSummary(value: unknown): value is ToolkitSummary {
  if (!value || typeof value !== "object") return false;
  const toolkit = value as Record<string, unknown>;

  return (
    typeof toolkit.slug === "string" &&
    typeof toolkit.name === "string" &&
    typeof toolkit.key === "string" &&
    typeof toolkit.logo_url === "string" &&
    typeof toolkit.actions_count === "number" &&
    typeof toolkit.triggers_count === "number"
  );
}

function isAsciiLetterOrDigit(character: string): boolean {
  const code = character.codePointAt(0);
  if (code === undefined) return false;

  return (
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122)
  );
}

function toExportName(value: string): string {
  let exportName = "";
  let capitalizeNext = true;

  for (const character of value) {
    if (!isAsciiLetterOrDigit(character)) {
      capitalizeNext = true;
      continue;
    }

    exportName += capitalizeNext ? character.toUpperCase() : character;
    capitalizeNext = false;
  }

  const firstCode = exportName.codePointAt(0);
  const startsWithNumber =
    firstCode !== undefined && firstCode >= 48 && firstCode <= 57;

  if (!exportName || startsWithNumber || RESERVED_EXPORTS.has(exportName)) {
    return `Tool${exportName}`;
  }

  return exportName;
}

function normalizeName(value: string): string {
  let normalized = "";

  for (const character of value.toLowerCase()) {
    if (isAsciiLetterOrDigit(character)) normalized += character;
  }

  return normalized;
}

async function fetchText(url: string, headers?: HeadersInit): Promise<string> {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return response.text();
}

async function fetchFromParse(apiKey: string): Promise<SourceToolkit[]> {
  const toolkits: SourceToolkit[] = [];
  const limit = 200;
  let page = 1;
  let totalPages = 1;

  do {
    const url = new URL(PARSE_URL);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    const payload = JSON.parse(
      await fetchText(url.href, { "X-API-Key": apiKey }),
    ) as unknown;

    if (!payload || typeof payload !== "object") {
      throw new Error("Parse returned a non-object response");
    }

    const response = payload as Partial<ParseToolkitPage>;
    const data = response.data;
    if (
      response.status !== "success" ||
      !data ||
      !Array.isArray(data.toolkits) ||
      !data.toolkits.every(isToolkitSummary) ||
      typeof data.total_pages !== "number"
    ) {
      throw new Error("Parse returned an invalid toolkit page");
    }

    toolkits.push(
      ...data.toolkits.map(
        ({ slug, name, actions_count, triggers_count }) => ({
          id: slug,
          name,
          actionsCount: actions_count,
          triggersCount: triggers_count,
        }),
      ),
    );
    totalPages = data.total_pages;
    page += 1;
  } while (page <= totalPages);

  return toolkits;
}

function parseDocsHtml(html: string): SourceToolkit[] {
  const $ = load(html);
  const toolkits = new Map<string, SourceToolkit>();

  $(
    'a[href^="/toolkits/"], a[href^="https://docs.composio.dev/toolkits/"]',
  ).each((_, element) => {
    const anchor = $(element);
    const keyButton = anchor.find('button[aria-label^="Copy "]').first();
    if (!keyButton.length) return;

    const href = anchor.attr("href");
    const name = anchor
      .find("span.truncate.text-sm.font-medium.text-fd-foreground")
      .first()
      .text()
      .trim();
    if (!href || !name) return;

    const id = new URL(href, DOCS_URL).pathname.split("/").filter(Boolean).at(-1);
    if (!id) return;

    const counts = anchor
      .find("div.flex.items-center.gap-3.pl-12 > span")
      .map((_, span) => Number($(span).text().trim()))
      .get();

    toolkits.set(id, {
      id,
      name,
      actionsCount: counts[0] ?? 0,
      triggersCount: counts[1] ?? 0,
    });
  });

  return [...toolkits.values()];
}

async function fetchFromDocs(): Promise<SourceToolkit[]> {
  return parseDocsHtml(await fetchText(DOCS_URL));
}

async function getSourceToolkits(): Promise<SourceToolkit[]> {
  const apiKey = process.env.PARSE_API_KEY;
  if (apiKey) return fetchFromParse(apiKey);

  const htmlFile = process.env.TOOLKIT_HTML_FILE;
  const toolkits = htmlFile
    ? parseDocsHtml(await readFile(htmlFile, "utf8"))
    : fetchFromDocs();

  return toolkits;
}

function rankToolkits(toolkits: readonly SourceToolkit[]): SourceToolkit[] {
  const selected = new Map<string, SourceToolkit>();

  for (const toolkit of toolkits.slice(0, FEATURED_TOOLKIT_COUNT)) {
    selected.set(toolkit.id, toolkit);
  }

  for (const toolkit of toolkits) {
    if (REQUIRED_TOOLKITS.has(toolkit.id)) selected.set(toolkit.id, toolkit);
  }

  const remaining = toolkits
    .filter(({ id }) => !selected.has(id))
    .sort((left, right) => {
      const scoreDifference =
        right.actionsCount +
        right.triggersCount -
        (left.actionsCount + left.triggersCount);

      return scoreDifference || left.name.localeCompare(right.name);
    });

  for (const toolkit of remaining) {
    if (selected.size === CATALOG_LIMIT) break;
    selected.set(toolkit.id, toolkit);
  }

  return [...selected.values()];
}

function isIconModule(value: unknown): value is IconModule {
  if (!value || typeof value !== "object") return false;
  const icon = value as Partial<IconModule>;

  return (
    typeof icon.slug === "string" &&
    typeof icon.title === "string" &&
    Array.isArray(icon.aliases) &&
    icon.aliases.every((alias) => typeof alias === "string")
  );
}

function addToIndex(
  index: Map<string, Set<IconModule>>,
  key: string,
  icon: IconModule,
): void {
  if (!key) return;

  const matches = index.get(key);
  if (matches) {
    matches.add(icon);
  } else {
    index.set(key, new Set([icon]));
  }
}

function buildIconIndexes(icons: readonly IconModule[]): {
  bySlug: ReadonlyMap<string, IconModule>;
  exact: IconIndex;
  normalized: IconIndex;
} {
  const bySlug = new Map<string, IconModule>();
  const exact = new Map<string, Set<IconModule>>();
  const normalized = new Map<string, Set<IconModule>>();

  for (const icon of icons) {
    bySlug.set(icon.slug, icon);
    for (const name of [icon.slug, icon.title, ...icon.aliases]) {
      addToIndex(exact, name.toLowerCase(), icon);
      addToIndex(normalized, normalizeName(name), icon);
    }
  }

  return { bySlug, exact, normalized };
}

function findUniqueIcon(
  toolkit: SourceToolkit,
  index: IconIndex,
  normalize: (value: string) => string,
): IconMatch {
  const matches = new Set<IconModule>();

  for (const value of [toolkit.id, toolkit.name]) {
    for (const icon of index.get(normalize(value)) ?? []) matches.add(icon);
  }

  return {
    icon: matches.size === 1 ? [...matches][0] : undefined,
    ambiguous: matches.size > 1,
  };
}

function matchIcon(
  toolkit: SourceToolkit,
  bySlug: ReadonlyMap<string, IconModule>,
  exact: IconIndex,
  normalized: IconIndex,
): IconMatch {
  const slugMatch = bySlug.get(ICON_OVERRIDES[toolkit.id] ?? toolkit.id);
  if (slugMatch) return { icon: slugMatch, ambiguous: false };

  const exactMatch = findUniqueIcon(toolkit, exact, (value) =>
    value.toLowerCase(),
  );
  if (exactMatch.icon || exactMatch.ambiguous) return exactMatch;

  return findUniqueIcon(toolkit, normalized, normalizeName);
}

async function createCatalog(toolkits: readonly SourceToolkit[]): Promise<{
  catalog: CatalogToolkit[];
  matches: number;
  ambiguities: number;
}> {
  const require = createRequire(import.meta.url);
  const iconPackage = require("@thesvg/icons") as Record<string, unknown>;
  const icons = Object.values(iconPackage).filter(isIconModule);
  const { bySlug, exact, normalized } = buildIconIndexes(icons);
  const catalog: CatalogToolkit[] = [];
  let matches = 0;
  let ambiguities = 0;

  for (const toolkit of rankToolkits(toolkits)) {
    const match = matchIcon(toolkit, bySlug, exact, normalized);
    if (match.ambiguous) ambiguities += 1;
    if (match.icon) matches += 1;

    catalog.push({
      id: toolkit.id,
      name: toolkit.name,
      ...(match.icon
        ? { image: `${ICON_URL}/${match.icon.slug}/default.svg` }
        : {}),
    });
  }

  return { catalog, matches, ambiguities };
}

function formatCatalog(toolkits: readonly CatalogToolkit[]): string {
  const usedNames = new Set<string>();
  const exports = toolkits.map((toolkit) => {
    const baseName = toExportName(toolkit.name);
    const idSuffix = toExportName(toolkit.id);
    let exportName = baseName;
    let suffix = 2;

    if (usedNames.has(exportName)) {
      exportName = `${baseName}${idSuffix}`;
    }
    while (usedNames.has(exportName)) {
      exportName = `${baseName}${idSuffix}${suffix}`;
      suffix += 1;
    }

    usedNames.add(exportName);
    return { exportName, toolkit };
  });

  const declarations = exports
    .map(
      ({ exportName, toolkit }) =>
        `export const ${exportName}: ToolCatalogItem = ${JSON.stringify(toolkit)};`,
    )
    .join("\n");
  const catalogItems = exports
    .map(({ exportName }) => `  ${exportName},`)
    .join("\n");

  return `import type { ToolCatalogItem } from "./types";

// Add a tool by exporting one ToolCatalogItem here, then register it below.
${declarations}

export const toolCatalog: readonly ToolCatalogItem[] = [
${catalogItems}
];
`;
}

async function main(): Promise<void> {
  const sourceToolkits = await getSourceToolkits();
  if (sourceToolkits.length < CATALOG_LIMIT) {
    throw new Error(
      `Expected at least ${CATALOG_LIMIT} toolkits, received ${sourceToolkits.length}`,
    );
  }

  const { catalog, matches, ambiguities } = await createCatalog(sourceToolkits);
  await writeFile(CATALOG_FILE, formatCatalog(catalog));

  console.log(
    `Synced ${catalog.length} toolkits with ${matches} icon matches and ${ambiguities} ambiguities.`,
  );
}

await main();
