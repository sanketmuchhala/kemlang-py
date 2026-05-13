import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { CodeSample } from "@/components/code-sample";

export const metadata: Metadata = {
  title: "Installation",
  description: "Install kemlang-py via npm, pip, or from source.",
};

const S = {
  h1: "font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4",
  h2: "font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t",
  h3: "font-semibold text-base mt-6 mb-3",
  p:  "text-muted-foreground leading-relaxed mb-4",
  li: "flex gap-2 text-sm text-muted-foreground leading-relaxed",
};

export default function InstallationPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Installation</p>
        <h1 className={S.h1}>Install kemlang-py</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Get kemlang-py running on your machine in under a minute.
          Pick the method that suits your workflow.
        </p>
      </div>

      {/* Requirements */}
      <section>
        <h2 className={S.h2}>System requirements</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            ["Python", "3.10 or newer"],
            ["Node.js", "14+ (npm method only)"],
            ["OS", "macOS · Linux · Windows"],
            ["Disk", "~15 MB installed"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center gap-3 rounded-lg border px-4 py-3 bg-muted/20">
              <CheckCircle className="h-4 w-4 text-primary shrink-0" />
              <div>
                <span className="text-sm font-medium">{k}</span>
                <span className="text-sm text-muted-foreground ml-2">{v}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* npm */}
      <section>
        <h2 className={S.h2}>Install via npm <span className="text-primary text-sm font-mono font-normal ml-2">recommended</span></h2>
        <p className={S.p}>The fastest way - works on any machine with Node.js installed. Automatically installs Python dependencies.</p>
        <CodeSample code="npm install -g kemlang-py" highlight={false} language="bash" />
        <p className="text-sm text-muted-foreground mt-3 mb-2">Verify it worked:</p>
        <CodeSample code="kem version" highlight={false} language="bash" />
        <div className="mt-3 rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
          <div className="px-4 py-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <span className="font-mono text-xs text-muted-foreground">output</span>
          </div>
          <pre className="px-4 py-3 font-mono text-sm" style={{ color: "hsl(var(--kw))" }}>KemLang 0.1.3</pre>
        </div>
      </section>

      {/* pip */}
      <section>
        <h2 className={S.h2}>Install via pip</h2>
        <p className={S.p}>If you already have Python 3.10+ and prefer pip:</p>
        <CodeSample code="pip install kemlang-py" highlight={false} language="bash" />
        <p className="text-sm text-muted-foreground mt-3 mb-2">Verify:</p>
        <CodeSample code="kem version" highlight={false} language="bash" />
      </section>

      {/* From source */}
      <section>
        <h2 className={S.h2}>Install from source</h2>
        <p className={S.p}>For contributors or if you want the latest unreleased changes:</p>
        <CodeSample
          code={`git clone https://github.com/sanketmuchhala/kemlang-py\ncd kemlang-py\npip install -e .`}
          highlight={false}
          language="bash"
        />
        <p className="text-sm text-muted-foreground mt-3">
          The <code>-e</code> flag installs in editable mode - changes to the source are reflected immediately without reinstalling.
        </p>
      </section>

      {/* Troubleshooting */}
      <section>
        <h2 className={S.h2}>Troubleshooting</h2>

        <h3 className={S.h3}>&ldquo;kem: command not found&rdquo;</h3>
        <ul className="space-y-2 mb-6">
          {[
            ["npm", "Run npm bin -g to find the global bin path and add it to your PATH."],
            ["pip",  "Run python -m site --user-base to find the user base, then add /bin to PATH."],
            ["Windows", "Restart your terminal - PATH changes take effect on new sessions."],
          ].map(([k, v]) => (
            <li key={k} className={S.li}>
              <span className="text-primary shrink-0">›</span>
              <span><strong>{k}</strong> - {v}</span>
            </li>
          ))}
        </ul>

        <h3 className={S.h3}>Permission errors on macOS / Linux</h3>
        <CodeSample code={`# npm\nsudo npm install -g kemlang-py\n\n# pip\npip install --user kemlang-py`} highlight={false} language="bash" />

        <h3 className="font-semibold text-base mt-6 mb-3">Python version too old</h3>
        <p className={S.p}>kemlang-py requires Python 3.10+. Check your version:</p>
        <CodeSample code="python3 --version" highlight={false} language="bash" />
        <p className="text-sm text-muted-foreground mt-2">
          If you see Python 3.9 or earlier, upgrade via{" "}
          <code>brew install python@3.11</code> (macOS) or{" "}
          <code>sudo apt install python3.11</code> (Ubuntu).
        </p>
      </section>

      {/* Updating */}
      <section>
        <h2 className={S.h2}>Updating</h2>
        <p className={S.p}>Keep kemlang-py up to date:</p>
        <CodeSample
          code={`# npm\nnpm update -g kemlang-py\n\n# pip\npip install --upgrade kemlang-py`}
          highlight={false}
          language="bash"
        />
      </section>

      {/* Next */}
      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Next up</span>
        <Link href="/docs/language/syntax" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity">
          Syntax & Keywords <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
