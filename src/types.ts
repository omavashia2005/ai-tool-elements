export type ToolField = Readonly<{
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}>;

export type ToolImage =
  | Readonly<{ type: "svg"; content: string }>
  | Readonly<{ type: "url"; src: string }>;

export type ToolCallState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied"
  | "output-cancelled";

export type Tool = Readonly<{
  id: string;
  name: string;
  description?: string;
  image?: ToolImage;
  fields?: readonly ToolField[];
}>;

export type ToolCatalogItem = Tool;
