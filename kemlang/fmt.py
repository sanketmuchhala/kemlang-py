from .parser import parse_program
from .types import (
    Assignment,
    Binary,
    Block,
    Break,
    Continue,
    Declaration,
    Expr,
    If,
    Input,
    Literal,
    Print,
    Program,
    Stmt,
    TokenType,
    Unary,
    Variable,
    While,
)


class Formatter:
    def __init__(self):
        self.indent_level = 0
        self.output: list[str] = []

    def format_program(self, program: Program) -> str:
        """Format a complete program."""
        self.output = []
        self.indent_level = 0

        self.emit("kem bhai")
        self.newline()

        for stmt in program.statements:
            self.format_statement(stmt)
            self.newline()

        self.emit("aavjo bhai")
        self.newline()

        return "".join(self.output).rstrip() + "\n"

    def format_statement(self, stmt: Stmt):
        """Format a statement."""
        if isinstance(stmt, Print):
            self.format_print(stmt)
        elif isinstance(stmt, Declaration):
            self.format_declaration(stmt)
        elif isinstance(stmt, Assignment):
            self.format_assignment(stmt)
        elif isinstance(stmt, If):
            self.format_if(stmt)
        elif isinstance(stmt, While):
            self.format_while(stmt)
        elif isinstance(stmt, Block):
            self.format_block(stmt)
        elif isinstance(stmt, Break):
            self.emit("tame jao")
        elif isinstance(stmt, Continue):
            self.emit("aagal vado")

    def format_print(self, stmt: Print):
        self.emit("bhai bol ")
        self.format_expression(stmt.expression)

    def format_declaration(self, stmt: Declaration):
        self.emit(f"aa {stmt.name} che ")
        self.format_expression(stmt.initializer)

    def format_assignment(self, stmt: Assignment):
        self.emit(f"{stmt.name} che ")
        self.format_expression(stmt.value)

    def format_if(self, stmt: If):
        self.emit("jo ")
        self.format_expression(stmt.condition)
        self.emit(" {")
        self.newline()
        self.indent()
        self.format_block_contents(stmt.then_branch)
        self.dedent()
        self.emit("}")

        if stmt.else_branch:
            self.emit(" nahi to {")
            self.newline()
            self.indent()
            self.format_block_contents(stmt.else_branch)
            self.dedent()
            self.emit("}")

    def format_while(self, stmt: While):
        self.emit("farvu {")
        self.newline()
        self.indent()
        self.format_block_contents(stmt.body)
        self.dedent()
        self.emit("} jya sudhi ")
        self.format_expression(stmt.condition)

    def format_block(self, block: Block):
        self.emit("{")
        self.newline()
        self.indent()
        self.format_block_contents(block)
        self.dedent()
        self.emit("}")

    def format_block_contents(self, block: Block):
        """Format the contents of a block without the braces."""
        for stmt in block.statements:
            self.format_statement(stmt)
            self.newline()

    def format_expression(self, expr: Expr):
        """Format an expression."""
        if isinstance(expr, Literal):
            self.format_literal(expr)
        elif isinstance(expr, Variable):
            self.emit(expr.name)
        elif isinstance(expr, Binary):
            self.format_binary(expr)
        elif isinstance(expr, Unary):
            self.format_unary(expr)
        elif isinstance(expr, Input):
            self.emit("bapu tame bolo")

    def format_literal(self, expr: Literal):
        value = expr.value
        if isinstance(value, str):
            # Escape special characters
            escaped = (
                value.replace("\\", "\\\\")
                .replace('"', '\\"')
                .replace("\n", "\\n")
                .replace("\t", "\\t")
            )
            self.emit(f'"{escaped}"')
        elif isinstance(value, bool):
            self.emit("bhai chhe" if value else "bhai nathi")
        else:
            self.emit(str(value))

    def format_binary(self, expr: Binary):
        # Add parentheses for clarity with complex expressions
        needs_parens = isinstance(expr.left, Binary) and self.needs_parentheses(expr.left, expr)

        if needs_parens:
            self.emit("(")
        self.format_expression(expr.left)
        if needs_parens:
            self.emit(")")

        self.emit(f" {expr.operator.lexeme} ")

        needs_parens = isinstance(expr.right, Binary) and self.needs_parentheses(expr.right, expr)
        if needs_parens:
            self.emit("(")
        self.format_expression(expr.right)
        if needs_parens:
            self.emit(")")

    def format_unary(self, expr: Unary):
        self.emit(expr.operator.lexeme)
        if isinstance(expr.right, Binary):
            self.emit("(")
            self.format_expression(expr.right)
            self.emit(")")
        else:
            self.format_expression(expr.right)

    def needs_parentheses(self, child: Binary, parent: Binary) -> bool:
        """Determine if child expression needs parentheses."""
        precedence = {
            TokenType.MULTIPLY: 3,
            TokenType.DIVIDE: 3,
            TokenType.MODULO: 3,
            TokenType.PLUS: 2,
            TokenType.MINUS: 2,
            TokenType.GREATER: 1,
            TokenType.GREATER_EQUAL: 1,
            TokenType.LESS: 1,
            TokenType.LESS_EQUAL: 1,
            TokenType.EQUAL: 0,
            TokenType.NOT_EQUAL: 0,
        }

        child_prec = precedence.get(child.operator.type, 0)
        parent_prec = precedence.get(parent.operator.type, 0)

        return child_prec < parent_prec

    def emit(self, text: str):
        """Emit text at current indentation."""
        if self.output and self.output[-1].endswith("\n"):
            self.output.append("  " * self.indent_level)
        self.output.append(text)

    def newline(self):
        """Emit a newline."""
        self.output.append("\n")

    def indent(self):
        """Increase indentation level."""
        self.indent_level += 1

    def dedent(self):
        """Decrease indentation level."""
        self.indent_level = max(0, self.indent_level - 1)


def format_code(source: str) -> str:
    """Format KemLang source code."""
    try:
        program = parse_program(source)
        formatter = Formatter()
        return formatter.format_program(program)
    except Exception as e:
        raise ValueError(f"Cannot format invalid code: {str(e)}") from e
