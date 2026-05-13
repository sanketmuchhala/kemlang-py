import Link from "next/link";
import { ArrowRight, Terminal, Zap, Heart, Package, BookOpen, GitBranch } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeSample } from "@/components/code-sample";
import { InstallTabs } from "@/components/install-tabs";

const heroCode = `kem bhai
  // greet the user
  aa naam che bapu tame bolo
  bhai bol "kem cho, " + naam + "!"

  aa i che 1
  farvu {
    bhai bol i
    i che i + 1
  } jya sudhi i < 6
aavjo bhai`;

const snippets = [
  {
    label: "Variables",
    code: `aa x che 42
aa msg che "kem cho!"
bhai bol msg`,
  },
  {
    label: "Conditionals",
    code: `jo age >= 18 {
  bhai bol "adult"
} nahi to {
  bhai bol "minor"
}`,
  },
  {
    label: "Loops",
    code: `aa i che 0
farvu {
  bhai bol i
  i che i + 1
} jya sudhi i < 5`,
  },
];

const keywords: [string, string][] = [
  ["kem bhai",                 "program start"],
  ["aavjo bhai",               "program end"],
  ["aa x che val",             "declare variable"],
  ["x che val",                "reassign variable"],
  ["bhai bol expr",            "print"],
  ["bapu tame bolo",           "read input"],
  ["jo cond { }",              "if"],
  ["nahi to { }",              "else"],
  ["farvu { } jya sudhi cond", "while loop"],
  ["tame jao",                 "break"],
  ["aagal vado",               "continue"],
  ["bhai chhe / bhai nathi",   "true / false"],
];

const features = [
  {
    icon: Terminal,
    title: "Gujarati keywords",
    body: "Write kem bhai, bhai bol, jo, farvu. Real Gujarati words mapped to real programming concepts.",
  },
  {
    icon: Zap,
    title: "Zero config",
    body: "One install command, one run command. No runtime setup, no config files.",
  },
  {
    icon: Package,
    title: "npm & PyPI",
    body: "Install however you prefer. Works on macOS, Linux, and Windows.",
  },
  {
    icon: BookOpen,
    title: "Rich CLI",
    body: "kem run, kem repl, kem fmt, kem tokens, kem ast — a complete developer toolkit.",
  },
  {
    icon: GitBranch,
    title: "Open source",
    body: "MIT licensed. Built in Python. Read the code, file issues, send PRs.",
  },
  {
    icon: Heart,
    title: "Community",
    body: "Made for Gujarati speakers learning programming, and programmers curious about linguistic esolangs.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative border-b overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

        {/* Large decorative text */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          aria-hidden
        >
          <span
            className="font-display text-[22vw] font-normal leading-none whitespace-nowrap opacity-[0.04]"
            style={{ letterSpacing: "-0.04em" }}
          >
            kem bhai
          </span>
        </div>

        <div className="relative container mx-auto px-5 md:px-8 py-24 md:py-36">
          <div className="grid lg:grid-cols-5 gap-16 items-center">

            {/* Left 2/5 */}
            <div className="lg:col-span-2">
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-5 a-rise">
                v0.1.3 · available now
              </p>
              <h1 className="font-display text-5xl md:text-6xl leading-[1.08] tracking-tight a-rise d1">
                Code in<br />
                <em className="not-italic text-primary">Gujarati.</em>
              </h1>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed a-rise d2">
                kemlang-py is a programming language with Gujarati keywords.
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
            </div>

            {/* Right 3/5 */}
            <div className="lg:col-span-3 a-appear d2">
              <div className="a-bob">
                <CodeSample code={heroCode} highlight />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick install strip ───────────────────────────────── */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-5 md:px-8 py-4">
          <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
            <span className="text-xs text-muted-foreground shrink-0">Install:</span>
            {[
              "npm install -g kemlang-py",
              "pip install kemlang-py",
            ].map((cmd) => (
              <div
                key={cmd}
                className="flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded border shrink-0"
                style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}
              >
                <span className="text-primary">$</span>
                <span style={{ color: "hsl(var(--code-fg))" }}>{cmd}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Snippets ─────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b">
        <div className="container mx-auto px-5 md:px-8">
          <div className="max-w-xl mb-14">
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
              Familiar words.<br />Real code.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every Gujarati keyword maps directly to a programming concept — no translation required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {snippets.map((s) => (
              <div key={s.label}>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  {s.label}
                </p>
                <CodeSample code={s.code} highlight />
              </div>
            ))}
          </div>

          {/* Keyword table */}
          <div className="max-w-3xl rounded-xl border overflow-hidden">
            <div
              className="px-5 py-3 border-b"
              style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}
            >
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                keyword reference
              </p>
            </div>
            <div style={{ background: "hsl(var(--code-bg))" }}>
              {keywords.map(([kw, desc], i) => (
                <div
                  key={kw}
                  className="flex items-center justify-between px-5 py-2.5 text-sm"
                  style={{
                    borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined,
                  }}
                >
                  <code
                    className="font-mono text-xs"
                    style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0 }}
                  >
                    {kw}
                  </code>
                  <span className="text-xs" style={{ color: "hsl(var(--cmt))" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Install ───────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b bg-muted/20">
        <div className="container mx-auto px-5 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
            <div>
              <h2 className="font-display text-4xl md:text-5xl leading-tight mb-5">
                Running in<br />under a minute.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Pick your preferred package manager. Both install the same{" "}
                <code>kem</code> CLI.
              </p>
              <div className="space-y-2 font-mono text-sm">
                {[
                  ["run",    "kem run hello.jsk"],
                  ["repl",   "kem repl"],
                  ["format", "kem fmt hello.jsk"],
                  ["tokens", "kem tokens hello.jsk"],
                  ["ast",    "kem ast hello.jsk"],
                ].map(([label, cmd]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-primary w-14 shrink-0 text-xs">{label}</span>
                    <span
                      className="text-xs"
                      style={{ color: "hsl(var(--code-fg))" }}
                    >
                      {cmd}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <InstallTabs />
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="py-24 md:py-32 border-b">
        <div className="container mx-auto px-5 md:px-8">
          <h2 className="font-display text-4xl md:text-5xl leading-tight mb-14 max-w-xs">
            Everything included.
          </h2>
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

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-5 md:px-8 text-center">
          <h2 className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6">
            kem cho,<br />
            <em className="not-italic text-primary">developer.</em>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
            Start writing Gujarati code today. It takes less than 60 seconds to install.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 h-11 px-7 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Read the docs <ArrowRight className="h-4 w-4" />
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
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
