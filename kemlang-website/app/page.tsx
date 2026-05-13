import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Terminal, Zap, Heart, Package, BookOpen, GitBranch } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeSample } from "@/components/code-sample";
import { InstallTabs } from "@/components/install-tabs";

export const metadata: Metadata = {
  title: "kemlang-py - Gujarati Programming Language",
  description:
    "Write programs in Gujarati with kemlang-py. A fun, open-source interpreter with real Gujarati keywords like kem bhai, bhai bol, and jo. Install with npm or pip.",
  alternates: { canonical: "https://kemlang.cloud/" },
  openGraph: {
    title: "kemlang-py - Gujarati Programming Language",
    description: "Write programs in Gujarati. Real Gujarati keywords, open source, install with npm or pip.",
    url: "https://kemlang.cloud/",
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const heroCode = `kem bhai
  // read the user's name
  aa naam che bapu tame bolo
  bhai bol "kem cho, " + naam + "!"

  // count from 1 to 5
  aa i che 1
  farvu {
    bhai bol i
    i che i + 1
  } jya sudhi i < 6
aavjo bhai`;

const pythonVsKem = [
  { label: "Print",      python: `print("Hello!")`,                                      kem: `bhai bol "Hello!"` },
  { label: "Variable",   python: `x = 42`,                                               kem: `aa x che 42` },
  { label: "If / Else",  python: `if age >= 18:\n    print("adult")\nelse:\n    print("minor")`, kem: `jo age >= 18 {\n  bhai bol "adult"\n} nahi to {\n  bhai bol "minor"\n}` },
  { label: "While",      python: `while i < 5:\n    print(i)\n    i += 1`,               kem: `farvu {\n  bhai bol i\n  i che i + 1\n} jya sudhi i < 5` },
  { label: "Input",      python: `name = input()`,                                       kem: `aa name che bapu tame bolo` },
];

// Step-by-step: the same program grown line by line
const buildSteps = [
  {
    title: "Start every program",
    desc: "Every kemlang-py program opens with kem bhai and closes with aavjo bhai. Think of it as saying \"hello, brother\" and \"goodbye, brother\".",
    code: `kem bhai
aavjo bhai`,
    output: "",
  },
  {
    title: "Print something",
    desc: "bhai bol means \"brother, say\" - it prints whatever comes after it. Strings go in double or single quotes.",
    code: `kem bhai
  bhai bol "kem cho, duniya!"
aavjo bhai`,
    output: "kem cho, duniya!",
  },
  {
    title: "Declare a variable",
    desc: "aa means \"this\", che means \"is\". So aa naam che \"Sanket\" reads: this naam is \"Sanket\".",
    code: `kem bhai
  aa naam che "Sanket"
  bhai bol "kem cho, " + naam + "!"
aavjo bhai`,
    output: `kem cho, Sanket!`,
  },
  {
    title: "Read user input",
    desc: "bapu tame bolo means \"father, you say\" - it waits for the user to type something and returns it as a string.",
    code: `kem bhai
  bhai bol "What is your name?"
  aa naam che bapu tame bolo
  bhai bol "kem cho, " + naam + "!"
aavjo bhai`,
    output: `What is your name?\n> Riya\nkem cho, Riya!`,
  },
  {
    title: "Add a conditional",
    desc: "jo means \"if\", nahi to means \"otherwise\". Braces wrap the block - no colons, no indentation rules.",
    code: `kem bhai
  aa score che 88

  jo score >= 90 {
    bhai bol "A grade - saras!"
  } nahi to {
    jo score >= 75 {
      bhai bol "B grade - thik che"
    } nahi to {
      bhai bol "Keep practising"
    }
  }
aavjo bhai`,
    output: "B grade - thik che",
  },
  {
    title: "Loop with farvu",
    desc: "farvu means \"to do\", jya sudhi means \"as long as\". The condition goes at the end, checked after each iteration.",
    code: `kem bhai
  aa i che 1
  farvu {
    bhai bol i
    i che i + 1
    jo i > 5 { tame jao }
  } jya sudhi bhai chhe
aavjo bhai`,
    output: "1\n2\n3\n4\n5",
  },
];

const keywords: [string, string, string][] = [
  ["kem bhai",                 "program start",   "aa = this · che = is"],
  ["aavjo bhai",               "program end",     "aavjo = goodbye"],
  ["aa x che val",             "declare",         "bhai = brother · bol = say"],
  ["x che val",                "reassign",        "same, without aa"],
  ["bhai bol expr",            "print",           "bapu = father · bolo = say"],
  ["bapu tame bolo",           "read input",      "returns a string"],
  ["jo cond { }",              "if",              "jo = if"],
  ["nahi to { }",              "else",            "nahi to = otherwise"],
  ["farvu { } jya sudhi cond", "while loop",      "jya sudhi = while/until"],
  ["tame jao",                 "break",           "tame = you · jao = go"],
  ["aagal vado",               "continue",        "aagal = forward · vado = move"],
  ["bhai chhe / bhai nathi",   "true / false",    "also: true / false"],
];

const cliCommands = [
  { cmd: "kem run hello.jsk",    desc: "Execute a file",                output: "kem cho, Sanket!\n1\n2\n3\n4\n5" },
  { cmd: "kem repl",             desc: "Interactive REPL",              output: "KemLang REPL v0.1.3\n>>> bhai bol 1 + 1\n2\n>>> " },
  { cmd: "kem fmt hello.jsk",    desc: "Auto-format in place",          output: "Formatted hello.jsk" },
  { cmd: "kem tokens hello.jsk", desc: "Inspect the token stream",      output: "KEM_BHAI        'kem bhai'   1:0\nBHAI_BOL        'bhai bol'   2:2\nSTRING          '\"Hello!\"'   2:10\nAAVJO_BHAI      'aavjo bhai' 3:0" },
  { cmd: "kem ast hello.jsk",    desc: "Pretty-print the AST",          output: "Program\n└── Print\n    └── Literal: \"Hello!\"" },
];

const roadmap: [string, string][] = [
  ["Functions",            'kaam add(a, b) { aapo a + b }'],
  ["= assignment",         "aa x = 10"],
  ["String interpolation", 'bhai bol f"kem cho, {naam}!"'],
  ["Arrays",               "aa nums che [1, 2, 3]"],
  ["Maps",                 'aa p che {"name": "Sanket"}'],
  ["bhai sambhal",         "aa inp che bhai sambhal"],
];

const features = [
  { icon: Terminal, title: "Gujarati keywords",  body: "Real Gujarati words mapped to real programming concepts - kem bhai, bhai bol, jo, nahi to, farvu." },
  { icon: Zap,      title: "Zero config",        body: "One install command, one run command. No runtimes to configure, no project files to create." },
  { icon: Package,  title: "npm & PyPI",         body: "Install via npm or pip. The same kem CLI on macOS, Linux, and Windows." },
  { icon: BookOpen, title: "Full CLI toolkit",   body: "kem run · kem repl · kem fmt · kem tokens · kem ast. Everything in one binary." },
  { icon: GitBranch,title: "Open source",        body: "MIT licensed, built in Python with Typer and Rich. Small, readable codebase." },
  { icon: Heart,    title: "Community first",    body: "Built for Gujarati speakers learning to code - and programmers curious about language design." },
];

// ── Shared styles ─────────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">{children}</p>
);

const SectionHeading = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`font-display text-4xl md:text-5xl leading-tight mb-4 ${className}`}>{children}</h2>
);

const SectionDesc = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed">{children}</p>
);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative border-b overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none" aria-hidden>
          <span className="font-display text-[22vw] leading-none whitespace-nowrap opacity-[0.035]" style={{ letterSpacing: "-0.04em" }}>
            kem bhai
          </span>
        </div>

        <div className="relative container mx-auto px-5 md:px-8 py-24 md:py-36">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-2">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-5 a-rise">
                v0.1.3 · npm & PyPI
              </p>
              <h1 className="font-display text-5xl md:text-6xl leading-[1.08] tracking-tight a-rise d1">
                Code in<br />
                <em className="not-italic text-primary">Gujarati.</em>
              </h1>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed a-rise d2">
                kemlang-py is a programming language with real Gujarati keywords.
                Write <code>kem bhai</code>, run everywhere.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 a-rise d3">
                <Link href="/docs" className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Get started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/playground" className="inline-flex items-center justify-center h-10 px-5 rounded-md border text-sm font-medium hover:bg-muted/50 transition-colors">
                  Playground
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-4 a-rise d4">
                {[["13","keywords"],["3","install methods"],["3.10+","Python"]].map(([n,l]) => (
                  <div key={l}>
                    <p className="font-display text-2xl text-primary leading-none mb-1">{n}</p>
                    <p className="text-xs text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 a-appear d2">
              <div className="a-bob"><CodeSample code={heroCode} highlight /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Install strip ────────────────────────────────────────────── */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-5 md:px-8 py-3.5">
          <div className="flex items-center justify-center gap-4 overflow-x-auto">
            <span className="font-mono text-xs text-muted-foreground shrink-0">install:</span>
            {["npm install -g kemlang-py","pip install kemlang-py"].map(cmd => (
              <div key={cmd} className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded border shrink-0" style={{ background:"hsl(var(--code-bg))", borderColor:"hsl(var(--border))" }}>
                <span className="text-primary select-none">$</span>
                <span style={{ color:"hsl(var(--code-fg))" }}>{cmd}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Python vs kemlang-py ─────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <SectionLabel>Translation</SectionLabel>
            <SectionHeading>If you know Python,<br />you already get it.</SectionHeading>
            <SectionDesc>
              kemlang-py follows the same logic as Python - just with Gujarati words in place of English ones. Every concept maps one-to-one.
            </SectionDesc>
          </div>

          <div className="rounded-xl border overflow-hidden max-w-3xl mx-auto">
            <div className="grid grid-cols-[80px_1fr_1fr] border-b" style={{ background:"hsl(var(--code-bg))", borderColor:"hsl(var(--border))" }}>
              <div className="px-4 py-2.5" />
              <div className="px-4 py-2.5 border-l" style={{ borderColor:"hsl(var(--border))" }}>
                <span className="font-mono text-xs text-muted-foreground">python</span>
              </div>
              <div className="px-4 py-2.5 border-l" style={{ borderColor:"hsl(var(--border))" }}>
                <span className="font-mono text-xs text-primary">kemlang-py</span>
              </div>
            </div>
            {pythonVsKem.map(({ label, python, kem }, i) => (
              <div key={label} className="grid grid-cols-[80px_1fr_1fr]" style={{ background:"hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
                <div className="px-4 py-3 flex items-start" style={{ borderRight:"1px solid hsl(var(--border))" }}>
                  <span className="text-xs text-muted-foreground font-mono mt-0.5">{label}</span>
                </div>
                <div className="px-4 py-3" style={{ borderRight:"1px solid hsl(var(--border))" }}>
                  <pre className="font-mono text-xs leading-relaxed whitespace-pre border-0 bg-transparent p-0 m-0 rounded-none" style={{ color:"hsl(var(--code-fg) / 0.55)" }}>{python}</pre>
                </div>
                <div className="px-4 py-3">
                  <pre className="font-mono text-xs leading-relaxed whitespace-pre border-0 bg-transparent p-0 m-0 rounded-none" style={{ color:"hsl(var(--kw))" }}>{kem}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Build your first program ──────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b bg-muted/10">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <SectionLabel>Learn by building</SectionLabel>
            <SectionHeading>Write your first program,<br />one line at a time.</SectionHeading>
            <SectionDesc>
              Every concept introduced step by step - from the bare skeleton to a full interactive program with input, conditionals, and loops.
            </SectionDesc>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {buildSteps.map(({ title, desc, code, output }, i) => (
              <div key={i} className="grid md:grid-cols-[1fr_1.6fr] gap-0 rounded-xl border overflow-hidden" style={{ background:"hsl(var(--code-bg))" }}>
                {/* Left: explanation */}
                <div className="p-7 flex flex-col justify-center border-b md:border-b-0 md:border-r" style={{ borderColor:"hsl(var(--border))" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                      step {String(i + 1).padStart(2,"0")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base mb-2" style={{ color:"hsl(var(--code-fg))" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:"hsl(var(--cmt))" }}>{desc}</p>
                  {output && (
                    <div className="mt-5">
                      <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color:"hsl(var(--cmt))" }}>output</p>
                      <div className="rounded-lg border px-3 py-2" style={{ borderColor:"hsl(var(--border))", background:"hsl(var(--background) / 0.4)" }}>
                        <pre className="font-mono text-xs leading-relaxed" style={{ color:"hsl(var(--kw))" }}>{output}</pre>
                      </div>
                    </div>
                  )}
                </div>
                {/* Right: code */}
                <div>
                  <CodeSample code={code} highlight className="rounded-none border-0" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/playground" className="inline-flex items-center gap-2 h-10 px-6 rounded-md border text-sm font-medium hover:bg-muted/50 transition-colors">
              Try all of these in the playground <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Keyword reference ─────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <SectionLabel>Language reference</SectionLabel>
            <SectionHeading>13 keywords.<br />That&apos;s the whole language.</SectionHeading>
            <SectionDesc>
              kemlang-py is intentionally small. Every keyword has a clear Gujarati meaning - no guessing, no arbitrary symbols to memorise.
            </SectionDesc>
          </div>

          <div className="rounded-xl border overflow-hidden max-w-4xl mx-auto">
            <div className="grid grid-cols-[160px_1fr_1fr] border-b px-5 py-3" style={{ background:"hsl(var(--code-bg))", borderColor:"hsl(var(--border))" }}>
              <span className="font-mono text-xs text-muted-foreground">keyword</span>
              <span className="font-mono text-xs text-muted-foreground">meaning</span>
              <span className="font-mono text-xs text-muted-foreground">etymology</span>
            </div>
            <div style={{ background:"hsl(var(--code-bg))" }}>
              {keywords.map(([kw, meaning, notes], i) => (
                <div key={kw} className="grid grid-cols-[160px_1fr_1fr] px-5 py-3 text-xs" style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
                  <code className="font-mono" style={{ background:"transparent", color:"hsl(var(--kw))", padding:0, fontSize:"0.75rem" }}>{kw}</code>
                  <span style={{ color:"hsl(var(--code-fg))" }}>{meaning}</span>
                  <span style={{ color:"hsl(var(--cmt))" }}>{notes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b bg-muted/10">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <SectionLabel>Architecture</SectionLabel>
            <SectionHeading>How it works.</SectionHeading>
            <SectionDesc>
              kemlang-py is a tree-walking interpreter written in Python. Your source code goes through three stages before producing output.
            </SectionDesc>
          </div>

          <div className="grid md:grid-cols-3 gap-px border rounded-xl overflow-hidden bg-border max-w-4xl mx-auto">
            {[
              {
                step:"01", title:"Lexer", file:"kemlang/lexer.py",
                desc:"Source code is scanned into a stream of typed tokens. Multi-word keywords like kem bhai are matched first, then single keywords, literals, and operators.",
                sample:`// source\nkem bhai\n  bhai bol 42\naavjo bhai\n\n// tokens\nKEM_BHAI\nBHAI_BOL  INTEGER(42)\nAAVJO_BHAI`,
              },
              {
                step:"02", title:"Parser", file:"kemlang/parser.py",
                desc:"The token stream feeds a recursive-descent parser that produces an Abstract Syntax Tree of typed statement and expression nodes.",
                sample:`// tokens → AST\nProgram\n└── Print\n    └── Literal\n        value: 42\n        type: INTEGER`,
              },
              {
                step:"03", title:"Interpreter", file:"kemlang/interpreter.py",
                desc:"A tree-walking interpreter visits each node and executes it. Variables live in an Environment dict. Errors carry line and column info.",
                sample:`// AST → output\n$ kem run hello.jsk\n42\n\n// Exit code: 0`,
              },
            ].map(({ step, title, file, desc, sample }) => (
              <div key={step} className="bg-background p-7 flex flex-col gap-5">
                <div>
                  <p className="font-mono text-xs text-primary mb-1">{step}</p>
                  <h3 className="font-display text-xl mb-0.5">{title}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">{file}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="rounded-lg p-4 font-mono text-xs leading-relaxed whitespace-pre mt-auto" style={{ background:"hsl(var(--code-bg))", color:"hsl(var(--cmt))", border:"1px solid hsl(var(--border))" }}>
                  {sample}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLI ───────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <SectionLabel>CLI</SectionLabel>
            <SectionHeading>One binary.<br />Five commands.</SectionHeading>
            <SectionDesc>
              The <code>kem</code> CLI covers running, formatting, inspecting tokens, and visualising the AST - all out of the box.
            </SectionDesc>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {cliCommands.map(({ cmd, desc, output }) => (
              <div key={cmd} className="rounded-xl border overflow-hidden" style={{ background:"hsl(var(--code-bg))" }}>
                <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor:"hsl(var(--border))" }}>
                  <span className="font-mono text-xs text-primary select-none">$</span>
                  <span className="font-mono text-sm font-medium" style={{ color:"hsl(var(--code-fg))" }}>{cmd}</span>
                  <span className="ml-auto text-xs text-muted-foreground hidden sm:block">{desc}</span>
                </div>
                <div className="px-5 py-3">
                  <pre className="font-mono text-xs leading-relaxed border-0 bg-transparent p-0 m-0 rounded-none" style={{ color:"hsl(var(--cmt))" }}>{output}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Install ───────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b bg-muted/20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <SectionLabel>Installation</SectionLabel>
            <SectionHeading>Running in under a minute.</SectionHeading>
            <SectionDesc>Pick npm or pip - both install the same <code>kem</code> binary. Works on macOS, Linux, and Windows.</SectionDesc>
          </div>
          <div className="max-w-xl mx-auto">
            <InstallTabs />
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <SectionLabel>Features</SectionLabel>
            <SectionHeading>Everything included.</SectionHeading>
            <SectionDesc>A complete language environment - interpreter, formatter, REPL, and token inspector - all in one install.</SectionDesc>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px border rounded-xl overflow-hidden bg-border max-w-5xl mx-auto">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-background p-7 hover:bg-muted/30 transition-colors">
                <Icon className="h-5 w-5 text-primary mb-4" strokeWidth={1.5} />
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap ───────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b bg-muted/10">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <SectionLabel>Roadmap</SectionLabel>
            <SectionHeading>What&apos;s coming next.</SectionHeading>
            <SectionDesc>
              kemlang-py is under active development. These features are planned for upcoming releases.{" "}
              <Link href="https://github.com/sanketmuchhala/kemlang-py" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">
                Contribute on GitHub.
              </Link>
            </SectionDesc>
          </div>

          <div className="rounded-xl border overflow-hidden max-w-2xl mx-auto">
            {roadmap.map(([title, example], i) => (
              <div key={title} className="grid grid-cols-[140px_1fr] items-center px-6 py-4 text-sm" style={{ background:"hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
                <span className="font-medium" style={{ color:"hsl(var(--code-fg))" }}>{title}</span>
                <code className="font-mono text-xs" style={{ background:"transparent", color:"hsl(var(--kw) / 0.8)", padding:0 }}>{example}</code>
              </div>
            ))}
            <div className="px-6 py-3 border-t text-xs font-mono text-right" style={{ borderColor:"hsl(var(--border))", background:"hsl(var(--code-bg))", color:"hsl(var(--str))" }}>
              all planned
            </div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            Want to help? The codebase is small and well-documented.{" "}
            <Link href="/docs" className="text-primary underline underline-offset-4">Read the docs</Link> then open a PR.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="relative container mx-auto px-5 md:px-8 text-center">
          <SectionLabel>Get started</SectionLabel>
          <h2 className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6">
            kem cho,<br />
            <em className="not-italic text-primary">developer.</em>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Start writing Gujarati code today. Install in under a minute, run your first program in five.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link href="/docs" className="inline-flex items-center gap-2 h-11 px-7 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Read the docs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/playground" className="inline-flex items-center gap-2 h-11 px-7 rounded-md border font-medium hover:bg-muted/50 transition-colors text-sm">
              Try in browser
            </Link>
            <Link href="https://github.com/sanketmuchhala/kemlang-py" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 h-11 px-7 rounded-md border font-medium hover:bg-muted/50 transition-colors text-sm">
              Star on GitHub
            </Link>
          </div>

          <div className="inline-block text-left rounded-xl border overflow-hidden" style={{ background:"hsl(var(--code-bg))" }}>
            <div className="px-5 py-2.5 border-b flex items-center gap-2" style={{ borderColor:"hsl(var(--border))" }}>
              <div className="flex gap-1.5">
                {["#FF5F56","#FFBD2E","#27C93F"].map(c => <span key={c} className="block h-2.5 w-2.5 rounded-full" style={{ background:c }} />)}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground ml-2">quick start</span>
            </div>
            <div className="px-5 py-4 space-y-1.5">
              {[
                ["# install", "npm install -g kemlang-py"],
                ["# write",   "printf 'kem bhai\\nbhai bol \"kem cho!\"\\naavjo bhai' > hello.jsk"],
                ["# run",     "kem run hello.jsk"],
                ["# output",  "kem cho!"],
              ].map(([c, cmd]) => (
                <div key={c} className="flex items-start gap-4 font-mono text-xs">
                  <span className="shrink-0 w-16" style={{ color:"hsl(var(--cmt))" }}>{c}</span>
                  <span style={{ color: c === "# output" ? "hsl(var(--kw))" : "hsl(var(--code-fg))" }}>{cmd}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
