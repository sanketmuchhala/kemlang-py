import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://gujju-py.vercel.app"),
  title: {
    default: "kemlang-py — Gujarati Programming Language",
    template: "%s | kemlang-py",
  },
  description:
    "kemlang-py lets you write programs using Gujarati keywords. Install in seconds with npm or pip.",
  keywords: ["kemlang-py", "Gujarati", "programming language", "interpreter", "esolang"],
  authors: [{ name: "Sanket Muchhala" }],
  creator: "Sanket Muchhala",
  openGraph: {
    type: "website",
    url: "https://gujju-py.vercel.app",
    title: "kemlang-py — Gujarati Programming Language",
    description: "Write programs using Gujarati keywords. Install in seconds.",
    siteName: "kemlang-py",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
