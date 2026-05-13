import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, Play, BookOpen, Github } from "lucide-react";
import { CodeSample } from "@/components/code-sample";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn how to write programs with kemlang-py — the Gujarati programming language.",
};

const quickStartCode = `kem bhai
  aa naam che "kemlang-py"
  bhai bol "Namaste, " + naam + "!"
aavjo bhai`;

const cards = [
  {
    icon: Download,
    title: "Installation",
    desc: "Install kemlang-py via npm or pip and run your first program.",
    href: "/docs/installation",
    cta: "Get set up",
  },
  {
    icon: BookOpen,
    title: "Syntax guide",
    desc: "Learn variables, conditionals, loops, and every keyword.",
    href: "/docs/language/syntax",
    cta: "Read the guide",
  },
  {
    icon: Play,
    title: "Playground",
    desc: "Write and run kemlang-py code right in your browser.",
    href: "/playground",
    cta: "Open playground",
  },
];

const features = [
  ["Gujarati keywords", "Write kem bhai, bhai bol, jo, farvu — real Gujarati words that map directly to programming concepts."],
  ["Familiar logic", "Same control flow as Python or JavaScript — if, else, while, break, continue — just spelled differently."],
  ["Zero setup", "One npm or pip install, then kem run. No project files, no config, no toolchain."],
  ["Full CLI", "kem run · kem repl · kem fmt · kem tokens · kem ast — everything you need in one binary."],
  ["Open source", "MIT licensed, written in Python. Small, readable codebase — easy to contribute to."],
  ["Educational", "Designed for Gujarati speakers learning programming, and programmers curious about language design."],
];

const steps = [
  {
    n: "1",
    title: "Install kemlang-py",
    body: "Pick npm or pip — both give you the same kem command globally.",
    code: "npm install -g kemlang-py",
    href: "/docs/installation",
  },
  {
    n: "2",
    title: "Create a .jsk file",
    body: "Every kemlang-py program opens with kem bhai and closes with aavjo bhai.",
    code: `kem bhai\n  bhai bol "kem cho, duniya!"\naavjo bhai`,
    href: "/docs/language/syntax",
  },
  {
    n: "3",
    title: "Run it",
    body: "Pass your file to kem run and see the output.",
    code: "kem run hello.jsk",
    href: null,
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">
          kemlang-py docs
        </p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          Documentation
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          kemlang-py is a programming language with Gujarati keywords. This guide covers
          everything from installation to the full language reference.
        </p>
      </div>

      {/* Quick nav cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {cards.map(({ icon: Icon, title, desc, href, cta }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border p-5 hover:border-primary/40 hover:bg-muted/30 transition-colors"
          >
            <Icon className="h-5 w-5 text-primary mb-3" strokeWidth={1.5} />
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{desc}</p>
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
              {cta} <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>

      {/* What is kemlang-py */}
      <section className="mb-12">
        <h2 className="font-display text-2xl md:text-3xl mb-4">What is kemlang-py?</h2>
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          <p>
            kemlang-py is a programming language that uses Gujarati keywords.
            Instead of writing <code>print(&quot;hello&quot;)</code>, you write{" "}
            <code>bhai bol &quot;hello&quot;</code>. Instead of <code>if</code>, you write{" "}
            <code>jo</code>. Every keyword has a clear Gujarati meaning.
          </p>
          <p>
            It&apos;s designed to make programming accessible to Gujarati speakers, and to show
            that a programming language can feel natural in any language.
          </p>
        </div>
      </section>

      {/* Quick example */}
      <section className="mb-12">
        <h2 className="font-display text-2xl md:text-3xl mb-4">Quick example</h2>
        <p className="text-muted-foreground mb-5">
          Here&apos;s a complete kemlang-py program that creates a variable and prints a greeting:
        </p>
        <CodeSample code={quickStartCode} highlight />
        <div className="mt-4 rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
          <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: "hsl(var(--border))" }}>
            <span className="font-mono text-xs text-muted-foreground">output</span>
          </div>
          <div className="px-4 py-3">
            <pre className="font-mono text-sm" style={{ color: "hsl(var(--kw))" }}>
              Namaste, kemlang-py!
            </pre>
          </div>
        </div>
        <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary shrink-0">›</span>
            <span><code>kem bhai</code> — opens the program (&quot;hello, brother&quot;)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary shrink-0">›</span>
            <span><code>aa naam che &quot;kemlang-py&quot;</code> — declares a variable (<em>aa = this, che = is</em>)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary shrink-0">›</span>
            <span><code>bhai bol ...</code> — prints to stdout (<em>bhai = brother, bol = say</em>)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary shrink-0">›</span>
            <span><code>aavjo bhai</code> — closes the program (&quot;goodbye, brother&quot;)</span>
          </li>
        </ul>
      </section>

      {/* Get started steps */}
      <section className="mb-12">
        <h2 className="font-display text-2xl md:text-3xl mb-6">Get started in 3 steps</h2>
        <div className="space-y-4">
          {steps.map(({ n, title, body, code, href }) => (
            <div key={n} className="rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
              <div className="flex items-start gap-4 p-5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                <span className="font-display text-3xl text-primary/30 leading-none shrink-0 mt-0.5">{n}</span>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: "hsl(var(--code-fg))" }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--cmt))" }}>{body}</p>
                </div>
              </div>
              <div className="px-5 py-3">
                <pre className="font-mono text-sm leading-relaxed" style={{ color: "hsl(var(--kw))" }}>{code}</pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="font-display text-2xl md:text-3xl mb-6">Key features</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map(([title, desc]) => (
            <div key={title} className="rounded-xl border p-5 bg-muted/20">
              <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="rounded-xl border p-6 bg-muted/20">
        <h2 className="font-semibold mb-4">Continue reading</h2>
        <ul className="space-y-2.5">
          {[
            { label: "Installation guide", href: "/docs/installation", desc: "npm, pip, and from source" },
            { label: "Language syntax", href: "/docs/language/syntax", desc: "Full keyword and grammar reference" },
            { label: "Web playground", href: "/playground", desc: "Run kemlang-py in your browser" },
            { label: "GitHub repository", href: "https://github.com/sanketmuchhala/kemlang-py", desc: "Source, issues, and contributions", external: true },
          ].map(({ label, href, desc, external }) => (
            <li key={href}>
              <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="flex items-center justify-between gap-4 group"
              >
                <div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{label}</span>
                  <span className="text-xs text-muted-foreground ml-2">{desc}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
