import Link from "next/link";
import { ArrowRight, Terminal, Zap, Heart, Package, BookOpen, GitBranch, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeSample } from "@/components/code-sample";
import { InstallTabs } from "@/components/install-tabs";

// ── Code examples ─────────────────────────────────────────────────────────────

const heroCode = `kem bhai
  // greet the user by name
  aa naam che bapu tame bolo
  bhai bol "kem cho, " + naam + "!"

  // count from 1 to 5
  aa i che 1
  farvu {
    bhai bol i
    i che i + 1
  } jya sudhi i < 6
aavjo bhai`;

const fizzBuzzCode = `kem bhai
  aa n che 1
  farvu {
    jo n % 15 == 0 {
      bhai bol "FizzBuzz"
    } nahi to {
      jo n % 3 == 0 {
        bhai bol "Fizz"
      } nahi to {
        jo n % 5 == 0 {
          bhai bol "Buzz"
        } nahi to {
          bhai bol n
        }
      }
    }
    n che n + 1
  } jya sudhi n < 21
aavjo bhai`;

const guessCode = `kem bhai
  aa secret che 42
  aa guess che 0
  aa tries che 0

  farvu {
    bhai bol "Guess a number:"
    guess che bapu tame bolo
    tries che tries + 1

    jo guess == secret {
      bhai bol "Correct in " + tries + " tries!"
      tame jao
    } nahi to {
      bhai bol "Try again..."
    }
  } jya sudhi bhai chhe
aavjo bhai`;

const pythonVsKem = [
  {
    label: "Print",
    python: `print("Hello!")`,
    kem:    `bhai bol "Hello!"`,
  },
  {
    label: "Variable",
    python: `x = 42`,
    kem:    `aa x che 42`,
  },
  {
    label: "If / Else",
    python: `if age >= 18:\n    print("adult")\nelse:\n    print("minor")`,
    kem:    `jo age >= 18 {\n  bhai bol "adult"\n} nahi to {\n  bhai bol "minor"\n}`,
  },
  {
    label: "While loop",
    python: `while i < 5:\n    print(i)\n    i += 1`,
    kem:    `farvu {\n  bhai bol i\n  i che i + 1\n} jya sudhi i < 5`,
  },
  {
    label: "Input",
    python: `name = input()`,
    kem:    `aa name che bapu tame bolo`,
  },
];

const snippets = [
  {
    label: "Variables & types",
    code: `aa name   che "Sanket"      // string
aa age    che 25            // integer
aa gpa    che 3.14          // float
aa active che bhai chhe     // boolean

bhai bol "Name: "  + name
bhai bol "Age: "   + age`,
  },
  {
    label: "Conditionals",
    code: `aa score che 87

jo score >= 90 {
  bhai bol "A grade"
} nahi to {
  jo score >= 75 {
    bhai bol "B grade"
  } nahi to {
    bhai bol "C grade"
  }
}`,
  },
  {
    label: "Loops & control",
    code: `aa sum che 0
aa i che 1

farvu {
  jo i % 2 == 0 {
    aagal vado    // skip evens
  }
  sum che sum + i
  i che i + 1
} jya sudhi i <= 10

bhai bol "Odd sum: " + sum`,
  },
];

const keywords: [string, string, string][] = [
  ["kem bhai",                 "program start",      "required — opens every program"],
  ["aavjo bhai",               "program end",        "required — closes every program"],
  ["aa x che val",             "declare variable",   "aa = this, che = is"],
  ["x che val",                "reassign",           "same syntax, no aa"],
  ["bhai bol expr",            "print",              "bhai = brother, bol = say"],
  ["bapu tame bolo",           "read input",         "returns a string"],
  ["jo cond { }",              "if statement",       "jo = if"],
  ["nahi to { }",              "else clause",        "nahi to = otherwise"],
  ["farvu { } jya sudhi cond", "while loop",         "farvu = do, jya sudhi = while"],
  ["tame jao",                 "break",              "exits the nearest loop"],
  ["aagal vado",               "continue",           "skip to next iteration"],
  ["bhai chhe",                "true",               "alias: true"],
  ["bhai nathi",               "false",              "alias: false"],
];

const cliCommands = [
  {
    cmd: "kem run hello.jsk",
    desc: "Execute a .jsk file",
    output: "kem cho, Sanket!\n1\n2\n3\n4\n5",
  },
  {
    cmd: "kem repl",
    desc: "Interactive REPL — enter code line by line",
    output: "KemLang REPL v0.1.3\n>>> bhai bol 1 + 1\n2\n>>> ",
  },
  {
    cmd: "kem fmt hello.jsk",
    desc: "Auto-format your code in place",
    output: "Formatted hello.jsk",
  },
  {
    cmd: "kem tokens hello.jsk",
    desc: "Inspect the token stream from the lexer",
    output: "KEM_BHAI        'kem bhai'   1:0\nBHAI_BOL        'bhai bol'   2:2\nSTRING          '\"Hello!\"'   2:10\nAAVJO_BHAI      'aavjo bhai' 3:0",
  },
  {
    cmd: "kem ast hello.jsk",
    desc: "Pretty-print the Abstract Syntax Tree",
    output: "Program\n└── Print\n    └── Literal: \"Hello!\"",
  },
];

const roadmap: [string, string, string][] = [
  ["Functions",            "kaam add(a, b) { aapo a + b }",               "planned"],
  ["= assignment",         "aa x = 10  // instead of aa x che 10",        "planned"],
  ["String interpolation", 'bhai bol f"kem cho, {naam}!"',                "planned"],
  ["Arrays",               "aa nums che [1, 2, 3]",                       "planned"],
  ["Maps",                 'aa p che {"name": "Sanket"}',                  "planned"],
  ["bhai sambhal",         "aa input che bhai sambhal  // cleaner input",  "planned"],
];

const features = [
  {
    icon: Terminal,
    title: "Gujarati keywords",
    body: "Real Gujarati words — kem bhai, bhai bol, jo, nahi to, farvu. Every keyword means something in the language.",
  },
  {
    icon: Zap,
    title: "Zero config",
    body: "One install command, one run command. No runtimes to configure, no project files to create.",
  },
  {
    icon: Package,
    title: "npm & PyPI",
    body: "Install via npm or pip. The same kem CLI lands on every platform — macOS, Linux, Windows.",
  },
  {
    icon: BookOpen,
    title: "Full CLI toolkit",
    body: "kem run · kem repl · kem fmt · kem tokens · kem ast. Everything you need in one binary.",
  },
  {
    icon: GitBranch,
    title: "Open source",
    body: "MIT licensed, built in Python with Typer and Rich. The source is readable and welcoming to contributors.",
  },
  {
    icon: Heart,
    title: "Community first",
    body: "Built for Gujarati speakers learning to code, and for anyone curious about linguistic programming languages.",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative border-b overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          aria-hidden
        >
          <span
            className="font-display text-[22vw] leading-none whitespace-nowrap opacity-[0.035]"
            style={{ letterSpacing: "-0.04em" }}
          >
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
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Get started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/playground"
                  className="inline-flex items-center justify-center h-10 px-5 rounded-md border text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  Playground
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 a-rise d4">
                {[
                  ["13", "keywords"],
                  ["3",  "install methods"],
                  ["3.10+", "Python"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display text-2xl text-primary leading-none mb-1">{n}</p>
                    <p className="text-xs text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 a-appear d2">
              <div className="a-bob">
                <CodeSample code={heroCode} highlight />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Install strip ────────────────────────────────────────────── */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-5 md:px-8 py-3.5">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="text-xs text-muted-foreground shrink-0 font-mono">install:</span>
            {["npm install -g kemlang-py", "pip install kemlang-py"].map((cmd) => (
              <div
                key={cmd}
                className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded border shrink-0"
                style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}
              >
                <span className="text-primary select-none">$</span>
                <span style={{ color: "hsl(var(--code-fg))" }}>{cmd}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Python vs kemlang-py ─────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-2xl mb-14">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
              Translation
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
              If you know Python,<br />you already get it.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              kemlang-py follows the same logic as Python — just with Gujarati words
              in place of English ones. Every concept maps one-to-one.
            </p>
          </div>

          <div className="rounded-xl border overflow-hidden max-w-3xl">
            {/* Header */}
            <div
              className="grid grid-cols-[80px_1fr_1fr] border-b"
              style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}
            >
              <div className="px-4 py-2.5" />
              <div className="px-4 py-2.5 border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <span className="font-mono text-xs text-muted-foreground">python</span>
              </div>
              <div className="px-4 py-2.5 border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <span className="font-mono text-xs text-primary">kemlang-py</span>
              </div>
            </div>

            {pythonVsKem.map(({ label, python, kem }, i) => (
              <div
                key={label}
                className="grid grid-cols-[80px_1fr_1fr]"
                style={{
                  background: "hsl(var(--code-bg))",
                  borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined,
                }}
              >
                <div
                  className="px-4 py-3 flex items-start"
                  style={{ borderRight: "1px solid hsl(var(--border))" }}
                >
                  <span className="text-xs text-muted-foreground font-mono mt-0.5">{label}</span>
                </div>
                <div
                  className="px-4 py-3"
                  style={{ borderRight: "1px solid hsl(var(--border))" }}
                >
                  <pre
                    className="font-mono text-xs leading-relaxed whitespace-pre border-0 bg-transparent p-0 m-0 rounded-none"
                    style={{ color: "hsl(var(--code-fg) / 0.6)" }}
                  >
                    {python}
                  </pre>
                </div>
                <div className="px-4 py-3">
                  <pre
                    className="font-mono text-xs leading-relaxed whitespace-pre border-0 bg-transparent p-0 m-0 rounded-none"
                    style={{ color: "hsl(var(--kw))" }}
                  >
                    {kem}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Code snippets ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b bg-muted/10">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-xl mb-14">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
              Examples
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
              Real programs,<br />real Gujarati.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All the control flow you need — variables, conditionals, and loops —
              written in words that feel natural.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-16">
            {snippets.map((s) => (
              <div key={s.label}>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  {s.label}
                </p>
                <CodeSample code={s.code} highlight />
              </div>
            ))}
          </div>

          {/* Larger examples side by side */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                FizzBuzz
              </p>
              <CodeSample code={fizzBuzzCode} highlight />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                Number guessing game
              </p>
              <CodeSample code={guessCode} highlight />
            </div>
          </div>
        </div>
      </section>

      {/* ── Keyword reference ─────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-xl mb-14">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
              Language reference
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
              13 keywords.<br />That&apos;s the whole language.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              kemlang-py is intentionally small. Every keyword has a clear Gujarati meaning —
              no guessing, no memorising arbitrary symbols.
            </p>
          </div>

          <div className="rounded-xl border overflow-hidden max-w-4xl">
            <div
              className="grid grid-cols-[180px_1fr_1fr] border-b px-5 py-3"
              style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}
            >
              <span className="font-mono text-xs text-muted-foreground">keyword</span>
              <span className="font-mono text-xs text-muted-foreground">meaning</span>
              <span className="font-mono text-xs text-muted-foreground">notes</span>
            </div>
            <div style={{ background: "hsl(var(--code-bg))" }}>
              {keywords.map(([kw, meaning, notes], i) => (
                <div
                  key={kw}
                  className="grid grid-cols-[180px_1fr_1fr] px-5 py-3 text-xs"
                  style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}
                >
                  <code
                    className="font-mono"
                    style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0, fontSize: "0.75rem" }}
                  >
                    {kw}
                  </code>
                  <span style={{ color: "hsl(var(--code-fg))" }}>{meaning}</span>
                  <span style={{ color: "hsl(var(--cmt))" }}>{notes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b bg-muted/10">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-xl mb-16">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
              Architecture
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
              How it works.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              kemlang-py is a tree-walking interpreter written in Python.
              Your code goes through three stages before producing output.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px border rounded-xl overflow-hidden bg-border max-w-4xl">
            {[
              {
                step: "01",
                title: "Lexer",
                subtitle: "kemlang/lexer.py",
                desc: "Source code is scanned into a stream of tokens. Multi-word keywords like kem bhai are matched first, then single keywords, literals, and operators.",
                sample: `// Input source:\nkem bhai\n  bhai bol 42\naavjo bhai\n\n// Becomes:\nKEM_BHAI\nBHAI_BOL  INTEGER(42)\nAAVJO_BHAI`,
              },
              {
                step: "02",
                title: "Parser",
                subtitle: "kemlang/parser.py",
                desc: "The token stream is fed into a recursive-descent parser that builds an Abstract Syntax Tree of typed statement and expression nodes.",
                sample: `// Token stream → AST:\nProgram\n└── Print\n    └── Literal\n        value: 42\n        type: INTEGER`,
              },
              {
                step: "03",
                title: "Interpreter",
                subtitle: "kemlang/interpreter.py",
                desc: "A tree-walking interpreter traverses the AST and executes each node. Variables are stored in an Environment dict. Errors are reported with line and column.",
                sample: `// AST → output:\n$ kem run hello.jsk\n42\n\n// Exit code: 0`,
              },
            ].map(({ step, title, subtitle, desc, sample }) => (
              <div key={step} className="bg-background p-7 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-primary mb-1">{step}</p>
                    <h3 className="font-display text-xl mb-0.5">{title}</h3>
                    <p className="font-mono text-[10px] text-muted-foreground">{subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div
                  className="rounded-lg p-4 font-mono text-xs leading-relaxed whitespace-pre mt-auto"
                  style={{ background: "hsl(var(--code-bg))", color: "hsl(var(--cmt))", border: "1px solid hsl(var(--border))" }}
                >
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
          <div className="max-w-xl mb-14">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
              CLI
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
              One binary.<br />Five commands.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The <code>kem</code> CLI covers everything from running files to inspecting
              the token stream and AST — no extra tools required.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl">
            {cliCommands.map(({ cmd, desc, output }) => (
              <div key={cmd} className="rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
                {/* Command line */}
                <div
                  className="flex items-center gap-3 px-5 py-3 border-b"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <span className="font-mono text-xs text-primary select-none">$</span>
                  <span className="font-mono text-sm font-medium" style={{ color: "hsl(var(--code-fg))" }}>{cmd}</span>
                  <span className="ml-auto text-xs text-muted-foreground hidden sm:block">{desc}</span>
                </div>
                {/* Output */}
                <div className="px-5 py-3">
                  <pre
                    className="font-mono text-xs leading-relaxed border-0 bg-transparent p-0 m-0 rounded-none"
                    style={{ color: "hsl(var(--cmt))" }}
                  >
                    {output}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Install ───────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b bg-muted/20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
                Installation
              </p>
              <h2 className="font-display text-4xl md:text-5xl leading-tight mb-5">
                Running in<br />under a minute.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Pick npm or pip — both install the same <code>kem</code> binary.
                Works on macOS, Linux, and Windows.
              </p>
              <div className="space-y-3">
                {[
                  { n: "1", t: "Install kemlang-py", sub: "via npm or pip" },
                  { n: "2", t: "Create a .jsk file", sub: "start with kem bhai" },
                  { n: "3", t: "Run your program",  sub: "kem run hello.jsk" },
                ].map(({ n, t, sub }) => (
                  <div key={n} className="flex items-center gap-4">
                    <span className="font-display text-3xl text-primary/30 w-8 shrink-0">{n}</span>
                    <div>
                      <p className="font-medium text-sm">{t}</p>
                      <p className="text-xs text-muted-foreground font-mono">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <InstallTabs />
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-xl mb-14">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
              Features
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Everything included.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px border rounded-xl overflow-hidden bg-border">
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
          <div className="max-w-xl mb-14">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">
              Roadmap
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
              What&apos;s coming next.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              kemlang-py is under active development. These features are planned
              for upcoming releases.{" "}
              <Link
                href="https://github.com/sanketmuchhala/kemlang-py"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Contribute on GitHub.
              </Link>
            </p>
          </div>

          <div className="rounded-xl border overflow-hidden max-w-3xl">
            {roadmap.map(([title, example, status], i) => (
              <div
                key={title}
                className="grid grid-cols-[1fr_2fr_80px] gap-4 items-center px-6 py-4 text-sm"
                style={{
                  background: "hsl(var(--code-bg))",
                  borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined,
                }}
              >
                <span className="font-medium" style={{ color: "hsl(var(--code-fg))" }}>
                  {title}
                </span>
                <code
                  className="font-mono text-xs"
                  style={{ background: "transparent", color: "hsl(var(--kw) / 0.8)", padding: 0 }}
                >
                  {example}
                </code>
                <span className="font-mono text-xs text-right" style={{ color: "hsl(var(--str))" }}>
                  {status}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground max-w-xl">
            Want to help? Pick a roadmap item and open a PR — the codebase is small
            and well-documented in{" "}
            <Link href="/docs" className="text-primary underline underline-offset-4">
              the docs
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="relative container mx-auto px-5 md:px-8 text-center">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-6">
            Get started
          </p>
          <h2 className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6">
            kem cho,<br />
            <em className="not-italic text-primary">developer.</em>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Start writing Gujarati code today. Install in under a minute,
            run your first program in five.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 h-11 px-7 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Read the docs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 h-11 px-7 rounded-md border font-medium hover:bg-muted/50 transition-colors text-sm"
            >
              Try in browser
            </Link>
            <Link
              href="https://github.com/sanketmuchhala/kemlang-py"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-11 px-7 rounded-md border font-medium hover:bg-muted/50 transition-colors text-sm"
            >
              Star on GitHub
            </Link>
          </div>

          {/* Mini quick-start */}
          <div
            className="inline-block text-left rounded-xl border overflow-hidden"
            style={{ background: "hsl(var(--code-bg))" }}
          >
            <div className="px-5 py-2.5 border-b flex items-center gap-2" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="flex gap-1.5">
                {["#FF5F56","#FFBD2E","#27C93F"].map(c => (
                  <span key={c} className="block h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground ml-2">quick start</span>
            </div>
            <div className="px-5 py-4 space-y-1.5">
              {[
                ["# install", "npm install -g kemlang-py"],
                ["# write",   'echo "kem bhai\\nbhai bol \\"kem cho!\\"\\naavjo bhai" > hello.jsk'],
                ["# run",     "kem run hello.jsk"],
                ["# output",  "kem cho!"],
              ].map(([comment, cmd]) => (
                <div key={comment} className="flex items-start gap-4 font-mono text-xs">
                  <span className="shrink-0 w-16" style={{ color: "hsl(var(--cmt))" }}>{comment}</span>
                  <span style={{ color: comment === "# output" ? "hsl(var(--kw))" : "hsl(var(--code-fg))" }}>
                    {cmd}
                  </span>
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
