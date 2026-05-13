import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How it works",
  description: "A detailed look at kemlang-py's internals — the pipeline, data structures, and tech stack.",
};

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t scroll-mt-20">{children}</h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: "hsl(var(--code-bg))", color: "hsl(var(--kw))" }}>{children}</code>
);

const StageBox = ({
  step,
  name,
  file,
  input,
  output,
  desc,
  accent,
}: {
  step: string;
  name: string;
  file: string;
  input: string;
  output: string;
  desc: string;
  accent: string;
}) => (
  <div className="rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
    <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: "hsl(var(--border))" }}>
      <span className="font-display text-2xl leading-none" style={{ color: accent }}>{step}</span>
      <div>
        <p className="font-semibold text-sm">{name}</p>
        <p className="font-mono text-xs text-muted-foreground">{file}</p>
      </div>
    </div>
    <div className="px-5 py-4 grid grid-cols-[1fr_auto_1fr] gap-3 items-center border-b text-xs" style={{ borderColor: "hsl(var(--border))" }}>
      <div className="rounded-lg border px-3 py-2 text-center font-mono" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--cmt))" }}>
        {input}
      </div>
      <span style={{ color: accent }}>→</span>
      <div className="rounded-lg border px-3 py-2 text-center font-mono" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--kw))" }}>
        {output}
      </div>
    </div>
    <p className="px-5 py-3 text-xs text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

export default function InternalsPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Internals</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          How it works
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          kemlang-py is a tree-walking interpreter written in pure Python.
          This page walks through every stage of the pipeline — from raw source text
          to executed output — and lists every library the project depends on.
        </p>
      </div>

      {/* Top-level pipeline */}
      <H2 id="pipeline">The full pipeline</H2>
      <P>
        When you run <Code>kem run hello.jsk</Code>, your source file passes through three sequential stages.
        Each stage transforms one data structure into another; nothing is shared between stages except the output of the previous one.
      </P>

      {/* ASCII pipeline diagram */}
      <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
        <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">pipeline overview</span>
        </div>
        <pre className="px-5 py-5 font-mono text-xs leading-relaxed overflow-x-auto" style={{ color: "hsl(var(--code-fg))" }}>{`
  ┌──────────────────────────┐
  │  Source file  (.jsk)     │   raw UTF-8 text on disk
  └────────────┬─────────────┘
               │
               ▼
  ┌──────────────────────────┐
  │  Lexer  (lexer.py)       │   scans characters → tokens
  └────────────┬─────────────┘
               │  List[Token]
               ▼
  ┌──────────────────────────┐
  │  Parser  (parser.py)     │   consumes tokens → AST
  └────────────┬─────────────┘
               │  Program (dataclass tree)
               ▼
  ┌──────────────────────────┐
  │  Interpreter             │   walks AST → side effects
  │  (interpreter.py)        │   (print, input, variables)
  └────────────┬─────────────┘
               │
               ▼
           stdout / exit code
`}</pre>
      </div>

      {/* Stage 1 — Lexer */}
      <H2 id="lexer">Stage 1 — Lexer</H2>
      <StageBox
        step="1"
        name="Lexer"
        file="kemlang/lexer.py"
        input="str (source text)"
        output="List[Token]"
        accent="hsl(var(--kw))"
        desc="The lexer (also called a tokenizer or scanner) reads the raw source text character by character and groups characters into tokens. A token is the smallest meaningful unit of the language — a keyword, a number, a string, an operator."
      />

      <div className="mt-5 mb-6">
        <p className="text-sm font-semibold mb-3">Token data structure</p>
        <div className="rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
          <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`@dataclass
class Token:
    type:    TokenType   # e.g. TokenType.BHAI_BOL
    lexeme:  str         # the raw text e.g. "bhai bol"
    line:    int         # 1-indexed line number
    column:  int         # 0-indexed column offset`}</pre>
        </div>
      </div>

      <P>
        Multi-word keywords like <Code>kem bhai</Code>, <Code>bhai bol</Code>, and <Code>aavjo bhai</Code> are the
        trickiest part of lexing. The lexer checks for multi-word sequences first (using a look-ahead
        buffer), then falls back to single-word keywords, then identifiers. This order matters —
        <Code>bhai</Code> alone is not a valid keyword, but <Code>bhai bol</Code> is.
      </P>

      <div className="rounded-xl border overflow-hidden mb-6" style={{ background: "hsl(var(--code-bg))" }}>
        <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">kem tokens hello.jsk</span>
        </div>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--cmt))" }}>{`  KEM_BHAI        'kem bhai'       1:0
  BHAI_BOL        'bhai bol'       2:2
  STRING          '"kem cho!"'     2:10
  AAVJO_BHAI      'aavjo bhai'     3:0
  EOF             ''               4:0`}</pre>
      </div>

      <p className="text-sm font-semibold mb-3">Lexer scanning order</p>
      <div className="rounded-xl border overflow-hidden mb-8">
        {[
          ["1", "Multi-word keywords",  "kem bhai, aavjo bhai, bhai bol, jya sudhi, nahi to, tame jao, aagal vado, bapu tame bolo, bhai chhe, bhai nathi"],
          ["2", "Single-word keywords", "aa, che, jo, farvu, kaam"],
          ["3", "Identifiers",          "any sequence of letters/digits/underscore not matching a keyword"],
          ["4", "String literals",      "double-quoted, single-line only"],
          ["5", "Number literals",      "integer or float (one decimal point)"],
          ["6", "Operators",            "+ - * / % == != < > <= >="],
          ["7", "Punctuation",          "{ } ( )"],
        ].map(([step, name, detail], i) => (
          <div key={step} className="grid grid-cols-[28px_140px_1fr] px-5 py-2.5 text-xs gap-3" style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <span className="text-muted-foreground">{step}</span>
            <span className="font-medium">{name}</span>
            <span className="text-muted-foreground">{detail}</span>
          </div>
        ))}
      </div>

      {/* Stage 2 — Parser */}
      <H2 id="parser">Stage 2 — Parser</H2>
      <StageBox
        step="2"
        name="Parser"
        file="kemlang/parser.py"
        input="List[Token]"
        output="Program (AST root)"
        accent="hsl(var(--str))"
        desc="The parser consumes the token stream and builds an Abstract Syntax Tree (AST). kemlang-py uses a hand-written recursive-descent parser — one method per grammar rule. The AST is a tree of Python dataclasses defined in types.py."
      />

      <div className="mt-5 mb-6">
        <p className="text-sm font-semibold mb-3">AST node types (types.py)</p>
        <div className="rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
          <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`Program(body: list[Statement])
  ├── Print(value: Expression)
  ├── Declaration(name: str, value: Expression)
  ├── Assignment(name: str, value: Expression)
  ├── If(condition: Expression, then: list[Statement],
  │       else_: list[Statement] | None)
  ├── While(condition: Expression, body: list[Statement])
  ├── Break
  └── Continue

Expressions
  ├── Literal(value: int | float | str | bool | None)
  ├── Variable(name: str)
  ├── Binary(op: str, left: Expression, right: Expression)
  └── Unary(op: str, operand: Expression)`}</pre>
        </div>
      </div>

      <P>
        Every node is a frozen <Code>@dataclass</Code> — immutable once created. The parser never modifies
        the token stream; it only advances a position cursor. If the token at the current position doesn&apos;t
        match what the grammar expects, the parser raises a <Code>ParseError</Code> immediately.
      </P>

      <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
        <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">kem ast example.jsk</span>
        </div>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--cmt))" }}>{`Program
├── Declaration (x)
│   └── Literal: 10
└── If
    ├── Condition: Binary (>)
    │   ├── Left: Variable (x)
    │   └── Right: Literal: 5
    └── Then:
        └── Print
            └── Literal: "big"`}</pre>
      </div>

      {/* Stage 3 — Interpreter */}
      <H2 id="interpreter">Stage 3 — Interpreter</H2>
      <StageBox
        step="3"
        name="Interpreter"
        file="kemlang/interpreter.py"
        input="Program (AST root)"
        output="stdout + exit code"
        accent="hsl(var(--num))"
        desc="The interpreter walks the AST recursively. For each node type it calls the matching execute_* or evaluate_* method. Statements produce side effects (printing, mutating variables); expressions return a KemValue."
      />

      <div className="mt-5 mb-6">
        <p className="text-sm font-semibold mb-3">Runtime types</p>
        <div className="rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
          <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`# types.py
KemValue = int | float | str | bool | None

# All kemlang-py values at runtime are one of these five Python types.
# There is no separate "KemInt" class — Python's int IS the runtime int.`}</pre>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold mb-3">Environment (variable scope)</p>
        <div className="rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
          <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`class Environment:
    def __init__(self, parent: Environment | None = None):
        self._store: dict[str, KemValue] = {}
        self._parent = parent

    def get(self, name: str) -> KemValue: ...
    def set(self, name: str, value: KemValue) -> None: ...
    def assign(self, name: str, value: KemValue) -> None: ...

# Blocks (if/while bodies) get a child Environment.
# Variable lookup walks up parent chain until found or raises RuntimeError.`}</pre>
        </div>
      </div>

      <P>
        Control flow (<Code>tame jao</Code> / break, <Code>aagal vado</Code> / continue) is implemented using Python
        exceptions. When the interpreter encounters a <Code>Break</Code> node it raises a <Code>BreakError</Code>;
        the enclosing <Code>execute_while</Code> catches it and exits the loop. This is a clean pattern
        used by many tree-walking interpreters.
      </P>

      <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`class BreakError(Exception): pass
class ContinueError(Exception): pass

def execute_while(self, node: While) -> None:
    while self.is_truthy(self.evaluate(node.condition)):
        try:
            for stmt in node.body:
                self.execute(stmt)
        except BreakError:
            break
        except ContinueError:
            continue`}</pre>
      </div>

      {/* CLI layer */}
      <H2 id="cli-layer">The CLI layer</H2>
      <P>
        The <Code>kem</Code> binary is a thin wrapper over the pipeline. It handles argument parsing,
        file I/O, error formatting, and exit codes. It does not add any language semantics.
      </P>

      <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`# cli.py — what "kem run file.jsk" actually does:

source = Path(file).read_text()          # 1. read the file
tokens = Lexer(source).tokenize()         # 2. lex
ast    = Parser(tokens).parse()           # 3. parse
exit_code = Interpreter().run(ast)        # 4. execute
raise typer.Exit(exit_code)              # 5. set exit code`}</pre>
      </div>

      {/* Tech stack */}
      <H2 id="tech-stack">Tech stack</H2>
      <P>
        kemlang-py is deliberately minimal — the interpreter itself has zero runtime dependencies.
        Every library below is either a dev tool or a CLI convenience layer.
      </P>

      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[140px_80px_1fr] border-b px-5 py-2.5" style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">library</span>
          <span className="font-mono text-xs text-muted-foreground">version</span>
          <span className="font-mono text-xs text-muted-foreground">used for</span>
        </div>
        {[
          ["Python",       "≥ 3.10",  "Runtime. Uses match/case syntax, union types (X | Y), dataclasses. No older Python supported."],
          ["Typer",        "≥ 0.9",   "CLI argument parsing for kem run / repl / fmt / tokens / ast / version. Generates --help automatically."],
          ["Rich",         "≥ 13",    "Terminal output — syntax highlighting in the REPL, coloured error messages, formatted tables."],
          ["pytest",       "dev",     "Test runner for all unit and integration tests."],
          ["Hypothesis",   "dev",     "Property-based / fuzz testing in test_prop_fuzz.py. Generates random programs to find edge cases."],
          ["ruff",         "dev",     "Linter + formatter. Replaces flake8 + isort + black in one fast tool."],
          ["mypy",         "dev",     "Static type checker. lexer.py, types.py, errors.py, fmt.py, cli.py are fully typed."],
          ["Node.js",      "≥ 18",    "npm wrapper only (npm-package/). Calls pip install kemlang-py on postinstall."],
          ["Next.js 14",   "website", "This documentation site. App Router, server components, no database."],
          ["Vercel",       "website", "Hosting for the docs site. Auto-deploys on every push to main."],
        ].map(([lib, ver, desc], i) => (
          <div key={lib} className="grid grid-cols-[140px_80px_1fr] px-5 py-2.5 text-xs gap-2" style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <code className="font-mono" style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0 }}>{lib}</code>
            <span className="text-muted-foreground font-mono">{ver}</span>
            <span style={{ color: "hsl(var(--cmt))" }}>{desc}</span>
          </div>
        ))}
      </div>

      {/* File map */}
      <H2 id="file-map">File map</H2>
      <P>Every file in <Code>kemlang/</Code> has a single job. Here&apos;s exactly what each one contains.</P>

      <div className="space-y-3 mb-8">
        {[
          {
            file: "kemlang/types.py",
            role: "Shared data definitions",
            contains: "TokenType enum (all token kinds), Token dataclass, all AST node dataclasses (Program, Print, Declaration, Assignment, If, While, Break, Continue, Literal, Variable, Binary, Unary), and the KemValue type alias.",
          },
          {
            file: "kemlang/errors.py",
            role: "Exception classes + diagnostics",
            contains: "LexerError, ParseError, RuntimeError subclasses. The render() function formats errors with line/column pointers for Rich output.",
          },
          {
            file: "kemlang/lexer.py",
            role: "Tokenizer",
            contains: "Lexer class. __init__ sets up keyword dicts. tokenize() drives the scan loop. Separate methods for strings, numbers, identifiers, and multi-word keyword detection.",
          },
          {
            file: "kemlang/parser.py",
            role: "Recursive-descent parser",
            contains: "Parser class. parse() → Program. parse_statement() dispatches to parse_print(), parse_declaration(), parse_if(), parse_while(), parse_break(), parse_continue(). parse_expression() / parse_comparison() / parse_term() / parse_factor() handle operator precedence.",
          },
          {
            file: "kemlang/interpreter.py",
            role: "Tree-walking interpreter",
            contains: "Interpreter class. Environment inner class. execute() dispatches by node type. evaluate() returns a KemValue. Arithmetic coercion, string concatenation, and I/O (bhai bol / bapu tame bolo) all live here.",
          },
          {
            file: "kemlang/fmt.py",
            role: "Code formatter",
            contains: "Formatter class. Reads source, runs the lexer, re-emits tokens with normalised indentation, operator spacing, and trailing whitespace removed.",
          },
          {
            file: "kemlang/cli.py",
            role: "CLI entry point",
            contains: "Typer app with run, repl, fmt, tokens, ast, version subcommands. Calls lexer/parser/interpreter in sequence. REPL loop reads multiline input until Ctrl+D/Ctrl+Z.",
          },
          {
            file: "kemlang/version.py",
            role: "Version string",
            contains: '__version__ = "0.1.3" — single source of truth imported by cli.py and referenced in pyproject.toml.',
          },
        ].map(({ file, role, contains }) => (
          <div key={file} className="rounded-xl border p-4 bg-muted/10">
            <div className="flex items-center gap-3 mb-2">
              <code className="font-mono text-xs" style={{ color: "hsl(var(--kw))" }}>{file}</code>
              <span className="text-xs text-muted-foreground">{role}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{contains}</p>
          </div>
        ))}
      </div>

      {/* Design decisions */}
      <H2 id="design">Design decisions</H2>
      <div className="space-y-4 mb-8">
        {[
          {
            decision: "Tree-walking interpreter, not bytecode",
            reason: "The simplest correct implementation. A tree-walker is easy to debug, easy to extend, and fast enough for a scripting language. Bytecode compilation would add significant complexity with no user-visible benefit at kemlang-py's current scale.",
          },
          {
            decision: "Python exceptions for break/continue",
            reason: "Rather than threading a 'should_break' flag through every execute call, raising BreakError/ContinueError lets the while executor catch them at exactly the right stack frame. This is the same technique CPython uses internally.",
          },
          {
            decision: "Dataclasses for AST nodes",
            reason: "Python dataclasses give free __repr__, __eq__, and type annotations without boilerplate. They make the AST easy to inspect in tests and in kem ast output.",
          },
          {
            decision: "No runtime dependencies",
            reason: "Typer and Rich are CLI conveniences — the interpreter itself (lexer.py + parser.py + interpreter.py + types.py + errors.py) imports nothing outside the standard library. This keeps kemlang-py installable anywhere Python runs.",
          },
          {
            decision: "Multi-word keywords scanned first",
            reason: "Languages like Gujarati naturally form phrases. 'bhai bol' (print) reads more naturally as a two-word phrase than as two separate tokens. The lexer handles this by always trying multi-word matches before single-word ones.",
          },
        ].map(({ decision, reason }) => (
          <div key={decision} className="flex gap-4 items-start rounded-xl border p-4 bg-muted/10">
            <span className="text-primary shrink-0 font-mono text-xs mt-0.5">›</span>
            <div>
              <p className="font-medium text-sm mb-1">{decision}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{reason}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Introduction
        </Link>
        <Link href="/docs/installation" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80">
          Installation <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
