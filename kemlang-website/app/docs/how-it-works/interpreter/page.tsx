import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "The Interpreter",
  description: "How kemlang-py's tree-walking interpreter executes the AST. Environments, scopes, control flow, and I/O.",
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

      <div className="grid grid-cols-3 gap-3 mb-10 text-center">
        {[
          { label: "Input",  val: "Program",     sub: "root AST node" },
          { label: "Output", val: "int",          sub: "exit code (0 or 1)" },
          { label: "Source", val: "interpreter.py", sub: "271 lines" },
        ].map(c => (
          <div key={c.label} className="rounded-xl border p-4" style={{ background: "hsl(var(--code-bg))" }}>
            <p className="font-mono text-[10px] text-muted-foreground mb-1">{c.label}</p>
            <p className="font-mono text-xs font-semibold" style={{ color: "hsl(var(--kw))" }}>{c.val}</p>
            <p className="font-mono text-[10px] text-muted-foreground mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <H2 id="tree-walking">What is a tree-walking interpreter?</H2>
      <P>
        A tree-walking interpreter executes a program by recursively walking its AST. For each node
        it visits, it calls the appropriate handler method. No intermediate representation (bytecode,
        machine code) is produced - the AST is the only thing the interpreter ever operates on.
      </P>
      <P>
        Compared to compiled or bytecode approaches, a tree-walker is the simplest possible execution strategy.
        It is also the slowest - every variable lookup, every arithmetic operation, every conditional branch
        requires a Python function call and a runtime type dispatch. But for a scripting language where
        startup time and clarity matter more than raw throughput, this is the right trade-off.
      </P>

      <Diagram label="execution strategies compared">{`  NATIVE COMPILED  (C, Rust, Go)
  Source ──▶ Compiler ──▶ x86 binary ──▶ CPU executes directly
  Speed: fastest.  Build step: required.  Complexity: very high.

  BYTECODE VM  (CPython, JVM, Lua)
  Source ──▶ Compiler ──▶ bytecode ──▶ virtual machine interprets
  Speed: fast.  Build step: implicit on run.  Complexity: high.

  TREE-WALKING  (kemlang-py, early Ruby 1.x, MRI before YARV)
  Source ──▶ Lexer ──▶ Parser ──▶ AST ──▶ walk and execute directly
  Speed: slow.  Build step: none.  Complexity: low.
  Best for: scripting, education, rapid prototyping.`}</Diagram>

      <H2 id="execute-evaluate">Execute vs. evaluate</H2>
      <P>
        The interpreter has two recursive entry points: <code className="font-mono text-xs">execute()</code>
        for statements and <code className="font-mono text-xs">evaluate()</code> for expressions.
        The split matches the language&apos;s grammar: statements produce side effects (printing, assigning),
        expressions produce values.
      </P>

      <Block label="kemlang/interpreter.py - the two dispatch methods">{`def execute(self, stmt: Stmt):
    """Execute a statement - produces side effects, returns nothing."""
    if isinstance(stmt, Print):       return self.execute_print(stmt)
    if isinstance(stmt, Declaration): return self.execute_declaration(stmt)
    if isinstance(stmt, Assignment):  return self.execute_assignment(stmt)
    if isinstance(stmt, If):          return self.execute_if(stmt)
    if isinstance(stmt, While):       return self.execute_while(stmt)
    if isinstance(stmt, Block):       return self.execute_block(stmt)
    if isinstance(stmt, Break):       raise BreakError()
    if isinstance(stmt, Continue):    raise ContinueError()

def evaluate(self, expr: Expr) -> KemValue:
    """Evaluate an expression - returns a KemValue, no side effects."""
    if isinstance(expr, Literal):  return expr.value
    if isinstance(expr, Variable): return self.environment.get(expr.name)
    if isinstance(expr, Binary):   return self.evaluate_binary(expr)
    if isinstance(expr, Unary):    return self.evaluate_unary(expr)
    if isinstance(expr, Input):    return self.input_fn().rstrip("\\n")`}</Block>

      <P>
        Notice that <code className="font-mono text-xs">execute()</code> dispatches on the node type with
        <code className="font-mono text-xs"> isinstance()</code> checks. This is the visitor pattern without
        the boilerplate - Python&apos;s dynamic typing makes it readable without implementing abstract visitor classes.
      </P>

      <H2 id="environment">Environments and variable scope</H2>
      <P>
        Variables are stored in an <code className="font-mono text-xs">Environment</code> - a dictionary
        (<code className="font-mono text-xs">dict[str, KemValue]</code>) with a reference to an optional
        parent environment. The interpreter always has a current environment; it starts as the global
        environment and is temporarily replaced when entering a block.
      </P>

      <Block label="kemlang/interpreter.py - the Environment class">{`class Environment:
    def __init__(self, enclosing: Optional["Environment"] = None):
        self.values: dict[str, KemValue] = {}
        self.enclosing = enclosing           # parent environment

    def define(self, name: str, value: KemValue):
        if name in self.values:
            raise RuntimeError(f"Variable '{name}' already declared in this scope")
        self.values[name] = value            # aa x che 10

    def get(self, name: str) -> KemValue:
        if name in self.values:
            return self.values[name]
        if self.enclosing:
            return self.enclosing.get(name)  # walk up the chain
        raise RuntimeError(f"Undefined variable '{name}'")

    def assign(self, name: str, value: KemValue):
        if name in self.values:
            self.values[name] = value
            return
        if self.enclosing:
            self.enclosing.assign(name, value)  # assign in parent if not local
            return
        raise RuntimeError(f"Undefined variable '{name}'")`}</Block>

      <P>
        When <code className="font-mono text-xs">execute_block()</code> is called (for an if-body or while-body),
        it creates a new <code className="font-mono text-xs">Environment</code> with the current environment
        as its parent. All variable declarations inside the block go into this new environment. When the
        block exits (even via exception), the interpreter restores the previous environment.
      </P>

      <Diagram label="environment chain for a nested program">{`  kem bhai
    aa x che 10          <- defined in global env
    aa n che 5           <- defined in global env
    farvu {
      aa i che 1         <- defined in while-body env (local)
      jo i > 0 {
        aa temp che i    <- defined in if-body env (local to if)
      }
    } jya sudhi i <= n

  ┌─────────────────────────────────────────────────────┐
  │  If-body Environment  (innermost)                   │
  │  values: { temp: 1 }                                │
  │  enclosing ──────────────────────────────────────┐  │
  └──────────────────────────────────────────────────┼──┘
                                                     │  lookup walks up
  ┌──────────────────────────────────────────────────▼──┐
  │  While-body Environment                             │
  │  values: { i: 1 }                                   │
  │  enclosing ──────────────────────────────────────┐  │
  └──────────────────────────────────────────────────┼──┘
                                                     │
  ┌──────────────────────────────────────────────────▼──┐
  │  Global Environment                                  │
  │  values: { x: 10, n: 5 }                            │
  │  enclosing: None                                     │
  └─────────────────────────────────────────────────────┘

  Reading 'n' from inside the while body:
    while-body.get("n") -> not found -> enclosing.get("n")
    global.get("n")     -> found! -> returns 5`}</Diagram>

      <Block label="kemlang/interpreter.py - execute_block creates and restores scope">{`def execute_block(self, stmt: Block):
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
        immediately - a <code className="font-mono text-xs">break</code> inside three nested function calls
        must exit the loop that&apos;s several levels up the Python call stack.
      </P>
      <P>
        kemlang-py uses Python exceptions for this. When the interpreter visits a
        <code className="font-mono text-xs"> Break</code> node, it raises
        <code className="font-mono text-xs"> BreakError</code>. The
        <code className="font-mono text-xs"> execute_while</code> method catches it and exits the loop.
        This avoids threading a <code className="font-mono text-xs">should_break</code> flag through
        every recursive call - the exception automatically propagates to exactly the right catch site.
      </P>

      <Block label="kemlang/interpreter.py - while loop with break/continue">{`def execute_while(self, stmt: While):
    """farvu { body } jya sudhi condition
    Note: body executes FIRST, then condition is checked (do-while semantics)."""
    try:
        while True:
            with contextlib.suppress(ContinueError):
                self.execute(stmt.body)    # execute the block

            # check condition AFTER body
            condition = self.evaluate(stmt.condition)
            if not self.is_truthy(condition):
                break                      # normal exit

    except BreakError:
        pass  # tame jao -> exit immediately`}</Block>

      <Diagram label="execution trace for: farvu { bhai bol i  i che i + 1 } jya sudhi i <= 3">{`  i starts at 1 (declared before the loop)

  Iteration 1:
    execute(Block)
      -> execute(Print)    -> evaluate Literal(i) -> get i=1 -> output "1"
      -> execute(Assignment) -> evaluate i+1 = 2  -> assign i=2
    evaluate condition: i <= 3  ->  2 <= 3  ->  True  ->  continue

  Iteration 2:
    execute(Block)
      -> execute(Print)    -> output "2"
      -> execute(Assignment) -> assign i=3
    evaluate condition: 3 <= 3  ->  True  ->  continue

  Iteration 3:
    execute(Block)
      -> execute(Print)    -> output "3"
      -> execute(Assignment) -> assign i=4
    evaluate condition: 4 <= 3  ->  False  ->  break

  Final output: 1  2  3  (each on its own line)`}</Diagram>

      <H2 id="io">Input and output</H2>
      <P>
        <code className="font-mono text-xs">bhai bol</code> (print) evaluates its expression and calls
        Python&apos;s <code className="font-mono text-xs">print()</code> via a configurable
        <code className="font-mono text-xs"> output_fn</code> callback. Using a callback rather than
        calling <code className="font-mono text-xs">print()</code> directly allows the test suite to
        capture output without monkey-patching builtins.
      </P>
      <P>
        <code className="font-mono text-xs">bapu tame bolo</code> (read input) is an
        <code className="font-mono text-xs"> Input</code> expression node. When evaluated, it calls
        Python&apos;s <code className="font-mono text-xs">input()</code> via the configurable
        <code className="font-mono text-xs"> input_fn</code> and strips the trailing newline.
        The result is a string; if it looks like a number, the binary operators will auto-coerce it.
      </P>

      <Block label="kemlang/interpreter.py - print and input">{`def execute_print(self, stmt: Print):
    value = self.evaluate(stmt.expression)
    self.output_fn(self.stringify(value))    # calls print() by default

def evaluate(self, expr: Expr) -> KemValue:
    ...
    if isinstance(expr, Input):
        return self.input_fn().rstrip("\\n") # calls input() by default

# The Interpreter constructor:
def __init__(
    self,
    input_fn:  Callable[[], str]         = input,   # overridable for tests
    output_fn: Callable[[str], None]     = print,   # overridable for tests
):`}</Block>

      <H2 id="errors">Error handling</H2>
      <P>
        The interpreter catches <code className="font-mono text-xs">RuntimeError</code> at the top level
        of <code className="font-mono text-xs">interpret()</code>. Any unhandled runtime error - undefined
        variable, type mismatch, division by zero - propagates up to this catch site, prints the error
        message to stdout, and returns exit code 1.
      </P>

      <Block label="kemlang/interpreter.py - top-level error handling">{`def interpret(self, program: Program) -> int:
    try:
        for statement in program.statements:
            self.execute(statement)
        return 0                              # success
    except RuntimeError as e:
        self.output_fn(f"Runtime Error: {e.message}")
        return 1                              # error`}</Block>

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
