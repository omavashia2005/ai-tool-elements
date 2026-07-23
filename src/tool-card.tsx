import type { ComponentProps, JSX, ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Tool } from "@/types";

export type ToolCardProps<T extends Tool = Tool> = Omit<
  ComponentProps<typeof Card>,
  "children"
> & {
  tool: T;
  actions?: ReactNode;
  footer?: ReactNode;
};

export function ToolCard<T extends Tool = Tool>({
  tool,
  actions,
  footer,
  ...props
}: ToolCardProps<T>): JSX.Element {
  return (
    <Card {...props}>
      <CardHeader className="flex flex-row items-start gap-3">
        {tool.image ? (
          <img
            className="size-10 rounded-md object-contain"
            src={tool.image}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <CardTitle>{tool.name}</CardTitle>
          {tool.description ? (
            <CardDescription>{tool.description}</CardDescription>
          ) : null}
        </div>

        {actions ? <CardAction>{actions}</CardAction> : null}
      </CardHeader>

      {tool.fields?.length ? (
        <CardContent>
          <ul className="flex flex-col gap-3" aria-label={`${tool.name} fields`}>
            {tool.fields.map((field) => (
              <li className="flex items-start justify-between gap-4" key={field.name}>
                <span className="flex flex-col gap-1">
                  <strong>{field.label ?? field.name}</strong>
                  {field.description ? (
                    <small className="text-muted-foreground">{field.description}</small>
                  ) : null}
                </span>
                <small className="text-muted-foreground">
                  {field.required ? "Required" : "Optional"}
                </small>
              </li>
            ))}
          </ul>
        </CardContent>
      ) : null}

      {footer ? <CardFooter className="border-t">{footer}</CardFooter> : null}
    </Card>
  );
}
