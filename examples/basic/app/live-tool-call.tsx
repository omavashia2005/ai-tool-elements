"use client";

import {
  Notion,
  ToolCallCard,
  type Tool,
  type ToolCallState,
} from "ai-tool-elements";
import { useEffect, useState } from "react";
import type { JSX, ReactNode } from "react";

import { Example } from "./example";
import { SmoothResize } from "./smooth-resize";

const pageTool = {
  ...Notion,
  description: "pages.create",
} as const satisfies Tool;

const INPUT = {
  parent: "Team Wiki",
  title: "Launch checklist",
};

type Step = Readonly<{
  state: ToolCallState;
  input: unknown;
  output?: string;
}>;

const STEPS: readonly Step[] = [
  { state: "input-streaming", input: '{ "parent": "Team Wiki",' },
  {
    state: "input-streaming",
    input: '{ "parent": "Team Wiki", "title": "Launch chec',
  },
  { state: "input-available", input: INPUT },
  { state: "approval-requested", input: INPUT },
  { state: "approval-responded", input: INPUT },
  {
    state: "output-available",
    input: INPUT,
    output: "Created “Launch checklist” in Team Wiki.",
  },
];

const STEP_MS = 1500;
const HOLD_MS = 3600;

export function LiveToolCall({ code }: { code: ReactNode }): JSX.Element {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIndex(STEPS.length - 1);
      return;
    }
    const timer = setTimeout(
      () => setIndex((index + 1) % STEPS.length),
      index === STEPS.length - 1 ? HOLD_MS : STEP_MS,
    );
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="live-demo">
      <Example title="agent — localhost:3000" code={code}>
        <p className="chat-user">Draft a launch checklist in our wiki</p>
        <SmoothResize>
          <ToolCallCard
            className="showcase-card live-card"
            tool={pageTool}
            state={step.state}
            input={step.input}
            output={step.output}
          />
        </SmoothResize>
        {step.state === "output-available" ? (
          <p className="chat-assistant">
            Done — the checklist is live in Team Wiki with 6 items.
          </p>
        ) : (
          <p className="chat-typing" aria-hidden>
            <span />
            <span />
            <span />
          </p>
        )}
      </Example>
    </div>
  );
}
