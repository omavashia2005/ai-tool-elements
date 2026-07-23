export type ToolField = Readonly<{
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
}>;

export type Tool = Readonly<{
  id: string;
  name: string;
  description?: string;
  image?: string;
  fields?: readonly ToolField[];
}>;

export type ToolCatalogItem = Tool & Readonly<{ image: string }>;
