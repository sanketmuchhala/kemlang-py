import pytest

from kemlang.parser import ParseError, parse_program
from kemlang.types import (
    Assignment,
    Binary,
    Block,
    Break,
    Continue,
    Declaration,
    If,
    Input,
    Literal,
    Print,
    Program,
    TokenType,
    Unary,
    Variable,
    While,
)


class TestParser:
    def test_parse_program_structure(self):
        source = """kem bhai
        bhai bol "hello"
        aavjo bhai"""

        program = parse_program(source)

        assert isinstance(program, Program)
        assert len(program.statements) == 1
        assert isinstance(program.statements[0], Print)

    def test_print_statement(self):
        source = 'kem bhai\nbhai bol "hello world"\naavjo bhai'
        program = parse_program(source)

        stmt = program.statements[0]
        assert isinstance(stmt, Print)
        assert isinstance(stmt.expression, Literal)
        assert stmt.expression.value == "hello world"

    def test_declaration(self):
        source = "kem bhai\naa x che 42\naavjo bhai"
        program = parse_program(source)

        stmt = program.statements[0]
        assert isinstance(stmt, Declaration)
        assert stmt.name == "x"
        assert isinstance(stmt.initializer, Literal)
        assert stmt.initializer.value == 42

    def test_assignment(self):
        source = "kem bhai\naa x che 1\nx che 42\naavjo bhai"
        program = parse_program(source)

        stmt = program.statements[1]
        assert isinstance(stmt, Assignment)
        assert stmt.name == "x"
        assert isinstance(stmt.value, Literal)
        assert stmt.value.value == 42

    def test_if_statement(self):
        source = """kem bhai
        jo bhai chhe {
            bhai bol "true"
        }
        aavjo bhai"""

        program = parse_program(source)
        stmt = program.statements[0]

        assert isinstance(stmt, If)
        assert isinstance(stmt.condition, Literal)
        assert stmt.condition.value is True
        assert isinstance(stmt.then_branch, Block)
        assert stmt.else_branch is None

    def test_if_else_statement(self):
        source = """kem bhai
        jo bhai nathi {
            bhai bol "false"
        } nahi to {
            bhai bol "true"
        }
        aavjo bhai"""

        program = parse_program(source)
        stmt = program.statements[0]

        assert isinstance(stmt, If)
        assert isinstance(stmt.condition, Literal)
        assert stmt.condition.value is False
        assert isinstance(stmt.then_branch, Block)
        assert isinstance(stmt.else_branch, Block)

    def test_while_statement(self):
        source = """kem bhai
        farvu {
            bhai bol "loop"
        } jya sudhi bhai chhe
        aavjo bhai"""

        program = parse_program(source)
        stmt = program.statements[0]

        assert isinstance(stmt, While)
        assert isinstance(stmt.body, Block)
        assert isinstance(stmt.condition, Literal)
        assert stmt.condition.value is True

    def test_break_continue(self):
        source = """kem bhai
        tame jao
        aagal vado
        aavjo bhai"""

        program = parse_program(source)

        assert isinstance(program.statements[0], Break)
        assert isinstance(program.statements[1], Continue)

    def test_binary_expressions(self):
        source = "kem bhai\nbhai bol 1 + 2 * 3\naavjo bhai"
        program = parse_program(source)

        stmt = program.statements[0]
        expr = stmt.expression

        # Should parse as 1 + (2 * 3) due to precedence
        assert isinstance(expr, Binary)
        assert expr.operator.type == TokenType.PLUS
        assert isinstance(expr.left, Literal)
        assert expr.left.value == 1
        assert isinstance(expr.right, Binary)
        assert expr.right.operator.type == TokenType.MULTIPLY

    def test_comparison_operators(self):
        source = "kem bhai\nbhai bol 1 < 2\naavjo bhai"
        program = parse_program(source)

        expr = program.statements[0].expression
        assert isinstance(expr, Binary)
        assert expr.operator.type == TokenType.LESS

    def test_equality_operators(self):
        source = "kem bhai\nbhai bol 1 == 2\naavjo bhai"
        program = parse_program(source)

        expr = program.statements[0].expression
        assert isinstance(expr, Binary)
        assert expr.operator.type == TokenType.EQUAL

    def test_unary_minus(self):
        source = "kem bhai\nbhai bol -42\naavjo bhai"
        program = parse_program(source)

        expr = program.statements[0].expression
        assert isinstance(expr, Unary)
        assert expr.operator.type == TokenType.MINUS
        assert isinstance(expr.right, Literal)
        assert expr.right.value == 42

    def test_parenthesized_expressions(self):
        source = "kem bhai\nbhai bol (1 + 2) * 3\naavjo bhai"
        program = parse_program(source)

        expr = program.statements[0].expression
        # Should parse as (1 + 2) * 3
        assert isinstance(expr, Binary)
        assert expr.operator.type == TokenType.MULTIPLY
        assert isinstance(expr.left, Binary)
        assert expr.left.operator.type == TokenType.PLUS

    def test_variable_expression(self):
        source = "kem bhai\nbhai bol variable_name\naavjo bhai"
        program = parse_program(source)

        expr = program.statements[0].expression
        assert isinstance(expr, Variable)
        assert expr.name == "variable_name"

    def test_input_expression(self):
        source = "kem bhai\naa x che bapu tame bolo\naavjo bhai"
        program = parse_program(source)

        expr = program.statements[0].initializer
        assert isinstance(expr, Input)

    def test_boolean_literals(self):
        source = """kem bhai
        aa t che bhai chhe
        aa f che bhai nathi
        aavjo bhai"""

        program = parse_program(source)

        t_expr = program.statements[0].initializer
        f_expr = program.statements[1].initializer

        assert isinstance(t_expr, Literal)
        assert t_expr.value is True
        assert isinstance(f_expr, Literal)
        assert f_expr.value is False

    def test_operator_precedence(self):
        # Test that * has higher precedence than +
        source = "kem bhai\nbhai bol 1 + 2 * 3 + 4\naavjo bhai"
        program = parse_program(source)

        expr = program.statements[0].expression
        # Should parse as (1 + (2 * 3)) + 4
        assert isinstance(expr, Binary)
        assert expr.operator.type == TokenType.PLUS
        assert isinstance(expr.right, Literal)
        assert expr.right.value == 4

        left = expr.left
        assert isinstance(left, Binary)
        assert left.operator.type == TokenType.PLUS
        assert isinstance(left.left, Literal)
        assert left.left.value == 1

        # The 2 * 3 part
        mult_expr = left.right
        assert isinstance(mult_expr, Binary)
        assert mult_expr.operator.type == TokenType.MULTIPLY

    def test_comparison_precedence(self):
        # Test that + has higher precedence than ==
        source = "kem bhai\nbhai bol 1 + 2 == 3\naavjo bhai"
        program = parse_program(source)

        expr = program.statements[0].expression
        # Should parse as (1 + 2) == 3
        assert isinstance(expr, Binary)
        assert expr.operator.type == TokenType.EQUAL
        assert isinstance(expr.left, Binary)
        assert expr.left.operator.type == TokenType.PLUS

    def test_missing_program_start(self):
        source = 'bhai bol "hello"'

        with pytest.raises(ParseError) as exc:
            parse_program(source)

        assert "must start with 'kem bhai'" in str(exc.value)

    def test_missing_program_end(self):
        source = 'kem bhai\nbhai bol "hello"'

        with pytest.raises(ParseError) as exc:
            parse_program(source)

        assert "must end with 'aavjo bhai'" in str(exc.value)

    def test_missing_che_in_declaration(self):
        source = "kem bhai\naa x 42\naavjo bhai"

        with pytest.raises(ParseError) as exc:
            parse_program(source)

        assert "Expected 'che'" in str(exc.value)

    def test_missing_brace_in_if(self):
        source = 'kem bhai\njo bhai chhe bhai bol "hi"\naavjo bhai'

        with pytest.raises(ParseError) as exc:
            parse_program(source)

        assert "Expected '{'" in str(exc.value)

    def test_missing_closing_paren(self):
        source = "kem bhai\nbhai bol (1 + 2\naavjo bhai"

        with pytest.raises(ParseError) as exc:
            parse_program(source)

        assert "Expected ')'" in str(exc.value)

    def test_complex_expression(self):
        source = "kem bhai\nbhai bol (1 + 2) * (3 - 4) / 5\naavjo bhai"
        program = parse_program(source)

        # Just verify it parses without error
        expr = program.statements[0].expression
        assert isinstance(expr, Binary)

    def test_nested_blocks(self):
        source = """kem bhai
        jo bhai chhe {
            jo bhai nathi {
                bhai bol "nested"
            }
        }
        aavjo bhai"""

        program = parse_program(source)
        if_stmt = program.statements[0]

        assert isinstance(if_stmt, If)
        assert isinstance(if_stmt.then_branch, Block)

        nested_if = if_stmt.then_branch.statements[0]
        assert isinstance(nested_if, If)

    def test_empty_blocks(self):
        source = """kem bhai
        jo bhai chhe {
        }
        aavjo bhai"""

        program = parse_program(source)
        if_stmt = program.statements[0]

        assert isinstance(if_stmt, If)
        assert len(if_stmt.then_branch.statements) == 0
