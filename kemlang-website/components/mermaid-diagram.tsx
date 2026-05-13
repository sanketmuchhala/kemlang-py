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

      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        darkMode: resolvedTheme === "dark",
        themeVariables:
          resolvedTheme === "dark"
            ? {
                primaryColor: "#0d2b1e",
                primaryTextColor: "#e2e8f0",
                primaryBorderColor: "#34d39944",
                lineColor: "#34d399",
                secondaryColor: "#0d1f18",
                tertiaryColor: "#111827",
                background: "#0c1012",
                mainBkg: "#0d2b1e",
                nodeBorder: "#34d39966",
                clusterBkg: "#0d1f18",
                titleColor: "#34d399",
                edgeLabelBackground: "#0c1012",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "13px",
              }
            : {
                primaryColor: "#ecfdf5",
                primaryTextColor: "#064e3b",
                primaryBorderColor: "#10b98144",
                lineColor: "#059669",
                secondaryColor: "#f0fdf4",
                tertiaryColor: "#f9fafb",
                background: "#ffffff",
                mainBkg: "#ecfdf5",
                nodeBorder: "#10b98166",
                titleColor: "#059669",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "13px",
              },
      });

      if (cancelled || !ref.current) return;

      const divId = `mermaid-${id}`;
      ref.current.innerHTML = "";
      const { svg } = await mermaid.render(divId, chart);
      if (!cancelled && ref.current) {
        ref.current.innerHTML = svg;
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart, id, resolvedTheme]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    />
  );
}
