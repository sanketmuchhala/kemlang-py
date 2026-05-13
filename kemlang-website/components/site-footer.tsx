import Link from "next/link";
import { Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-5 md:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-sm font-semibold text-primary">$</span>
              <span className="font-mono text-sm font-semibold">
                kemlang<span className="text-primary">-py</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A Gujarati-flavored programming language. Write real programs with words you already know.
            </p>
            <Link
              href="https://github.com/sanketmuchhala/kemlang-py"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Product
            </p>
            <ul className="space-y-2">
              {[
                { label: "Documentation", href: "/docs" },
                { label: "Playground", href: "/playground" },
                { label: "Changelog", href: "/changelog" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Packages
            </p>
            <ul className="space-y-2">
              {[
                { label: "npm", href: "https://www.npmjs.com/package/kemlang-py" },
                { label: "PyPI", href: "https://pypi.org/project/kemlang-py/" },
                { label: "GitHub", href: "https://github.com/sanketmuchhala/kemlang-py" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} kemlang-py · MIT License
          </p>
          <p className="text-xs text-muted-foreground">
            Made for the Gujarati developer community
          </p>
        </div>
      </div>
    </footer>
  );
}
