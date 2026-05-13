import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MermaidDiagram } from "@/components/mermaid-diagram";

export const metadata: Metadata = {
  title: "How it works",
  description: "A detailed look at kemlang-py's internals - the pipeline, data structures, and tech stack.",
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

const DiagramWrap = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
    <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
    </div>
    <div className="px-4 py-6">{children}</div>
  </div>
);

const PIPELINE_CHART = `
flowchart LR
  A(["Source\\n.jsk file"]):::io
  B["Lexer\\nlexer.py"]:::stage
  C["Parser\\nparser.py"]:::stage
  D["Interpreter\\ninterpreter.py"]:::stage
  E(["stdout\\n+ exit code"]):::io

  A -->|"raw text"| B
  B -->|"List[Token]"| C
  C -->|"Program AST"| D
  D -->|"print / exit"| E

  classDef io fill:#0d2b1e,stroke:#34d399,stroke-width:2px,color:#e2e8f0
  classDef stage fill:#0d1f18,stroke:#34d39966,stroke-width:1px,color:#e2e8f0
`.trim();

const LEXER_CHART = `
flowchart TD
  SRC["Source text"]:::input

  MW{"multi-word keyword?"}:::decision
  SW{"single-word keyword?"}:::decision
  ID{"identifier?"}:::decision
  LIT{"literal?"}:::decision
  OP{"operator or punct?"}:::decision
  ERR["LexerError"]:::error

  SRC --> MW
  MW -->|yes| T1["KEM_BHAI / BHAI_BOL\\nAAVJO_BHAI / etc."]:::token
  MW -->|no| SW
  SW -->|yes| T2["JO / AA / CHE\\nFARVU / etc."]:::token
  SW -->|no| ID
  ID -->|yes| T3["IDENTIFIER"]:::token
  ID -->|no| LIT
  LIT -->|yes| T4["STRING / INTEGER\\nFLOAT / BOOL"]:::token
  LIT -->|no| OP
  OP -->|yes| T5["PLUS / MINUS\\nEQEQ / etc."]:::token
  OP -->|no| ERR

  classDef input fill:#0d2b1e,stroke:#34d399,stroke-width:2px,color:#e2e8f0
  classDef decision fill:#111827,stroke:#34d39966,color:#94a3b8,stroke-width:1px
  classDef token fill:#0d1f18,stroke:#34d39944,color:#34d399,stroke-width:1px
  classDef error fill:#2b0d0d,stroke:#f8717155,color:#fca5a5,stroke-width:1px
`.trim();

const AST_CHART = `
graph TD
  P["Program"]:::root
  D["Declaration  x"]:::node
  L1["Literal  10"]:::leaf
  IF["If"]:::node
  COND["Binary  op=gt"]:::node
  VAR["Variable  x"]:::leaf
  L2["Literal  5"]:::leaf
  THEN["Print"]:::node
  L3["Literal  'big'"]:::leaf

  P --> D
  P --> IF
  D --> L1
  IF --> COND
  IF --> THEN
  COND --> VAR
  COND --> L2
  THEN --> L3

  classDef root fill:#0d2b1e,stroke:#34d399,stroke-width:2px,color:#e2e8f0
  classDef node fill:#0d1f18,stroke:#34d39966,color:#e2e8f0,stroke-width:1px
  classDef leaf fill:#111827,stroke:#34d39933,color:#64748b,stroke-width:1px
`.trim();

const ENV_CHART = `
flowchart TD
  G["Global Environment\\nx=10  n=5"]:::env
  B1["Block Env - if body\\ntemp='big'"]:::child
  B2["Block Env - while body\\ni=3"]:::child
  MISS["RuntimeError\\nundefined variable"]:::error

  B1 -->|"parent lookup"| G
  B2 -->|"parent lookup"| G
  G -->|"not found anywhere"| MISS

  classDef env fill:#0d2b1e,stroke:#34d399,stroke-width:2px,color:#e2e8f0
  classDef child fill:#0d1f18,stroke:#34d39966,color:#e2e8f0,stroke-width:1px
  classDef error fill:#2b0d0d,stroke:#f8717155,color:#fca5a5,stroke-width:1px
`.trim();

const STACK_CHART = `
flowchart LR
  subgraph RT["Runtime"]
    PY["Python 3.10+"]:::core
    TY["Typer"]:::lib
    RI["Rich"]:::lib
  end
  subgraph DV["Dev tooling"]
    RU["ruff"]:::dev
    MY["mypy"]:::dev
    PT["pytest"]:::dev
    HY["Hypothesis"]:::dev
  end
  subgraph DS["Distribution"]
    NX["Next.js docs"]:::web
    VE["Vercel"]:::web
    NP["npm wrapper"]:::web
    PP["PyPI"]:::web
  end

  classDef core fill:#0d2b1e,stroke:#34d399,stroke-width:2px,color:#e2e8f0
  classDef lib fill:#0d1f18,stroke:#34d39966,color:#e2e8f0,stroke-width:1px
  classDef dev fill:#111827,stroke:#6366f166,color:#a5b4fc,stroke-width:1px
  classDef web fill:#0f172a,stroke:#818cf866,color:#c4b5fd,stroke-width:1px
`.trim();

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
          This page walks through every stage of the pipeline - from raw source text
          to executed output - with diagrams, data structures, and design decisions.
        </p>
      </div>

      {/* Full pipeline */}
      <H2 id="pipeline">The full pipeline</H2>
      <P>
        When you run <Code>kem run hello.jsk</Code>, your source file passes through three sequential stages.
        Each stage transforms one data structure into the next - nothing is shared between stages except the output of the previous one.
      </P>

      <DiagramWrap label="pipeline overview">
        <MermaidDiagram chart={PIPELINE_CHART} />
      </DiagramWrap>

      <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
        <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">what "kem run file.jsk" actually executes</span>
        </div>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`source    = Path(file).read_text()
tokens    = Lexer(source).tokenize()     # str  → List[Token]
ast       = Parser(tokens).parse()       # tokens → Program
exit_code = Interpreter().run(ast)       # ast  → stdout + int
raise typer.Exit(exit_code)`}</pre>
      </div>

      {/* Lexer */}
      <H2 id="lexer">Stage 1 - Lexer</H2>
      <P>
        The lexer reads source text character by character and groups characters into tokens -
        the smallest meaningful units of the language. It handles multi-word Gujarati keywords
        (like <Code>bhai bol</Code> and <Code>aavjo bhai</Code>) by always trying multi-word matches before single-word ones.
      </P>

      <DiagramWrap label="lexer scanning order">
        <MermaidDiagram chart={LEXER_CHART} />
      </DiagramWrap>

      <p className="text-sm font-semibold mb-3">Token data structure</p>
      <div className="rounded-xl border overflow-hidden mb-6" style={{ background: "hsl(var(--code-bg))" }}>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`@dataclass
class Token:
    type:    TokenType   # e.g. TokenType.BHAI_BOL
    lexeme:  str         # the raw text  e.g. "bhai bol"
    line:    int         # 1-indexed line number
    column:  int         # 0-indexed column offset`}</pre>
      </div>

      <p className="text-sm font-semibold mb-3">Example token stream</p>
      <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
        <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">kem tokens hello.jsk</span>
        </div>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--cmt))" }}>{`  KEM_BHAI        'kem bhai'       1:0
  BHAI_BOL        'bhai bol'       2:2
  STRING          '"kem cho!"'     2:10
  AAVJO_BHAI      'aavjo bhai'     3:0
  EOF             ''               4:0`}</pre>
      </div>

      {/* Parser */}
      <H2 id="parser">Stage 2 - Parser</H2>
      <P>
        The parser consumes the token stream with a hand-written recursive-descent approach -
        one method per grammar rule. It builds an Abstract Syntax Tree (AST): a tree of
        immutable Python <Code>@dataclass</Code> nodes defined in <Code>types.py</Code>.
      </P>

      <DiagramWrap label="AST for: aa x che 10 / jo x > 5 { bhai bol 'big' }">
        <MermaidDiagram chart={AST_CHART} />
      </DiagramWrap>

      <p className="text-sm font-semibold mb-3">All AST node types</p>
      <div className="rounded-xl border overflow-hidden mb-6" style={{ background: "hsl(var(--code-bg))" }}>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`# Statements (produce side effects)
Program(body: list[Statement])
Print(value: Expression)
Declaration(name: str, value: Expression)
Assignment(name: str, value: Expression)
If(condition: Expression, then: list[Statement], else_: list[Statement] | None)
While(condition: Expression, body: list[Statement])
Break
Continue

# Expressions (return a KemValue)
Literal(value: int | float | str | bool | None)
Variable(name: str)
Binary(op: str, left: Expression, right: Expression)
Unary(op: str, operand: Expression)`}</pre>
      </div>

      {/* Interpreter */}
      <H2 id="interpreter">Stage 3 - Interpreter</H2>
      <P>
        The interpreter walks the AST recursively. Statements call <Code>execute()</Code> for side
        effects (printing, mutating variables). Expressions call <Code>evaluate()</Code> and return
        a <Code>KemValue</Code>. Variable scope is managed by a chain of <Code>Environment</Code> dicts.
      </P>

      <DiagramWrap label="variable scope - Environment chain">
        <MermaidDiagram chart={ENV_CHART} />
      </DiagramWrap>

      <p className="text-sm font-semibold mb-3">Runtime value type</p>
      <div className="rounded-xl border overflow-hidden mb-5" style={{ background: "hsl(var(--code-bg))" }}>
        <pre className="px-5 py-4 font-mono text-xs leading-relaxed" style={{ color: "hsl(var(--code-fg))" }}>{`# types.py
KemValue = int | float | str | bool | None

# Every kemlang-py value at runtime is one of these five Python types.
# No wrapper classes - Python's int/float/str ARE the runtime types.`}</pre>
      </div>

      <p className="text-sm font-semibold mb-3">Control flow via exceptions</p>
      <P>
        Break and continue are implemented by raising Python exceptions - <Code>BreakError</Code> and <Code>ContinueError</Code>.
        The enclosing <Code>execute_while</Code> catches them at exactly the right stack frame. This avoids threading
        a flag through every recursive call.
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

      {/* Tech stack */}
      <H2 id="tech-stack">Tech stack</H2>
      <P>
        The interpreter itself has <strong>zero runtime dependencies</strong> - <Code>lexer.py</Code>, <Code>parser.py</Code>,
        <Code>interpreter.py</Code>, <Code>types.py</Code>, and <Code>errors.py</Code> import nothing outside the Python standard library.
        Everything else is a CLI layer, dev tool, or distribution mechanism.
      </P>

      <DiagramWrap label="full dependency map">
        <MermaidDiagram chart={STACK_CHART} />
      </DiagramWrap>

      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[130px_80px_1fr] border-b px-5 py-2.5" style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">library</span>
          <span className="font-mono text-xs text-muted-foreground">version</span>
          <span className="font-mono text-xs text-muted-foreground">used for</span>
        </div>
        {[
          ["Python",      "≥ 3.10",  "Runtime. Uses match/case, union types (X | Y), dataclasses. No older Python supported."],
          ["Typer",       "≥ 0.9",   "CLI argument parsing for kem run / repl / fmt / tokens / ast. Auto-generates --help."],
          ["Rich",        "≥ 13",    "Coloured error messages, REPL output, formatted tables in the terminal."],
          ["pytest",      "dev",     "Test runner for all unit and integration tests."],
          ["Hypothesis",  "dev",     "Property-based fuzz testing in test_prop_fuzz.py. Generates random programs to find edge cases."],
          ["ruff",        "dev",     "Linter + formatter in one tool. Replaces flake8 + isort + black."],
          ["mypy",        "dev",     "Static type checker. lexer.py, types.py, errors.py, fmt.py, cli.py are fully typed."],
          ["Node.js",     "≥ 18",    "npm wrapper only. postinstall script calls pip install kemlang-py."],
          ["Next.js 14",  "website", "This documentation site. App Router, server components, deployed on Vercel."],
        ].map(([lib, ver, desc], i) => (
          <div key={lib} className="grid grid-cols-[130px_80px_1fr] px-5 py-2.5 text-xs gap-2" style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <code className="font-mono" style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0 }}>{lib}</code>
            <span className="text-muted-foreground font-mono">{ver}</span>
            <span style={{ color: "hsl(var(--cmt))" }}>{desc}</span>
          </div>
        ))}
      </div>

      {/* File map */}
      <H2 id="file-map">File map</H2>
      <P>Every file in <Code>kemlang/</Code> has a single job.</P>

      <div className="space-y-3 mb-8">
        {[
          {
            file: "kemlang/types.py",
            role: "Shared data definitions",
            contains: "TokenType enum, Token dataclass, all AST node dataclasses, and the KemValue type alias. Imported by every other module - never imports from them.",
          },
          {
            file: "kemlang/errors.py",
            role: "Exception classes + diagnostics",
            contains: "LexerError, ParseError, RuntimeError subclasses. render() formats errors with line/column pointers via Rich.",
          },
          {
            file: "kemlang/lexer.py",
            role: "Tokenizer",
            contains: "Lexer class. tokenize() drives the scan loop. Separate methods handle strings, numbers, identifiers, and multi-word keyword detection.",
          },
          {
            file: "kemlang/parser.py",
            role: "Recursive-descent parser",
            contains: "Parser class with one method per grammar rule. parse_expression() → parse_comparison() → parse_term() → parse_factor() handles operator precedence.",
          },
          {
            file: "kemlang/interpreter.py",
            role: "Tree-walking interpreter",
            contains: "Interpreter class + Environment. execute() dispatches by node type. evaluate() returns KemValue. All arithmetic coercion, string concatenation, and I/O live here.",
          },
          {
            file: "kemlang/fmt.py",
            role: "Code formatter",
            contains: "Formatter class. Runs the lexer then re-emits tokens with normalised indentation, operator spacing, and trailing whitespace removed.",
          },
          {
            file: "kemlang/cli.py",
            role: "CLI entry point",
            contains: "Typer app with run, repl, fmt, tokens, ast, version commands. REPL loop reads multiline input until Ctrl+D/Ctrl+Z.",
          },
          {
            file: "kemlang/version.py",
            role: "Version string",
            contains: '__version__ = "0.1.3" - single source of truth imported by cli.py.',
          },
        ].map(({ file, role, contains }) => (
          <div key={file} className="rounded-xl border p-4 bg-muted/10">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <code className="font-mono text-xs" style={{ color: "hsl(var(--kw))" }}>{file}</code>
              <span className="text-xs text-muted-foreground border px-2 py-0.5 rounded-full">{role}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{contains}</p>
          </div>
        ))}
      </div>

      {/* Design decisions */}
      <H2 id="design">Design decisions</H2>
      <div className="space-y-3 mb-8">
        {[
          ["Tree-walking, not bytecode", "The simplest correct implementation. A tree-walker is easy to debug and extend. Bytecode compilation would add significant complexity with no user-visible benefit at kemlang-py's current scale."],
          ["Python exceptions for break/continue", "Raising BreakError/ContinueError lets the while executor catch them at exactly the right stack frame, avoiding a 'should_break' flag threaded through every call. CPython uses the same technique internally."],
          ["Dataclasses for AST nodes", "Free __repr__, __eq__, and type annotations without boilerplate. Makes the AST easy to inspect in tests and in kem ast output."],
          ["Zero runtime dependencies", "The interpreter (lexer + parser + interpreter + types + errors) imports nothing outside stdlib. Typer and Rich are CLI conveniences only - kemlang-py is installable anywhere Python runs."],
          ["Multi-word keywords scanned first", "Gujarati naturally forms phrases. 'bhai bol' reads more naturally as a two-word phrase. The lexer always tries multi-word matches before single-word ones to handle this correctly."],
        ].map(([decision, reason]) => (
          <div key={decision as string} className="flex gap-4 items-start rounded-xl border p-4 bg-muted/10">
            <span className="text-primary shrink-0 font-mono text-sm mt-0.5">›</span>
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
