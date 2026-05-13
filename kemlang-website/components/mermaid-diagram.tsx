"use client";

import { useEffect, useRef, useId } from "react";
import { useTheme } from "next-themes";

export function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = "m" + useId().replace(/[^a-z0-9]/gi, "");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;
    let alive = true;

    (async () => {
      const { default: mermaid } = await import("mermaid");
      if (!alive || !ref.current) return;

      const dark = resolvedTheme !== "light";

      mermaid.initialize({
        startOnLoad: false,
        theme: dark ? "dark" : "neutral",
        fontFamily: "JetBrains Mono, ui-monospace, monospace",
        fontSize: 12,
        flowchart: { curve: "basis", padding: 20, useMaxWidth: true },
        themeVariables: dark
          ? {
              lineColor: "#34d399",
              primaryBorderColor: "#34d39966",
              edgeLabelBackground: "transparent",
            }
          : {
              lineColor: "#059669",
              primaryBorderColor: "#10b98166",
              edgeLabelBackground: "transparent",
            },
      });

      try {
        ref.current.innerHTML = "";
        const { svg } = await mermaid.render(uid, chart);
        if (alive && ref.current) {
          ref.current.innerHTML = svg;
          const el = ref.current.querySelector("svg");
          if (el) {
            el.style.maxWidth = "100%";
            el.style.height = "auto";
          }
        }
      } catch {
        // silent on invalid chart definitions
      }
    })();

    return () => { alive = false; };
  }, [chart, uid, resolvedTheme]);

  return <div ref={ref} className="flex justify-center min-h-[80px] py-2" />;
}
