"use client";

import { useEffect, useRef, useState } from "react";
import type { JSX, ReactNode } from "react";

// Animates container height when children resize, so state changes glide
// instead of jumping the layout below.
export function SmoothResize({ children }: { children: ReactNode }): JSX.Element {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setHeight(Math.ceil(el.getBoundingClientRect().height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="smooth-resize" style={height ? { height } : undefined}>
      <div ref={inner}>{children}</div>
    </div>
  );
}
