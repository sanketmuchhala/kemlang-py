import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H2, P, Diagram, Block } from "@/components/hiw";

export const metadata: Metadata = {
  title: "Runtime and Types",
  description: "kemlang-py's five runtime types, dynamic typing, coercion rules, truthiness, and the full execution lifecycle.",
};

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
      <Block label="kemlang/types.py">{`KemValue = int | float | str | bool | None

# There are no wrapper classes. Python's built-in types ARE the runtime types.
# int   -> 42, 0, -7
# float -> 3.14, 0.5
# str   -> "hello", result of bapu tame bolo
# bool  -> bhai chhe (True), bhai nathi (False)
# None  -> result of failed input coercion`}</Block>

      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[80px_130px_1fr] border-b px-5 py-2.5 font-mono text-xs text-muted-foreground"
          style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span>type</span><span>kemlang-py literal</span><span>notes</span>
        </div>
        {[
          ["int",   "42, 0, -7",             "arbitrary precision Python int"],
          ["float", "3.14, 0.5, -1.0",       "IEEE 754 double, same as Python float"],
          ["str",   '"hello"',                "UTF-8, double-quoted, single-line only"],
          ["bool",  "bhai chhe / bhai nathi", "Python True/False (subclass of int)"],
          ["None",  "(no literal)",            "failed input coercion; never user-writable"],
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
        Variables have no declared type. They hold whatever value was assigned to them, and that type
        can change on reassignment. The interpreter discovers the type of a value at runtime using
        Python&apos;s <code className="font-mono text-xs">isinstance()</code>.
      </P>

      <Block label="valid in kemlang-py">{`kem bhai
  aa x che 42          # x is int
  x che "hello"        # x is now str - perfectly legal
  x che bhai chhe      # x is now bool
aavjo bhai`}</Block>

      <H2 id="truthiness">Truthiness</H2>
      <P>
        Conditions accept any <code className="font-mono text-xs">KemValue</code>. The interpreter
        applies the same rules as Python&apos;s <code className="font-mono text-xs">bool()</code>:
      </P>

      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[180px_80px_1fr] border-b px-5 py-2.5 font-mono text-xs text-muted-foreground"
          style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span>value</span><span>truthy?</span><span>notes</span>
        </div>
        {[
          ["bhai chhe",       "yes", "canonical truthy value"],
          ["bhai nathi",      "no",  "canonical falsy value"],
          ["any non-zero int","yes", "0 is falsy; 1, -5, 42 are truthy"],
          ["0",               "no",  "zero integer"],
          ["any non-zero float","yes","0.0 is falsy"],
          ["0.0",             "no",  "zero float"],
          ["non-empty string","yes", '"hello", "0", " " are all truthy'],
          ['""',              "no",  "empty string"],
          ["None",            "no",  "always falsy"],
        ].map(([val, truthy, notes], i) => (
          <div key={val} className="grid grid-cols-[180px_80px_1fr] px-5 py-2.5 text-xs"
            style={{ background: "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
            <code className="font-mono text-[10px]" style={{ color: "hsl(var(--kw))" }}>{val}</code>
            <span style={{ color: truthy === "yes" ? "hsl(var(--primary))" : "hsl(var(--cmt))" }}>{truthy}</span>
            <span style={{ color: "hsl(var(--cmt))" }}>{notes}</span>
          </div>
        ))}
      </div>

      <H2 id="arithmetic">Arithmetic and type promotion</H2>
      <Diagram label="arithmetic type rules">{`
  int   op int    ->  int      5 + 3 = 8
  int   op float  ->  float    5 + 3.0 = 8.0
  float op float  ->  float    1.5 * 2.0 = 3.0

  Division:  7 / 2  uses Python /  ->  3.5  (float, not integer 3)
  Modulo:    7 % 3  ->  1
  Negation:  -5     ->  int
             -3.14  ->  float`}</Diagram>

      <H2 id="plus-coercion">The + operator</H2>
      <P>
        If either operand is a string, both are stringified and concatenated.
        Otherwise, numeric addition is performed.
      </P>

      <Diagram label="+ operator coercion examples">{`
  10 + 5          ->  15          numeric addition
  10 + 3.14       ->  13.14       int + float promotion
  "score: " + 10  ->  "score: 10" str on left -> stringify right
  10 + " points"  ->  "10 points" str on right -> stringify left
  "a" + "b"       ->  "ab"        both str -> concatenate

  stringify() rules:
    int:   str(n)           -> "42"
    float: str(f)           -> "3.14"
    bool:  True  -> "bhai chhe"   False -> "bhai nathi"
    None:  "none"`}</Diagram>

      <Block label="kemlang/interpreter.py - + operator implementation">{`if op == TokenType.PLUS:
    if isinstance(left, str) or isinstance(right, str):
        return self.stringify(left) + self.stringify(right)
    return left + right`}</Block>

      <H2 id="comparison">Comparison operators</H2>
      <Diagram label="comparison examples">{`
  10 == 10        ->  bhai chhe    (True)
  10 == 10.0      ->  bhai chhe    (True  - int/float equality in Python)
  10 == "10"      ->  bhai nathi   (False - different types)
  "a" < "b"       ->  bhai chhe    (True  - lexicographic)
  bhai chhe == 1  ->  bhai chhe    (True  - bool is int subclass, True == 1)
  bhai nathi == 0 ->  bhai chhe    (True  - False == 0 in Python)`}</Diagram>

      <H2 id="lifecycle">Full execution lifecycle</H2>
      <Diagram label="from kem run to process exit">{`
  $ kem run hello.jsk

  ┌─ 1. CLI (kemlang/cli.py) ────────────────────────────────────────┐
  │  typer parses command and file argument                           │
  │  validates .jsk extension (warns if different)                   │
  │  reads file: Path(file).read_text(encoding="utf-8")              │
  └──────────────────────────────────────────────────────────────────┘
                               │ raw source string
  ┌─ 2. Lexer (kemlang/lexer.py) ────────────────────────────────────┐
  │  Lexer(source).tokenize()                                         │
  │  scans left-to-right, emits tokens                               │
  │  LexerError on bad character -> CLI prints error, exit code 1    │
  └──────────────────────────────────────────────────────────────────┘
                               │ List[Token]
  ┌─ 3. Parser (kemlang/parser.py) ──────────────────────────────────┐
  │  Parser(tokens).parse()                                           │
  │  filters NEWLINE tokens, recursive descent builds AST            │
  │  ParseError on grammar violation -> CLI prints error, exit code 1│
  └──────────────────────────────────────────────────────────────────┘
                               │ Program (AST root)
  ┌─ 4. Interpreter (kemlang/interpreter.py) ────────────────────────┐
  │  Interpreter().interpret(program)                                 │
  │  walks AST, calls execute() on each statement                    │
  │  Print -> calls output_fn (print) -> stdout                      │
  │  Input -> calls input_fn (input)  <- stdin                       │
  │  RuntimeError caught at top level -> exit code 1                 │
  └──────────────────────────────────────────────────────────────────┘
                               │ int (0 or 1)
  ┌─ 5. CLI exit ─────────────────────────────────────────────────────┐
  │  raise typer.Exit(exit_code)                                      │
  └──────────────────────────────────────────────────────────────────┘

  $ echo $?
  0`}</Diagram>

      <H2 id="error-propagation">Error propagation</H2>
      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[140px_1fr] border-b px-5 py-2.5 font-mono text-xs text-muted-foreground"
          style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span>error type</span><span>when raised</span>
        </div>
        {[
          ["LexerError",   "Bad character in source. Raised immediately - no parsing or execution."],
          ["ParseError",   "Grammar violation in token stream. Raised immediately - no execution."],
          ["RuntimeError", "Bad operation during execution. Caught at interpret() top level, prints message, returns exit code 1."],
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
