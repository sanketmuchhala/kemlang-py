import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodeSample } from "@/components/code-sample";

export const metadata: Metadata = {
  title: "Syntax & Keywords",
  description: "Complete syntax and keyword reference for kemlang-py.",
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t">{children}</h2>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-semibold text-base mt-7 mb-3">{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

export default function SyntaxPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Language guide</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          Syntax & Keywords
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Every keyword, operator, and construct in kemlang-py — with examples.
        </p>
      </div>

      {/* Program structure */}
      <section>
        <H2>Program structure</H2>
        <P>Every kemlang-py program must be wrapped in <code>kem bhai</code> and <code>aavjo bhai</code>. Nothing runs outside these fences.</P>
        <CodeSample highlight code={`kem bhai\n  // your code here\naavjo bhai`} />
        <ul className="mt-4 space-y-2">
          {[
            ["kem bhai", "Opens the program — literally \"hello, brother\""],
            ["aavjo bhai", "Closes the program — literally \"goodbye, brother\""],
            ["//", "Single-line comment — ignored by the interpreter"],
          ].map(([kw, desc]) => (
            <li key={kw} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-primary shrink-0">›</span>
              <span><code>{kw}</code> — {desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Variables */}
      <section>
        <H2>Variables</H2>
        <H3>Declaration — <code className="font-mono text-sm font-normal text-primary">aa x che val</code></H3>
        <P>Declare a new variable with <code>aa</code> (this) and <code>che</code> (is). Every type is inferred automatically.</P>
        <CodeSample highlight code={`kem bhai\n  aa naam  che "Sanket"      // string\n  aa age   che 25            // integer\n  aa pi    che 3.14          // float\n  aa flag  che bhai chhe     // boolean\naavjo bhai`} />

        <H3>Reassignment — <code className="font-mono text-sm font-normal text-primary">x che val</code></H3>
        <P>Reassign an existing variable using <code>che</code> without <code>aa</code>.</P>
        <CodeSample highlight code={`kem bhai\n  aa count che 0\n  count che 1\n  count che count + 1\n  bhai bol count   // 2\naavjo bhai`} />
      </section>

      {/* Types */}
      <section>
        <H2>Data types</H2>
        <div className="rounded-xl border overflow-hidden">
          <div className="grid grid-cols-[100px_1fr_1fr] border-b px-5 py-3" style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
            <span className="font-mono text-xs text-muted-foreground">type</span>
            <span className="font-mono text-xs text-muted-foreground">examples</span>
            <span className="font-mono text-xs text-muted-foreground">notes</span>
          </div>
          {[
            ["string",  '"hello" · \'world\'',  "single or double quotes"],
            ["integer", "42 · -7 · 0",          "whole numbers"],
            ["float",   "3.14 · -0.5",          "decimal numbers"],
            ["boolean", "bhai chhe · bhai nathi", "also: true / false"],
            ["none",    "—",                    "result of failed input"],
          ].map(([type, ex, note], i) => (
            <div key={type} className="grid grid-cols-[100px_1fr_1fr] px-5 py-3 text-xs" style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
              <code className="font-mono" style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0, fontSize: "0.75rem" }}>{type}</code>
              <span style={{ color: "hsl(var(--code-fg))" }}>{ex}</span>
              <span style={{ color: "hsl(var(--cmt))" }}>{note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Output */}
      <section>
        <H2>Output — <code className="font-mono text-2xl font-normal text-primary">bhai bol</code></H2>
        <P><code>bhai bol</code> (brother, say) prints any value to stdout. It automatically converts numbers and booleans to strings.</P>
        <CodeSample highlight code={`kem bhai\n  bhai bol "Hello, World!"\n  bhai bol 42\n  bhai bol 3.14\n  bhai bol bhai chhe\naavjo bhai`} />
        <div className="mt-3 rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
          <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <span className="font-mono text-xs text-muted-foreground">output</span>
          </div>
          <pre className="px-4 py-3 font-mono text-sm" style={{ color: "hsl(var(--kw))" }}>
            {`Hello, World!\n42\n3.14\ntrue`}
          </pre>
        </div>
      </section>

      {/* Input */}
      <section>
        <H2>Input — <code className="font-mono text-2xl font-normal text-primary">bapu tame bolo</code></H2>
        <P><code>bapu tame bolo</code> (father, you say) reads a line from stdin and returns it as a string.</P>
        <CodeSample highlight code={`kem bhai\n  bhai bol "What is your name?"\n  aa naam che bapu tame bolo\n  bhai bol "kem cho, " + naam + "!"\naavjo bhai`} />
      </section>

      {/* String ops */}
      <section>
        <H2>String operations</H2>
        <P>Use <code>+</code> to concatenate strings. If either side is a string, the other side is automatically cast.</P>
        <CodeSample highlight code={`kem bhai\n  aa first che "Sanket"\n  aa last  che "Patel"\n  aa full  che first + " " + last\n  bhai bol full               // Sanket Patel\n  bhai bol "Age: " + 25       // Age: 25\naavjo bhai`} />
      </section>

      {/* Arithmetic */}
      <section>
        <H2>Arithmetic</H2>
        <CodeSample highlight code={`kem bhai\n  aa a che 10\n  aa b che 3\n\n  bhai bol a + b    // 13\n  bhai bol a - b    // 7\n  bhai bol a * b    // 30\n  bhai bol a / b    // 3.333...\n  bhai bol a % b    // 1  (modulo)\naavjo bhai`} />
      </section>

      {/* Comparisons */}
      <section>
        <H2>Comparison operators</H2>
        <P>All comparisons return <code>bhai chhe</code> (true) or <code>bhai nathi</code> (false).</P>
        <div className="rounded-xl border overflow-hidden mb-4">
          <div className="grid grid-cols-[80px_1fr] border-b px-5 py-3" style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
            <span className="font-mono text-xs text-muted-foreground">operator</span>
            <span className="font-mono text-xs text-muted-foreground">meaning</span>
          </div>
          {[
            ["==", "equal to"],
            ["!=", "not equal to"],
            ["<",  "less than"],
            [">",  "greater than"],
            ["<=", "less than or equal"],
            [">=", "greater than or equal"],
          ].map(([op, desc], i) => (
            <div key={op} className="grid grid-cols-[80px_1fr] px-5 py-2.5 text-xs" style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
              <code className="font-mono" style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0, fontSize: "0.75rem" }}>{op}</code>
              <span style={{ color: "hsl(var(--code-fg))" }}>{desc}</span>
            </div>
          ))}
        </div>
        <CodeSample highlight code={`kem bhai\n  bhai bol 10 == 10   // true\n  bhai bol 10 != 5    // true\n  bhai bol 3 > 7      // false\naavjo bhai`} />
      </section>

      {/* If */}
      <section>
        <H2>Conditionals — <code className="font-mono text-2xl font-normal text-primary">jo / nahi to</code></H2>
        <P><code>jo</code> means &ldquo;if&rdquo;, <code>nahi to</code> means &ldquo;otherwise&rdquo;. Braces are required. There is no <code>else if</code> — nest another <code>jo</code> inside.</P>
        <CodeSample highlight code={`kem bhai\n  aa score che 82\n\n  jo score >= 90 {\n    bhai bol "A grade"\n  } nahi to {\n    jo score >= 75 {\n      bhai bol "B grade"\n    } nahi to {\n      bhai bol "C grade"\n    }\n  }\naavjo bhai`} />
      </section>

      {/* While */}
      <section>
        <H2>Loops — <code className="font-mono text-2xl font-normal text-primary">farvu / jya sudhi</code></H2>
        <P><code>farvu</code> means &ldquo;to do&rdquo;, <code>jya sudhi</code> means &ldquo;as long as&rdquo;. The body runs first, then the condition is checked.</P>
        <CodeSample highlight code={`kem bhai\n  aa i che 1\n  farvu {\n    bhai bol i\n    i che i + 1\n  } jya sudhi i <= 5\naavjo bhai`} />
        <div className="mt-3 rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
          <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <span className="font-mono text-xs text-muted-foreground">output</span>
          </div>
          <pre className="px-4 py-3 font-mono text-sm" style={{ color: "hsl(var(--kw))" }}>1{"\n"}2{"\n"}3{"\n"}4{"\n"}5</pre>
        </div>
      </section>

      {/* Break / Continue */}
      <section>
        <H2>Loop control</H2>
        <H3><code>tame jao</code> — break</H3>
        <P>Exit the nearest loop immediately.</P>
        <CodeSample highlight code={`kem bhai\n  aa i che 1\n  farvu {\n    jo i == 4 { tame jao }\n    bhai bol i\n    i che i + 1\n  } jya sudhi bhai chhe\naavjo bhai`} />

        <H3><code>aagal vado</code> — continue</H3>
        <P>Skip the rest of the current iteration and move to the next.</P>
        <CodeSample highlight code={`kem bhai\n  aa i che 0\n  farvu {\n    i che i + 1\n    jo i % 2 == 0 { aagal vado }  // skip evens\n    bhai bol i\n  } jya sudhi i < 10\naavjo bhai`} />
      </section>

      {/* Full keyword table */}
      <section>
        <H2>Full keyword reference</H2>
        <div className="rounded-xl border overflow-hidden">
          <div className="grid grid-cols-[160px_1fr_1fr] border-b px-5 py-3" style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
            <span className="font-mono text-xs text-muted-foreground">keyword</span>
            <span className="font-mono text-xs text-muted-foreground">meaning</span>
            <span className="font-mono text-xs text-muted-foreground">Gujarati</span>
          </div>
          {[
            ["kem bhai",                 "program start",   "hello, brother"],
            ["aavjo bhai",               "program end",     "goodbye, brother"],
            ["aa x che val",             "declare",         "this x is val"],
            ["x che val",                "reassign",        "x is val"],
            ["bhai bol expr",            "print",           "brother, say"],
            ["bapu tame bolo",           "read input",      "father, you say"],
            ["jo cond { }",              "if",              "if"],
            ["nahi to { }",              "else",            "otherwise"],
            ["farvu { } jya sudhi cond", "while",           "do while"],
            ["tame jao",                 "break",           "you go"],
            ["aagal vado",               "continue",        "move forward"],
            ["bhai chhe",                "true",            "brother is"],
            ["bhai nathi",               "false",           "brother is not"],
          ].map(([kw, en, gj], i) => (
            <div key={kw} className="grid grid-cols-[160px_1fr_1fr] px-5 py-3 text-xs" style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
              <code className="font-mono" style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0, fontSize: "0.75rem" }}>{kw}</code>
              <span style={{ color: "hsl(var(--code-fg))" }}>{en}</span>
              <span style={{ color: "hsl(var(--cmt))" }}>{gj}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/installation" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Installation
        </Link>
        <Link href="/docs/language/variables" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity">
          Variables <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
