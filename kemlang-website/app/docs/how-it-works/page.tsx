import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How it works - Overview",
  description: "How kemlang-py turns source text into running programs. The full pipeline explained.",
};

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t scroll-mt-20">{children}</h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

const Diagram = ({ label, children }: { label: string; children: string }) => (
  <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
    <div className="px-4 py-2 border-b font-mono text-xs text-muted-foreground"
      style={{ borderColor: "hsl(var(--border))" }}>{label}</div>
    <div className="overflow-x-auto">
      <pre className="px-6 py-5 font-mono text-xs leading-relaxed"
        style={{ color: "hsl(var(--code-fg))" }}>{children}</pre>
    </div>
  </div>
);

const Block = ({ label, children }: { label?: string; children: string }) => (
  <div className="rounded-xl border overflow-hidden mb-6" style={{ background: "hsl(var(--code-bg))" }}>
    {label && (
      <div className="px-4 py-2 border-b font-mono text-xs text-muted-foreground"
        style={{ borderColor: "hsl(var(--border))" }}>{label}</div>
    )}
    <pre className="px-5 py-4 font-mono text-xs leading-relaxed overflow-x-auto"
      style={{ color: "hsl(var(--code-fg))" }}>{children}</pre>
  </div>
);

const SubPageCard = ({ href, title, desc, step }: { href: string; title: string; desc: string; step: string }) => (
  <Link href={href}
    className="group flex gap-4 items-start rounded-xl border p-5 hover:border-primary/40 hover:bg-muted/20 transition-colors">
    <span className="font-display text-3xl leading-none text-primary/20 group-hover:text-primary/40 transition-colors shrink-0">{step}</span>
    <div>
      <p className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{title}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-auto shrink-0 mt-0.5 transition-colors" />
  </Link>
);

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">How it works</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          Overview
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          kemlang-py is a tree-walking interpreter. This section explains exactly how it turns a
          <code className="font-mono text-sm px-1"> .jsk </code> source file into running output -
          from character scanning all the way to executing statements.
        </p>
      </div>

      <H2 id="what-is-a-language">What is a programming language, really?</H2>
      <P>
        A programming language is a convention. The source file you write is just text - a sequence of Unicode
        characters sitting on disk. Nothing in the hardware understands <code className="font-mono text-xs">bhai bol</code>.
        The interpreter is the program that reads that text and figures out what to do with it.
      </P>
      <P>
        Every interpreter or compiler does the same fundamental job: transform source text into behavior.
        The strategies differ enormously in complexity and performance, but the goal is always the same.
      </P>

      <H2 id="spectrum">The spectrum of language implementations</H2>
      <P>
        Different languages take different approaches to turning source into execution. The main strategies
        are compiled native code, bytecode + virtual machine, and tree-walking interpretation.
      </P>

      <Diagram label="language implementation spectrum">{`
  Source text
      │
      ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │  COMPILED  (C, Rust, Go)                                          │
  │                                                                   │
  │  Source ──▶ Compiler ──▶ Machine code (.exe / .o) ──▶ CPU runs   │
  │                                                                   │
  │  + Fastest possible execution (direct CPU instructions)           │
  │  - Compilation takes time; separate step before running           │
  └───────────────────────────────────────────────────────────────────┘

  ┌───────────────────────────────────────────────────────────────────┐
  │  BYTECODE VM  (Python, Java, Lua)                                 │
  │                                                                   │
  │  Source ──▶ Compiler ──▶ Bytecode ──▶ Virtual Machine ──▶ output │
  │                          (.pyc)       (CPython, JVM)              │
  │                                                                   │
  │  + Faster than tree-walking; portable across platforms            │
  │  - VM adds complexity; bytecode is an intermediate layer          │
  └───────────────────────────────────────────────────────────────────┘

  ┌───────────────────────────────────────────────────────────────────┐
  │  TREE-WALKING  (kemlang-py, early Ruby, many scripting languages) │
  │                                                                   │
  │  Source ──▶ Lexer ──▶ Parser ──▶ AST ──▶ walk & execute          │
  │                                                                   │
  │  + Simplest implementation; easy to debug and extend              │
  │  - Slowest; each node is re-evaluated on every visit              │
  └───────────────────────────────────────────────────────────────────┘`}
      </Diagram>

      <P>
        kemlang-py is a tree-walking interpreter. It never produces compiled output - it reads your source
        file and executes it directly by walking the parsed tree. This makes the implementation small (~1000
        lines across three core files), readable, and easy to modify.
      </P>

      <H2 id="pipeline">The pipeline</H2>
      <P>
        Every time you run <code className="font-mono text-xs">kem run hello.jsk</code>, the source file
        travels through three sequential stages. Each stage receives the output of the previous one.
        Nothing is shared between stages except that single transformed value.
      </P>

      <Diagram label="the full pipeline">{`
  ┌──────────────────────────────────────────────────────────────────┐
  │  Source file  (hello.jsk)                                        │
  │                                                                  │
  │  kem bhai                                                        │
  │    bhai bol "kem cho, duniya!"                                   │
  │  aavjo bhai                                                      │
  └────────────────────────────┬─────────────────────────────────────┘
                               │  raw UTF-8 text
                               ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  Stage 1: Lexer  (kemlang/lexer.py)                              │
  │                                                                  │
  │  Scans characters left-to-right. Groups them into tokens.        │
  │  Handles multi-word Gujarati keywords. Skips whitespace.         │
  └────────────────────────────┬─────────────────────────────────────┘
                               │  List[Token]
                               │
                               │  KEM_BHAI    'kem bhai'              1:0
                               │  BHAI_BOL    'bhai bol'              2:2
                               │  STRING      '"kem cho, duniya!"'    2:10
                               │  AAVJO_BHAI  'aavjo bhai'           3:0
                               │  EOF         ''                      4:0
                               ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  Stage 2: Parser  (kemlang/parser.py)                            │
  │                                                                  │
  │  Consumes tokens one at a time. Checks grammar rules.            │
  │  Builds a tree of dataclass nodes (the AST).                     │
  └────────────────────────────┬─────────────────────────────────────┘
                               │  Program (AST)
                               │
                               │  Program
                               │  └── Print
                               │      └── Literal("kem cho, duniya!")
                               ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  Stage 3: Interpreter  (kemlang/interpreter.py)                  │
  │                                                                  │
  │  Walks the AST recursively. Executes each node. Manages          │
  │  variable scope via Environment. Handles I/O and errors.         │
  └────────────────────────────┬─────────────────────────────────────┘
                               │
                               ▼
                       stdout: kem cho, duniya!
                       exit code: 0`}
      </Diagram>

      <H2 id="stage-1">Stage 1: Lexer</H2>
      <P>
        The lexer (also called a scanner or tokenizer) reads the source string one character at a time
        and groups characters into tokens. A token is the smallest meaningful unit of the language - a keyword,
        a number, a string literal, an operator, or an identifier.
      </P>
      <P>
        kemlang-py&apos;s lexer handles something unusual: multi-word keywords. Most languages use single
        reserved words (<code className="font-mono text-xs">if</code>, <code className="font-mono text-xs">while</code>,
        <code className="font-mono text-xs">print</code>). kemlang-py uses natural Gujarati phrases like
        <code className="font-mono text-xs"> bhai bol</code> (print) and
        <code className="font-mono text-xs"> aavjo bhai</code> (end of program).
        The lexer checks for these multi-word sequences before checking single-word keywords.
      </P>
      <P>
        Input: raw source text as a Python <code className="font-mono text-xs">str</code>.
        Output: <code className="font-mono text-xs">List[Token]</code>, each token carrying its type,
        lexeme (the original text), line number, and column offset.
      </P>
      <Link href="/docs/how-it-works/lexer" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:opacity-80 mb-8 block">
        Deep dive: The Lexer <ArrowRight className="h-3.5 w-3.5" />
      </Link>

      <H2 id="stage-2">Stage 2: Parser</H2>
      <P>
        The parser takes the flat token stream and builds a tree structure called an Abstract Syntax Tree
        (AST). The tree represents the grammatical structure of your program - nesting, operator precedence,
        and the parent-child relationships between statements and expressions.
      </P>
      <P>
        kemlang-py uses a hand-written recursive-descent parser. Each grammar rule has a corresponding
        method (<code className="font-mono text-xs">statement()</code>, <code className="font-mono text-xs">if_statement()</code>,
        <code className="font-mono text-xs">expression()</code>, etc.). These methods call each other
        recursively, naturally mirroring the nested structure of the grammar.
      </P>
      <P>
        Input: <code className="font-mono text-xs">List[Token]</code> (with NEWLINE tokens stripped).
        Output: a <code className="font-mono text-xs">Program</code> dataclass containing a list of
        <code className="font-mono text-xs"> Stmt</code> nodes, each of which may contain
        <code className="font-mono text-xs"> Expr</code> nodes.
      </P>
      <Link href="/docs/how-it-works/parser" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:opacity-80 mb-8 block">
        Deep dive: The Parser <ArrowRight className="h-3.5 w-3.5" />
      </Link>

      <H2 id="stage-3">Stage 3: Interpreter</H2>
      <P>
        The interpreter walks the AST recursively. For each node it visits, it calls the appropriate
        handler. Statement nodes (Print, Declaration, If, While) produce side effects - they print to
        stdout, define variables, branch, or loop. Expression nodes (Binary, Variable, Literal) return
        a <code className="font-mono text-xs">KemValue</code> - one of Python&apos;s five built-in types.
      </P>
      <P>
        Variable scope is managed through a chain of <code className="font-mono text-xs">Environment</code>
        objects. Each block (if body, while body) gets its own environment that holds a reference to
        its parent. When a variable lookup fails in the current environment, it walks up the chain.
      </P>
      <P>
        Input: <code className="font-mono text-xs">Program</code> (root AST node).
        Output: stdout text + an integer exit code (0 = success, 1 = error).
      </P>
      <Link href="/docs/how-it-works/interpreter" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:opacity-80 mb-8 block">
        Deep dive: The Interpreter <ArrowRight className="h-3.5 w-3.5" />
      </Link>

      <H2 id="in-code">What the CLI actually does</H2>
      <P>
        The <code className="font-mono text-xs">kem run</code> command in <code className="font-mono text-xs">kemlang/cli.py</code>
        calls these three stages in sequence. The entire pipeline is five lines:
      </P>

      <Block label="kemlang/cli.py - kem run (simplified)">{`source    = Path(file).read_text(encoding="utf-8")
tokens    = Lexer(source).tokenize()          # str  -> List[Token]
ast       = Parser(tokens).parse()            # tokens -> Program
exit_code = Interpreter().interpret(ast)      # AST -> stdout + int
raise typer.Exit(exit_code)`}</Block>

      <H2 id="explore">Explore each stage in detail</H2>

      <div className="space-y-3 mt-6">
        <SubPageCard
          href="/docs/how-it-works/lexer"
          step="1"
          title="The Lexer"
          desc="How characters become tokens. Multi-word keywords, the scanning loop, what gets rejected and why."
        />
        <SubPageCard
          href="/docs/how-it-works/parser"
          step="2"
          title="The Parser"
          desc="How tokens become an AST. Context-free grammars, recursive descent, operator precedence, and the full BNF grammar."
        />
        <SubPageCard
          href="/docs/how-it-works/interpreter"
          step="3"
          title="The Interpreter"
          desc="How the AST gets executed. Tree-walking, environment scopes, control flow via exceptions, and I/O."
        />
        <SubPageCard
          href="/docs/how-it-works/runtime"
          step="4"
          title="Runtime and Types"
          desc="The five runtime types, truthiness, type coercion, the full execution lifecycle, and error propagation."
        />
      </div>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/installation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Installation
        </Link>
        <Link href="/docs/how-it-works/lexer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80">
          The Lexer <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
