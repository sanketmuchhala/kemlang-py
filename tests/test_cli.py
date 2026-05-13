import tempfile
from pathlib import Path

from typer.testing import CliRunner

from kemlang.cli import app


class TestCLI:
    def setup_method(self):
        self.runner = CliRunner()

    def test_version_command(self):
        result = self.runner.invoke(app, ["version"])
        assert result.exit_code == 0
        assert "KemLang" in result.stdout
        assert "KemLang" in result.stdout

    def test_run_valid_file(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            f.write("""kem bhai
            bhai bol "Hello from CLI!"
            aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["run", f.name])
            assert result.exit_code == 0
            assert "Hello from CLI!" in result.stdout

        Path(f.name).unlink()

    def test_run_file_with_trace(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            f.write("""kem bhai
            aa x che 42
            bhai bol x
            aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["run", f.name, "--trace"])
            assert result.exit_code == 0
            assert "Tokens:" in result.stdout
            assert "AST:" in result.stdout
            assert "42" in result.stdout

        Path(f.name).unlink()

    def test_run_nonexistent_file(self):
        result = self.runner.invoke(app, ["run", "nonexistent.jsk"])
        assert result.exit_code == 1
        assert "not found" in result.stdout

    def test_run_invalid_syntax(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            f.write("""kem bhai
            invalid syntax here
            aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["run", f.name])
            assert result.exit_code == 1

        Path(f.name).unlink()

    def test_tokens_command(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            f.write("""kem bhai
            aa x che 42
            aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["tokens", f.name])
            assert result.exit_code == 0
            assert "KEM_BHAI" in result.stdout
            assert "AA" in result.stdout
            assert "IDENTIFIER" in result.stdout
            assert "CHE" in result.stdout
            assert "INTEGER" in result.stdout
            assert "AAVJO_BHAI" in result.stdout

        Path(f.name).unlink()

    def test_ast_command(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            f.write("""kem bhai
            bhai bol "hello"
            aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["ast", f.name])
            assert result.exit_code == 0
            assert "Program" in result.stdout

        Path(f.name).unlink()

    def test_fmt_command_single_file(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            # Poorly formatted code
            f.write("""kem bhai
aa x che 42
jo x==42{bhai bol"found"}
aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["fmt", f.name])
            assert result.exit_code == 0

            # Check that file was actually formatted
            formatted_content = Path(f.name).read_text()
            assert "x == 42" in formatted_content  # Spaces around operators
            assert "{\n  " in formatted_content  # Proper block formatting

        Path(f.name).unlink()

    def test_fmt_command_check_mode(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            # Poorly formatted code
            f.write("""kem bhai
aa x che 42
jo x==42{bhai bol"found"}
aavjo bhai""")
            f.flush()

            original_content = Path(f.name).read_text()

            result = self.runner.invoke(app, ["fmt", f.name, "--check"])
            assert result.exit_code == 1  # Should exit with error for unformatted files
            assert "Would format" in result.stdout

            # File should not be modified
            assert Path(f.name).read_text() == original_content

        Path(f.name).unlink()

    def test_fmt_command_directory(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)

            # Create multiple .jsk files
            (temp_path / "file1.jsk").write_text("""kem bhai
aa x che 1
aavjo bhai""")

            (temp_path / "file2.jsk").write_text("""kem bhai
aa y che 2
aavjo bhai""")

            # Create a non-.jsk file that should be ignored
            (temp_path / "readme.txt").write_text("This should be ignored")

            result = self.runner.invoke(app, ["fmt", str(temp_path)])
            assert result.exit_code == 0
            # Should process the .jsk files
            assert "file1.jsk" in result.stdout or "file2.jsk" in result.stdout

    def test_fmt_no_kem_files(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir)
            (temp_path / "readme.txt").write_text("No .jsk files here")

            result = self.runner.invoke(app, ["fmt", str(temp_path)])
            assert result.exit_code == 0
            assert "No .jsk files found" in result.stdout

    def test_ast_command_parse_error(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            f.write("""kem bhai
            bhai bol "unterminated string
            aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["ast", f.name])
            assert result.exit_code == 1
            assert "Error" in result.stdout

        Path(f.name).unlink()

    def test_tokens_command_lexer_error(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            f.write("""kem bhai
            aa x che "unterminated string
            aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["tokens", f.name])
            assert result.exit_code == 1

        Path(f.name).unlink()

    def test_repl_help_message(self):
        # Test that REPL shows help message on start
        # Note: This is a basic test since REPL is interactive
        result = self.runner.invoke(app, ["repl"], input="\x04")  # Send EOF immediately
        assert "KemLang REPL" in result.stdout
        assert "Ctrl+D" in result.stdout

    def test_fmt_invalid_syntax_file(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            f.write("""kem bhai
            this is not valid syntax @#$
            aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["fmt", f.name])
            # Should show error for invalid syntax
            assert "Error formatting" in result.stdout

        Path(f.name).unlink()

    def test_run_file_runtime_error(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".jsk", delete=False) as f:
            f.write("""kem bhai
            bhai bol 1 / 0
            aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["run", f.name])
            assert result.exit_code == 1
            assert "Division by zero" in result.stdout

        Path(f.name).unlink()

    def test_extension_warning(self):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
            f.write("""kem bhai
            bhai bol "hello"
            aavjo bhai""")
            f.flush()

            result = self.runner.invoke(app, ["run", f.name])
            assert result.exit_code == 0
            assert "Warning" in result.stdout
            assert ".jsk extension" in result.stdout
            assert "hello" in result.stdout

        Path(f.name).unlink()
