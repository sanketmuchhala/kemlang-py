from typing import Optional


class KemError(Exception):
    def __init__(self, message: str, line: int = 0, col: int = 0):
        self.message = message
        self.line = line
        self.col = col
        super().__init__(message)


class LexerError(KemError):
    pass


class ParseError(KemError):
    pass


class RuntimeError(KemError):
    pass


class BreakError(Exception):
    pass


class ContinueError(Exception):
    pass


def render_diagnostic(source: str, line: int, col: int, message: str, kind: str = "Error") -> str:
    """Render a diagnostic with source context and caret pointing to the error."""
    lines = source.split('\n')

    if line < 1 or line > len(lines):
        return f"{kind}: {message} (line {line}:{col})"

    error_line = lines[line - 1]
    line_num_width = len(str(line))

    # Build the diagnostic output
    result = []
    result.append(f"{kind}: {message}")
    result.append(f" --> line {line}:{col}")
    result.append(f"{line:>{line_num_width}} | {error_line}")

    # Add caret pointing to the error column
    caret_line = " " * (line_num_width + 3) + " " * max(0, col - 1) + "^"
    result.append(caret_line)

    return "\n".join(result)