from .errors import ParseError
from .lexer import tokenize
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
    Token,
    TokenType,
    Unary,
    Variable,
    While,
)


class Parser:
    def __init__(self, tokens: list[Token]):
        self.tokens = [t for t in tokens if t.type != TokenType.NEWLINE]  # Filter out newlines
        self.current = 0

    def parse(self) -> Program:
        """Parse a complete program."""
        # Skip to program start
        if not self.check(TokenType.KEM_BHAI):
            self.error("Program must start with 'kem bhai'")

        self.advance()  # consume 'kem bhai'

        statements = []
        while not self.check(TokenType.AAVJO_BHAI) and not self.is_at_end():
            stmt = self.statement()
            if stmt:
                statements.append(stmt)

        if not self.match(TokenType.AAVJO_BHAI):
            self.error("Program must end with 'aavjo bhai'")

        return Program(statements)

    def statement(self) -> Stmt | None:
        """Parse a statement."""
        if self.match(TokenType.BHAI_BOL):
            return self.print_statement()
        if self.match(TokenType.AA):
            return self.declaration()
        if self.match(TokenType.JO):
            return self.if_statement()
        if self.match(TokenType.FARVU):
            return self.while_statement()
        if self.match(TokenType.TAME_JAO):
            return Break()
        if self.match(TokenType.AAGAL_VADO):
            return Continue()
        if self.check(TokenType.IDENTIFIER):
            return self.assignment()

        # Skip unknown tokens for error recovery
        self.advance()
        return None

    def print_statement(self) -> Print:
        """Parse: bhai bol <expr>"""
        expr = self.expression()
        return Print(expr)

    def declaration(self) -> Declaration:
        """Parse: aa <id> che <expr>"""
        if not self.check(TokenType.IDENTIFIER):
            self.error("Expected variable name after 'aa'")

        name = self.advance().lexeme

        if not self.match(TokenType.CHE):
            self.error("Expected 'che' after variable name")

        expr = self.expression()
        return Declaration(name, expr)

    def assignment(self) -> Assignment:
        """Parse: <id> che <expr>"""
        name = self.advance().lexeme

        if not self.match(TokenType.CHE):
            self.error("Expected 'che' after variable name")

        expr = self.expression()
        return Assignment(name, expr)

    def if_statement(self) -> If:
        """Parse: jo <expr> { ... } [nahi to { ... }]"""
        condition = self.expression()

        if not self.match(TokenType.LEFT_BRACE):
            self.error("Expected '{' after if condition")

        then_branch = self.block()

        else_branch = None
        if self.match(TokenType.ELSE):
            if not self.match(TokenType.LEFT_BRACE):
                self.error("Expected '{' after 'nahi to'")
            else_branch = self.block()

        return If(condition, then_branch, else_branch)

    def while_statement(self) -> While:
        """Parse: farvu { ... } jya sudhi <expr>"""
        if not self.match(TokenType.LEFT_BRACE):
            self.error("Expected '{' after 'farvu'")

        body = self.block()

        if not self.match(TokenType.JYA_SUDHI):
            self.error("Expected 'jya sudhi' after while body")

        condition = self.expression()
        return While(body, condition)

    def block(self) -> Block:
        """Parse a block of statements between braces."""
        statements = []

        while not self.check(TokenType.RIGHT_BRACE) and not self.is_at_end():
            stmt = self.statement()
            if stmt:
                statements.append(stmt)

        if not self.match(TokenType.RIGHT_BRACE):
            self.error("Expected '}' after block")

        return Block(statements)

    # Expression parsing using Pratt parser precedence
    def expression(self) -> Expr:
        """Parse expression (lowest precedence)."""
        return self.equality()

    def equality(self) -> Expr:
        """Parse equality: ==, !="""
        expr = self.comparison()

        while self.match(TokenType.EQUAL, TokenType.NOT_EQUAL):
            operator = self.previous()
            right = self.comparison()
            expr = Binary(expr, operator, right)

        return expr

    def comparison(self) -> Expr:
        """Parse comparison: >, >=, <, <="""
        expr = self.term()

        while self.match(
            TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL
        ):
            operator = self.previous()
            right = self.term()
            expr = Binary(expr, operator, right)

        return expr

    def term(self) -> Expr:
        """Parse addition/subtraction: +, -"""
        expr = self.factor()

        while self.match(TokenType.PLUS, TokenType.MINUS):
            operator = self.previous()
            right = self.factor()
            expr = Binary(expr, operator, right)

        return expr

    def factor(self) -> Expr:
        """Parse multiplication/division/modulo: *, /, %"""
        expr = self.unary()

        while self.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO):
            operator = self.previous()
            right = self.unary()
            expr = Binary(expr, operator, right)

        return expr

    def unary(self) -> Expr:
        """Parse unary operators: -"""
        if self.match(TokenType.MINUS):
            operator = self.previous()
            right = self.unary()
            return Unary(operator, right)

        return self.primary()

    def primary(self) -> Expr:
        """Parse primary expressions."""
        if self.match(TokenType.BHAI_CHHE):
            return Literal(True)

        if self.match(TokenType.BHAI_NATHI):
            return Literal(False)

        if self.match(TokenType.INTEGER):
            return Literal(self.previous().literal)

        if self.match(TokenType.FLOAT):
            return Literal(self.previous().literal)

        if self.match(TokenType.STRING):
            return Literal(self.previous().literal)

        if self.match(TokenType.IDENTIFIER):
            return Variable(self.previous().lexeme)

        if self.match(TokenType.BAPU_TAME_BOLO):
            return Input()

        if self.match(TokenType.LEFT_PAREN):
            expr = self.expression()
            if not self.match(TokenType.RIGHT_PAREN):
                self.error("Expected ')' after expression")
            return expr

        self.error(f"Unexpected token '{self.peek().lexeme}'")

    # Utility methods
    def match(self, *types: TokenType) -> bool:
        """Check if current token matches any of the given types."""
        for token_type in types:
            if self.check(token_type):
                self.advance()
                return True
        return False

    def check(self, token_type: TokenType) -> bool:
        """Check if current token is of given type."""
        if self.is_at_end():
            return False
        return self.peek().type == token_type

    def advance(self) -> Token:
        """Consume current token and return it."""
        if not self.is_at_end():
            self.current += 1
        return self.previous()

    def is_at_end(self) -> bool:
        """Check if we're at the end of tokens."""
        return self.peek().type == TokenType.EOF

    def peek(self) -> Token:
        """Return current token without advancing."""
        return self.tokens[self.current]

    def previous(self) -> Token:
        """Return previous token."""
        return self.tokens[self.current - 1]

    def error(self, message: str):
        """Raise a parse error."""
        current = self.peek()
        raise ParseError(message, current.line, current.col)

    def synchronize(self):
        """Recover from a parse error by advancing to next statement."""
        self.advance()

        while not self.is_at_end():
            # Look for statement starters
            if self.peek().type in [
                TokenType.BHAI_BOL,
                TokenType.AA,
                TokenType.JO,
                TokenType.FARVU,
                TokenType.TAME_JAO,
                TokenType.AAGAL_VADO,
            ]:
                return
            self.advance()


def parse_program(source: str) -> Program:
    """Convenience function to parse source code into an AST."""
    tokens = tokenize(source)
    parser = Parser(tokens)
    return parser.parse()
