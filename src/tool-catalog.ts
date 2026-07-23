import type { Tool } from "./tool-card";

export type ToolCatalogItem = Tool & { image: string };

// ponytail: seed catalog only; automate the full import when consumers need more than the common tools.
export const toolCatalog = [
  {
    id: "github",
    name: "GitHub",
    image: "/artifacts/tool-logos/github.svg",
    description: "Source control and software collaboration.",
  },
  {
    id: "gmail",
    name: "Gmail",
    image: "/artifacts/tool-logos/gmail.svg",
    description: "Email and mailbox workflows.",
  },
  {
    id: "slack",
    name: "Slack",
    image: "/artifacts/tool-logos/slack.svg",
    description: "Team messaging and collaboration.",
  },
  {
    id: "notion",
    name: "Notion",
    image: "/artifacts/tool-logos/notion.svg",
    description: "Documents, knowledge bases, and project workspaces.",
  },
  {
    id: "googlesheets",
    name: "Google Sheets",
    image: "/artifacts/tool-logos/google-sheets.svg",
    description: "Cloud spreadsheets and tabular data.",
  },
  {
    id: "shopify",
    name: "Shopify",
    image: "/artifacts/tool-logos/shopify.svg",
    description: "Online stores, products, and orders.",
  },
  {
    id: "googledrive",
    name: "Google Drive",
    image: "/artifacts/tool-logos/google-drive.svg",
    description: "Cloud files and folders.",
  },
  {
    id: "supabase",
    name: "Supabase",
    image: "/artifacts/tool-logos/supabase.svg",
    description: "Databases, authentication, and backend services.",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    image: "/artifacts/tool-logos/hubspot.svg",
    description: "Customer relationship and marketing workflows.",
  },
  {
    id: "ably",
    name: "Ably",
    image: "/artifacts/tool-logos/ably.svg",
    description: "Realtime messaging and data delivery.",
  },
] as const satisfies readonly ToolCatalogItem[];
