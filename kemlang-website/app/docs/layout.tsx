import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DocsLayout } from "@/components/docs-layout";

const navigation = [
  {
    title: "Getting Started",
    href: "/docs",
    items: [
      { title: "Introduction",  href: "/docs" },
      { title: "Installation",  href: "/docs/installation" },
    ],
  },
  {
    title: "Language Guide",
    href: "/docs/language",
    items: [
      { title: "Syntax & Keywords", href: "/docs/language/syntax" },
    ],
  },
  {
    title: "More",
    href: "/playground",
    items: [
      { title: "Playground",  href: "/playground" },
      { title: "Changelog",   href: "/changelog" },
      { title: "GitHub",      href: "https://github.com/sanketmuchhala/kemlang-py" },
    ],
  },
];

export default function DocsLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="container mx-auto flex-1">
        <DocsLayout navigation={navigation}>
          {children}
        </DocsLayout>
      </div>
      <SiteFooter />
    </div>
  );
}