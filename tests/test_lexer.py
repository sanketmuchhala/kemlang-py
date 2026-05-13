import pytest

from kemlang.lexer import LexerError, tokenize
from kemlang.types import TokenType


class TestLexer:
    def test_multiword_keywords(self):
        source = "kem bhai aavjo bhai bhai bol bapu tame bolo"
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.KEM_BHAI
        assert tokens[1].type == TokenType.AAVJO_BHAI
        assert tokens[2].type == TokenType.BHAI_BOL
        assert tokens[3].type == TokenType.BAPU_TAME_BOLO

    def test_single_word_keywords(self):
        source = "aa che jo nahi to farvu"
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.AA
        assert tokens[1].type == TokenType.CHE
        assert tokens[2].type == TokenType.JO
        assert tokens[3].type == TokenType.NAHI
        assert tokens[4].type == TokenType.TO
        assert tokens[5].type == TokenType.FARVU

    def test_compound_keywords(self):
        source = "nahi to jya sudhi tame jao aagal vado"
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.ELSE  # "nahi to" combined
        assert tokens[1].type == TokenType.JYA_SUDHI
        assert tokens[2].type == TokenType.TAME_JAO
        assert tokens[3].type == TokenType.AAGAL_VADO

    def test_boolean_literals(self):
        source = "bhai chhe bhai nathi"
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.BHAI_CHHE
        assert tokens[1].type == TokenType.BHAI_NATHI

    def test_operators(self):
        source = "+ - * / % == != < > <= >="
        tokens = tokenize(source)

        expected = [
            TokenType.PLUS,
            TokenType.MINUS,
            TokenType.MULTIPLY,
            TokenType.DIVIDE,
            TokenType.MODULO,
            TokenType.EQUAL,
            TokenType.NOT_EQUAL,
            TokenType.LESS,
            TokenType.GREATER,
            TokenType.LESS_EQUAL,
            TokenType.GREATER_EQUAL,
        ]

        for i, expected_type in enumerate(expected):
            assert tokens[i].type == expected_type

    def test_delimiters(self):
        source = "( ) { }"
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.LEFT_PAREN
        assert tokens[1].type == TokenType.RIGHT_PAREN
        assert tokens[2].type == TokenType.LEFT_BRACE
        assert tokens[3].type == TokenType.RIGHT_BRACE

    def test_identifiers(self):
        source = "variable _underscore name123"
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.IDENTIFIER
        assert tokens[0].lexeme == "variable"
        assert tokens[1].type == TokenType.IDENTIFIER
        assert tokens[1].lexeme == "_underscore"
        assert tokens[2].type == TokenType.IDENTIFIER
        assert tokens[2].lexeme == "name123"

    def test_integers(self):
        source = "42 0 999"
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.INTEGER
        assert tokens[0].literal == 42
        assert tokens[1].type == TokenType.INTEGER
        assert tokens[1].literal == 0
        assert tokens[2].type == TokenType.INTEGER
        assert tokens[2].literal == 999

    def test_strings(self):
        source = '"hello" "world with spaces"'
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.STRING
        assert tokens[0].literal == "hello"
        assert tokens[1].type == TokenType.STRING
        assert tokens[1].literal == "world with spaces"

    def test_string_escapes(self):
        source = r'"hello\nworld" "tab\there" "quote\"here" "backslash\\"'
        tokens = tokenize(source)

        assert tokens[0].literal == "hello\nworld"
        assert tokens[1].literal == "tab\there"
        assert tokens[2].literal == 'quote"here'
        assert tokens[3].literal == "backslash\\"

    def test_line_column_tracking(self):
        source = "aa\nche\njo"
        tokens = tokenize(source)

        # aa at line 1, col 1
        assert tokens[0].line == 1
        assert tokens[0].col == 1

        # newline at line 1, col 3
        assert tokens[1].type == TokenType.NEWLINE
        assert tokens[1].line == 1

        # che at line 2, col 1
        assert tokens[2].line == 2
        assert tokens[2].col == 1

    def test_crlf_handling(self):
        source = "aa\r\nche"
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.AA
        assert tokens[1].type == TokenType.NEWLINE
        assert tokens[2].type == TokenType.CHE
        assert tokens[2].line == 2

    def test_unterminated_string_error(self):
        source = '"unterminated string'

        with pytest.raises(LexerError) as exc:
            tokenize(source)

        assert "Unterminated string" in str(exc.value)

    def test_unknown_escape_sequence(self):
        source = r'"bad\x escape"'

        with pytest.raises(LexerError) as exc:
            tokenize(source)

        assert "Unknown escape sequence" in str(exc.value)

    def test_unexpected_character(self):
        source = "valid @ invalid"

        with pytest.raises(LexerError) as exc:
            tokenize(source)

        assert "Unexpected character" in str(exc.value)

    def test_multiline_string(self):
        source = '"line1\nline2"'
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.STRING
        assert tokens[0].literal == "line1\nline2"

    def test_empty_string(self):
        source = '""'
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.STRING
        assert tokens[0].literal == ""

    def test_keyword_boundaries(self):
        # Test that keywords require word boundaries
        source = "aab chec joker"  # Should be identifiers, not keywords
        tokens = tokenize(source)

        assert tokens[0].type == TokenType.IDENTIFIER
        assert tokens[1].type == TokenType.IDENTIFIER
        assert tokens[2].type == TokenType.IDENTIFIER

    def test_complete_program(self):
        source = """kem bhai
        aa x che 42
        bhai bol x
        aavjo bhai"""

        tokens = tokenize(source)

        token_types = [t.type for t in tokens if t.type != TokenType.NEWLINE]
        expected = [
            TokenType.KEM_BHAI,
            TokenType.AA,
            TokenType.IDENTIFIER,
            TokenType.CHE,
            TokenType.INTEGER,
            TokenType.BHAI_BOL,
            TokenType.IDENTIFIER,
            TokenType.AAVJO_BHAI,
            TokenType.EOF,
        ]

        assert token_types == expected
