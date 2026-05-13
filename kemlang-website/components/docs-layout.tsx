"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

interface NavItem { title: string; href: string; }
interface NavSection { title: string; href: string; items?: NavItem[]; }

interface DocsLayoutProps {
  children: React.ReactNode;
  navigation: NavSection[];
}

export function DocsLayout({ children, navigation }: DocsLayoutProps) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  const isActive = (href: string) =>
    href === "/docs" ? path === "/docs" : path.startsWith(href);

  return (
    <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      {/* Mobile toggle */}
      <div className="md:hidden flex items-center justify-between px-5 py-3 border-b">
        <span className="font-mono text-sm font-medium">docs</span>
        <button onClick={() => setOpen(!open)} className="p-1.5 rounded-md hover:bg-muted/50 transition-colors">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block",
        open && "block"
      )}>
        {open && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
        )}
        <div className="relative h-full overflow-y-auto py-6 pr-6 lg:py-8">
          <nav className="w-full space-y-6">
            {navigation.map((section) => (
              <div key={section.href}>
                <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                  {section.title}
                </h4>
                {section.items && (
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="py-6 lg:py-8 px-5 md:px-0 min-w-0">
        {children}
      </main>
    </div>
  );
}
