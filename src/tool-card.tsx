import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type ToolField = {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
};

export type Tool = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  fields?: readonly ToolField[];
};

type ToolCardOwnProps<T extends Tool> = {
  tool: T;
  as?: ElementType;
  className?: string;
  actions?: ReactNode;
  footer?: ReactNode;
};

export type ToolCardProps<
  T extends Tool = Tool,
  C extends ElementType = "article",
> = ToolCardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<C>, keyof ToolCardOwnProps<T> | "children"> & {
    as?: C;
  };

export function ToolCard<T extends Tool, C extends ElementType = "article">({
  tool,
  as,
  className,
  actions,
  footer,
  ...props
}: ToolCardProps<T, C>) {
  const Component: ElementType = as ?? "article";

  return (
    <Component
      className={["ai-tool-card", className].filter(Boolean).join(" ")}
      {...props}
    >
      <div className="ai-tool-card__header">
        {tool.image ? (
          <img
            className="ai-tool-card__logo"
            src={tool.image}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="ai-tool-card__logo ai-tool-card__logo--fallback" aria-hidden="true">
            {tool.name.trim().charAt(0).toUpperCase() || "?"}
          </span>
        )}

        <div className="ai-tool-card__copy">
          <h3 className="ai-tool-card__title">{tool.name}</h3>
          {tool.description && <p className="ai-tool-card__description">{tool.description}</p>}
        </div>

        {actions && <div className="ai-tool-card__actions">{actions}</div>}
      </div>

      {tool.fields?.length ? (
        <ul className="ai-tool-card__fields" aria-label={`${tool.name} fields`}>
          {tool.fields.map((field) => (
            <li className="ai-tool-card__field" key={field.name}>
              <span>
                <strong>{field.label ?? field.name}</strong>
                {field.description && <small>{field.description}</small>}
              </span>
              <span className="ai-tool-card__requirement">
                {field.required ? "Required" : "Optional"}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {footer && <div className="ai-tool-card__footer">{footer}</div>}
    </Component>
  );
}
