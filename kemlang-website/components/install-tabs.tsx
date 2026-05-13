"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

const installMethods = [
  {
    id: "npm",
    label: "npm",
    icon: "⬡",
    install: "npm install -g kemlang-py",
    verify: "kem version",
    note: "Requires Node.js 14+ and Python 3.10+",
  },
  {
    id: "pip",
    label: "pip",
    icon: "🐍",
    install: "pip install kemlang-py",
    verify: "kem version",
    note: "Requires Python 3.10+",
  },
  {
    id: "source",
    label: "source",
    icon: "⌥",
    install: "git clone https://github.com/sanketmuchhala/kemlang-py\ncd kemlang-py\npip install -e .",
    verify: "kem version",
    note: "For contributors and local development",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
    >
      {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function CommandBlock({ code }: { code: string }) {
  return (
    <div
      className="relative group rounded-lg border border-border/60 overflow-hidden"
      style={{ background: "hsl(var(--code-bg))" }}
    >
      <div className="px-4 py-3">
        <pre className="font-mono text-sm text-foreground/90 whitespace-pre">{code}</pre>
      </div>
      <CopyButton text={code} />
    </div>
  );
}

export function InstallTabs() {
  const [active, setActive] = useState("npm");
  const method = installMethods.find((m) => m.id === active)!;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-lg mb-5 w-fit"
        style={{ background: "hsl(var(--muted))" }}
      >
        {installMethods.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
              active === m.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Install
          </p>
          <CommandBlock code={method.install} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Verify
          </p>
          <CommandBlock code={method.verify} />
        </div>
        <p className="text-xs text-muted-foreground">{method.note}</p>
      </div>
    </div>
  );
}
