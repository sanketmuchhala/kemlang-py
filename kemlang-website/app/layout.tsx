import type { Metadata } from "next";
import { Syne, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gujju-py.vercel.app"),
  title: {
    default: "kemlang-py — A Gujarati-flavored Programming Language",
    template: "%s | kemlang-py",
  },
  description:
    "kemlang-py is a fun, educational programming language with Gujarati keywords. Install with npm or pip and start coding in minutes.",
  keywords: ["kemlang-py", "kemlang", "Gujarati", "programming language", "interpreter", "esolang"],
  authors: [{ name: "Sanket Muchhala" }],
  creator: "Sanket Muchhala",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gujju-py.vercel.app",
    title: "kemlang-py — A Gujarati-flavored Programming Language",
    description:
      "kemlang-py is a fun, educational programming language with Gujarati keywords. Install with npm or pip and start coding in minutes.",
    siteName: "kemlang-py",
  },
  twitter: {
    card: "summary_large_image",
    title: "kemlang-py — A Gujarati-flavored Programming Language",
    description:
      "kemlang-py is a fun, educational programming language with Gujarati keywords.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="font-body antialiased min-h-screen">
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
