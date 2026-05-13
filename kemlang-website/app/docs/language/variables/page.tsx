import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodeSample } from "@/components/code-sample";

export const metadata: Metadata = {
  title: "Variables",
  description: "How variables work in kemlang-py - declaration, reassignment, scope, and types.",
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

export default function VariablesPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Language guide</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">Variables</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          How to declare, reassign, and use variables in kemlang-py.
        </p>
      </div>

      <section>
        <H2>Declaring a variable</H2>
        <P>
          Use <code>aa x che val</code> to declare a new variable.{" "}
          <em>aa</em> means &ldquo;this&rdquo;, <em>che</em> means &ldquo;is&rdquo;.
          Types are inferred - you never write them explicitly.
        </P>
        <CodeSample highlight code={`kem bhai\n  aa name    che "Sanket"     // string\n  aa age     che 25           // integer\n  aa balance che 9.99         // float\n  aa active  che bhai chhe   // boolean\n\n  bhai bol name\n  bhai bol age\naavjo bhai`} />
      </section>

      <section>
        <H2>Reassigning a variable</H2>
        <P>
          Drop the <code>aa</code> to reassign. You cannot reassign a variable that hasn&apos;t been declared yet -
          kemlang-py will throw an error.
        </P>
        <CodeSample highlight code={`kem bhai\n  aa count che 0\n  bhai bol count    // 0\n\n  count che 10\n  bhai bol count    // 10\n\n  count che count + 5\n  bhai bol count    // 15\naavjo bhai`} />
      </section>

      <section>
        <H2>All data types</H2>

        <h3 className="font-semibold text-base mt-6 mb-3">Strings</h3>
        <P>Text values. Single or double quotes both work. Concatenate with <code>+</code>.</P>
        <CodeSample highlight code={`aa msg1 che "double quotes"\naa msg2 che 'single quotes'\naa full che msg1 + " and " + msg2\nbhai bol full`} />

        <h3 className="font-semibold text-base mt-6 mb-3">Integers</h3>
        <P>Whole numbers, positive or negative.</P>
        <CodeSample highlight code={`aa x che 42\naa y che -7\naa z che 0`} />

        <h3 className="font-semibold text-base mt-6 mb-3">Floats</h3>
        <P>Decimal numbers. Division always returns a float when the result is not whole.</P>
        <CodeSample highlight code={`aa pi    che 3.14159\naa rate  che -0.5\naa ratio che 10 / 3   // 3.333...`} />

        <h3 className="font-semibold text-base mt-6 mb-3">Booleans</h3>
        <P><code>bhai chhe</code> and <code>bhai nathi</code> are the boolean literals. <code>true</code> and <code>false</code> are also accepted as aliases.</P>
        <CodeSample highlight code={`aa isOn  che bhai chhe    // true\naa isOff che bhai nathi   // false\naa same  che true         // also works`} />
      </section>

      <section>
        <H2>String + number concatenation</H2>
        <P>
          If either side of <code>+</code> is a string, the other side is automatically converted.
          You never need to cast manually.
        </P>
        <CodeSample highlight code={`kem bhai\n  aa score che 87\n  bhai bol "Score: " + score   // Score: 87\n  bhai bol score + " points"   // 87 points\naavjo bhai`} />
      </section>

      <section>
        <H2>Scope</H2>
        <P>
          Variables declared inside a block (<code>jo</code>, <code>farvu</code>) are scoped to that block.
          They are not accessible outside it.
        </P>
        <CodeSample highlight code={`kem bhai\n  aa x che 10\n\n  jo x > 5 {\n    aa msg che "x is big"   // block-scoped\n    bhai bol msg            // works\n  }\n\n  // bhai bol msg  <-- would error here\naavjo bhai`} />
      </section>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/language/syntax" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Syntax & Keywords
        </Link>
        <Link href="/docs/language/control-flow" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity">
          Control Flow <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
