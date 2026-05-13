import { Metadata } from "next";
import Link from "next/link";
import { Github, GitPullRequest, Bug, Star, GitBranch, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "GitHub",
  description: "kemlang-py on GitHub — source code, issues, contributing, and releases.",
};

export default function GitHubPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Resources</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          GitHub
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          kemlang-py is fully open source under the MIT license. The entire project — interpreter,
          CLI, formatter, website — lives in one repository.
        </p>
      </div>

      {/* Repo card */}
      <div className="rounded-xl border p-6 mb-10 hover:border-primary/40 transition-colors">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">sanketmuchhala / kemlang-py</p>
              <p className="text-xs text-muted-foreground">github.com/sanketmuchhala/kemlang-py</p>
            </div>
          </div>
          <Link
            href="https://github.com/sanketmuchhala/kemlang-py"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            Open <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          A Gujarati-flavored programming language interpreter built in Python.
          MIT licensed, actively developed.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {[
          {
            icon: Bug,
            title: "Report a bug",
            desc: "Found something broken? Open an issue with steps to reproduce.",
            href: "https://github.com/sanketmuchhala/kemlang-py/issues/new",
            label: "Open issue",
          },
          {
            icon: GitPullRequest,
            title: "Submit a PR",
            desc: "Want to fix a bug or add a feature? PRs are welcome.",
            href: "https://github.com/sanketmuchhala/kemlang-py/pulls",
            label: "View PRs",
          },
          {
            icon: Star,
            title: "Star the repo",
            desc: "If you find kemlang-py useful, a star helps others discover it.",
            href: "https://github.com/sanketmuchhala/kemlang-py",
            label: "Star on GitHub",
          },
          {
            icon: GitBranch,
            title: "Releases",
            desc: "See what changed in each version — release notes and changelogs.",
            href: "https://github.com/sanketmuchhala/kemlang-py/releases",
            label: "View releases",
          },
        ].map(({ icon: Icon, title, desc, href, label }) => (
          <Link
            key={title}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border p-5 hover:border-primary/40 hover:bg-muted/30 transition-colors"
          >
            <Icon className="h-5 w-5 text-primary mb-3" strokeWidth={1.5} />
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{desc}</p>
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
              {label} <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        ))}
      </div>

      {/* Repo structure */}
      <section className="mb-12">
        <h2 className="font-display text-2xl md:text-3xl mb-5">Repository structure</h2>
        <div className="rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
          {[
            ["kemlang/",           "Core interpreter package — lexer, parser, interpreter, CLI"],
            ["kemlang/lexer.py",   "Tokenizes source code into a token stream"],
            ["kemlang/parser.py",  "Recursive-descent parser → AST"],
            ["kemlang/interpreter.py", "Tree-walking interpreter"],
            ["kemlang/cli.py",     "Typer CLI — kem run / repl / fmt / tokens / ast"],
            ["tests/",             "pytest test suite — exec, CLI, lexer, parser, fuzz"],
            ["npm-package/",       "Node.js wrapper that pip-installs kemlang-py"],
            ["kemlang-website/",   "This Next.js docs site"],
            ["docs/",              "Project status, design notes, roadmap"],
          ].map(([path, desc], i) => (
            <div
              key={path}
              className="grid grid-cols-[200px_1fr] px-5 py-3 text-xs"
              style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}
            >
              <code
                className="font-mono"
                style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0, fontSize: "0.75rem" }}
              >
                {path}
              </code>
              <span style={{ color: "hsl(var(--cmt))" }}>{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contributing */}
      <section className="mb-12">
        <h2 className="font-display text-2xl md:text-3xl mb-4">Contributing</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          kemlang-py is a small, readable codebase — a good place to learn how programming language interpreters work.
          Here&apos;s how to get started:
        </p>
        <div className="space-y-4">
          {[
            ["1", "Fork and clone", "git clone https://github.com/sanketmuchhala/kemlang-py"],
            ["2", "Install dev deps", "pip install -e .[dev,test]"],
            ["3", "Run the tests",    "pytest -m \"not slow\""],
            ["4", "Make your change", "Edit kemlang/ files — lexer, parser, or interpreter"],
            ["5", "Check quality",    "ruff check kemlang tests && ruff format kemlang tests"],
            ["6", "Open a PR",        "Push your branch and open a pull request on GitHub"],
          ].map(([n, title, cmd]) => (
            <div key={n} className="flex gap-4 items-start rounded-xl border p-4 bg-muted/10">
              <span className="font-display text-2xl text-primary/30 leading-none shrink-0">{n}</span>
              <div>
                <p className="font-medium text-sm mb-1">{title}</p>
                <code
                  className="font-mono text-xs"
                  style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0 }}
                >
                  {cmd}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* License */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl mb-4">License</h2>
        <div className="rounded-xl border p-5 bg-muted/20">
          <p className="font-semibold text-sm mb-1">MIT License</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            kemlang-py is free and open source software. You can use it, modify it, and distribute it freely
            — even commercially — as long as you include the original license notice.
          </p>
          <Link
            href="https://github.com/sanketmuchhala/kemlang-py/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:opacity-80 transition-opacity"
          >
            Read the full license <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
