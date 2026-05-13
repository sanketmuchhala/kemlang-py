import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Runtime and Types",
  description: "kemlang-py's five runtime types, dynamic typing, coercion rules, truthiness, and the full execution lifecycle.",
};

const H2 = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-display text-2xl md:text-3xl mt-12 mb-4 pt-8 border-t scroll-mt-20">{children}</h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
);

const Diagram = ({ label, children }: { label: string; children: string }) => (
  <div className="rounded-xl border overflow-hidden mb-8" style={{ background: "hsl(var(--code-bg))" }}>
    <div className="px-4 py-2 border-b font-mono text-xs text-muted-foreground"
      style={{ borderColor: "hsl(var(--border))" }}>{label}</div>
    <div className="overflow-x-auto">
      <pre className="px-6 py-5 font-mono text-xs leading-relaxed"
        style={{ color: "hsl(var(--code-fg))" }}>{children}</pre>
    </div>
  </div>
);

const Block = ({ label, children }: { label?: string; children: string }) => (
  <div className="rounded-xl border overflow-hidden mb-6" style={{ background: "hsl(var(--code-bg))" }}>
    {label && (
      <div className="px-4 py-2 border-b font-mono text-xs text-muted-foreground"
        style={{ borderColor: "hsl(var(--border))" }}>{label}</div>
    )}
    <pre className="px-5 py-4 font-mono text-xs leading-relaxed overflow-x-auto"
      style={{ color: "hsl(var(--code-fg))" }}>{children}</pre>
  </div>
);

export default function RuntimePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">How it works</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          Runtime and Types
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Every value in a running kemlang-py program is one of five Python types. This page covers
          how those types behave, how coercion works, what is truthy, and the full lifecycle of a
          program from file read to process exit.
        </p>
      </div>

      <H2 id="kemvalue">KemValue - the runtime type</H2>
      <P>
        kemlang-py defines a single type alias that covers all possible runtime values:
      </P>

      <Block label="kemlang/types.py">{`KemValue = int | float | str | bool | None`}</Block>

      <P>
        There are no wrapper classes. No <code className="font-mono text-xs">KemInt</code>,
        no <code className="font-mono text-xs">KemString</code>. Python&apos;s own built-in types
        are the runtime types. This means all of Python&apos;s arithmetic, comparison, and string
        operations work natively on kemlang-py values - the interpreter just delegates to Python.
      </P>

      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[80px_130px_1fr] border-b px-5 py-2.5 font-mono text-xs text-muted-foreground"
          style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span>Python type</span><span>kemlang-py literal</span><span>notes</span>
        </div>
        {[
          ["int",   "42, 0, -7",          "arbitrary precision, same as Python int"],
          ["float", "3.14, 0.5, -1.0",   "IEEE 754 double, same as Python float"],
          ["str",   '"hello", "123"',     "UTF-8, double-quoted only, single-line"],
          ["bool",  "bhai chhe / bhai nathi", "Python True/False - subclass of int"],
          ["None",  "(no literal)",        "result of failed input coercion; not user-writable"],
        ].map(([type, literal, notes], i) => (
          <div key={type} className="grid grid-cols-[80px_130px_1fr] px-5 py-2.5 text-xs"
            style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <code className="font-mono" style={{ color: "hsl(var(--kw))" }}>{type}</code>
            <code className="font-mono text-[10px]" style={{ color: "hsl(var(--str))" }}>{literal}</code>
            <span style={{ color: "hsl(var(--cmt))" }}>{notes}</span>
          </div>
        ))}
      </div>

      <H2 id="dynamic">Dynamic typing</H2>
      <P>
        kemlang-py is dynamically typed. Variables have no declared type - they hold whatever value
        was assigned to them, and that type can change on reassignment.
      </P>

      <Block label="valid in kemlang-py: x changes type on reassignment">{`kem bhai
  aa x che 42          # x is int
  x che "hello"        # x is now str - perfectly legal
  x che bhai chhe      # x is now bool
aavjo bhai`}</Block>

      <P>
        The interpreter discovers the type of a value at runtime by calling Python&apos;s built-in
        <code className="font-mono text-xs"> isinstance()</code>. It does not track types statically.
        Type errors are discovered when an incompatible operation is attempted - for example, trying
        to subtract a string from a number.
      </P>

      <H2 id="truthiness">Truthiness</H2>
      <P>
        Conditions in <code className="font-mono text-xs">jo</code> and
        <code className="font-mono text-xs"> jya sudhi</code> accept any
        <code className="font-mono text-xs"> KemValue</code>, not just booleans.
        The interpreter converts the value to a boolean using the same rules as Python:
      </P>

      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[160px_80px_1fr] border-b px-5 py-2.5 font-mono text-xs text-muted-foreground"
          style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span>value</span><span>truthy?</span><span>notes</span>
        </div>
        {[
          ["bhai chhe  (True)",  "yes", "the canonical truthy value"],
          ["bhai nathi  (False)", "no",  "the canonical falsy value"],
          ["any non-zero int",   "yes", "0 is falsy; 1, -5, 42 are truthy"],
          ["0",                  "no",  "zero integer is falsy"],
          ["any non-zero float", "yes", "0.0 is falsy"],
          ["0.0",                "no",  "zero float is falsy"],
          ['any non-empty str',  "yes", '"hello", "0", " " are all truthy'],
          ['""  (empty string)', "no",  "empty string is falsy"],
          ["None",               "no",  "None is always falsy"],
        ].map(([val, truthy, notes], i) => (
          <div key={val} className="grid grid-cols-[160px_80px_1fr] px-5 py-2.5 text-xs"
            style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <code className="font-mono text-[10px]" style={{ color: "hsl(var(--kw))" }}>{val}</code>
            <span style={{ color: truthy === "yes" ? "hsl(var(--primary))" : "hsl(var(--cmt))" }}>
              {truthy}
            </span>
            <span style={{ color: "hsl(var(--cmt))" }}>{notes}</span>
          </div>
        ))}
      </div>

      <Block label="kemlang/interpreter.py - is_truthy">{`def is_truthy(self, value: KemValue) -> bool:
    if value is None:        return False
    if isinstance(value, bool): return value
    if isinstance(value, int):  return value != 0
    if isinstance(value, float): return value != 0.0
    if isinstance(value, str):  return len(value) > 0
    return False`}</Block>

      <H2 id="arithmetic">Arithmetic and type rules</H2>
      <P>
        kemlang-py follows Python&apos;s numeric promotion rules for arithmetic: integer arithmetic
        stays integer; mixing int with float promotes to float.
      </P>

      <Diagram label="arithmetic type rules">{`  int   op int    ->  int      (5 + 3 = 8, 7 / 2 = 3  integer division)
  int   op float  ->  float    (5 + 3.0 = 8.0)
  float op float  ->  float    (1.5 * 2.0 = 3.0)
  int   op bool   ->  int      (bool is a subclass of int in Python)

  Division:  7 / 2  uses Python's /  ->  3.5  (float, not integer 3)
  Modulo:    7 % 3  ->  1    (remainder)
  Negation:  -5     ->  int
             -3.14  ->  float`}</Diagram>

      <H2 id="plus-coercion">The + operator: addition or concatenation</H2>
      <P>
        The <code className="font-mono text-xs">+</code> operator has two behaviours: numeric addition
        and string concatenation. If either operand is a string, both operands are converted to strings
        and concatenated. Otherwise, numeric addition is performed.
      </P>

      <Block label="kemlang/interpreter.py - evaluate_binary (+ operator)">{`def evaluate_binary(self, expr: Binary) -> KemValue:
    left  = self.evaluate(expr.left)
    right = self.evaluate(expr.right)
    op    = expr.operator.type

    if op == TokenType.PLUS:
        if isinstance(left, str) or isinstance(right, str):
            return self.stringify(left) + self.stringify(right)  # concatenate
        return left + right  # numeric addition`}</Block>

      <Diagram label="+ coercion examples">{`  10 + 5          ->  15          both int, numeric addition
  10 + 3.14       ->  13.14       int + float = float addition
  "score: " + 10  ->  "score: 10" str on left, stringify right
  10 + " points"  ->  "10 points" str on right, stringify left
  "a" + "b"       ->  "ab"        both str, concatenate

  stringify() rules:
    int:   str(value)       -> "42"
    float: str(value)       -> "3.14"
    bool:  "bhai chhe" / "bhai nathi"  (not Python's True/False)
    None:  "none"`}</Diagram>

      <H2 id="comparison">Comparison operators</H2>
      <P>
        Comparison operators (<code className="font-mono text-xs">== != &lt; &gt; &lt;= &gt;=</code>)
        return Python booleans (<code className="font-mono text-xs">True</code> /
        <code className="font-mono text-xs">False</code>), which kemlang-py treats as
        <code className="font-mono text-xs"> bhai chhe</code> /
        <code className="font-mono text-xs"> bhai nathi</code>.
      </P>
      <P>
        Equality (<code className="font-mono text-xs">==</code>) compares value and type - Python&apos;s
        default <code className="font-mono text-xs">==</code> behaviour. The integer
        <code className="font-mono text-xs"> 1</code> equals the float
        <code className="font-mono text-xs"> 1.0</code> because Python promotes numeric types for comparison.
        The string <code className="font-mono text-xs">&quot;1&quot;</code> does not equal the integer
        <code className="font-mono text-xs"> 1</code> because they are different types.
      </P>

      <Diagram label="comparison examples">{`  10 == 10        ->  bhai chhe    (True)
  10 == 10.0      ->  bhai chhe    (True  - int/float promotion)
  10 == "10"      ->  bhai nathi   (False - different types)
  "a" < "b"       ->  bhai chhe    (True  - lexicographic)
  bhai chhe == 1  ->  bhai chhe    (True  - bool is subclass of int)
  bhai nathi == 0 ->  bhai chhe    (True  - False == 0 in Python)`}</Diagram>

      <H2 id="input-coercion">Input coercion (bapu tame bolo)</H2>
      <P>
        <code className="font-mono text-xs">bapu tame bolo</code> always returns a string - it is
        Python&apos;s <code className="font-mono text-xs">input()</code> with the trailing newline stripped.
        When that string is used in arithmetic, the interpreter attempts to convert it:
      </P>

      <Block label="kemlang/interpreter.py - numeric coercion in arithmetic">{`# When doing arithmetic on a value that might be a string from input:
def coerce_to_number(self, value: KemValue) -> int | float:
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, str):
        try:
            return int(value)        # try int first
        except ValueError:
            try:
                return float(value)  # then float
            except ValueError:
                raise RuntimeError(f"Cannot convert '{value}' to a number")`}</Block>

      <P>
        This means <code className="font-mono text-xs">bapu tame bolo</code> works naturally for numeric
        input: if the user types <code className="font-mono text-xs">42</code>, the string
        <code className="font-mono text-xs"> &quot;42&quot;</code> is returned, and when it is used in
        arithmetic (e.g. <code className="font-mono text-xs">x + 1</code>), it is silently coerced to
        the integer <code className="font-mono text-xs">42</code>. If the user types
        <code className="font-mono text-xs"> hello</code> and you try to add a number to it, you get a
        <code className="font-mono text-xs"> RuntimeError</code>.
      </P>

      <H2 id="lifecycle">Full execution lifecycle</H2>
      <P>
        Here is everything that happens from the moment you type
        <code className="font-mono text-xs"> kem run hello.jsk</code> to when the process exits:
      </P>

      <Diagram label="complete execution lifecycle">{`  $ kem run hello.jsk

  1. CLI (kemlang/cli.py)
     - typer parses the command and file argument
     - validates the .jsk extension (warns if different)
     - reads the file with Path(file).read_text(encoding="utf-8")

  2. Lexer (kemlang/lexer.py)
     - Lexer(source).tokenize() called
     - scans source string left-to-right
     - returns List[Token] including EOF
     - raises LexerError on bad character -> exit code 1

  3. Parser (kemlang/parser.py)
     - Parser(tokens).parse() called
     - filters NEWLINE tokens from list
     - checks for KEM_BHAI at position 0
     - recursive descent builds Program dataclass tree
     - raises ParseError on grammar violation -> exit code 1

  4. Interpreter (kemlang/interpreter.py)
     - Interpreter().interpret(program) called
     - creates global Environment
     - iterates program.statements, calling execute() on each
     - each Print calls output_fn (Python's print) -> stdout
     - each Input calls input_fn (Python's input) <- stdin
     - RuntimeError caught at top level -> exit code 1

  5. CLI (kemlang/cli.py)
     - receives exit code from interpret()
     - raise typer.Exit(exit_code)
     - Python process exits with that code

  $ echo $?
  0    <- success`}</Diagram>

      <H2 id="error-propagation">Error propagation</H2>
      <P>
        All three error types map to exit code 1. The distinction is only in the message:
      </P>

      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[140px_1fr] border-b px-5 py-2.5 font-mono text-xs text-muted-foreground"
          style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span>error type</span><span>when it is raised</span>
        </div>
        {[
          ["LexerError",   "Raised by the lexer when a character cannot start any valid token. Program exits immediately - no parsing or execution occurs."],
          ["ParseError",   "Raised by the parser when the token stream violates the grammar. Program exits immediately - no execution occurs."],
          ["RuntimeError", "Raised by the interpreter during execution. Caught at the top of interpret(), which prints the message and returns exit code 1."],
        ].map(([name, desc], i) => (
          <div key={name} className="grid grid-cols-[140px_1fr] px-5 py-3 text-xs"
            style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <code className="font-mono" style={{ color: "hsl(0 62% 60%)" }}>{name}</code>
            <span style={{ color: "hsl(var(--cmt))" }}>{desc}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/how-it-works/interpreter" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          The Interpreter
        </Link>
        <Link href="/docs/language/syntax" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80">
          Language Guide <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
