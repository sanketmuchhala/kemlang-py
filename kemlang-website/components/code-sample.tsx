"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface CodeSampleProps {
  code: string;
  language?: string;
  className?: string;
  highlight?: boolean;
}

const MULTI_KW = [
  "kem bhai","aavjo bhai","bhai bol","bapu tame bolo",
  "bhai chhe","bhai nathi","jya sudhi","tame jao",
  "aagal vado","nahi to",
];
const SINGLE_KW = ["aa","che","jo","nahi","farvu","true","false","to"];

function renderLine(line: string, idx: number): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let rem = line;
  let k = idx * 500;

  // Full-line / end-of-line comment
  const ci = rem.indexOf("//");
  let commentTail = "";
  if (ci !== -1) {
    commentTail = rem.slice(ci);
    rem = rem.slice(0, ci);
  }

  while (rem.length) {
    // Multi-word keywords
    let hit = false;
    for (const kw of MULTI_KW) {
      if (rem.startsWith(kw) && !/[a-zA-Z0-9_]/.test(rem[kw.length] ?? "")) {
        nodes.push(<span key={k++} className="t-kw">{kw}</span>);
        rem = rem.slice(kw.length);
        hit = true;
        break;
      }
    }
    if (hit) continue;

    // String
    if (rem[0] === '"' || rem[0] === "'") {
      const q = rem[0];
      const end = rem.indexOf(q, 1);
      if (end !== -1) {
        nodes.push(<span key={k++} className="t-str">{rem.slice(0, end + 1)}</span>);
        rem = rem.slice(end + 1);
        continue;
      }
    }

    // Number
    const nm = rem.match(/^-?\d+(\.\d+)?/);
    if (nm) {
      nodes.push(<span key={k++} className="t-num">{nm[0]}</span>);
      rem = rem.slice(nm[0].length);
      continue;
    }

    // Single keywords
    let sw = false;
    for (const kw of SINGLE_KW) {
      const re = new RegExp(`^${kw}(?![a-zA-Z0-9_])`);
      if (re.test(rem)) {
        nodes.push(<span key={k++} className="t-kw">{kw}</span>);
        rem = rem.slice(kw.length);
        sw = true;
        break;
      }
    }
    if (sw) continue;

    // Operator / bracket
    const op = rem.match(/^(==|!=|<=|>=|[+\-*/%<>!{}()\[\]=])/);
    if (op) {
      nodes.push(<span key={k++} className="t-op">{op[0]}</span>);
      rem = rem.slice(op[0].length);
      continue;
    }

    // Identifier
    const id = rem.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (id) {
      nodes.push(<span key={k++}>{id[0]}</span>);
      rem = rem.slice(id[0].length);
      continue;
    }

    nodes.push(<span key={k++}>{rem[0]}</span>);
    rem = rem.slice(1);
  }

  if (commentTail)
    nodes.push(<span key={k++} className="t-cmt">{commentTail}</span>);

  return nodes;
}

function highlightCode(code: string) {
  return code.split("\n").map((line, i) => (
    <span key={i}>
      {renderLine(line, i)}
      {i < code.split("\n").length - 1 ? "\n" : ""}
    </span>
  ));
}

export function CodeSample({ code, language = "jsk", className, highlight = true }: CodeSampleProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group rounded-xl overflow-hidden", className)}>
      <pre>
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{
            background: "hsl(var(--code-bg))",
            borderColor: "hsl(var(--border))",
          }}
        >
          <div className="flex gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-full" style={{ background: "#FF5F56" }} />
            <span className="block h-2.5 w-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
            <span className="block h-2.5 w-2.5 rounded-full" style={{ background: "#27C93F" }} />
          </div>
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{ color: "hsl(var(--cmt))" }}
          >
            {language}
          </span>
          <button
            onClick={copy}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: copied ? "hsl(var(--kw))" : "hsl(var(--cmt))" }}
          >
            {copied ? <><Check className="h-3 w-3" /> copied</> : <><Copy className="h-3 w-3" /> copy</>}
          </button>
        </div>

        {/* Code body */}
        <code
          className="block px-5 py-4 text-sm leading-[1.75] overflow-x-auto"
          style={{ color: "hsl(var(--code-fg))" }}
        >
          {highlight ? highlightCode(code) : code}
        </code>
      </pre>
    </div>
  );
}
