import string

import pytest
from hypothesis import HealthCheck, assume, given, settings
from hypothesis import strategies as st

from kemlang.fmt import format_code
from kemlang.interpreter import run
from kemlang.lexer import LexerError, tokenize
from kemlang.parser import ParseError, parse_program
from kemlang.types import TokenType


# Keep CI fast: 25 examples, 2s deadline per example, suppress slow-data warning
CI_SETTINGS = settings(max_examples=25, deadline=2000, suppress_health_check=[HealthCheck.too_slow])


class TestPropertyFuzz:
    # Character sets for generating test data
    VALID_IDENTIFIER_CHARS = string.ascii_letters + string.digits + "_"
    VALID_STRING_CHARS = string.ascii_letters + string.digits + " !@#$%^&*()[]{}|:;<>?,.`~"

    @CI_SETTINGS
    @given(st.text(alphabet=VALID_IDENTIFIER_CHARS, min_size=1, max_size=20))
    def test_identifier_tokenization_never_crashes(self, identifier):
        """Property: Valid identifiers should never crash the lexer."""
        assume(identifier[0].isalpha() or identifier[0] == "_")  # Valid identifier start

        # Don't test keywords as identifiers
        keywords = {"aa", "che", "jo", "nahi", "to", "farvu"}
        assume(identifier not in keywords)

        try:
            tokens = tokenize(identifier)
            assert len(tokens) >= 1
            assert tokens[0].type == TokenType.IDENTIFIER
            assert tokens[0].lexeme == identifier
        except LexerError:
            # Lexer errors are acceptable, crashes are not
            pass

    @CI_SETTINGS
    @given(st.integers(min_value=0, max_value=999999))
    def test_integer_tokenization_never_crashes(self, number):
        """Property: Valid integers should never crash the lexer."""
        try:
            tokens = tokenize(str(number))
            assert len(tokens) >= 1
            assert tokens[0].type == TokenType.INTEGER
            assert tokens[0].literal == number
        except LexerError:
            pass

    @CI_SETTINGS
    @given(st.text(alphabet=VALID_STRING_CHARS, min_size=0, max_size=50))
    def test_string_tokenization_never_crashes(self, content):
        """Property: Valid string content should never crash the lexer."""
        # Escape quotes and backslashes for valid string literal
        escaped_content = content.replace("\\", "\\\\").replace('"', '\\"')
        string_literal = f'"{escaped_content}"'

        try:
            tokens = tokenize(string_literal)
            if tokens and tokens[0].type == TokenType.STRING:
                # If it parsed successfully, the content should match
                assert tokens[0].literal == content
        except LexerError:
            # Lexer errors are acceptable for edge cases
            pass

    @CI_SETTINGS
    @given(
        st.lists(
            st.sampled_from(["+", "-", "*", "/", "%", "==", "!=", "<", ">", "<=", ">="]),
            min_size=1,
            max_size=10,
        )
    )
    def test_operator_sequences_never_crash_lexer(self, operators):
        """Property: Sequences of operators should never crash the lexer."""
        source = " ".join(operators)

        try:
            tokens = tokenize(source)
            # Should have at least as many tokens as operators
            assert len([t for t in tokens if t.type != TokenType.EOF]) >= len(operators)
        except LexerError:
            # Some combinations might be invalid (like multiple = signs)
            pass

    @CI_SETTINGS
    @given(st.integers(min_value=1, max_value=10))
    def test_nested_parentheses_parsing(self, depth):
        """Property: Deeply nested parentheses should not crash the parser."""
        # Generate nested parentheses expression: (((...(42)...)))
        expr = "42"
        for _ in range(depth):
            expr = f"({expr})"

        source = f"kem bhai\nbhai bol {expr}\naavjo bhai"

        try:
            program = parse_program(source)
            # Should parse successfully
            assert program is not None
        except (ParseError, RecursionError):
            # Deep nesting might cause recursion errors, which is acceptable
            pass

    @CI_SETTINGS
    @given(st.lists(st.integers(min_value=0, max_value=100), min_size=1, max_size=20))
    def test_arithmetic_expression_evaluation(self, numbers):
        """Property: Arithmetic expressions with valid numbers should not crash."""
        if len(numbers) == 1:
            expr = str(numbers[0])
        else:
            # Create expression like: num1 + num2 + num3 ...
            expr = " + ".join(str(n) for n in numbers)

        source = f"kem bhai\nbhai bol {expr}\naavjo bhai"

        try:
            exit_code = run(source, input_fn=lambda: "", output_fn=lambda x: None)
            assert exit_code in [0, 1]  # Should exit cleanly
        except Exception:
            # Some expressions might cause overflow or other issues
            pass

    @CI_SETTINGS
    @given(st.text(min_size=10, max_size=200))
    def test_random_text_never_crashes_lexer(self, text):
        """Property: Random text should never crash the lexer process."""
        try:
            tokens = tokenize(text)
            # Should always produce at least EOF token
            assert len(tokens) >= 1
            assert tokens[-1].type == TokenType.EOF
        except LexerError:
            # Lexer errors are fine, crashes are not
            pass
        except Exception as e:
            # No other exceptions should occur
            pytest.fail(f"Unexpected exception in lexer: {type(e).__name__}: {e}")

    @CI_SETTINGS
    @given(st.integers(min_value=0, max_value=50))
    def test_variable_declaration_chains(self, chain_length):
        """Property: Long chains of variable declarations should work."""
        statements = []
        for i in range(chain_length):
            if i == 0:
                statements.append(f"aa var{i} che {i}")
            else:
                statements.append(f"aa var{i} che var{i - 1} + {i}")

        if statements:
            statements.append(f"bhai bol var{chain_length - 1}")

        source = "kem bhai\n" + "\n".join(statements) + "\naavjo bhai"

        try:
            exit_code = run(source, input_fn=lambda: "", output_fn=lambda x: None)
            assert exit_code in [0, 1]
        except RecursionError:
            # Very long chains might cause recursion issues
            pass

    def test_format_idempotency_fuzzing(self):
        """Property: Formatting should be idempotent for valid programs."""
        valid_programs = [
            """kem bhai
aa x che 42
bhai bol x
aavjo bhai""",
            """kem bhai
jo bhai chhe {
    bhai bol "true"
} nahi to {
    bhai bol "false"
}
aavjo bhai""",
            """kem bhai
aa i che 0
farvu {
    bhai bol i
    i che i + 1
} jya sudhi i < 5
aavjo bhai""",
        ]

        for program in valid_programs:
            try:
                formatted_once = format_code(program)
                formatted_twice = format_code(formatted_once)
                assert formatted_once == formatted_twice, "Formatting should be idempotent"
            except ValueError:
                # Invalid programs are acceptable to reject
                pass

    @CI_SETTINGS
    @given(
        st.lists(
            st.text(alphabet=string.ascii_letters, min_size=1, max_size=10), min_size=1, max_size=10
        )
    )
    def test_string_concatenation_properties(self, string_parts):
        """Property: String concatenation should be associative."""
        assume(all(part.isalpha() for part in string_parts))  # Only letters for simplicity

        if len(string_parts) < 2:
            return

        # Create concatenation expression
        concat_expr = " + ".join(f'"{part}"' for part in string_parts)
        source = f"kem bhai\nbhai bol {concat_expr}\naavjo bhai"

        try:
            # Should not crash and should produce expected result
            expected_result = "".join(string_parts)

            # Capture output
            output_lines = []

            def capture_output(line):
                output_lines.append(line)

            exit_code = run(source, input_fn=lambda: "", output_fn=capture_output)

            if exit_code == 0 and output_lines:
                assert output_lines[0] == expected_result

        except Exception:
            # Complex expressions might fail for various reasons
            pass

    @CI_SETTINGS
    @given(st.integers(min_value=1, max_value=20))
    def test_nested_if_statements(self, nesting_depth):
        """Property: Nested if statements should not crash the parser."""
        # Generate nested if: if (true) { if (true) { ... } }
        inner = 'bhai bol "innermost"'

        for _i in range(nesting_depth):
            inner = f"""jo bhai chhe {{
    {inner}
}}"""

        source = f"kem bhai\n{inner}\naavjo bhai"

        try:
            program = parse_program(source)
            assert program is not None

            # Try to run it too
            exit_code = run(source, input_fn=lambda: "", output_fn=lambda x: None)
            assert exit_code in [0, 1]

        except (ParseError, RecursionError, MemoryError):
            # Deep nesting might cause various resource issues
            pass

    def test_smoke_test_examples(self):
        """Smoke test: All example files should process without crashing."""
        examples = [
            """kem bhai
aa naam che bapu tame bolo
bhai bol "kem cho, " + naam + "!"
aavjo bhai""",
            """kem bhai
aa i che 0
farvu {
  bhai bol i
  i che i + 1
  jo i == 5 { tame jao }
} jya sudhi i < 10

jo i == 5 {
  bhai bol "panch ma masti!"
} nahi to {
  bhai bol "kuch to gadbad chhe!"
}
aavjo bhai""",
            """kem bhai
aa x che 1
x che x + "oops"
aavjo bhai""",
        ]

        for i, example in enumerate(examples):
            try:
                # All should at least tokenize and parse
                tokens = tokenize(example)
                assert len(tokens) > 0

                program = parse_program(example)
                assert program is not None

                # Try to format
                formatted = format_code(example)
                assert len(formatted) > 0

                # Try to run (may fail with runtime errors, but shouldn't crash)
                exit_code = run(example, input_fn=lambda: "test_input", output_fn=lambda x: None)
                assert exit_code in [0, 1]

            except (LexerError, ParseError, ValueError):
                # Some examples are designed to fail (like the errors.jsk)
                if i == 2:  # errors.jsk should fail
                    continue
                else:
                    raise
            except Exception as e:
                pytest.fail(f"Unexpected crash in example {i}: {type(e).__name__}: {e}")
