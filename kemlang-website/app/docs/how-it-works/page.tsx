import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H2, P, Diagram, Block, MermaidChart } from "@/components/hiw";

export const metadata: Metadata = {
  title: "How it works - Overview",
  description: "How kemlang-py turns source text into running programs. The full pipeline explained.",
};

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
        Different languages take different approaches to turning source into execution.
      </P>

      <Diagram label="language implementation spectrum">{`
  Source text
      │
      ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │  COMPILED  (C, Rust, Go)                                          │
  │                                                                   │
  │  Source ──▶ Compiler ──▶ Machine code (.exe) ──▶ CPU runs        │
  │                                                                   │
  │  + Fastest possible execution (direct CPU instructions)           │
  │  - Compilation is a separate step before running                  │
  └───────────────────────────────────────────────────────────────────┘
      │
      ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │  BYTECODE VM  (Python, Java, Lua)                                 │
  │                                                                   │
  │  Source ──▶ Compiler ──▶ Bytecode ──▶ VM interprets              │
  │                                                                   │
  │  + Faster than tree-walking; portable across platforms            │
  │  - VM adds complexity; bytecode is an intermediate layer          │
  └───────────────────────────────────────────────────────────────────┘
      │
      ▼
  ┌───────────────────────────────────────────────────────────────────┐
  │  TREE-WALKING  (kemlang-py, early Ruby, many scripting languages) │
  │                                                                   │
  │  Source ──▶ Lexer ──▶ Parser ──▶ AST ──▶ walk & execute          │
  │                                                                   │
  │  + Simplest implementation; easy to debug and extend              │
  │  - Slowest; each node is re-evaluated on every visit              │
  └───────────────────────────────────────────────────────────────────┘`}</Diagram>

      <H2 id="pipeline">The pipeline</H2>
      <P>
        Every time you run <code className="font-mono text-xs">kem run hello.jsk</code>, the source file
        travels through three sequential stages. Each stage receives the output of the previous one.
      </P>

      <MermaidChart label="the full pipeline" chart={`flowchart LR
    A([".jsk\\nsource file"]) -->|"raw text"| B["Lexer\\nlexer.py"]
    B -->|"List[Token]"| C["Parser\\nparser.py"]
    C -->|"Program AST"| D["Interpreter\\ninterpreter.py"]
    D -->|"stdout + exit"| E(["output"])`} />

      <H2 id="in-code">What the CLI actually does</H2>
      <Block label="kemlang/cli.py - kem run (simplified)">{`source    = Path(file).read_text(encoding="utf-8")
tokens    = Lexer(source).tokenize()          # str  -> List[Token]
ast       = Parser(tokens).parse()            # tokens -> Program
exit_code = Interpreter().interpret(ast)      # AST -> stdout + int
raise typer.Exit(exit_code)`}</Block>

      <H2 id="stage-1">Stage 1: Lexer</H2>
      <P>
        The lexer reads source text one character at a time and groups characters into tokens - the smallest
        meaningful units of the language. kemlang-py&apos;s lexer handles multi-word Gujarati keywords like
        <code className="font-mono text-xs"> bhai bol</code> by checking multi-word sequences before single-word keywords.
      </P>
      <Link href="/docs/how-it-works/lexer" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:opacity-80 mb-8 block">
        Deep dive: The Lexer <ArrowRight className="h-3.5 w-3.5" />
      </Link>

      <H2 id="stage-2">Stage 2: Parser</H2>
      <P>
        The parser takes the flat token stream and builds an Abstract Syntax Tree using recursive descent.
        Each grammar rule maps to a method; operator precedence is encoded in the grammar stratification.
      </P>
      <Link href="/docs/how-it-works/parser" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:opacity-80 mb-8 block">
        Deep dive: The Parser <ArrowRight className="h-3.5 w-3.5" />
      </Link>

      <H2 id="stage-3">Stage 3: Interpreter</H2>
      <P>
        The interpreter walks the AST recursively. Statement nodes produce side effects; expression nodes
        return a <code className="font-mono text-xs">KemValue</code>. Variable scope is managed through a
        chain of <code className="font-mono text-xs">Environment</code> objects.
      </P>
      <Link href="/docs/how-it-works/interpreter" className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:opacity-80 mb-8 block">
        Deep dive: The Interpreter <ArrowRight className="h-3.5 w-3.5" />
      </Link>

      <H2 id="explore">Explore each stage</H2>
      <div className="space-y-3 mt-6">
        <SubPageCard href="/docs/how-it-works/lexer" step="1" title="The Lexer"
          desc="How characters become tokens. Multi-word keywords, the scanning loop, what gets rejected and why." />
        <SubPageCard href="/docs/how-it-works/parser" step="2" title="The Parser"
          desc="How tokens become an AST. Context-free grammars, recursive descent, operator precedence, the full BNF grammar." />
        <SubPageCard href="/docs/how-it-works/interpreter" step="3" title="The Interpreter"
          desc="How the AST gets executed. Tree-walking, environment scopes, control flow via exceptions, and I/O." />
        <SubPageCard href="/docs/how-it-works/runtime" step="4" title="Runtime and Types"
          desc="The five runtime types, truthiness, type coercion, the full execution lifecycle, and error propagation." />
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
