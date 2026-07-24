import type { ComponentProps, JSX, ReactNode } from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ToolCardHeader } from "@/tool-card";
import type { Tool, ToolCallState } from "@/types";

const stateLabels: Record<ToolCallState, string> = {
  "input-streaming": "Pending",
  "input-available": "Running",
  "approval-requested": "Awaiting approval",
  "approval-responded": "Responded",
  "output-available": "Completed",
  "output-error": "Error",
  "output-denied": "Denied",
  "output-cancelled": "Cancelled",
};

function formatValue(value: unknown): string {
  return typeof value === "string"
    ? value
    : (JSON.stringify(value, null, 2) ?? String(value));
}

export type ToolCallCardProps<T extends Tool = Tool> = Omit<
  ComponentProps<typeof Card>,
  "children"
> & {
  tool: T;
  state: ToolCallState;
  input?: unknown;
  output?: ReactNode;
  errorText?: string;
  actions?: ReactNode;
  footer?: ReactNode;
};

export function ToolCallCard<T extends Tool = Tool>({
  tool,
  state,
  input,
  output,
  errorText,
  actions,
  footer,
  ...props
}: ToolCallCardProps<T>): JSX.Element {
  return (
    <Card {...props} data-state={state}>
      <ToolCardHeader
        tool={tool}
        actions={
          <div className="flex items-center gap-2">
            <span
              className="rounded-full border px-2 py-1 text-xs text-muted-foreground"
              role="status"
            >
              {stateLabels[state]}
            </span>
            {actions}
          </div>
        }
      />

      {input !== undefined ? (
        <CardContent>
          <strong className="text-sm">Input</strong>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
            {formatValue(input)}
          </pre>
        </CardContent>
      ) : null}

      {state === "output-available" && output !== undefined ? (
        <CardContent>
          <strong className="text-sm">Output</strong>
          <div className="mt-2 text-sm text-muted-foreground">{output}</div>
        </CardContent>
      ) : null}

      {state === "output-error" ||
      state === "output-denied" ||
      state === "output-cancelled" ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {errorText ??
              (state === "output-error"
                ? "The tool call failed."
                : state === "output-denied"
                  ? "The tool call was denied."
                  : "The tool call was cancelled.")}
          </p>
        </CardContent>
      ) : null}

      {footer ? <CardFooter className="border-t">{footer}</CardFooter> : null}
    </Card>
  );
}
