import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodeSample } from "@/components/code-sample";

export const metadata: Metadata = {
  title: "CLI Reference",
  description: "Complete reference for the kem command-line interface.",
};

const Block = ({ cmd, flag, desc, output }: { cmd: string; flag?: string; desc: string; output?: string }) => (
  <div className="rounded-xl border overflow-hidden mb-4" style={{ background: "hsl(var(--code-bg))" }}>
    <div className="flex items-center justify-between gap-4 px-5 py-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-primary select-none">$</span>
        <span className="font-mono text-sm font-medium" style={{ color: "hsl(var(--code-fg))" }}>{cmd}</span>
        {flag && <span className="font-mono text-xs text-muted-foreground">{flag}</span>}
      </div>
      <span className="text-xs text-muted-foreground hidden sm:block shrink-0">{desc}</span>
    </div>
    {output && (
      <pre className="px-5 py-3 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--cmt))" }}>{output}</pre>
    )}
  </div>
);

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t scroll-mt-20">{children}</h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

export default function CliPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">CLI Reference</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          The <code className="text-primary">kem</code> CLI
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The <code>kem</code> command-line tool is the only binary you need.
          It runs files, starts a REPL, formats code, and lets you inspect the token stream and AST.
        </p>
      </div>

      {/* Overview */}
      <div className="rounded-xl border overflow-hidden mb-10" style={{ background: "hsl(var(--code-bg))" }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">kem --help</span>
        </div>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`KemLang - A Gujarati-flavored programming language

Usage: kem [COMMAND]

Commands:
  run      Run a KemLang file
  repl     Start an interactive REPL
  fmt      Format KemLang files
  tokens   Show the token stream for a file
  ast      Show the Abstract Syntax Tree for a file
  version  Show version information

Options:
  --help   Show this message and exit`}</pre>
      </div>

      {/* kem run */}
      <H2 id="run">kem run</H2>
      <P>Execute a <code>.jsk</code> file. This is the main command you&apos;ll use.</P>

      <Block cmd="kem run hello.jsk" desc="Run a file" output="kem cho, Sanket!" />

      <h3 className="font-semibold text-sm mt-6 mb-2">Flags</h3>
      <div className="rounded-xl border overflow-hidden mb-6">
        <div className="grid grid-cols-[140px_1fr] border-b px-5 py-2.5" style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">flag</span>
          <span className="font-mono text-xs text-muted-foreground">description</span>
        </div>
        {[
          ["--trace", "Print the token stream and AST before running the program — useful for debugging"],
          ["--help",  "Show usage information for this command"],
        ].map(([flag, desc], i) => (
          <div key={flag} className="grid grid-cols-[140px_1fr] px-5 py-2.5 text-xs" style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <code className="font-mono" style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0, fontSize: "0.75rem" }}>{flag}</code>
            <span style={{ color: "hsl(var(--cmt))" }}>{desc}</span>
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-sm mt-6 mb-3">Running with trace</h3>
      <P>The <code>--trace</code> flag is invaluable when a program isn&apos;t behaving as expected — it shows you exactly how the interpreter sees your code.</P>
      <Block
        cmd="kem run hello.jsk --trace"
        desc="Run with token + AST output"
        output={`Tokens:
  KEM_BHAI        'kem bhai'       1:0
  BHAI_BOL        'bhai bol'       2:2
  STRING          '"kem cho!"'     2:10
  AAVJO_BHAI      'aavjo bhai'     3:0

AST:
Program
└── Print
    └── Literal: "kem cho!"

kem cho!`}
      />

      <h3 className="font-semibold text-sm mt-6 mb-3">File extensions</h3>
      <P>
        kemlang-py files use the <code>.jsk</code> extension. If you pass a file with a different extension,
        <code>kem run</code> will print a warning but still execute it.
      </P>

      {/* kem repl */}
      <H2 id="repl">kem repl</H2>
      <P>Start an interactive Read-Eval-Print Loop. Type kemlang-py code and press <kbd className="px-1.5 py-0.5 text-xs border rounded font-mono">Ctrl+D</kbd> (Unix) or <kbd className="px-1.5 py-0.5 text-xs border rounded font-mono">Ctrl+Z</kbd> (Windows) to execute.</P>

      <Block
        cmd="kem repl"
        desc="Start interactive REPL"
        output={`KemLang REPL v0.1.3
Type your code and press Ctrl+D (Unix) or Ctrl+Z (Windows) to execute.

>>> aa x che 10
    bhai bol x * 2
[Ctrl+D]
20

>>> `}
      />

      <P>The REPL automatically wraps your input in <code>kem bhai</code> / <code>aavjo bhai</code> if you don&apos;t include them — so you can skip the boilerplate when experimenting.</P>

      {/* kem fmt */}
      <H2 id="fmt">kem fmt</H2>
      <P>Format a <code>.jsk</code> file in-place, or check whether files are already formatted.</P>

      <Block cmd="kem fmt hello.jsk" desc="Format a file in place" output="Formatted hello.jsk" />
      <Block cmd="kem fmt ." desc="Format all .jsk files in current directory" output={`Formatted examples/hello.jsk\nFormatted examples/loop_and_if.jsk\nAlready formatted examples/errors.jsk`} />

      <h3 className="font-semibold text-sm mt-6 mb-3">Check mode</h3>
      <P>Use <code>--check</code> to verify formatting without modifying files — useful in CI or pre-commit hooks.</P>
      <Block
        cmd="kem fmt --check ."
        desc="Check without modifying"
        output={`Would format examples/hello.jsk\n1 file(s) need formatting\n\nExit code: 1`}
      />

      <h3 className="font-semibold text-sm mt-6 mb-3">What the formatter does</h3>
      <ul className="space-y-2 mb-6">
        {[
          "Normalises indentation to 2 spaces inside blocks",
          "Adds spaces around binary operators (a+b → a + b)",
          "Adds spaces around comparison operators",
          "Removes trailing whitespace",
          "Ensures a single newline at end of file",
        ].map((item) => (
          <li key={item} className="flex gap-2 text-sm text-muted-foreground">
            <span className="text-primary shrink-0">›</span>
            {item}
          </li>
        ))}
      </ul>

      {/* kem tokens */}
      <H2 id="tokens">kem tokens</H2>
      <P>Print the token stream produced by the lexer. Useful for understanding how kemlang-py reads your source code, and for debugging lexer issues.</P>

      <Block
        cmd="kem tokens hello.jsk"
        desc="Show lexer token stream"
        output={`Tokens for hello.jsk:
  KEM_BHAI        'kem bhai'       1:0
  BHAI_BOL        'bhai bol'       2:2
  STRING          '"kem cho!"'     2:10
  AAVJO_BHAI      'aavjo bhai'     3:0
  EOF             ''               4:0`}
      />

      <P>Each token shows: <strong>type</strong>, <strong>literal value</strong>, and <strong>line:column</strong> position in the source file.</P>

      <h3 className="font-semibold text-sm mt-6 mb-3">Token types</h3>
      <div className="rounded-xl border overflow-hidden">
        <div className="grid grid-cols-[160px_1fr] border-b px-5 py-2.5" style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">token type</span>
          <span className="font-mono text-xs text-muted-foreground">what it represents</span>
        </div>
        {[
          ["KEM_BHAI",      "kem bhai — program start"],
          ["AAVJO_BHAI",    "aavjo bhai — program end"],
          ["BHAI_BOL",      "bhai bol — print keyword"],
          ["AA",            "aa — variable declaration keyword"],
          ["CHE",           "che — assignment keyword"],
          ["JO",            "jo — if keyword"],
          ["NAHI_TO",       "nahi to — else keyword"],
          ["FARVU",         "farvu — loop body keyword"],
          ["JYA_SUDHI",     "jya sudhi — loop condition keyword"],
          ["TAME_JAO",      "tame jao — break"],
          ["AAGAL_VADO",    "aagal vado — continue"],
          ["BHAI_CHHE",     "bhai chhe / true"],
          ["BHAI_NATHI",    "bhai nathi / false"],
          ["STRING",        "a string literal"],
          ["INTEGER",       "an integer literal"],
          ["FLOAT",         "a decimal literal"],
          ["IDENTIFIER",    "a variable name"],
          ["EOF",           "end of file"],
        ].map(([type, desc], i) => (
          <div key={type} className="grid grid-cols-[160px_1fr] px-5 py-2 text-xs" style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <code className="font-mono" style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0, fontSize: "0.72rem" }}>{type}</code>
            <span style={{ color: "hsl(var(--cmt))" }}>{desc}</span>
          </div>
        ))}
      </div>

      {/* kem ast */}
      <H2 id="ast">kem ast</H2>
      <P>Pretty-print the Abstract Syntax Tree that the parser builds from your source. Useful for understanding how kemlang-py parsed your program.</P>

      <CodeSample highlight={false} language="jsk" code={`kem bhai
  aa x che 10
  jo x > 5 {
    bhai bol "big"
  }
aavjo bhai`} />

      <Block
        cmd="kem ast example.jsk"
        desc="Show the parsed AST"
        output={`AST for example.jsk:
Program
├── Declaration (x)
│   └── Literal: 10
└── If
    ├── Condition: Binary (>)
    │   ├── Left: Variable (x)
    │   └── Right: Literal: 5
    └── Then:
        └── Print
            └── Literal: "big"`}
      />

      {/* kem version */}
      <H2 id="version">kem version</H2>
      <P>Print the installed version of kemlang-py.</P>
      <Block cmd="kem version" desc="Show version" output="KemLang 0.1.3" />

      {/* Exit codes */}
      <H2 id="exit-codes">Exit codes</H2>
      <P>All <code>kem</code> commands follow standard exit code conventions:</P>
      <div className="rounded-xl border overflow-hidden">
        <div className="grid grid-cols-[80px_1fr] border-b px-5 py-2.5" style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">code</span>
          <span className="font-mono text-xs text-muted-foreground">meaning</span>
        </div>
        {[
          ["0", "Success — program ran without errors"],
          ["1", "Error — lexer, parser, or runtime error occurred"],
          ["2", "Usage error — wrong command or missing argument"],
        ].map(([code, desc], i) => (
          <div key={code} className="grid grid-cols-[80px_1fr] px-5 py-2.5 text-xs" style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <code className="font-mono" style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0, fontSize: "0.75rem" }}>{code}</code>
            <span style={{ color: "hsl(var(--cmt))" }}>{desc}</span>
          </div>
        ))}
      </div>
      <P>Use exit codes in shell scripts to check whether a program succeeded:</P>
      <CodeSample highlight={false} language="bash" code={`kem run my_program.jsk && echo "Success" || echo "Failed"`} />

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/examples" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Examples
        </Link>
        <Link href="/docs/errors" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80">
          Error reference <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
