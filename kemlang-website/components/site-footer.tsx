import Link from "next/link";
import { Github } from "lucide-react";

const links = {
  product: [
    { label: "Documentation", href: "/docs" },
    { label: "Playground", href: "/playground" },
    { label: "Changelog", href: "/changelog" },
  ],
  install: [
    { label: "npm", href: "https://www.npmjs.com/package/kemlang-py", external: true },
    { label: "PyPI", href: "https://pypi.org/project/kemlang-py/", external: true },
    { label: "GitHub", href: "https://github.com/sanketmuchhala/kemlang-py", external: true },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-display font-bold text-xs">
                k
              </div>
              <span className="font-display font-bold text-lg">
                kemlang<span className="text-primary">-py</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A Gujarati-flavored programming language. Write code with the words you know.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Link
                href="https://github.com/sanketmuchhala/kemlang-py"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Product
            </h4>
            <ul className="space-y-2">
              {links.product.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Install */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Install
            </h4>
            <ul className="space-y-2">
              {links.install.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noreferrer" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} kemlang-py. MIT License.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with{" "}
            <span className="text-primary">♥</span>
            {" "}for the Gujarati developer community.
          </p>
        </div>
      </div>
    </footer>
  );
}
