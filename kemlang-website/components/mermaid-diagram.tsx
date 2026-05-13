"use client";

import { useEffect, useRef, useId } from "react";
import { useTheme } from "next-themes";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;

      const dark = resolvedTheme === "dark";

      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: dark
          ? {
              // backgrounds
              background:           "#0c1012",
              mainBkg:              "#0d1f18",
              secondaryBkg:         "#0d1f18",
              tertiaryBkg:          "#111827",
              clusterBkg:           "#0d1a14",
              // text
              primaryTextColor:     "#e2e8f0",
              secondaryTextColor:   "#94a3b8",
              tertiaryTextColor:    "#64748b",
              // borders / lines
              primaryBorderColor:   "#34d39955",
              secondaryBorderColor: "#34d39933",
              tertiaryBorderColor:  "#1e293b",
              lineColor:            "#34d399",
              edgeLabelBackground:  "#0c1012",
              // nodes
              primaryColor:         "#0d1f18",
              secondaryColor:       "#0d1f18",
              tertiaryColor:        "#111827",
              nodeBorder:           "#34d39955",
              // accents
              titleColor:           "#34d399",
              labelColor:           "#e2e8f0",
              // clusters / subgraphs
              clusterBorder:        "#1e293b",
              fillType0:            "#0d1f18",
              fillType1:            "#0f2920",
              fillType2:            "#111827",
              // fonts
              fontFamily:           "JetBrains Mono, monospace",
              fontSize:             "12px",
            }
          : {
              background:           "#ffffff",
              mainBkg:              "#ecfdf5",
              secondaryBkg:         "#f0fdf4",
              tertiaryBkg:          "#f9fafb",
              clusterBkg:           "#d1fae5",
              primaryTextColor:     "#064e3b",
              secondaryTextColor:   "#374151",
              tertiaryTextColor:    "#6b7280",
              primaryBorderColor:   "#10b98155",
              secondaryBorderColor: "#10b98133",
              tertiaryBorderColor:  "#e5e7eb",
              lineColor:            "#059669",
              edgeLabelBackground:  "#ffffff",
              primaryColor:         "#ecfdf5",
              secondaryColor:       "#f0fdf4",
              tertiaryColor:        "#f9fafb",
              nodeBorder:           "#10b98155",
              titleColor:           "#059669",
              labelColor:           "#064e3b",
              clusterBorder:        "#d1fae5",
              fontFamily:           "JetBrains Mono, monospace",
              fontSize:             "12px",
            },
        flowchart: {
          curve: "basis",
          padding: 20,
          useMaxWidth: true,
        },
      });

      if (cancelled || !ref.current) return;

      ref.current.innerHTML = "";
      const divId = `mermaid-${id}`;
      const { svg } = await mermaid.render(divId, chart);
      if (!cancelled && ref.current) {
        ref.current.innerHTML = svg;
        // make svg fill the container width cleanly
        const svgEl = ref.current.querySelector("svg");
        if (svgEl) {
          svgEl.style.maxWidth = "100%";
          svgEl.style.height = "auto";
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart, id, resolvedTheme]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80px" }}
    />
  );
}
