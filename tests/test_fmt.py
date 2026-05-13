import pytest

from kemlang.fmt import format_code


class TestFormatter:
    def test_basic_formatting(self):
        source = """kem bhai
aa x che 42
bhai bol x
aavjo bhai"""

        formatted = format_code(source)
        assert "aa x che 42" in formatted
        assert "bhai bol x" in formatted

    def test_operator_spacing(self):
        source = """kem bhai
bhai bol 1+2*3-4/5
aavjo bhai"""

        formatted = format_code(source)
        assert "1 + 2 * 3 - 4 / 5" in formatted

    def test_comparison_operators(self):
        source = """kem bhai
bhai bol x==y
bhai bol a!=b
bhai bol c<d
bhai bol e>f
bhai bol g<=h
bhai bol i>=j
aavjo bhai"""

        formatted = format_code(source)
        lines = formatted.split("\n")
        content_lines = [
            line.strip()
            for line in lines
            if line.strip() and line.strip() not in ["kem bhai", "aavjo bhai"]
        ]

        assert "bhai bol x == y" in content_lines
        assert "bhai bol a != b" in content_lines
        assert "bhai bol c < d" in content_lines
        assert "bhai bol e > f" in content_lines
        assert "bhai bol g <= h" in content_lines
        assert "bhai bol i >= j" in content_lines

    def test_if_statement_formatting(self):
        source = """kem bhai
jo x==42{bhai bol"found"}
aavjo bhai"""

        formatted = format_code(source)
        assert "jo x == 42 {" in formatted
        assert '  bhai bol "found"' in formatted
        assert "}" in formatted

    def test_if_else_formatting(self):
        source = """kem bhai
jo x==42{bhai bol"found"}nahi to{bhai bol"not found"}
aavjo bhai"""

        formatted = format_code(source)
        assert "jo x == 42 {" in formatted
        assert "} nahi to {" in formatted
        assert '  bhai bol "found"' in formatted
        assert '  bhai bol "not found"' in formatted

    def test_while_loop_formatting(self):
        source = """kem bhai
farvu{bhai bol i
i che i+1}jya sudhi i<10
aavjo bhai"""

        formatted = format_code(source)
        assert "farvu {" in formatted
        assert "  bhai bol i" in formatted
        assert "  i che i + 1" in formatted
        assert "} jya sudhi i < 10" in formatted

    def test_nested_blocks(self):
        source = """kem bhai
jo bhai chhe{jo bhai nathi{bhai bol"nested"}}
aavjo bhai"""

        formatted = format_code(source)
        # Find the nested structure
        assert "jo bhai chhe {" in formatted
        assert "  jo bhai nathi {" in formatted
        assert '    bhai bol "nested"' in formatted
        assert "  }" in formatted
        assert "}" in formatted

    def test_string_literal_preservation(self):
        source = """kem bhai
bhai bol "hello\\nworld\\twith\\ttabs\\\"and quotes\\\\"
aavjo bhai"""

        formatted = format_code(source)
        assert 'hello\\nworld\\twith\\ttabs\\"and quotes\\\\' in formatted

    def test_boolean_literals(self):
        source = """kem bhai
aa t che bhai chhe
aa f che bhai nathi
aavjo bhai"""

        formatted = format_code(source)
        assert "aa t che bhai chhe" in formatted
        assert "aa f che bhai nathi" in formatted

    def test_unary_minus(self):
        source = """kem bhai
bhai bol -42
bhai bol -(x+y)
aavjo bhai"""

        formatted = format_code(source)
        assert "bhai bol -42" in formatted
        assert "bhai bol -(x + y)" in formatted

    def test_parentheses_preservation(self):
        source = """kem bhai
bhai bol (1+2)*3
aavjo bhai"""

        formatted = format_code(source)
        assert "bhai bol (1 + 2) * 3" in formatted

    def test_input_expression(self):
        source = """kem bhai
aa name che bapu tame bolo
aavjo bhai"""

        formatted = format_code(source)
        assert "aa name che bapu tame bolo" in formatted

    def test_break_continue_statements(self):
        source = """kem bhai
tame jao
aagal vado
aavjo bhai"""

        formatted = format_code(source)
        assert "tame jao" in formatted
        assert "aagal vado" in formatted

    def test_empty_blocks(self):
        source = """kem bhai
jo bhai chhe{
}
aavjo bhai"""

        formatted = format_code(source)
        assert "jo bhai chhe {" in formatted
        assert "}" in formatted

    def test_complex_expression_precedence(self):
        source = """kem bhai
bhai bol 1+2*3+4
bhai bol (1+2)*(3+4)
aavjo bhai"""

        formatted = format_code(source)
        assert "bhai bol 1 + 2 * 3 + 4" in formatted
        assert "bhai bol (1 + 2) * (3 + 4)" in formatted

    def test_idempotency(self):
        """Test that formatting twice produces the same result."""
        source = """kem bhai
aa x che 42
jo x==42{
bhai bol"found"
}nahi to{
bhai bol"not found"
}
aavjo bhai"""

        formatted_once = format_code(source)
        formatted_twice = format_code(formatted_once)

        assert formatted_once == formatted_twice

    def test_program_structure_preservation(self):
        """Test that basic program structure is preserved."""
        source = """kem bhai
aa x che 1
bhai bol x
aavjo bhai"""

        formatted = format_code(source)

        # Should start with 'kem bhai' and end with 'aavjo bhai'
        lines = formatted.strip().split("\n")
        assert lines[0] == "kem bhai"
        assert lines[-1] == "aavjo bhai"

    def test_whitespace_normalization(self):
        """Test that excessive whitespace is normalized."""
        source = """kem bhai


aa x che 42


bhai bol x


aavjo bhai"""

        formatted = format_code(source)

        # Should not have multiple consecutive blank lines
        lines = formatted.split("\n")
        consecutive_empty = 0
        max_consecutive_empty = 0

        for line in lines:
            if line.strip() == "":
                consecutive_empty += 1
                max_consecutive_empty = max(max_consecutive_empty, consecutive_empty)
            else:
                consecutive_empty = 0

        # Should not have more than 1 consecutive empty line
        assert max_consecutive_empty <= 1

    def test_invalid_code_error(self):
        """Test that invalid code raises an error."""
        source = """kem bhai
        invalid syntax here @#$
        aavjo bhai"""

        with pytest.raises(ValueError) as exc:
            format_code(source)

        assert "Cannot format invalid code" in str(exc.value)

    def test_missing_program_fence(self):
        """Test formatting of code without proper program fences."""
        source = 'bhai bol "hello"'

        with pytest.raises(ValueError):
            format_code(source)

    def test_real_example_formatting(self):
        """Test formatting of the hello.jsk example."""
        source = """kem bhai
aa naam che bapu tame bolo
bhai bol"kem cho, "+naam+"!"
aavjo bhai"""

        formatted = format_code(source)

        assert "aa naam che bapu tame bolo" in formatted
        assert 'bhai bol "kem cho, " + naam + "!"' in formatted

    def test_loop_example_formatting(self):
        """Test formatting of loop_and_if.jsk example."""
        source = """kem bhai
aa i che 0
farvu{bhai bol i
i che i+1
jo i==5{tame jao}}jya sudhi i<10
jo i==5{bhai bol"panch ma masti!"}nahi to{bhai bol"kuch to gadbad chhe!"}
aavjo bhai"""

        formatted = format_code(source)

        # Check key formatting expectations
        assert "farvu {" in formatted
        assert "} jya sudhi i < 10" in formatted
        assert "jo i == 5 {" in formatted
        assert "} nahi to {" in formatted
