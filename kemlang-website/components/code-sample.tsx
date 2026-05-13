"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

interface CodeSampleProps {
  code: string;
  language?: string;
  className?: string;
  highlighted?: boolean;
}

const KEYWORDS = new Set([
  "kem bhai", "aavjo bhai", "bhai bol", "bapu tame bolo",
  "bhai chhe", "bhai nathi", "jya sudhi", "tame jao",
  "aagal vado", "nahi to", "aa", "che", "jo", "nahi", "farvu",
  "true", "false",
]);

function highlight(code: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, lineIdx) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Comment
    const commentIdx = remaining.indexOf("//");
    if (commentIdx !== -1) {
      const before = remaining.slice(0, commentIdx);
      const comment = remaining.slice(commentIdx);
      remaining = before;
      // process before, then append comment at end
      parts.push(...tokenizeLine(before, lineIdx * 100));
      parts.push(
        <span key={`cmt-${lineIdx}`} className="kem-cmt">{comment}</span>
      );
      return (
        <span key={lineIdx}>
          {parts}
          {lineIdx < lines.length - 1 ? "\n" : ""}
        </span>
      );
    }

    parts.push(...tokenizeLine(remaining, lineIdx * 100));
    return (
      <span key={lineIdx}>
        {parts}
        {lineIdx < lines.length - 1 ? "\n" : ""}
      </span>
    );
  });
}

function tokenizeLine(line: string, baseKey: number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = baseKey;

  while (remaining.length > 0) {
    // Multi-word keywords (longest first)
    const multiKws = [
      "kem bhai", "aavjo bhai", "bhai bol", "bapu tame bolo",
      "bhai chhe", "bhai nathi", "jya sudhi", "tame jao",
      "aagal vado", "nahi to",
    ];
    let matched = false;
    for (const kw of multiKws) {
      if (remaining.startsWith(kw)) {
        parts.push(<span key={key++} className="kem-kw">{kw}</span>);
        remaining = remaining.slice(kw.length);
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // String
    if (remaining[0] === '"' || remaining[0] === "'") {
      const q = remaining[0];
      const end = remaining.indexOf(q, 1);
      if (end !== -1) {
        const str = remaining.slice(0, end + 1);
        parts.push(<span key={key++} className="kem-str">{str}</span>);
        remaining = remaining.slice(end + 1);
        continue;
      }
    }

    // Number
    const numMatch = remaining.match(/^-?\d+(\.\d+)?/);
    if (numMatch) {
      parts.push(<span key={key++} className="kem-num">{numMatch[0]}</span>);
      remaining = remaining.slice(numMatch[0].length);
      continue;
    }

    // Single-char keywords / operators
    const singleKws = ["aa", "che", "jo", "nahi", "farvu", "true", "false"];
    let singleMatch = false;
    for (const kw of singleKws) {
      const regex = new RegExp(`^${kw}(?![a-zA-Z0-9_])`);
      if (regex.test(remaining)) {
        parts.push(<span key={key++} className="kem-kw">{kw}</span>);
        remaining = remaining.slice(kw.length);
        singleMatch = true;
        break;
      }
    }
    if (singleMatch) continue;

    // Operator
    const opMatch = remaining.match(/^(==|!=|<=|>=|[+\-*/%<>!{}()\[\]])/);
    if (opMatch) {
      parts.push(<span key={key++} className="kem-op">{opMatch[0]}</span>);
      remaining = remaining.slice(opMatch[0].length);
      continue;
    }

    // Identifier or plain text
    const wordMatch = remaining.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (wordMatch) {
      parts.push(<span key={key++}>{wordMatch[0]}</span>);
      remaining = remaining.slice(wordMatch[0].length);
      continue;
    }

    // Fallback: consume one char
    parts.push(<span key={key++}>{remaining[0]}</span>);
    remaining = remaining.slice(1);
  }

  return parts;
}

export function CodeSample({ code, language = "jsk", className, highlighted = true }: CodeSampleProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className={cn("relative group rounded-xl overflow-hidden border border-border/60", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/40">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
          {language}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <><Check className="h-3 w-3 text-green-400" /> Copied</>
          ) : (
            <><Copy className="h-3 w-3" /> Copy</>
          )}
        </button>
      </div>
      {/* Code */}
      <div style={{ background: "hsl(var(--code-bg))" }} className="p-5 overflow-x-auto">
        <pre className="text-sm leading-relaxed border-0 bg-transparent p-0 m-0">
          <code className="font-mono bg-transparent text-foreground/90">
            {highlighted ? highlight(code) : code}
          </code>
        </pre>
      </div>
    </div>
  );
}
