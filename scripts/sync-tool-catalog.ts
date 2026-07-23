import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

import { load } from "cheerio";

const DOCS_URL = "https://docs.composio.dev/toolkits";
const PARSE_URL =
  "https://api.parse.bot/scraper/8e464fbd-d473-428f-996d-174a82b024a8/list_toolkits";
const ARTIFACT_URL = "/artifacts/tool-logos";
const ARTIFACT_DIR = "public/artifacts/tool-logos";
const CATALOG_FILE = "src/tool-catalog.ts";
const MINIMUM_TOOLKIT_COUNT = 1_403;
const DOWNLOAD_WORKERS = 16;
const IMAGE_EXTENSIONS: Readonly<Record<string, string>> = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/vnd.microsoft.icon": "ico",
  "image/webp": "webp",
  "image/x-icon": "ico",
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
  logoUrl?: string;
}>;

type CatalogToolkit = Readonly<{
  id: string;
  name: string;
  image?: string;
}>;

type DownloadedImage = Readonly<{
  bytes: Buffer;
  extension: string;
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

function assertSafeId(id: string): void {
  if (!id || basename(id) !== id || id === "." || id === "..") {
    throw new Error(`Unsafe toolkit id: ${JSON.stringify(id)}`);
  }
}

async function fetchText(url: string, headers?: HeadersInit): Promise<string> {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return response.text();
}

async function fetchFromParse(apiKey: string): Promise<SourceToolkit[]> {
  const toolkits: ToolkitSummary[] = [];
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

    toolkits.push(...data.toolkits);
    totalPages = data.total_pages;
    page += 1;
  } while (page <= totalPages);

  return toolkits.map(({ slug, name, logo_url }) => ({
    id: slug,
    name,
    logoUrl: logo_url || undefined,
  }));
}

function parseDocsHtml(html: string): SourceToolkit[] {
  const $ = load(html);
  const toolkits = new Map<string, SourceToolkit>();

  $('a[href^="https://docs.composio.dev/toolkits/"]').each((_, element) => {
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

    const id = new URL(href).pathname.split("/").filter(Boolean).at(-1);
    if (!id) return;

    toolkits.set(id, {
      id,
      name,
      logoUrl: anchor.find("img").first().attr("src"),
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
  return htmlFile
    ? parseDocsHtml(await readFile(htmlFile, "utf8"))
    : fetchFromDocs();
}

async function localizeLogo(toolkit: SourceToolkit): Promise<CatalogToolkit> {
  assertSafeId(toolkit.id);
  if (!toolkit.logoUrl) return { id: toolkit.id, name: toolkit.name };

  const fallbackUrl = `https://logos.composio.dev/api/${encodeURIComponent(toolkit.id)}`;
  const urls = new Set([toolkit.logoUrl, fallbackUrl]);

  for (const url of urls) {
    const image = await downloadImage(url);
    if (!image) continue;

    const filename = `${toolkit.id}.${image.extension}`;
    await writeFile(join(ARTIFACT_DIR, filename), image.bytes);

    return {
      id: toolkit.id,
      name: toolkit.name,
      image: `${ARTIFACT_URL}/${filename}`,
    };
  }

  return { id: toolkit.id, name: toolkit.name };
}

async function downloadImage(url: string): Promise<DownloadedImage | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;

    const mediaType = response.headers.get("content-type")?.split(";")[0];
    const extension = mediaType ? IMAGE_EXTENSIONS[mediaType] : undefined;
    if (!extension) return undefined;

    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length) return undefined;

    return {
      bytes,
      extension,
    };
  } catch {
    return undefined;
  }
}

async function localizeLogos(toolkits: readonly SourceToolkit[]): Promise<CatalogToolkit[]> {
  const queue = [...toolkits];
  const catalog: CatalogToolkit[] = [];

  async function worker(): Promise<void> {
    for (;;) {
      const toolkit = queue.shift();
      if (!toolkit) return;
      catalog.push(await localizeLogo(toolkit));
    }
  }

  await Promise.all(Array.from({ length: DOWNLOAD_WORKERS }, () => worker()));
  return catalog.sort((left, right) => left.name.localeCompare(right.name));
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

${declarations}

export const toolCatalog: readonly ToolCatalogItem[] = [
${catalogItems}
];
`;
}

async function removeStaleAssets(toolkits: readonly CatalogToolkit[]): Promise<void> {
  const usedFiles = new Set(
    toolkits.flatMap(({ image }) => (image ? [basename(image)] : [])),
  );

  await Promise.all(
    (await readdir(ARTIFACT_DIR))
      .filter((filename) => !usedFiles.has(filename))
      .map((filename) => unlink(join(ARTIFACT_DIR, filename))),
  );
}

async function main(): Promise<void> {
  const sourceToolkits = await getSourceToolkits();
  if (sourceToolkits.length < MINIMUM_TOOLKIT_COUNT) {
    throw new Error(
      `Expected at least ${MINIMUM_TOOLKIT_COUNT} toolkits, received ${sourceToolkits.length}`,
    );
  }

  await mkdir(ARTIFACT_DIR, { recursive: true });
  const catalog = await localizeLogos(sourceToolkits);
  await removeStaleAssets(catalog);
  await writeFile(CATALOG_FILE, formatCatalog(catalog));

  const logoCount = catalog.filter(({ image }) => image).length;
  console.log(`Synced ${catalog.length} toolkits with ${logoCount} local logos.`);
}

await main();
