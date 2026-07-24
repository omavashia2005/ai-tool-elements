"use client";

import { useState } from "react";
import type { JSX, ReactNode } from "react";

const GROUPS = [
  {
    label: "Components",
    items: [
      { id: "tool-call-card", label: "ToolCallCard" },
      { id: "tool-card", label: "ToolCard" },
      { id: "custom", label: "Custom" },
    ],
  },
] as const;

type TabId = "tool-call-card" | "tool-card" | "custom";

const ALL_TABS = GROUPS.flatMap((group) => group.items);

export function ComponentViewer({
  views,
}: {
  views: Record<TabId, ReactNode>;
}): JSX.Element {
  const [active, setActive] = useState<TabId>("tool-call-card");

  return (
    <div className="viewer">
      <nav className="viewer-nav" aria-label="Components">
        {GROUPS.map((group) => (
          <div className="viewer-group" key={group.label}>
            <p className="viewer-group-label">{group.label}</p>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  active === item.id ? "viewer-tab active" : "viewer-tab"
                }
                aria-current={active === item.id}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="viewer-panel">
        {ALL_TABS.map((tab) => (
          <div key={tab.id} hidden={active !== tab.id}>
            {views[tab.id]}
          </div>
        ))}
      </div>
    </div>
  );
}
