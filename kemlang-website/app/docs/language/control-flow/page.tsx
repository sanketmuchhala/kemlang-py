import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodeSample } from "@/components/code-sample";

export const metadata: Metadata = {
  title: "Control Flow",
  description: "Conditionals and loops in kemlang-py — jo, nahi to, farvu, tame jao, aagal vado.",
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
const Output = ({ text }: { text: string }) => (
  <div className="mt-3 rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
    <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
      <span className="font-mono text-xs text-muted-foreground">output</span>
    </div>
    <pre className="px-4 py-3 font-mono text-sm" style={{ color: "hsl(var(--kw))" }}>{text}</pre>
  </div>
);

export default function ControlFlowPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Language guide</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">Control Flow</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Conditionals and loops — the building blocks of any real program.
        </p>
      </div>

      {/* if */}
      <section>
        <H2>If statement — <code className="font-mono text-xl font-normal text-primary">jo</code></H2>
        <P><code>jo</code> means &ldquo;if&rdquo;. The condition goes between <code>jo</code> and the opening brace. No parentheses required.</P>
        <CodeSample highlight code={`kem bhai\n  aa temp che 38\n\n  jo temp > 37 {\n    bhai bol "Fever!"\n  }\naavjo bhai`} />
        <Output text="Fever!" />
      </section>

      {/* if-else */}
      <section>
        <H2>If-Else — <code className="font-mono text-xl font-normal text-primary">jo / nahi to</code></H2>
        <P><code>nahi to</code> means &ldquo;otherwise&rdquo;. It must immediately follow the closing brace of the <code>jo</code> block.</P>
        <CodeSample highlight code={`kem bhai\n  aa age che 16\n\n  jo age >= 18 {\n    bhai bol "Can vote"\n  } nahi to {\n    bhai bol "Cannot vote yet"\n  }\naavjo bhai`} />
        <Output text="Cannot vote yet" />
      </section>

      {/* else if */}
      <section>
        <H2>Chained conditions</H2>
        <P>kemlang-py has no <code>else if</code> keyword. Nest another <code>jo</code> inside a <code>nahi to</code> block instead.</P>
        <CodeSample highlight code={`kem bhai\n  aa score che 74\n\n  jo score >= 90 {\n    bhai bol "A grade"\n  } nahi to {\n    jo score >= 75 {\n      bhai bol "B grade"\n    } nahi to {\n      jo score >= 60 {\n        bhai bol "C grade"\n      } nahi to {\n        bhai bol "Fail"\n      }\n    }\n  }\naavjo bhai`} />
        <Output text="C grade" />
      </section>

      {/* while */}
      <section>
        <H2>While loop — <code className="font-mono text-xl font-normal text-primary">farvu / jya sudhi</code></H2>
        <P>
          <code>farvu</code> means &ldquo;to do&rdquo;. <code>jya sudhi</code> means &ldquo;as long as&rdquo;.
          The body executes first, then the condition is checked — similar to a do-while in other languages.
        </P>
        <CodeSample highlight code={`kem bhai\n  aa i che 1\n  farvu {\n    bhai bol i\n    i che i + 1\n  } jya sudhi i <= 5\naavjo bhai`} />
        <Output text={"1\n2\n3\n4\n5"} />

        <H3>Infinite loop with break</H3>
        <P>Use <code>bhai chhe</code> (true) as the condition for an infinite loop, then break out with <code>tame jao</code>.</P>
        <CodeSample highlight code={`kem bhai\n  aa n che 1\n  farvu {\n    bhai bol n\n    n che n + 1\n    jo n > 3 { tame jao }\n  } jya sudhi bhai chhe\naavjo bhai`} />
        <Output text={"1\n2\n3"} />
      </section>

      {/* break */}
      <section>
        <H2>Break — <code className="font-mono text-xl font-normal text-primary">tame jao</code></H2>
        <P><code>tame jao</code> (you go) exits the innermost loop immediately. Execution resumes after the loop.</P>
        <CodeSample highlight code={`kem bhai\n  aa i che 0\n  farvu {\n    i che i + 1\n    jo i == 5 {\n      bhai bol "Found 5!"\n      tame jao\n    }\n  } jya sudhi i < 100\n  bhai bol "Loop ended at: " + i\naavjo bhai`} />
        <Output text={"Found 5!\nLoop ended at: 5"} />
      </section>

      {/* continue */}
      <section>
        <H2>Continue — <code className="font-mono text-xl font-normal text-primary">aagal vado</code></H2>
        <P><code>aagal vado</code> (move forward) skips the rest of the current iteration and jumps straight to the condition check.</P>
        <CodeSample highlight code={`kem bhai\n  // print only odd numbers 1-9\n  aa i che 0\n  farvu {\n    i che i + 1\n    jo i % 2 == 0 { aagal vado }\n    bhai bol i\n  } jya sudhi i < 10\naavjo bhai`} />
        <Output text={"1\n3\n5\n7\n9"} />
      </section>

      {/* truthiness */}
      <section>
        <H2>Truthy and falsy values</H2>
        <P>Conditions accept any value — not just booleans. The following values are falsy; everything else is truthy.</P>
        <div className="rounded-xl border overflow-hidden mb-4">
          <div className="grid grid-cols-2 border-b px-5 py-3" style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
            <span className="font-mono text-xs text-muted-foreground">falsy values</span>
            <span className="font-mono text-xs text-muted-foreground">truthy (everything else)</span>
          </div>
          <div className="grid grid-cols-2 px-5 py-3" style={{ background: "hsl(var(--code-bg))" }}>
            <div className="space-y-1 text-xs font-mono" style={{ color: "hsl(var(--str))" }}>
              <div>bhai nathi</div>
              <div>false</div>
              <div>0</div>
              <div>&quot;&quot; (empty string)</div>
              <div>none</div>
            </div>
            <div className="text-xs font-mono" style={{ color: "hsl(var(--kw))" }}>
              <div>any non-zero number</div>
              <div>any non-empty string</div>
              <div>bhai chhe / true</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/language/variables" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Variables
        </Link>
        <Link href="/docs/examples" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity">
          Examples <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
