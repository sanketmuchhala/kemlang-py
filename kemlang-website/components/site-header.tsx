"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Github } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/docs", label: "Docs" },
  { href: "/playground", label: "Playground" },
  { href: "/changelog", label: "Changelog" },
];

export function SiteHeader() {
  const { setTheme, theme } = useTheme();
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-5 md:px-8">

        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-mono text-sm font-semibold text-primary">$</span>
          <span className="font-mono text-sm font-semibold tracking-tight">
            kemlang<span className="text-primary">-py</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3.5 py-1.5 text-sm rounded-md transition-colors",
                path === l.href
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="https://github.com/sanketmuchhala/kemlang-py"
            target="_blank"
            rel="noreferrer"
            className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Github className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors relative"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          <Link
            href="/docs"
            className="ml-1 hidden sm:flex items-center h-8 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
