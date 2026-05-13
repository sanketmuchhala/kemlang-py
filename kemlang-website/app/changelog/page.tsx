import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Changelog",
  description: "kemlang-py release history - new features, bug fixes, and improvements in every version.",
};

const changelog = [
  {
    version: "0.2.0",
    date: "2024-09-15",
    title: "Enhanced Language Features",
    items: [
      {
        type: "added",
        description: "Added support for loops and conditional statements"
      },
      {
        type: "added",
        description: "New built-in functions for string manipulation"
      },
      {
        type: "improved",
        description: "Better error messages with line number information"
      },
      {
        type: "fixed",
        description: "Fixed variable scoping issues in nested blocks"
      }
    ]
  },
  {
    version: "0.1.0",
    date: "2024-08-20",
    title: "Initial Release",
    items: [
      {
        type: "added",
        description: "Basic KemLang interpreter with core functionality"
      },
      {
        type: "added",
        description: "Variable declaration and assignment"
      },
      {
        type: "added",
        description: "String concatenation and basic operations"
      },
      {
        type: "added",
        description: "Print statements with 'bhai bol'"
      },
      {
        type: "added",
        description: "Program structure with 'kem bhai' and 'aavjo bhai'"
      }
    ]
  }
];

const typeColors = {
  added: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950",
  improved: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  fixed: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950",
  deprecated: "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950",
  removed: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
};

const typeLabels = {
  added: "Added",
  improved: "Improved",
  fixed: "Fixed",
  deprecated: "Deprecated",
  removed: "Removed"
};

export default function ChangelogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
              Changelog
            </h1>
            <p className="text-xl text-muted-foreground">
              Stay up to date with the latest KemLang releases and improvements.
            </p>
          </div>

          <div className="space-y-12">
            {changelog.map((release) => (
              <div key={release.version} className="relative">
                {/* Version header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">v{release.version}</h2>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      {new Date(release.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                  {release.title}
                </h3>

                {/* Changes list */}
                <div className="space-y-3">
                  {release.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeColors[item.type as keyof typeof typeColors]}`}>
                        {typeLabels[item.type as keyof typeof typeLabels]}
                      </span>
                      <p className="text-sm leading-relaxed pt-0.5">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                {changelog.indexOf(release) < changelog.length - 1 && (
                  <div className="mt-12 border-b border-border" />
                )}
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-16 p-6 rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2">Release Notes</h3>
            <p className="text-sm text-muted-foreground">
              KemLang follows semantic versioning. For detailed technical changes and breaking changes,
              visit our{" "}
              <a
                href="https://github.com/sanketmuchhala/Gujju.py/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                GitHub releases page
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}