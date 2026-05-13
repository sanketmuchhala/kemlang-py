import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kemlang.cloud"),
  title: {
    default: "kemlang-py - Gujarati Programming Language",
    template: "%s | kemlang-py",
  },
  description:
    "kemlang-py lets you write programs using Gujarati keywords. Install in seconds with npm or pip.",
  keywords: [
    "kemlang-py",
    "Gujarati programming language",
    "interpreter",
    "esolang",
    "learn to code in Gujarati",
    "Gujarati language",
  ],
  authors: [{ name: "Sanket Muchhala" }],
  creator: "Sanket Muchhala",
  openGraph: {
    type: "website",
    url: "https://kemlang.cloud",
    title: "kemlang-py - Gujarati Programming Language",
    description: "Write programs using Gujarati keywords. Install in seconds with npm or pip.",
    siteName: "kemlang-py",
  },
  twitter: {
    card: "summary_large_image",
    title: "kemlang-py - Gujarati Programming Language",
    description: "Write programs using Gujarati keywords. Install with npm or pip.",
    creator: "@sanketmuchhala",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased min-h-screen">
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "kemlang-py",
          "url": "https://kemlang.cloud",
          "sameAs": ["https://github.com/sanketmuchhala/kemlang-py"],
          "founder": { "@type": "Person", "name": "Sanket Muchhala" },
        }} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
