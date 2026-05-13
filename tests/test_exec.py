from io import StringIO

from kemlang.interpreter import run


class TestExecution:
    def capture_output(self, source, input_data=""):
        """Helper to capture output and input for testing."""
        output = StringIO()
        input_lines = input_data.split("\n")
        input_iter = iter(input_lines)

        def mock_input():
            try:
                return next(input_iter)
            except StopIteration:
                return ""

        def mock_print(text):
            output.write(str(text) + "\n")

        exit_code = run(source, input_fn=mock_input, output_fn=mock_print)
        return output.getvalue(), exit_code

    def test_hello_world(self):
        source = """kem bhai
        bhai bol "Hello, World!"
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        assert output.strip() == "Hello, World!"

    def test_variable_declaration_and_print(self):
        source = """kem bhai
        aa x che 42
        bhai bol x
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        assert output.strip() == "42"

    def test_variable_assignment(self):
        source = """kem bhai
        aa x che 1
        x che 2
        bhai bol x
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        assert output.strip() == "2"

    def test_string_concatenation(self):
        source = """kem bhai
        aa greeting che "Hello"
        aa name che "World"
        bhai bol greeting + ", " + name + "!"
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        assert output.strip() == "Hello, World!"

    def test_arithmetic_operations(self):
        source = """kem bhai
        bhai bol 1 + 2
        bhai bol 5 - 3
        bhai bol 4 * 3
        bhai bol 10 / 2
        bhai bol 7 % 3
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == ["3", "2", "12", "5", "1"]

    def test_comparison_operations(self):
        source = """kem bhai
        bhai bol 1 < 2
        bhai bol 2 > 1
        bhai bol 1 <= 1
        bhai bol 2 >= 1
        bhai bol 1 == 1
        bhai bol 1 != 2
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == ["true", "true", "true", "true", "true", "true"]

    def test_boolean_literals(self):
        source = """kem bhai
        bhai bol bhai chhe
        bhai bol bhai nathi
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == ["true", "false"]

    def test_unary_minus(self):
        source = """kem bhai
        bhai bol -42
        aa x che 5
        bhai bol -x
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == ["-42", "-5"]

    def test_if_statement_true(self):
        source = """kem bhai
        jo bhai chhe {
            bhai bol "condition is true"
        }
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        assert output.strip() == "condition is true"

    def test_if_statement_false(self):
        source = """kem bhai
        jo bhai nathi {
            bhai bol "should not print"
        }
        bhai bol "after if"
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        assert output.strip() == "after if"

    def test_if_else_statement(self):
        source = """kem bhai
        jo bhai nathi {
            bhai bol "false branch"
        } nahi to {
            bhai bol "true branch"
        }
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        assert output.strip() == "true branch"

    def test_while_loop(self):
        source = """kem bhai
        aa i che 0
        farvu {
            bhai bol i
            i che i + 1
        } jya sudhi i < 3
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == ["0", "1", "2"]

    def test_while_loop_with_break(self):
        source = """kem bhai
        aa i che 0
        farvu {
            jo i == 2 {
                tame jao
            }
            bhai bol i
            i che i + 1
        } jya sudhi i < 10
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == ["0", "1"]

    def test_while_loop_with_continue(self):
        source = """kem bhai
        aa i che 0
        farvu {
            i che i + 1
            jo i == 2 {
                aagal vado
            }
            bhai bol i
        } jya sudhi i < 4
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == ["1", "3", "4"]

    def test_input_output(self):
        source = """kem bhai
        aa name che bapu tame bolo
        bhai bol "Hello, " + name + "!"
        aavjo bhai"""

        output, exit_code = self.capture_output(source, "Sanket")
        assert exit_code == 0
        assert output.strip() == "Hello, Sanket!"

    def test_division_by_zero_error(self):
        source = """kem bhai
        bhai bol 1 / 0
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 1
        assert "Division by zero" in output

    def test_modulo_by_zero_error(self):
        source = """kem bhai
        bhai bol 5 % 0
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 1
        assert "Modulo by zero" in output

    def test_type_error_in_addition(self):
        source = """kem bhai
        bhai bol 1 + "hello"
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 1
        assert "TypeError: cannot `+` int and str" in output

    def test_undefined_variable_error(self):
        source = """kem bhai
        bhai bol undefined_var
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 1
        assert "Undefined variable 'undefined_var'" in output

    def test_reassign_undefined_variable_error(self):
        source = """kem bhai
        undefined_var che 42
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 1
        assert "Undefined variable 'undefined_var'" in output

    def test_redeclare_variable_error(self):
        source = """kem bhai
        aa x che 1
        aa x che 2
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 1
        assert "already declared" in output

    def test_modulo_non_integer_error(self):
        source = """kem bhai
        bhai bol 5.5 % 2
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 1
        assert "Modulo operator requires integer operands" in output

    def test_unary_minus_non_number_error(self):
        source = """kem bhai
        bhai bol -"hello"
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 1
        assert "Unary minus requires numeric operand" in output

    def test_comparison_non_number_error(self):
        source = """kem bhai
        bhai bol "hello" < "world"
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 1
        assert "requires numeric operands" in output

    def test_block_scoping(self):
        source = """kem bhai
        aa x che 1
        jo bhai chhe {
            aa x che 2
            bhai bol x
        }
        bhai bol x
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == ["2", "1"]

    def test_truthiness(self):
        """Test how different values are treated as truthy/falsy."""
        source = """kem bhai
        jo 0 {
            bhai bol "0 is truthy"
        } nahi to {
            bhai bol "0 is falsy"
        }

        jo "" {
            bhai bol "empty string is truthy"
        } nahi to {
            bhai bol "empty string is falsy"
        }

        jo "non-empty" {
            bhai bol "non-empty string is truthy"
        }

        jo 42 {
            bhai bol "42 is truthy"
        }
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == [
            "0 is falsy",
            "empty string is falsy",
            "non-empty string is truthy",
            "42 is truthy",
        ]

    def test_float_division(self):
        source = """kem bhai
        bhai bol 5 / 2
        bhai bol 4 / 2
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == ["2.5", "2"]  # 4.0 becomes "2" due to stringify logic

    def test_complete_example_hello(self):
        """Test the hello.jsk example."""
        source = """kem bhai
        aa naam che bapu tame bolo
        bhai bol "kem cho, " + naam + "!"
        aavjo bhai"""

        output, exit_code = self.capture_output(source, "Sanket")
        assert exit_code == 0
        assert output.strip() == "kem cho, Sanket!"

    def test_complete_example_loop_and_if(self):
        """Test the loop_and_if.jsk example."""
        source = """kem bhai
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
        aavjo bhai"""

        output, exit_code = self.capture_output(source)
        assert exit_code == 0
        lines = output.strip().split("\n")
        assert lines == ["0", "1", "2", "3", "4", "panch ma masti!"]
