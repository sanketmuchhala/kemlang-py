import re
from typing import List, Optional, Dict, Tuple

from .types import Token, TokenType
from .errors import LexerError


class Lexer:
    def __init__(self, source: str):
        self.source = source
        self.tokens: List[Token] = []
        self.start = 0
        self.current = 0
        self.line = 1
        self.col = 1

        # Multi-word keywords (order matters - longer first)
        self.multiword_keywords = [
            ("kem bhai", TokenType.KEM_BHAI),
            ("aavjo bhai", TokenType.AAVJO_BHAI),
            ("bhai bol", TokenType.BHAI_BOL),
            ("bapu tame bolo", TokenType.BAPU_TAME_BOLO),
            ("bhai chhe", TokenType.BHAI_CHHE),
            ("bhai nathi", TokenType.BHAI_NATHI),
            ("jya sudhi", TokenType.JYA_SUDHI),
            ("tame jao", TokenType.TAME_JAO),
            ("aagal vado", TokenType.AAGAL_VADO),
            ("nahi to", TokenType.ELSE),
        ]

        # Single-word keywords
        self.keywords: Dict[str, TokenType] = {
            "aa": TokenType.AA,
            "che": TokenType.CHE,
            "jo": TokenType.JO,
            "nahi": TokenType.NAHI,
            "to": TokenType.TO,
            "farvu": TokenType.FARVU,
            "true": TokenType.BHAI_CHHE,
            "false": TokenType.BHAI_NATHI,
        }

    def tokenize(self) -> List[Token]:
        while not self.is_at_end():
            self.start = self.current
            self.scan_token()

        self.tokens.append(Token(TokenType.EOF, "", self.line, self.col))
        return self.tokens

    def is_at_end(self) -> bool:
        return self.current >= len(self.source)

    def scan_token(self):
        start_col = self.col
        c = self.advance()

        # Whitespace (except newlines)
        if c in ' \t\r':
            return

        # Newlines
        if c == '\n':
            self.add_token(TokenType.NEWLINE)
            self.line += 1
            self.col = 1
            return

        # Single character tokens
        single_chars = {
            '(': TokenType.LEFT_PAREN,
            ')': TokenType.RIGHT_PAREN,
            '{': TokenType.LEFT_BRACE,
            '}': TokenType.RIGHT_BRACE,
            '+': TokenType.PLUS,
            '-': TokenType.MINUS,
            '*': TokenType.MULTIPLY,
            '%': TokenType.MODULO,
        }

        if c in single_chars:
            self.add_token(single_chars[c])
            return

        # Two character operators
        if c == '=':
            if self.match('='):
                self.add_token(TokenType.EQUAL)
            else:
                self.error(f"Unexpected character '='")
            return

        if c == '!':
            if self.match('='):
                self.add_token(TokenType.NOT_EQUAL)
            else:
                self.error(f"Unexpected character '!'")
            return

        if c == '<':
            if self.match('='):
                self.add_token(TokenType.LESS_EQUAL)
            else:
                self.add_token(TokenType.LESS)
            return

        if c == '>':
            if self.match('='):
                self.add_token(TokenType.GREATER_EQUAL)
            else:
                self.add_token(TokenType.GREATER)
            return

        # String literals
        if c == '"' or c == "'":
            self.string(c)
            return

        # Comments or division
        if c == '/':
            if self.match('/'):
                # A comment goes until the end of the line
                while self.peek() != '\n' and not self.is_at_end():
                    self.advance()
            else:
                self.add_token(TokenType.DIVIDE)
            return

        # Numbers
        if c.isdigit():
            self.number()
            return

        # Identifiers and keywords
        if c.isalpha() or c == '_':
            self.identifier_or_keyword()
            return

        self.error(f"Unexpected character '{c}'")

    def advance(self) -> str:
        if self.is_at_end():
            return '\0'
        self.current += 1
        self.col += 1
        return self.source[self.current - 1]

    def match(self, expected: str) -> bool:
        if self.is_at_end():
            return False
        if self.source[self.current] != expected:
            return False
        self.current += 1
        self.col += 1
        return True

    def peek(self) -> str:
        if self.is_at_end():
            return '\0'
        return self.source[self.current]

    def peek_next(self) -> str:
        if self.current + 1 >= len(self.source):
            return '\0'
        return self.source[self.current + 1]

    def string(self, quote_char):
        start_line = self.line
        start_col = self.col - 1

        value = ""
        while self.peek() != quote_char and not self.is_at_end():
            if self.peek() == '\n':
                self.line += 1
                self.col = 1
            elif self.peek() == '\\':
                self.advance()  # consume backslash
                escaped = self.peek()
                if escaped == 'n':
                    value += '\n'
                elif escaped == 't':
                    value += '\t'
                elif escaped == quote_char:
                    value += quote_char
                elif escaped == '\\':
                    value += '\\'
                else:
                    self.error(f"Unknown escape sequence '\\{escaped}'")
                    return
                self.advance()  # consume escaped character
            else:
                value += self.advance()

        if self.is_at_end():
            self.error("Unterminated string", start_line, start_col)
            return

        # Consume closing quote
        self.advance()
        self.add_token(TokenType.STRING, value)

    def number(self):
        while self.peek().isdigit():
            self.advance()

        # Look for a fractional part
        if self.peek() == '.' and self.peek_next().isdigit():
            # Consume the "."
            self.advance()
            while self.peek().isdigit():
                self.advance()
            value = float(self.source[self.start:self.current])
            self.add_token(TokenType.FLOAT, value)
        else:
            value = int(self.source[self.start:self.current])
            self.add_token(TokenType.INTEGER, value)

    def identifier_or_keyword(self):
        # First, try to match multi-word keywords
        remaining_source = self.source[self.start:]

        for keyword, token_type in self.multiword_keywords:
            if remaining_source.startswith(keyword):
                # Check if this is a complete word boundary
                end_pos = self.start + len(keyword)
                if (end_pos >= len(self.source) or
                    not (self.source[end_pos].isalnum() or self.source[end_pos] == '_')):
                    # Update position to end of keyword
                    self.current = end_pos
                    self.col = self.col - 1 + len(keyword)  # -1 because we already advanced once
                    self.add_token(token_type)
                    return

        # If no multi-word keyword matches, scan a regular identifier
        while (self.peek().isalnum() or self.peek() == '_'):
            self.advance()

        text = self.source[self.start:self.current]
        token_type = self.keywords.get(text, TokenType.IDENTIFIER)
        self.add_token(token_type)

    def add_token(self, token_type: TokenType, literal=None):
        text = self.source[self.start:self.current]
        # For multiword tokens, adjust the column to the start
        col = self.col - len(text)
        self.tokens.append(Token(token_type, text, self.line, col, literal))

    def error(self, message: str, line: Optional[int] = None, col: Optional[int] = None):
        if line is None:
            line = self.line
        if col is None:
            col = self.col - 1
        raise LexerError(message, line, col)


def tokenize(source: str) -> List[Token]:
    """Convenience function to tokenize source code."""
    lexer = Lexer(source)
    return lexer.tokenize()