import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodeSample } from "@/components/code-sample";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Planned features for kemlang-py — what's coming next and why.",
};

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t scroll-mt-20">{children}</h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

const Badge = ({ label, color }: { label: string; color: "amber" | "blue" | "green" }) => {
  const styles = {
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    blue:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-mono font-medium ${styles[color]}`}>
      {label}
    </span>
  );
};

const Feature = ({
  id,
  title,
  status,
  gujarati,
  why,
  example,
  children,
}: {
  id: string;
  title: string;
  status: "planned" | "in-progress" | "considering";
  gujarati?: string;
  why: string;
  example?: string;
  children?: React.ReactNode;
}) => {
  const statusBadge = status === "planned" ? <Badge label="planned" color="amber" />
    : status === "in-progress" ? <Badge label="in progress" color="blue" />
    : <Badge label="considering" color="green" />;

  return (
    <section id={id} className="mb-12 scroll-mt-20">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="font-display text-xl">{title}</h3>
        {statusBadge}
        {gujarati && (
          <span className="font-mono text-xs text-muted-foreground">{gujarati}</span>
        )}
      </div>
      <P>{why}</P>
      {children}
      {example && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">Proposed syntax</p>
          <CodeSample highlight code={example} />
        </div>
      )}
    </section>
  );
};

export default function RoadmapPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Roadmap</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          What&apos;s coming next
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          kemlang-py is a working interpreter — the core language is complete and stable.
          These are the features on the horizon, roughly in priority order.
        </p>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-4 mb-10 p-4 rounded-xl border bg-muted/10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge label="planned" color="amber" /> Actively being designed
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge label="in progress" color="blue" /> Being implemented on a branch
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge label="considering" color="green" /> Possible but not decided
        </div>
      </div>

      {/* Features */}
      <Feature
        id="functions"
        title="Functions"
        status="planned"
        gujarati="kaam / aapo"
        why="Functions are the biggest missing piece. Right now every kemlang-py program is a single flat sequence of statements — you can't extract reusable logic without copy-pasting code. Functions let you define named blocks of code, call them with arguments, and return values."
        example={`kem bhai
  kaam factorial n aapo {
    jo n <= 1 {
      dejo 1
    }
    dejo n * factorial n - 1
  }

  bhai bol factorial 5
aavjo bhai`}
      >
        <div className="rounded-xl border p-4 bg-muted/10 mb-4">
          <p className="font-semibold text-sm mb-3">Proposed keywords</p>
          <div className="space-y-2">
            {[
              ["kaam",  "kaam",  "define a function (from Gujarati for 'work')"],
              ["aapo",  "aapo",  "separates name+params from body (from 'give')"],
              ["dejo",  "dejo",  "return a value (from 'give back')"],
            ].map(([kw, gujarati, desc]) => (
              <div key={kw} className="flex gap-3 text-xs">
                <code className="font-mono shrink-0" style={{ color: "hsl(var(--kw))" }}>{gujarati}</code>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
        <P>
          The design goal is to keep the Gujarati flavour. Functions should feel like natural extensions
          of the existing keyword style, not bolted-on Python syntax. The exact keyword set is still
          being finalised — open an issue if you have opinions.
        </P>
      </Feature>

      <Feature
        id="assignment-operator"
        title="Assignment operator"
        status="planned"
        why="Today you reassign a variable by repeating the full declaration form: aa x che 10, then x che x + 1. The '=' shorthand would make mutation cleaner — especially inside loops where reassignment is common. The implementation is small; the design question is whether '=' should replace 'che' entirely or be an alternative."
        example={`kem bhai
  aa count che 0
  farvu {
    count = count + 1
    bhai bol count
  } jya sudhi count < 5
aavjo bhai`}
      >
        <P>
          The current reassignment syntax (<code>x che x + 1</code>) is unambiguous but verbose. An <code>=</code>
          operator would make loops and mutation-heavy programs much more concise. Open a PR or issue if you
          want to take this one — the interpreter change is a one-liner in <code>interpreter.py</code>.
        </P>
      </Feature>

      <Feature
        id="string-interpolation"
        title="String interpolation"
        status="planned"
        gujarati="${...}"
        why="Currently you build strings by concatenating with +, which gets unreadable fast. String interpolation lets you embed expressions directly inside string literals using a ${...} syntax, similar to JavaScript template literals."
        example={`kem bhai
  aa name che "Sanket"
  aa score che 95
  bhai bol "kem cho, \${name}! Your score is \${score}."
aavjo bhai`}
      >
        <P>
          Concatenation works but produces clunky code like <code>&quot;kem cho, &quot; + name + &quot;!&quot;</code>.
          Interpolation keeps the string readable as prose. The lexer would need to handle <code>${"{...}"}</code>
          spans as embedded expressions and emit them as special tokens.
        </P>
      </Feature>

      <Feature
        id="arrays"
        title="Arrays / lists"
        status="planned"
        gujarati="yaadi"
        why="kemlang-py has no collection type. Without arrays you can't store a list of values, compute averages, sort things, or model most real-world problems beyond simple scripts. Arrays are the first data structure that would make kemlang-py genuinely useful for more than toy programs."
        example={`kem bhai
  aa marks che yaadi [85, 92, 78, 90, 88]
  aa i che 0
  aa total che 0
  farvu {
    total che total + marks[i]
    i che i + 1
  } jya sudhi i < marks.lakhu
  bhai bol "Average: " + total / marks.lakhu
aavjo bhai`}
      >
        <div className="rounded-xl border p-4 bg-muted/10 mb-4">
          <p className="font-semibold text-sm mb-3">Proposed keywords / properties</p>
          <div className="space-y-2">
            {[
              ["yaadi", "declare an array (from Gujarati for 'list')"],
              [".lakhu",  "array length property (from 'count')"],
              ["[i]",    "zero-based index access"],
            ].map(([kw, desc]) => (
              <div key={kw} className="flex gap-3 text-xs">
                <code className="font-mono shrink-0" style={{ color: "hsl(var(--kw))" }}>{kw}</code>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Feature>

      <Feature
        id="maps"
        title="Maps / dictionaries"
        status="planned"
        gujarati="naksha"
        why="Arrays solve ordered collections; maps solve named ones. A grade tracker, a word-frequency counter, a config store — these all need key-value lookup. Maps would pair naturally with arrays to make kemlang-py capable of handling realistic data-processing programs."
        example={`kem bhai
  aa grades che naksha {
    "math"    : 92,
    "english" : 87,
    "science" : 95
  }
  bhai bol "Math grade: " + grades["math"]
aavjo bhai`}
      />

      <Feature
        id="error-handling"
        title="Error handling"
        status="planned"
        gujarati="bhai sambhal"
        why="Right now any runtime error crashes the whole program. A try/catch equivalent would let programs handle invalid input gracefully — especially important for the number-guessing game and grade calculator patterns where user input can be wrong."
        example={`kem bhai
  bhai sambhal {
    aa n che bapu tame bolo
    bhai bol n * 2
  } pakad {
    bhai bol "Invalid input, please enter a number"
  }
aavjo bhai`}
      >
        <div className="rounded-xl border p-4 bg-muted/10">
          <p className="font-semibold text-sm mb-2">Proposed keywords</p>
          <div className="space-y-2">
            {[
              ["bhai sambhal", "'watch out, friend' — the try block"],
              ["pakad",        "'catch' — handles the error"],
            ].map(([kw, desc]) => (
              <div key={kw} className="flex gap-3 text-xs">
                <code className="font-mono shrink-0" style={{ color: "hsl(var(--kw))" }}>{kw}</code>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Feature>

      <Feature
        id="for-each"
        title="For-each loop"
        status="considering"
        gujarati="drek mate"
        why="Iterating over an array with a manual index counter is verbose and error-prone. A for-each form would be the natural companion to arrays — once arrays land, a for-each becomes the obvious next step."
        example={`kem bhai
  aa nums che yaadi [1, 2, 3, 4, 5]
  drek mate num aa nums {
    bhai bol num * num
  }
aavjo bhai`}
      />

      <Feature
        id="multiline-strings"
        title="Multi-line strings"
        status="considering"
        gujarati='"""..."""'
        why="Single-line strings work for most cases but make it painful to embed formatted text, ASCII art, or large messages. Triple-quote strings (as in Python) would let you include newlines naturally."
        example={`kem bhai
  aa msg che """
  kem cho, duniya!
  This is a
  multi-line message.
  """
  bhai bol msg
aavjo bhai`}
      />

      {/* How to contribute */}
      <H2 id="contribute">Help build these features</H2>
      <P>
        kemlang-py is a small, readable codebase. The interpreter is ~500 lines across three files —
        a great size for a first contribution to a real language implementation.
      </P>
      <div className="space-y-3">
        {[
          ["Pick a feature", "Comment on an existing GitHub issue or open a new one describing what you want to build. We'll discuss the design before you write code."],
          ["Read the pipeline", "Lexer (lexer.py) → Parser (parser.py) → Interpreter (interpreter.py). Most features touch all three. Start by tracing how an existing feature like 'jo' flows through all three files."],
          ["Add tests first", "Write a test in tests/test_exec.py that shows the expected input/output. Then make the test pass. This keeps new features honest."],
          ["Check quality", "ruff check kemlang tests and ruff format --check kemlang tests must both pass before opening a PR."],
        ].map(([title, desc], i) => (
          <div key={title} className="flex gap-4 items-start rounded-xl border p-4 bg-muted/10">
            <span className="font-display text-2xl text-primary/30 leading-none shrink-0">{i + 1}</span>
            <div>
              <p className="font-medium text-sm mb-1">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border p-5 bg-muted/10">
        <p className="text-sm text-muted-foreground">
          Questions, proposals, or just want to discuss the language design?{" "}
          <Link href="https://github.com/sanketmuchhala/kemlang-py/issues" target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">
            Open an issue on GitHub
          </Link>
          {" "}— all design discussion happens in the open.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/errors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Error reference
        </Link>
        <Link href="/docs/github" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80">
          GitHub <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
