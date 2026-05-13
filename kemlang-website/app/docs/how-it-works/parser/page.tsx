import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "The Parser",
  description: "How kemlang-py's recursive-descent parser turns a token stream into an Abstract Syntax Tree.",
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

export default function ParserPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">How it works</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          The Parser
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The parser takes the flat token stream from the lexer and builds a tree that represents
          the structure of the program - nesting, operator precedence, and the relationships between
          statements and the expressions they contain.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-10 text-center">
        {[
          { label: "Input",  val: "List[Token]",  sub: "NEWLINE tokens filtered" },
          { label: "Output", val: "Program",      sub: "root AST node" },
          { label: "Source", val: "parser.py",    sub: "295 lines" },
        ].map(c => (
          <div key={c.label} className="rounded-xl border p-4" style={{ background: "hsl(var(--code-bg))" }}>
            <p className="font-mono text-[10px] text-muted-foreground mb-1">{c.label}</p>
            <p className="font-mono text-xs font-semibold" style={{ color: "hsl(var(--kw))" }}>{c.val}</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <H2 id="why-tree">Why a tree?</H2>
      <P>
        Source code has inherent structure. An <code className="font-mono text-xs">if</code> statement
        contains a condition and one or two blocks. A block contains statements. A statement might
        contain an expression. An expression might contain sub-expressions. This hierarchy of containment
        is exactly what a tree represents.
      </P>
      <P>
        A flat token list loses this structure. You cannot look at a sequence of tokens
        <code className="font-mono text-xs"> [JO, IDENTIFIER, GREATER, INTEGER, LEFT_BRACE, ...]</code>
        and know where the condition ends, where the then-block starts, and where the else-block begins
        without building a tree that makes those boundaries explicit.
      </P>
      <P>
        The Abstract Syntax Tree (AST) is the parser&apos;s answer. Each node in the tree corresponds
        to a grammatical construct. The tree is &quot;abstract&quot; because it drops irrelevant syntax
        details (braces, the word &quot;che&quot;, newlines) and keeps only the semantically meaningful structure.
      </P>

      <H2 id="grammar">The kemlang-py grammar (BNF)</H2>
      <P>
        A context-free grammar defines what sequences of tokens form a valid program. kemlang-py&apos;s
        grammar can be written in BNF (Backus-Naur Form). Each rule defines one grammatical construct
        in terms of simpler ones.
      </P>

      <Diagram label="kemlang-py grammar in BNF notation">{`  program     ::= "kem bhai" statement* "aavjo bhai"

  statement   ::= print_stmt
                | declaration
                | assignment
                | if_stmt
                | while_stmt
                | break_stmt
                | continue_stmt

  print_stmt  ::= "bhai bol" expression
  declaration ::= "aa" IDENTIFIER "che" expression
  assignment  ::= IDENTIFIER "che" expression
  break_stmt  ::= "tame jao"
  continue_stmt::= "aagal vado"

  if_stmt     ::= "jo" expression block
                  ( "nahi to" block )?

  while_stmt  ::= "farvu" block "jya sudhi" expression

  block       ::= "{" statement* "}"

  expression  ::= comparison

  comparison  ::= term ( ( "==" | "!=" | "<" | ">" | "<=" | ">=" ) term )*

  term        ::= factor ( ( "+" | "-" ) factor )*

  factor      ::= unary ( ( "*" | "/" | "%" ) unary )*

  unary       ::= "-" unary
                | primary

  primary     ::= INTEGER | FLOAT | STRING | BOOLEAN
                | "bapu tame bolo"
                | IDENTIFIER
                | "(" expression ")"`}</Diagram>

      <P>
        The grammar is stratified into levels: <code className="font-mono text-xs">expression</code> at the
        top delegates to <code className="font-mono text-xs">comparison</code>, which delegates to
        <code className="font-mono text-xs">term</code>, which delegates to
        <code className="font-mono text-xs">factor</code>, which reaches
        <code className="font-mono text-xs">unary</code> and finally
        <code className="font-mono text-xs">primary</code>. This stratification is how operator precedence
        is encoded.
      </P>

      <H2 id="precedence">Operator precedence</H2>
      <P>
        Why does <code className="font-mono text-xs">1 + 2 * 3</code> equal <code className="font-mono text-xs">7</code>
        and not <code className="font-mono text-xs">9</code>? Because multiplication has higher precedence
        than addition. The grammar encodes this by making
        <code className="font-mono text-xs"> factor</code> (which handles <code className="font-mono text-xs">*</code>,
        <code className="font-mono text-xs">/</code>, <code className="font-mono text-xs">%</code>)
        a lower-level rule than <code className="font-mono text-xs">term</code>
        (which handles <code className="font-mono text-xs">+</code>, <code className="font-mono text-xs">-</code>).
      </P>
      <P>
        Lower in the grammar = tighter binding = higher precedence. The chain works like this:
      </P>

      <Diagram label="operator precedence chain (lower = tighter binding)">{`  expression()          lowest precedence
    └── comparison()    == != < > <= >=
          └── term()    + -
                └── factor()   * / %
                      └── unary()    - (negation)
                            └── primary()   literals, variables, (expr)
                                            highest precedence

  Parsing 1 + 2 * 3:

    term() calls factor() to get left side
      factor() calls unary() -> primary() -> returns Literal(1)
    term() sees '+', so it calls factor() again for right side
      factor() calls unary() -> primary() -> gets Literal(2)
      factor() sees '*', so it calls unary() -> primary() -> Literal(3)
      factor() returns Binary(*, Literal(2), Literal(3))   <- binds tighter
    term() returns Binary(+, Literal(1), Binary(*, 2, 3))

  Result: 1 + (2 * 3) = 7   correct!`}</Diagram>

      <H2 id="recursive-descent">Recursive descent</H2>
      <P>
        kemlang-py uses a hand-written recursive-descent parser. &quot;Recursive descent&quot; means that
        each grammar rule has a corresponding Python method, and those methods call each other recursively
        as they parse nested constructs.
      </P>

      <Block label="kemlang/parser.py - how parse_if and parse_expression call each other">{`def statement(self) -> Stmt | None:
    if self.match(TokenType.JO):
        return self.if_statement()       # dispatch on current token
    if self.match(TokenType.AA):
        return self.declaration()
    # ... etc.

def if_statement(self) -> If:
    condition = self.expression()        # parse the condition expression
    then_branch = self.block()           # parse the { ... } body
    else_branch = None
    if self.match(TokenType.ELSE):
        else_branch = self.block()       # parse optional nahi to { ... }
    return If(condition, then_branch, else_branch)

def expression(self) -> Expr:
    return self.comparison()             # delegate to next level

def comparison(self) -> Expr:
    left = self.term()                   # get left operand
    while self.match(TokenType.EQUAL, TokenType.NOT_EQUAL, ...):
        op = self.previous()
        right = self.term()
        left = Binary(left, op, right)   # build binary node
    return left`}</Block>

      <H2 id="ast-nodes">AST node types</H2>
      <P>
        Every node in the tree is a frozen Python <code className="font-mono text-xs">@dataclass</code>.
        Dataclasses give free <code className="font-mono text-xs">__repr__</code> and
        <code className="font-mono text-xs"> __eq__</code> without boilerplate, and they are immutable
        once created - the parser builds the tree, then the interpreter reads it without modification.
      </P>

      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[160px_1fr] border-b px-5 py-2.5 font-mono text-xs text-muted-foreground"
          style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span>node type</span><span>fields</span>
        </div>
        {[
          ["Statements (produce side effects)", ""],
          ["Program",      "statements: list[Stmt]"],
          ["Block",        "statements: list[Stmt]"],
          ["Print",        "expression: Expr"],
          ["Declaration",  "name: str, initializer: Expr"],
          ["Assignment",   "name: str, value: Expr"],
          ["If",           "condition: Expr, then_branch: Block, else_branch: Block | None"],
          ["While",        "body: Block, condition: Expr  (body executes before condition is checked)"],
          ["Break",        "(no fields)"],
          ["Continue",     "(no fields)"],
          ["Expressions (return a KemValue)", ""],
          ["Literal",      "value: int | float | str | bool | None"],
          ["Variable",     "name: str"],
          ["Binary",       "left: Expr, operator: Token, right: Expr"],
          ["Unary",        "operator: Token, right: Expr"],
          ["Input",        "(no fields) - evaluates bapu tame bolo at runtime"],
        ].map(([name, fields], i) => {
          const isHeader = fields === "";
          return (
            <div key={`${name}-${i}`}
              className="grid grid-cols-[160px_1fr] px-5 py-2 text-xs"
              style={{
                background: isHeader ? "hsl(var(--muted) / 0.3)" : "hsl(var(--code-bg))",
                borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined,
              }}>
              <span className="font-mono font-semibold"
                style={{ color: isHeader ? "hsl(var(--muted-foreground))" : "hsl(var(--kw))", fontSize: isHeader ? "0.65rem" : undefined }}>
                {isHeader ? name.toUpperCase() : name}
              </span>
              <span className="font-mono text-[10px]" style={{ color: "hsl(var(--cmt))" }}>{fields}</span>
            </div>
          );
        })}
      </div>

      <H2 id="example">Parsing a complete example</H2>
      <P>
        Here is what the parser produces for a short conditional program:
      </P>

      <Block label="source">{`kem bhai
  aa x che 10
  jo x > 5 {
    bhai bol "big"
  } nahi to {
    bhai bol "small"
  }
aavjo bhai`}</Block>

      <Diagram label="resulting AST (shown as an indented tree)">{`  Program
  ├── Declaration
  │   ├── name:        "x"
  │   └── initializer: Literal(10)
  └── If
      ├── condition:   Binary
      │                 ├── left:     Variable("x")
      │                 ├── operator: Token(GREATER, ">")
      │                 └── right:    Literal(5)
      ├── then_branch: Block
      │   └── Print
      │       └── expression: Literal("big")
      └── else_branch: Block
          └── Print
              └── expression: Literal("small")`}</Diagram>

      <P>
        Notice that the AST contains no braces, no <code className="font-mono text-xs">che</code>,
        no <code className="font-mono text-xs">jo</code>, no <code className="font-mono text-xs">nahi to</code>.
        The parser consumed those tokens to understand structure, then discarded them. The tree captures
        only what the interpreter needs to execute the program.
      </P>

      <H2 id="errors">Parse errors</H2>
      <P>
        The parser raises <code className="font-mono text-xs">ParseError</code> when the token at the
        current position does not match what the grammar expects. Unlike the lexer, which errors immediately,
        the parser reports the specific token it expected and the token it found instead.
      </P>
      <P>
        Common causes: missing <code className="font-mono text-xs">kem bhai</code> or
        <code className="font-mono text-xs"> aavjo bhai</code>, a block without braces, a declaration
        without an initializer (<code className="font-mono text-xs">aa x che</code> with nothing after),
        or a <code className="font-mono text-xs">farvu</code> loop without
        <code className="font-mono text-xs"> jya sudhi</code>.
      </P>

      <Block label="error format">{`ParseError: expected '{' after 'jo' condition at line 3, column 14
ParseError: expected 'jya sudhi' after loop body at line 7, column 0
ParseError: program must start with 'kem bhai' at line 1, column 0`}</Block>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/how-it-works/lexer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          The Lexer
        </Link>
        <Link href="/docs/how-it-works/interpreter" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80">
          The Interpreter <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
