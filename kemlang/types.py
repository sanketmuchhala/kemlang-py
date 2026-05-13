from dataclasses import dataclass
from enum import Enum, auto
from typing import Any


class TokenType(Enum):
    # Literals
    INTEGER = auto()
    FLOAT = auto()
    STRING = auto()
    BOOLEAN = auto()
    IDENTIFIER = auto()

    # Keywords
    KEM_BHAI = auto()  # "kem bhai"
    AAVJO_BHAI = auto()  # "aavjo bhai"
    BHAI_BOL = auto()  # "bhai bol"
    AA = auto()  # "aa"
    CHE = auto()  # "che"
    JO = auto()  # "jo"
    NAHI = auto()  # "nahi"
    TO = auto()  # "to"
    ELSE = auto()  # "nahi to" (combined)
    FARVU = auto()  # "farvu"
    JYA_SUDHI = auto()  # "jya sudhi"
    TAME_JAO = auto()  # "tame jao"
    AAGAL_VADO = auto()  # "aagal vado"
    BAPU_TAME_BOLO = auto()  # "bapu tame bolo"
    BHAI_CHHE = auto()  # "bhai chhe" (true)
    BHAI_NATHI = auto()  # "bhai nathi" (false)

    # Operators
    PLUS = auto()  # "+"
    MINUS = auto()  # "-"
    MULTIPLY = auto()  # "*"
    DIVIDE = auto()  # "/"
    MODULO = auto()  # "%"
    EQUAL = auto()  # "=="
    NOT_EQUAL = auto()  # "!="
    LESS = auto()  # "<"
    GREATER = auto()  # ">"
    LESS_EQUAL = auto()  # "<="
    GREATER_EQUAL = auto()  # ">="

    # Delimiters
    LEFT_PAREN = auto()  # "("
    RIGHT_PAREN = auto()  # ")"
    LEFT_BRACE = auto()  # "{"
    RIGHT_BRACE = auto()  # "}"

    # Special
    NEWLINE = auto()
    EOF = auto()


@dataclass
class Token:
    type: TokenType
    lexeme: str
    line: int
    col: int
    literal: Any = None


# AST Node base classes
@dataclass
class ASTNode:
    pass


@dataclass
class Stmt(ASTNode):
    pass


@dataclass
class Expr(ASTNode):
    pass


# Statements
@dataclass
class Program(ASTNode):
    statements: list[Stmt]


@dataclass
class Block(ASTNode):
    statements: list[Stmt]


@dataclass
class Print(Stmt):
    expression: Expr


@dataclass
class Declaration(Stmt):
    name: str
    initializer: Expr


@dataclass
class Assignment(Stmt):
    name: str
    value: Expr


@dataclass
class If(Stmt):
    condition: Expr
    then_branch: Block
    else_branch: Block | None = None


@dataclass
class While(Stmt):
    body: Block
    condition: Expr


@dataclass
class Break(Stmt):
    pass


@dataclass
class Continue(Stmt):
    pass


# Expressions
@dataclass
class Binary(Expr):
    left: Expr
    operator: Token
    right: Expr


@dataclass
class Unary(Expr):
    operator: Token
    right: Expr


@dataclass
class Literal(Expr):
    value: Any


@dataclass
class Variable(Expr):
    name: str


@dataclass
class Input(Expr):
    pass


# Runtime value types
KemValue = int | float | str | bool | None
