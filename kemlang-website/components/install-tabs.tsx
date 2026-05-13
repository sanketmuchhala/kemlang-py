"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

const methods = [
  {
    id: "npm",
    label: "npm",
    steps: [
      { label: "install", cmd: "npm install -g kemlang-py" },
      { label: "verify",  cmd: "kem version" },
    ],
    note: "Requires Node.js 14+ and Python 3.10+",
  },
  {
    id: "pip",
    label: "pip",
    steps: [
      { label: "install", cmd: "pip install kemlang-py" },
      { label: "verify",  cmd: "kem version" },
    ],
    note: "Requires Python 3.10+",
  },
  {
    id: "src",
    label: "source",
    steps: [
      { label: "clone",   cmd: "git clone https://github.com/sanketmuchhala/kemlang-py" },
      { label: "install", cmd: "pip install -e kemlang-py/." },
      { label: "verify",  cmd: "kem version" },
    ],
    note: "For contributors and local development",
  },
];

function Cmd({ label, cmd }: { label: string; cmd: string }) {
  const [ok, setOk] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(cmd); } catch {}
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 font-medium">
        {label}
      </p>
      <div
        className="group relative flex items-center justify-between gap-3 rounded-lg border px-4 py-3 font-mono text-sm"
        style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}
      >
        <span style={{ color: "hsl(var(--code-fg))" }}>
          <span style={{ color: "hsl(var(--kw))" }} className="select-none mr-2">$</span>
          {cmd}
        </span>
        <button
          onClick={copy}
          className="shrink-0 transition-colors"
          style={{ color: ok ? "hsl(var(--kw))" : "hsl(var(--cmt))" }}
        >
          {ok ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

export function InstallTabs() {
  const [active, setActive] = useState("npm");
  const m = methods.find((x) => x.id === active)!;

  return (
    <div>
      <div className="flex gap-1 mb-5 border-b">
        {methods.map((x) => (
          <button
            key={x.id}
            onClick={() => setActive(x.id)}
            className={cn(
              "px-3 pb-2.5 pt-1 text-sm font-medium border-b-2 -mb-px transition-colors",
              active === x.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {m.steps.map((s) => <Cmd key={s.label} {...s} />)}
        <p className="text-xs text-muted-foreground pt-1">{m.note}</p>
      </div>
    </div>
  );
}
