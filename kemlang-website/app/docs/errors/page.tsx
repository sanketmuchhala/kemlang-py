import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CodeSample } from "@/components/code-sample";

export const metadata: Metadata = {
  title: "Error Reference",
  description: "Every error kemlang-py can produce, what it means, and how to fix it.",
};

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t scroll-mt-20">{children}</h2>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-semibold text-base mt-6 mb-3">{children}</h3>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

const ErrorBlock = ({ label, message, children }: { label: string; message: string; children?: React.ReactNode }) => (
  <div className="mb-6">
    <div className="rounded-xl border overflow-hidden" style={{ background: "hsl(var(--code-bg))" }}>
      <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: "hsl(var(--border))" }}>
        <span className="h-2 w-2 rounded-full bg-red-500/70" />
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
      </div>
      <pre className="px-5 py-3 font-mono text-xs leading-relaxed text-red-400">{message}</pre>
    </div>
    {children && <div className="mt-4">{children}</div>}
  </div>
);

const Fix = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 items-start text-sm text-muted-foreground mb-2">
    <span className="text-primary shrink-0 mt-0.5">›</span>
    <span>{children}</span>
  </div>
);

export default function ErrorsPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Reference</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          Error reference
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          kemlang-py reports three categories of errors: lexer errors, parse errors, and runtime errors.
          Each one tells you exactly where the problem is and what went wrong.
        </p>
      </div>

      {/* Error anatomy */}
      <div className="rounded-xl border p-5 mb-10 bg-muted/10">
        <p className="font-semibold text-sm mb-3">Anatomy of an error message</p>
        <pre className="font-mono text-xs leading-loose" style={{ color: "hsl(var(--code-fg))" }}>
{`LexerError: unexpected character '?' at line 3, column 8
ParseError: expected '}' after block body at line 7, column 0
RuntimeError: undefined variable 'xyz' at line 5, column 10`}
        </pre>
        <p className="text-xs text-muted-foreground mt-3">
          Every error includes a <strong>type</strong>, a <strong>human-readable message</strong>, and a <strong>line:column</strong> position pointing to the exact character that caused the problem.
        </p>
      </div>

      {/* Lexer errors */}
      <H2 id="lexer">LexerError</H2>
      <P>
        Lexer errors happen before parsing even begins. The lexer turns your raw source text into tokens;
        if it encounters a character or sequence it doesn&apos;t understand, it stops with a <code>LexerError</code>.
      </P>

      <H3>Unexpected character</H3>
      <ErrorBlock
        label="LexerError"
        message={`LexerError: unexpected character '?' at line 2, column 12`}
      >
        <CodeSample highlight={false} language="jsk" code={`kem bhai
  bhai bol x?2
aavjo bhai`} />
        <Fix>Remove the unsupported character. kemlang-py only recognises letters, digits, spaces, standard operators (<code>+ - * / % == != &lt; &gt; &lt;= &gt;=</code>), quotes, braces, and parentheses.</Fix>
      </ErrorBlock>

      <H3>Unterminated string</H3>
      <ErrorBlock
        label="LexerError"
        message={`LexerError: unterminated string literal starting at line 2, column 10`}
      >
        <CodeSample highlight={false} language="jsk" code={`kem bhai
  bhai bol "hello
aavjo bhai`} />
        <Fix>Every string must have a matching closing double-quote on the same line. Multi-line strings are not supported.</Fix>
      </ErrorBlock>

      <H3>Invalid number literal</H3>
      <ErrorBlock
        label="LexerError"
        message={`LexerError: invalid number literal '3.14.15' at line 3, column 6`}
      >
        <Fix>Numbers may have at most one decimal point. <code>3.14</code> is valid; <code>3.14.15</code> is not.</Fix>
      </ErrorBlock>

      {/* Parse errors */}
      <H2 id="parse">ParseError</H2>
      <P>
        Parse errors mean the token stream is syntactically invalid - the structure of your program doesn&apos;t
        match the grammar. The parser tells you what it expected and what it found instead.
      </P>

      <H3>Missing program header</H3>
      <ErrorBlock
        label="ParseError"
        message={`ParseError: expected 'kem bhai' to start program at line 1, column 0`}
      >
        <Fix>Every kemlang-py program must begin with <code>kem bhai</code> on its own line.</Fix>
        <CodeSample highlight code={`kem bhai
  bhai bol "now it works"
aavjo bhai`} />
      </ErrorBlock>

      <H3>Missing program footer</H3>
      <ErrorBlock
        label="ParseError"
        message={`ParseError: expected 'aavjo bhai' to end program, got EOF at line 5, column 0`}
      >
        <Fix>Every kemlang-py program must end with <code>aavjo bhai</code>. If you see this error, you probably forgot it or have an unclosed block above.</Fix>
      </ErrorBlock>

      <H3>Missing block body brace</H3>
      <ErrorBlock
        label="ParseError"
        message={`ParseError: expected '{' after condition at line 3, column 14`}
      >
        <CodeSample highlight={false} language="jsk" code={`kem bhai
  aa x che 5
  jo x > 0
    bhai bol "positive"
aavjo bhai`} />
        <Fix>The body of a <code>jo</code> or <code>farvu</code> block must be wrapped in curly braces.</Fix>
        <CodeSample highlight code={`kem bhai
  aa x che 5
  jo x > 0 {
    bhai bol "positive"
  }
aavjo bhai`} />
      </ErrorBlock>

      <H3>Expected expression</H3>
      <ErrorBlock
        label="ParseError"
        message={`ParseError: expected expression at line 2, column 12`}
      >
        <CodeSample highlight={false} language="jsk" code={`kem bhai
  aa x che
aavjo bhai`} />
        <Fix>The <code>che</code> keyword must be followed by a value or expression. You cannot declare a variable without initialising it.</Fix>
      </ErrorBlock>

      <H3>Missing <code>jya sudhi</code> condition</H3>
      <ErrorBlock
        label="ParseError"
        message={`ParseError: expected 'jya sudhi' after loop body at line 5, column 0`}
      >
        <CodeSample highlight={false} language="jsk" code={`kem bhai
  farvu {
    bhai bol "hi"
  }
aavjo bhai`} />
        <Fix>A <code>farvu</code> loop always needs a <code>jya sudhi</code> condition at the end. Use <code>bhai chhe</code> for an infinite loop that you exit with <code>tame jao</code>.</Fix>
        <CodeSample highlight code={`kem bhai
  farvu {
    bhai bol "hi"
  } jya sudhi bhai chhe
aavjo bhai`} />
      </ErrorBlock>

      {/* Runtime errors */}
      <H2 id="runtime">RuntimeError</H2>
      <P>
        Runtime errors occur while the program is executing - the syntax is valid but something goes wrong
        at evaluation time. These are the errors you&apos;ll encounter most often.
      </P>

      <H3>Undefined variable</H3>
      <ErrorBlock
        label="RuntimeError"
        message={`RuntimeError: undefined variable 'score' at line 4, column 10`}
      >
        <CodeSample highlight={false} language="jsk" code={`kem bhai
  bhai bol score
aavjo bhai`} />
        <Fix>Declare the variable with <code>aa name che value</code> before using it.</Fix>
        <Fix>Check spelling - kemlang-py identifiers are case-sensitive.</Fix>
        <Fix>Make sure the variable is not declared inside a block that has already exited.</Fix>
      </ErrorBlock>

      <H3>Type mismatch</H3>
      <ErrorBlock
        label="RuntimeError"
        message={`RuntimeError: cannot subtract STRING from INTEGER at line 3, column 12`}
      >
        <CodeSample highlight={false} language="jsk" code={`kem bhai
  aa x che 10 - "five"
aavjo bhai`} />
        <Fix>Arithmetic operators (<code>- * / %</code>) only work on numbers. Use <code>+</code> for string concatenation - it auto-converts the other operand.</Fix>
      </ErrorBlock>

      <H3>Division by zero</H3>
      <ErrorBlock
        label="RuntimeError"
        message={`RuntimeError: division by zero at line 3, column 14`}
      >
        <CodeSample highlight={false} language="jsk" code={`kem bhai
  aa x che 10 / 0
aavjo bhai`} />
        <Fix>Guard the division with a <code>jo</code> check before dividing.</Fix>
        <CodeSample highlight code={`kem bhai
  aa divisor che 0
  jo divisor != 0 {
    bhai bol 10 / divisor
  } nahi to {
    bhai bol "cannot divide by zero"
  }
aavjo bhai`} />
      </ErrorBlock>

      <H3>Invalid operand for unary minus</H3>
      <ErrorBlock
        label="RuntimeError"
        message={`RuntimeError: unary minus requires a number at line 2, column 12`}
      >
        <Fix>The unary minus (<code>-x</code>) only works on integers and floats, not strings or booleans.</Fix>
      </ErrorBlock>

      <H3>Input conversion failure</H3>
      <ErrorBlock
        label="RuntimeError"
        message={`RuntimeError: cannot convert input 'hello' to INTEGER at line 3, column 14`}
      >
        <CodeSample highlight={false} language="jsk" code={`kem bhai
  aa n che bapu tame bolo
  bhai bol n * 2
aavjo bhai`} />
        <Fix>
          <code>bapu tame bolo</code> reads input as a string. If you need a number, kemlang-py attempts implicit conversion when the value is used in arithmetic - if the user types something non-numeric, you get this error. Currently there is no built-in <code>parseInt</code>; validate input with a condition and re-prompt if needed.
        </Fix>
      </ErrorBlock>

      {/* Exit codes */}
      <H2 id="exit-codes">Error exit codes</H2>
      <P>When a program exits due to an error, the <code>kem</code> process sets an appropriate exit code:</P>

      <div className="rounded-xl border overflow-hidden">
        <div className="grid grid-cols-[80px_120px_1fr] border-b px-5 py-2.5" style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span className="font-mono text-xs text-muted-foreground">code</span>
          <span className="font-mono text-xs text-muted-foreground">when</span>
          <span className="font-mono text-xs text-muted-foreground">meaning</span>
        </div>
        {[
          ["0", "always",       "Program ran and exited cleanly"],
          ["1", "lexer errors", "Source could not be tokenized"],
          ["1", "parse errors", "Token stream is syntactically invalid"],
          ["1", "runtime errors","Program raised an error during execution"],
          ["2", "usage errors", "Wrong CLI command or missing argument"],
        ].map(([code, when, desc], i) => (
          <div key={`${code}-${i}`} className="grid grid-cols-[80px_120px_1fr] px-5 py-2.5 text-xs" style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <code className="font-mono" style={{ background: "transparent", color: "hsl(var(--kw))", padding: 0, fontSize: "0.75rem" }}>{code}</code>
            <span className="text-muted-foreground">{when}</span>
            <span style={{ color: "hsl(var(--cmt))" }}>{desc}</span>
          </div>
        ))}
      </div>

      {/* Debugging tips */}
      <H2 id="debugging">Debugging tips</H2>
      <ul className="space-y-3 mb-6">
        {[
          ["Use --trace", "kem run file.jsk --trace prints the token stream and AST before running. If the token stream looks wrong, the bug is in the lexer. If the AST looks wrong, the bug is in the parser. If both look right, it's a runtime issue."],
          ["Use kem tokens", "kem tokens file.jsk shows exactly how the lexer sees your code - useful for diagnosing unexpected character errors."],
          ["Use kem ast", "kem ast file.jsk pretty-prints the AST - useful for checking whether your conditionals and loops parsed as you intended."],
          ["Check line:column", "Every error includes a position. Open your file and go to that exact line and column. The error character is usually right there."],
          ["REPL for quick tests", "Paste a suspect expression into kem repl to evaluate it interactively without running the whole file."],
        ].map(([title, desc]) => (
          <li key={title as string} className="flex gap-3 items-start rounded-xl border p-4 bg-muted/10">
            <span className="text-primary shrink-0 font-mono text-xs mt-0.5">›</span>
            <div>
              <p className="font-medium text-sm mb-1">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/cli" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← CLI reference
        </Link>
        <Link href="/docs/roadmap" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80">
          Roadmap <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
