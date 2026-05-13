import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H2, P, Diagram, Block, StageStats } from "@/components/hiw";

export const metadata: Metadata = {
  title: "The Interpreter",
  description: "How kemlang-py's tree-walking interpreter executes the AST. Environments, scopes, control flow, and I/O.",
};

export default function InterpreterPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10 pb-8 border-b">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">How it works</p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          The Interpreter
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          The interpreter is where the program actually runs. It walks the AST node by node, executing
          statements and evaluating expressions, managing variable scope through a chain of environments.
        </p>
      </div>

      <StageStats input="Program" output="int" source="interpreter.py" lines={271} />

      <H2 id="tree-walking">What is a tree-walking interpreter?</H2>
      <P>
        A tree-walking interpreter executes a program by recursively visiting each node in the AST and
        calling the appropriate handler. No intermediate representation (bytecode, machine code) is produced.
        The AST is the only thing the interpreter ever operates on.
      </P>

      <Diagram label="execution strategies compared">{`
  NATIVE COMPILED  (C, Rust, Go)
  ─────────────────────────────────────────────────────────────────────
  Source ──▶ Compiler ──▶ x86 machine code ──▶ CPU executes directly
  Speed: fastest   Complexity: very high   Build step: required

  BYTECODE VM  (CPython, JVM, Lua)
  ─────────────────────────────────────────────────────────────────────
  Source ──▶ Compiler ──▶ bytecode ──▶ virtual machine interprets
  Speed: fast   Complexity: high   Build step: implicit on first run

  TREE-WALKING  (kemlang-py, early Ruby 1.x, MRI before YARV)
  ─────────────────────────────────────────────────────────────────────
  Source ──▶ Lexer ──▶ Parser ──▶ AST ──▶ walk and execute directly
  Speed: slow   Complexity: low   Build step: none
  Best for: scripting, education, rapid prototyping`}</Diagram>

      <H2 id="execute-evaluate">Execute vs. evaluate</H2>
      <P>
        The interpreter has two recursive entry points.
        <code className="font-mono text-xs"> execute()</code> handles statements - it produces side effects
        (printing, assigning variables) and returns nothing.
        <code className="font-mono text-xs"> evaluate()</code> handles expressions - it returns a
        <code className="font-mono text-xs"> KemValue</code>.
      </P>

      <Block label="kemlang/interpreter.py - the two dispatch methods">{`def execute(self, stmt: Stmt):
    """Execute a statement - side effects only, no return value."""
    if isinstance(stmt, Print):       return self.execute_print(stmt)
    if isinstance(stmt, Declaration): return self.execute_declaration(stmt)
    if isinstance(stmt, Assignment):  return self.execute_assignment(stmt)
    if isinstance(stmt, If):          return self.execute_if(stmt)
    if isinstance(stmt, While):       return self.execute_while(stmt)
    if isinstance(stmt, Block):       return self.execute_block(stmt)
    if isinstance(stmt, Break):       raise BreakError()
    if isinstance(stmt, Continue):    raise ContinueError()

def evaluate(self, expr: Expr) -> KemValue:
    """Evaluate an expression - returns a KemValue."""
    if isinstance(expr, Literal):  return expr.value
    if isinstance(expr, Variable): return self.environment.get(expr.name)
    if isinstance(expr, Binary):   return self.evaluate_binary(expr)
    if isinstance(expr, Unary):    return self.evaluate_unary(expr)
    if isinstance(expr, Input):    return self.input_fn().rstrip("\\n")`}</Block>

      <H2 id="environment">Environments and variable scope</H2>
      <P>
        Variables are stored in an <code className="font-mono text-xs">Environment</code> - a dict
        (<code className="font-mono text-xs">dict[str, KemValue]</code>) with a reference to an optional
        parent. The interpreter always has a current environment; it starts as global and is temporarily
        replaced when entering a block.
      </P>

      <Block label="kemlang/interpreter.py - Environment class">{`class Environment:
    def __init__(self, enclosing: Optional["Environment"] = None):
        self.values: dict[str, KemValue] = {}
        self.enclosing = enclosing          # parent environment

    def define(self, name: str, value: KemValue):
        if name in self.values:
            raise RuntimeError(f"Variable '{name}' already declared")
        self.values[name] = value

    def get(self, name: str) -> KemValue:
        if name in self.values:
            return self.values[name]
        if self.enclosing:
            return self.enclosing.get(name) # walk up the chain
        raise RuntimeError(f"Undefined variable '{name}'")

    def assign(self, name: str, value: KemValue):
        if name in self.values:
            self.values[name] = value
            return
        if self.enclosing:
            self.enclosing.assign(name, value)
            return
        raise RuntimeError(f"Undefined variable '{name}'")`}</Block>

      <Diagram label="environment chain for nested blocks">{`
  kem bhai
    aa x che 10      <- Global env
    aa n che 5       <- Global env
    farvu {
      aa i che 1     <- While-body env  (local)
      jo i > 0 {
        aa t che i   <- If-body env     (local to if)
      }
    } jya sudhi i <= n

  ┌──────────────────────────────────────────────┐
  │  If-body Environment                         │
  │  values: { t: 1 }                            │
  │  enclosing ──────────────────────────────┐   │
  └──────────────────────────────────────────┼───┘
                                             │ parent lookup
  ┌──────────────────────────────────────────▼───┐
  │  While-body Environment                      │
  │  values: { i: 1 }                            │
  │  enclosing ──────────────────────────────┐   │
  └──────────────────────────────────────────┼───┘
                                             │
  ┌──────────────────────────────────────────▼───┐
  │  Global Environment                          │
  │  values: { x: 10, n: 5 }                    │
  │  enclosing: None                             │
  └──────────────────────────────────────────────┘

  Reading 'n' from inside the while body:
    while-env.get("n")  ->  not found
    -> global.get("n")  ->  found! returns 5`}</Diagram>

      <Block label="kemlang/interpreter.py - execute_block pushes and pops scope">{`def execute_block(self, stmt: Block):
    previous = self.environment
    try:
        self.environment = Environment(self.environment)  # push new scope
        for statement in stmt.statements:
            self.execute(statement)
    finally:
        self.environment = previous  # always restore, even on exception`}</Block>

      <H2 id="control-flow">Control flow via Python exceptions</H2>
      <P>
        <code className="font-mono text-xs">tame jao</code> (break) and
        <code className="font-mono text-xs"> aagal vado</code> (continue) need to unwind the call stack
        instantly, potentially through several nested recursive calls. kemlang-py raises Python exceptions
        instead of threading a flag through every call frame.
      </P>

      <Block label="kemlang/interpreter.py - while loop with break/continue">{`def execute_while(self, stmt: While):
    """farvu { body } jya sudhi condition
    Note: body executes FIRST, condition checked AFTER (do-while semantics)."""
    try:
        while True:
            with contextlib.suppress(ContinueError):
                self.execute(stmt.body)   # run the block
            condition = self.evaluate(stmt.condition)
            if not self.is_truthy(condition):
                break                     # normal loop exit
    except BreakError:
        pass  # tame jao -> exit immediately`}</Block>

      <Diagram label="execution trace - farvu { bhai bol i  i che i + 1 } jya sudhi i <= 3">{`
  i = 1 (declared before loop)

  Iter 1:
    execute(Block)
      execute(Print)      evaluate Variable("i") -> 1  -> output "1"
      execute(Assignment) evaluate Binary(i+1)   -> 2  -> assign i=2
    evaluate condition: i <= 3  ->  2 <= 3  ->  True  continue

  Iter 2:
    execute(Block)
      execute(Print)      -> output "2"
      execute(Assignment) -> i=3
    evaluate condition: 3 <= 3  ->  True  continue

  Iter 3:
    execute(Block)
      execute(Print)      -> output "3"
      execute(Assignment) -> i=4
    evaluate condition: 4 <= 3  ->  False  break

  stdout: "1"  "2"  "3"  (each on its own line)`}</Diagram>

      <H2 id="io">Input and output</H2>
      <P>
        Both I/O operations use configurable callbacks so tests can capture output without patching builtins.
      </P>

      <Block label="kemlang/interpreter.py - I/O">{`def __init__(
    self,
    input_fn:  Callable[[], str]        = input,   # overridable for tests
    output_fn: Callable[[str], None]    = print,   # overridable for tests
):
    ...

def execute_print(self, stmt: Print):
    value = self.evaluate(stmt.expression)
    self.output_fn(self.stringify(value))   # calls print() by default

# Input is an expression node, evaluated when encountered:
if isinstance(expr, Input):
    return self.input_fn().rstrip("\\n")    # calls input() by default`}</Block>

      <H2 id="errors">Error handling</H2>
      <Block label="kemlang/interpreter.py - top-level catch">{`def interpret(self, program: Program) -> int:
    try:
        for statement in program.statements:
            self.execute(statement)
        return 0                               # success
    except RuntimeError as e:
        self.output_fn(f"Runtime Error: {e.message}")
        return 1                               # error -> exit code 1`}</Block>

      <div className="mt-12 pt-8 border-t flex items-center justify-between">
        <Link href="/docs/how-it-works/parser" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          The Parser
        </Link>
        <Link href="/docs/how-it-works/runtime" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80">
          Runtime and Types <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
