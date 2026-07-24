"use client";

import { useState } from "react";
import type { JSX, ReactNode } from "react";

// Standard frame for every component example: window chrome, a mono title,
// and slug tabs toggling between the live component and its code.
export function Example({
  title,
  code,
  children,
}: {
  title: string;
  code: ReactNode;
  children: ReactNode;
}): JSX.Element {
  const [view, setView] = useState<"component" | "code">("component");

  return (
    <figure className="app-frame">
      <figcaption className="app-frame-bar">
        <span className="frame-dot" />
        <span className="frame-dot" />
        <span className="frame-dot" />
        <span className="frame-title">{title}</span>
        <span className="frame-tabs" role="tablist">
          {(["component", "code"] as const).map((slug) => (
            <button
              key={slug}
              type="button"
              role="tab"
              aria-selected={view === slug}
              className={view === slug ? "frame-tab active" : "frame-tab"}
              onClick={() => setView(slug)}
            >
              {slug}
            </button>
          ))}
        </span>
      </figcaption>
      <div className="app-frame-body" hidden={view !== "component"}>
        {children}
      </div>
      <div className="app-frame-body" hidden={view !== "code"}>
        {code}
      </div>
    </figure>
  );
}
