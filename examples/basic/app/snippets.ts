export const CATALOG_SNIPPET = `import { ToolCard, toolCatalog } from "ai-tool-elements";
import "ai-tool-elements/styles.css";

export function Integrations() {
  const [query, setQuery] = useState("");

  const matches = toolCatalog.filter((tool) =>
    tool.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="integrations">
      <input
        placeholder={\`Search \${toolCatalog.length} tools…\`}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {matches.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}`;

export const TOOL_CALL_SNIPPET = `import { Notion, ToolCallCard } from "ai-tool-elements";
import "ai-tool-elements/styles.css";

// AI SDK tool parts map straight through — state, input, output
{message.parts.map((part) =>
  part.type === "tool-createPage" ? (
    <ToolCallCard
      key={part.toolCallId}
      tool={Notion}
      state={part.state}
      input={part.input}
      output={formatPage(part.output)}
    />
  ) : null,
)}`;

export const TYPE_SNIPPET = `type Tool = Readonly<{
  id: string;
  name: string;
  description?: string;
  image?: ToolImage;
  fields?: readonly ToolField[];
}>;

type ToolCallState =
  | "input-streaming" | "input-available"
  | "approval-requested" | "approval-responded"
  | "output-available" | "output-error"
  | "output-denied" | "output-cancelled";

// your own tools type-check against the same shape
const weather = { id: "weather", name: "Weather API" } satisfies Tool;`;

export const CUSTOM_TOOL_SNIPPET = `import type { Tool } from "ai-tool-elements";

export const Acme = {
  id: "acme",
  name: "Acme",
  description: "A project-defined connector.",
  fields: [{ name: "apiKey", label: "API key", required: true }],
} as const satisfies Tool;

<ToolCard tool={Acme} />`;
