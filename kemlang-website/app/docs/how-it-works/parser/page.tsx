import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H2, P, Diagram, Block, StageStats, MermaidChart } from "@/components/hiw";

export const metadata: Metadata = {
  title: "The Parser",
  description: "How kemlang-py's recursive-descent parser turns a token stream into an Abstract Syntax Tree.",
};

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

      <StageStats input="List[Token]" output="Program" source="parser.py" lines={295} />

      <H2 id="why-tree">Why a tree?</H2>
      <P>
        Source code has inherent structure. An <code className="font-mono text-xs">if</code> statement
        contains a condition and one or two blocks. A block contains statements. A statement might
        contain an expression. An expression might contain sub-expressions. This hierarchy of containment
        is exactly what a tree represents.
      </P>
      <P>
        The Abstract Syntax Tree (AST) is the parser&apos;s answer. It is &quot;abstract&quot; because it drops
        irrelevant syntax tokens (braces, the word &quot;che&quot;, newlines) and keeps only the semantically
        meaningful structure.
      </P>

      <H2 id="grammar">The kemlang-py grammar (BNF)</H2>
      <P>
        A context-free grammar defines what sequences of tokens form a valid program.
      </P>

      <Diagram label="kemlang-py grammar in BNF notation">{`
  program      ::= "kem bhai" statement* "aavjo bhai"

  statement    ::= print_stmt
                 | declaration
                 | assignment
                 | if_stmt
                 | while_stmt
                 | break_stmt
                 | continue_stmt

  print_stmt   ::= "bhai bol" expression
  declaration  ::= "aa" IDENTIFIER "che" expression
  assignment   ::= IDENTIFIER "che" expression
  break_stmt   ::= "tame jao"
  continue_stmt::= "aagal vado"

  if_stmt      ::= "jo" expression block ( "nahi to" block )?
  while_stmt   ::= "farvu" block "jya sudhi" expression
  block        ::= "{" statement* "}"

  expression   ::= comparison
  comparison   ::= term ( ( "==" | "!=" | "<" | ">" | "<=" | ">=" ) term )*
  term         ::= factor ( ( "+" | "-" ) factor )*
  factor       ::= unary ( ( "*" | "/" | "%" ) unary )*
  unary        ::= "-" unary | primary
  primary      ::= INTEGER | FLOAT | STRING | BOOLEAN
                 | "bapu tame bolo"
                 | IDENTIFIER
                 | "(" expression ")"`}</Diagram>

      <H2 id="precedence">Operator precedence</H2>
      <P>
        Why does <code className="font-mono text-xs">1 + 2 * 3</code> equal <code className="font-mono text-xs">7</code>
        and not <code className="font-mono text-xs">9</code>? The grammar encodes precedence by stratification:
        lower in the grammar = tighter binding = higher precedence.
      </P>

      <Diagram label="operator precedence chain - lower = tighter binding">{`
  expression()        lowest precedence (entry point)
    └── comparison()  == != < > <= >=
          └── term()  + -
                └── factor()  * / %
                      └── unary()  - (negation)
                            └── primary()  literals, variables, (expr)
                                           highest precedence

  Parsing  1 + 2 * 3 :

    term() needs a left operand  -> calls factor()
      factor() needs left  -> calls unary() -> primary() -> Literal(1)
      factor() sees no * / % -> returns Literal(1)
    term() has left=1, sees '+', needs right -> calls factor()
      factor() needs left  -> calls unary() -> primary() -> Literal(2)
      factor() sees '*'   -> calls unary() -> primary() -> Literal(3)
      factor() returns Binary(*, Literal(2), Literal(3))   <- tighter!
    term() returns Binary(+, Literal(1), Binary(*, 2, 3))

  Result tree: 1 + (2 * 3)  =  7   correct`}</Diagram>

      <H2 id="recursive-descent">Recursive descent</H2>
      <P>
        Each grammar rule has a corresponding Python method. Methods call each other recursively,
        naturally mirroring the nested structure of the grammar.
      </P>

      <Block label="kemlang/parser.py - how rules call each other">{`def statement(self) -> Stmt | None:
    if self.match(TokenType.JO):
        return self.if_statement()    # dispatch on current token
    if self.match(TokenType.AA):
        return self.declaration()
    # ...

def if_statement(self) -> If:
    condition   = self.expression()   # parse the condition
    then_branch = self.block()        # parse { ... }
    else_branch = None
    if self.match(TokenType.ELSE):
        else_branch = self.block()    # optional nahi to { ... }
    return If(condition, then_branch, else_branch)

def expression(self) -> Expr:
    return self.comparison()          # delegate to next level

def comparison(self) -> Expr:
    left = self.term()
    while self.match(TokenType.EQUAL, TokenType.NOT_EQUAL, ...):
        op    = self.previous()
        right = self.term()
        left  = Binary(left, op, right)
    return left`}</Block>

      <H2 id="ast-nodes">AST node types</H2>
      <P>
        Every node is an immutable <code className="font-mono text-xs">@dataclass</code>.
        The parser builds the tree; the interpreter reads it without modification.
      </P>

      <div className="rounded-xl border overflow-hidden mb-8">
        <div className="grid grid-cols-[160px_1fr] border-b px-5 py-2.5 font-mono text-xs text-muted-foreground"
          style={{ background: "hsl(var(--code-bg))", borderColor: "hsl(var(--border))" }}>
          <span>node type</span><span>fields</span>
        </div>
        {[
          ["Statements", ""],
          ["Program",     "statements: list[Stmt]"],
          ["Block",       "statements: list[Stmt]"],
          ["Print",       "expression: Expr"],
          ["Declaration", "name: str, initializer: Expr"],
          ["Assignment",  "name: str, value: Expr"],
          ["If",          "condition: Expr, then_branch: Block, else_branch: Block | None"],
          ["While",       "body: Block, condition: Expr  (body runs before condition is checked)"],
          ["Break",       "(no fields)"],
          ["Continue",    "(no fields)"],
          ["Expressions", ""],
          ["Literal",     "value: int | float | str | bool | None"],
          ["Variable",    "name: str"],
          ["Binary",      "left: Expr, operator: Token, right: Expr"],
          ["Unary",       "operator: Token, right: Expr"],
          ["Input",       "(no fields) - evaluates bapu tame bolo at runtime"],
        ].map(([name, fields], i) => {
          const isHeader = fields === "";
          return (
            <div key={`${name}-${i}`} className="grid grid-cols-[160px_1fr] px-5 py-2 text-xs"
              style={{ background: isHeader ? "hsl(var(--muted) / 0.3)" : "hsl(var(--code-bg))", borderTop: i > 0 ? "1px solid hsl(var(--border))" : undefined }}>
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

      <Block label="source">{`kem bhai
  aa x che 10
  jo x > 5 {
    bhai bol "big"
  } nahi to {
    bhai bol "small"
  }
aavjo bhai`}</Block>

      <MermaidChart label="resulting AST" chart={`graph TD
    P["Program"]
    D["Declaration\nname = x"]
    L1["Literal(10)"]
    I["If"]
    C["Binary\nop: >"]
    V["Variable(x)"]
    L2["Literal(5)"]
    TB["then: Print"]
    L3["Literal('big')"]
    EB["else: Print"]
    L4["Literal('small')"]

    P --> D & I
    D --> L1
    I --> C & TB & EB
    C --> V & L2
    TB --> L3
    EB --> L4`} />

      <P>
        The AST contains no braces, no <code className="font-mono text-xs">che</code>,
        no <code className="font-mono text-xs">jo</code>, no <code className="font-mono text-xs">nahi to</code>.
        The parser consumed those tokens to understand structure, then discarded them.
      </P>

      <H2 id="errors">Parse errors</H2>
      <P>
        The parser raises <code className="font-mono text-xs">ParseError</code> when the current token
        does not match what the grammar expects. It reports both the expected token and the actual one found.
      </P>
      <Block label="example error messages">{`ParseError: expected '{' after 'jo' condition at line 3, column 14
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
