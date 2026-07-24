"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { JSX } from "react";

export function CopyButton({ text }: { text: string }): JSX.Element {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="copy-button"
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
    </button>
  );
}
