import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Try kemlang-py in your browser. Write and run Gujarati programs instantly - no installation needed.",
};

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
