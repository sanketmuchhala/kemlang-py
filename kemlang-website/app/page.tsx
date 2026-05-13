import Link from "next/link";
import { ArrowRight, Terminal, Zap, Heart, Package, BookOpen } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeSample } from "@/components/code-sample";
import { InstallTabs } from "@/components/install-tabs";

const heroCode = `kem bhai
  // Say hello in Gujarati
  aa naam che bapu tame bolo
  bhai bol "kem cho, " + naam + "!"

  aa count che 1
  farvu {
    bhai bol count
    count che count + 1
  } jya sudhi count < 6
aavjo bhai`;

const snippets = [
  {
    title: "Variables",
    code: `aa x che 42
aa msg che "kem cho!"
bhai bol msg`,
  },
  {
    title: "Conditionals",
    code: `jo age >= 18 {
  bhai bol "adult"
} nahi to {
  bhai bol "minor"
}`,
  },
  {
    title: "Loops",
    code: `aa i che 0
farvu {
  bhai bol i
  i che i + 1
} jya sudhi i < 5`,
  },
];

const features = [
  {
    icon: <Terminal className="h-5 w-5" />,
    title: "Gujarati Keywords",
    description:
      "Write code with words you already know — kem bhai, bhai bol, jo, farvu. Programming in your mother tongue.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Zero Config",
    description:
      "One command to install, one to run. No runtimes to set up, no config files to write.",
  },
  {
    icon: <Package className="h-5 w-5" />,
    title: "npm & PyPI",
    description:
      "Install via npm or pip. Works on macOS, Linux, and Windows out of the box.",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Rich CLI",
    description:
      "Built-in formatter, token inspector, AST viewer, and an interactive REPL.",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Open Source",
    description:
      "MIT licensed. Built with Python, Typer, and Rich. Contributions welcome.",
  },
  {
    icon: <Terminal className="h-5 w-5" />,
    title: "Web Playground",
    description:
      "Try kemlang-py right in your browser — no install required.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border/60">
          {/* Grid background */}
          <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
          {/* Amber glow */}
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, hsl(38 95% 52%) 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
          />

          <div className="relative container mx-auto px-4 md:px-8 py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6 animate-fade-up">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                  </span>
                  v0.1.3 — now on npm &amp; PyPI
                </div>

                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight animate-fade-up delay-100">
                  Code in{" "}
                  <span
                    className="relative"
                    style={{
                      background: "linear-gradient(135deg, hsl(38 95% 52%), hsl(25 95% 55%))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Gujarati
                  </span>
                  .
                </h1>

                <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg animate-fade-up delay-200">
                  kemlang-py is a fun, educational programming language with
                  Gujarati keywords. Write{" "}
                  <code className="text-sm">kem bhai</code>, run anywhere.
                </p>

                <div className="mt-8 flex flex-wrap gap-3 animate-fade-up delay-300">
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/playground"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted/60 transition-colors"
                  >
                    Try Online
                  </Link>
                </div>

                {/* Quick install */}
                <div className="mt-8 animate-fade-up delay-400">
                  <div
                    className="inline-flex items-center gap-3 rounded-lg border border-border/60 px-4 py-2.5 font-mono text-sm"
                    style={{ background: "hsl(var(--code-bg))" }}
                  >
                    <span className="text-primary select-none">$</span>
                    <span className="text-foreground/90">npm install -g kemlang-py</span>
                  </div>
                </div>
              </div>

              {/* Right — code */}
              <div className="animate-fade-up delay-300 lg:animate-fade-in">
                <div className="animate-float">
                  <CodeSample code={heroCode} highlighted />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Language Snippets ─────────────────────────────── */}
        <section className="py-20 md:py-28 border-b border-border/60">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Simple. Readable. Gujarati.
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                KemLang maps familiar Gujarati words to real programming concepts.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {snippets.map((s, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    {s.title}
                  </p>
                  <CodeSample code={s.code} highlighted />
                </div>
              ))}
            </div>

            {/* Keyword reference strip */}
            <div className="mt-14 max-w-3xl mx-auto">
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <div className="px-5 py-3 border-b border-border/60 bg-muted/40">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Keyword Reference
                  </p>
                </div>
                <div className="divide-y divide-border/40" style={{ background: "hsl(var(--code-bg))" }}>
                  {[
                    ["kem bhai", "Program start"],
                    ["aavjo bhai", "Program end"],
                    ["aa x che val", "Declare variable"],
                    ["bhai bol expr", "Print"],
                    ["bapu tame bolo", "Read input"],
                    ["jo cond { }", "If statement"],
                    ["nahi to { }", "Else clause"],
                    ["farvu { } jya sudhi cond", "While loop"],
                    ["tame jao", "break"],
                    ["aagal vado", "continue"],
                  ].map(([kw, desc]) => (
                    <div
                      key={kw}
                      className="flex items-center justify-between px-5 py-2.5 text-sm"
                    >
                      <code className="font-mono text-primary/90 bg-transparent text-sm">
                        {kw}
                      </code>
                      <span className="text-muted-foreground text-xs">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Install ───────────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-muted/20 border-b border-border/60">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Up and running
                  <br />
                  in seconds.
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Install once, run anywhere. kemlang-py is available on npm,
                  PyPI, and GitHub.
                </p>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {[
                    "kem run hello.jsk — execute a file",
                    "kem repl — interactive REPL",
                    "kem fmt hello.jsk — format code",
                    "kem tokens hello.jsk — inspect tokens",
                    "kem ast hello.jsk — view AST",
                  ].map((cmd) => (
                    <div key={cmd} className="flex items-center gap-2">
                      <span className="text-primary">›</span>
                      <code className="font-mono text-xs bg-transparent">{cmd}</code>
                    </div>
                  ))}
                </div>
              </div>
              <InstallTabs />
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────── */}
        <section className="py-20 md:py-28 border-b border-border/60">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything you need.
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                A complete programming environment with a rich CLI and web playground.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 p-6 bg-card hover:border-primary/30 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-display font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                kem cho,{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, hsl(38 95% 52%), hsl(25 95% 55%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  developer!
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Start writing code in Gujarati today. It takes less than a minute to install.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  Read the Docs
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="https://github.com/sanketmuchhala/kemlang-py"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-md border border-border bg-background font-semibold hover:bg-muted/60 transition-colors text-sm"
                >
                  Star on GitHub
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
