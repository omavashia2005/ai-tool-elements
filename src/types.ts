export type ToolField = Readonly<{
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}>;

export type ToolImage =
  | Readonly<{ type: "svg"; content: string }>
  | Readonly<{ type: "url"; src: string }>;

export type Tool = Readonly<{
  id: string;
  name: string;
  description?: string;
  image?: ToolImage;
  fields?: readonly ToolField[];
}>;

export type ToolCatalogItem = Tool;
